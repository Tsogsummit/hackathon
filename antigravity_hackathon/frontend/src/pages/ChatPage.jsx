import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const ROLE_COLORS = {
  teacher: "#3b82f6",
  student: "#22c55e",
  parent: "#f59e0b",
  admin: "#ef4444",
  principal: "#8b5cf6",
};

const ROLE_LABELS = {
  teacher: "Багш",
  student: "Сурагч",
  parent: "Эцэг эх",
  admin: "Админ",
  principal: "Захирал",
};

function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг`;
  return d.toLocaleDateString("mn-MN", { month: "short", day: "numeric" });
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const token = useAuthStore((s) => s.token);
  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const autoOpenedRef = useRef(false);
  const threadScrollRef = useRef(null);
  const draftRef = useRef(null);
  const prevActiveUserIdRef = useRef(null);
  const threadRequestIdRef = useRef(0);

  const loadConversations = useCallback(async () => {
    try {
      const out = await apiFetch("/chat/dm/conversations", { token });
      setConversations(Array.isArray(out) ? out : []);
    } catch {
      setConversations([]);
    }
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(!!mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  const loadThread = useCallback(
    async (userId) => {
      const uid = Number(userId);
      if (!Number.isFinite(uid) || uid < 1) return;
      const reqId = ++threadRequestIdRef.current;
      setThreadLoading(true);
      try {
        const out = await apiFetch(`/chat/dm/${uid}`, { token });
        if (reqId !== threadRequestIdRef.current) return;
        setMessages(Array.isArray(out) ? out : []);
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });
      } catch {
        if (reqId !== threadRequestIdRef.current) return;
        setMessages([]);
      } finally {
        if (reqId === threadRequestIdRef.current) setThreadLoading(false);
      }
    },
    [token],
  );

  const openConversation = useCallback(
    (userId, user) => {
      const uid = Number(userId);
      if (!Number.isFinite(uid)) return;
      // Switch conversation: re-enable sending immediately + avoid mixing drafts across threads.
      setSending(false);
      setSendError("");
      setDraft("");
      setActiveUserId(uid);
      setActiveUser(user && typeof user === "object" ? { ...user, user_id: uid } : { user_id: uid, full_name: `User #${uid}` });
      setSearchMode(false);
      setMobileShowThread(isMobile);
      loadThread(uid);
    },
    [loadThread, isMobile],
  );

  useEffect(() => {
    if (activeUserId == null) return;
    const prev = prevActiveUserIdRef.current;
    prevActiveUserIdRef.current = activeUserId;
    if (prev !== activeUserId) requestAnimationFrame(() => draftRef.current?.focus());
  }, [activeUserId]);

  /* Эхний яриаг нээх (Messenger шиг — жагсаалт ирэхэд баруун талд шууд түүх) */
  useEffect(() => {
    if (searchMode || autoOpenedRef.current) return;
    if (conversations.length === 0) return;
    if (activeUserId != null) return;
    const first = conversations[0];
    const uid = Number(first.user_id);
    if (!Number.isFinite(uid)) return;
    autoOpenedRef.current = true;
    setActiveUserId(uid);
    setActiveUser(first);
    setMobileShowThread(isMobile);
    loadThread(uid);
  }, [conversations, activeUserId, searchMode, loadThread, isMobile]);

  useEffect(() => {
    if (!activeUserId) return;
    pollRef.current = setInterval(() => {
      loadThread(activeUserId);
      loadConversations();
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [activeUserId, loadThread, loadConversations]);

  const handleSend = async () => {
    if (!draft.trim() || activeUserId == null || sending) return;
    const uid = Number(activeUserId);
    setSending(true);
    setSendError("");
    try {
      await apiFetch(`/chat/dm/${uid}`, {
        method: "POST",
        body: { body: draft.trim() },
        token,
      });
      setDraft("");
      await loadThread(uid);
      await loadConversations();
    } catch (e) {
      const msg = e?.message || "Зурвас илгээж чадсангүй";
      setSendError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    try {
      const out = await apiFetch(`/chat/users?q=${encodeURIComponent(q.trim())}`, { token });
      setSearchResults(Array.isArray(out) ? out : []);
    } catch {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isActive = (c) => Number(c.user_id) === Number(activeUserId);

  return (
    <div className="es-chat-page-root" style={{ padding: 0 }}>
      {/* Зүүн — ярианы жагсаалт */}
      <div
        style={{
          width: 320,
          minWidth: 260,
          maxWidth: "36vw",
          borderRight: "1px solid var(--es-border)",
          display: "flex",
          flexDirection: "column",
          background: "var(--es-card-bg, #fff)",
          flexShrink: 0,
          ...(mobileShowThread && isMobile ? { display: "none" } : {}),
        }}
        className="chat-left-panel"
      >
        <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--es-border)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: "1.12rem", fontWeight: 800, color: "var(--es-text)" }}>Чат</h2>
            <button
              type="button"
              onClick={() => {
                setSearchMode(true);
                setSearchQuery("");
                setSearchResults([]);
              }}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: "none",
                background: "var(--es-accent)",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Шинэ чат
            </button>
          </div>

          {searchMode && (
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Хэрэглэгч хайх..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 14px",
                  borderRadius: 20,
                  border: "1px solid var(--es-border)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "var(--es-surface-solid)",
                  color: "var(--es-text)",
                }}
              />
              <button
                type="button"
                onClick={() => setSearchMode(false)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: "var(--es-muted)",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {searchMode && searchResults.length > 0 && (
            <div style={{ padding: "6px 0" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--es-muted)", padding: "4px 14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Хайлтын үр дүн
              </div>
              {searchResults.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => openConversation(u.id, u)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "12px 14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--es-surface-soft)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `${ROLE_COLORS[u.role] || "#6b7280"}22`,
                      color: ROLE_COLORS[u.role] || "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {(u.full_name || "?")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--es-text)" }}>{u.full_name}</div>
                    <div style={{ fontSize: "0.75rem", color: ROLE_COLORS[u.role] || "var(--es-muted)" }}>{ROLE_LABELS[u.role] || u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searchMode && conversations.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--es-muted)", fontSize: "0.9rem" }}>
              Одоогоор чат алга. «Шинэ чат» дарж эхлээрэй.
            </div>
          )}

          {!searchMode &&
            conversations.map((c) => (
              <button
                key={c.user_id}
                type="button"
                onClick={() => openConversation(c.user_id, c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "12px 14px",
                  background: isActive(c) ? "var(--es-accent-soft)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--es-border)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(c)) e.currentTarget.style.background = "var(--es-surface-soft)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(c)) e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: `${ROLE_COLORS[c.role] || "#6b7280"}22`,
                    color: ROLE_COLORS[c.role] || "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    flexShrink: 0,
                  }}
                >
                  {(c.full_name || "?")[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--es-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.full_name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--es-muted)", flexShrink: 0 }}>{timeAgo(c.last_at)}</div>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--es-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 3 }}>
                    {c.last_message || "—"}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Баруун — нэг хүний яриа (Facebook Messenger бүтэц) */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          background: "var(--es-chat-thread-bg)",
        }}
        className="chat-right-panel"
      >
        {activeUserId == null ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "var(--es-muted)", padding: 24 }}>
            <div style={{ fontSize: 52, marginBottom: 14, opacity: 0.35 }}>💬</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 700, color: "var(--es-text)" }}>Чат сонгоно уу</div>
            <div style={{ fontSize: "0.88rem", marginTop: 6, textAlign: "center", maxWidth: 280 }}>
              Зүүн талаас хэрэглэгч дээр дарна уу. Жагсаалт ирэхэд эхний яриа автоматаар нээгдэнэ.
            </div>
          </div>
        ) : (
          <>
            {/* Толгой — тогтвортой */}
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--es-border)",
                background: "var(--es-card-bg, #fff)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexShrink: 0,
                boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMobileShowThread(false);
                  setActiveUserId(null);
                  setActiveUser(null);
                  setSendError("");
                  setSending(false);
                  setDraft("");
                }}
                className="chat-back-btn"
                style={{
                  display: "none",
                  background: "var(--es-surface-soft)",
                  border: "1px solid var(--es-border)",
                  borderRadius: 8,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  padding: "6px 10px",
                  color: "var(--es-text)",
                }}
              >
                ←
              </button>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `${ROLE_COLORS[activeUser?.role] || "#6b7280"}22`,
                  color: ROLE_COLORS[activeUser?.role] || "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                {(activeUser?.full_name || "?")[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--es-text)" }}>{activeUser?.full_name || "..."}</div>
                <div style={{ fontSize: "0.74rem", color: ROLE_COLORS[activeUser?.role] || "var(--es-muted)" }}>
                  {ROLE_LABELS[activeUser?.role] || activeUser?.role || ""}
                </div>
              </div>
            </div>

            {/* Зурвасны бүс — үлдсэн өндрийг эзэлж гүйлгэнэ */}
            <div
              ref={threadScrollRef}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                padding: "16px 18px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {threadLoading && messages.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--es-muted)", marginTop: 32, fontSize: "0.9rem" }}>Ачаалж байна…</div>
              )}
              {!threadLoading && messages.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--es-muted)", marginTop: 36, fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Одоогоор зурвас алга.
                  <br />
                  Доорх талбарт бичээд илгээнэ үү.
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: m.is_mine ? "flex-end" : "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "min(72%, 420px)",
                      padding: "10px 14px",
                      borderRadius: m.is_mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: m.is_mine ? "var(--es-accent)" : "var(--es-card-bg, #fff)",
                      color: m.is_mine ? "#fff" : "var(--es-text)",
                      boxShadow: m.is_mine ? "0 1px 2px rgba(0,0,0,0.12)" : "0 1px 2px rgba(0,0,0,0.08)",
                      fontSize: "0.93rem",
                      lineHeight: 1.45,
                      wordBreak: "break-word",
                      border: m.is_mine ? "none" : "1px solid var(--es-border)",
                    }}
                  >
                    {!m.is_mine && (
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--es-muted)", marginBottom: 4 }}>{m.sender_name}</div>
                    )}
                    <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        marginTop: 6,
                        textAlign: "right",
                        opacity: m.is_mine ? 0.85 : 0.55,
                      }}
                    >
                      {formatTime(m.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} style={{ height: 1, flexShrink: 0 }} />
            </div>

            {/* Доод бичих талбар — Messenger шиг наалдсан */}
            <div
              style={{
                padding: "12px 16px 14px",
                borderTop: "1px solid var(--es-border)",
                background: "var(--es-card-bg, #fff)",
                flexShrink: 0,
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {sendError && (
                  <div
                    style={{
                      marginBottom: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "color-mix(in srgb, var(--es-danger) 14%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--es-danger) 26%, var(--es-border))",
                      color: "var(--es-text)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {sendError}
                  </div>
                )}
                <textarea
                  ref={draftRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Зурвас бичих…"
                  rows={1}
                  style={{
                    width: "100%",
                    flex: 1,
                    minHeight: 44,
                    maxHeight: 120,
                    padding: "12px 16px",
                    borderRadius: 22,
                    border: "1px solid var(--es-border)",
                    fontSize: "0.93rem",
                    resize: "none",
                    outline: "none",
                    lineHeight: 1.45,
                    fontFamily: "inherit",
                    background: "var(--es-surface-solid)",
                    color: "var(--es-text)",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !draft.trim()}
                style={{
                  minWidth: 44,
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 22,
                  border: "none",
                  background: draft.trim() ? "var(--es-accent)" : "var(--es-border)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  cursor: draft.trim() && !sending ? "pointer" : "default",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                {sending ? "…" : "Илгээх"}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .chat-left-panel {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            display: ${mobileShowThread ? "none" : "flex"} !important;
          }
          .chat-right-panel {
            display: ${mobileShowThread ? "flex" : "none"} !important;
          }
          .chat-back-btn {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
