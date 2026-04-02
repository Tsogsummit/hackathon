import { useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

export default function ChatPage() {
  const token = useAuthStore((s) => s.token);
  const me = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const boxRef = useRef(null);

  const lastId = useMemo(() => (messages.length ? messages[messages.length - 1].id : null), [messages]);

  async function loadInitial() {
    setErr("");
    try {
      const out = await apiFetch("/chat/messages?limit=200", { token });
      setMessages(out);
    } catch (e) {
      setErr(e?.message || "Чат ачаалж чадсангүй");
    }
  }

  async function pollNew() {
    if (!lastId) return;
    try {
      const out = await apiFetch(`/chat/messages?after_id=${lastId}&limit=200`, { token });
      if (out?.length) setMessages((prev) => [...prev, ...out]);
    } catch {
      // silent polling failure
    }
  }

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      pollNew();
    }, 2500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  async function sendMessage(e) {
    e.preventDefault();
    const body = input.trim();
    if (!body) return;
    setSending(true);
    setErr("");
    try {
      const out = await apiFetch("/chat/messages", { method: "POST", token, body: { body } });
      setMessages((prev) => [...prev, out]);
      setInput("");
    } catch (e2) {
      setErr(e2?.message || "Илгээж чадсангүй");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Нэгдсэн чат</h1>
      <p className="es-page-desc">Системийн бүх хэрэглэгч нэг сувгаар харилцана.</p>

      <div className="es-section" style={{ maxWidth: 960 }}>
        <div
          ref={boxRef}
          className="es-table-wrap"
          style={{ height: 420, padding: 10, marginBottom: 12, overflowY: "auto" }}
        >
          {messages.length === 0 ? (
            <p className="es-empty">Одоогоор мессеж алга.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {messages.map((m) => {
                const mine = me?.id === m.sender_id;
                return (
                  <div
                    key={m.id}
                    style={{
                      border: "1px solid var(--es-border)",
                      borderRadius: 8,
                      padding: 8,
                      background: mine ? "var(--es-accent-soft)" : "#f8fafc",
                    }}
                  >
                    <div style={{ fontSize: "0.82rem", color: "var(--es-muted)", marginBottom: 4 }}>
                      <strong>{m.sender_name}</strong> ({m.sender_role}) • #{m.id}
                    </div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
          <input
            className="es-input"
            style={{ flex: 1 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Мессеж бичнэ үү..."
            maxLength={2000}
          />
          <button type="submit" className="es-btn es-btn-primary" disabled={sending || !input.trim()}>
            {sending ? "Илгээж..." : "Илгээх"}
          </button>
        </form>

        {err && <p className="es-alert es-alert-danger" style={{ marginTop: 10 }}>{err}</p>}
      </div>
    </div>
  );
}
