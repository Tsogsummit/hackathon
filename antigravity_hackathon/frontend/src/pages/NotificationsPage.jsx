import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

function extractLink(body) {
  const m = /link:\s*(\S+)/i.exec(body || "");
  return m ? m[1] : null;
}

export default function NotificationsPage() {
  const token = useAuthStore((s) => s.token);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const out = await apiFetch("/profile/notifications", { token });
        setRows(out);
      } catch (e) {
        setErr(e?.message || "Мэдэгдэл ачаалж чадсангүй");
      }
    })();
  }, [token]);

  return (
    <div className="es-page">
      <h1 className="es-page-title">Мэдэгдлүүд</h1>
      <p className="es-page-desc">Сүүлийн 50 мэдэгдэл. Хэрэв link байвал шууд орж болно.</p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <div className="es-section">
        {rows.length === 0 ? (
          <p className="es-empty">Одоогоор мэдэгдэл алга.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {rows.map((n) => {
              const link = extractLink(n.body);
              return (
                <div key={n.id} style={{ border: "1px solid var(--es-border)", borderRadius: 10, padding: 10 }}>
                  <strong>{n.title}</strong>
                  <p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{n.body}</p>
                  {link && (
                    <div style={{ marginTop: 8 }}>
                      <Link className="es-btn es-btn-secondary" to={link}>
                        Нээх
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
