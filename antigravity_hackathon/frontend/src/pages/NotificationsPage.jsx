import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function extractLink(body) {
  const m = /link:\s*(\S+)/i.exec(body || "");
  return m ? m[1] : null;
}

function parseAttentionBinsFromBody(body) {
  // Backend embeds: ATTENTION_BINS:{...}
  const m = /ATTENTION_BINS:({[\s\S]*})/i.exec(body || "");
  if (!m) return null;
  try {
    const obj = JSON.parse(m[1]);
    if (!obj || typeof obj !== "object") return null;
    return obj;
  } catch {
    return null;
  }
}

function stripAttentionBinsMarker(body) {
  if (!body) return "";
  return body
    .split("\n")
    .filter((line) => !line.toUpperCase().startsWith("ATTENTION_BINS:"))
    .join("\n")
    .trim();
}

const attentionBinColor = (binKey) => {
  if (binKey === "80+") return "#22c55e"; // high attention
  if (binKey === "60-79") return "#f59e0b";
  if (binKey === "40-59") return "#f97316";
  if (binKey === "20-39") return "#ef4444";
  return "#7f1d1d"; // <20
};

function getNotificationKind(n) {
  const title = String(n?.title || "").toLowerCase();
  const body = String(n?.body || "").toLowerCase();

  if (body.includes("attention_bins:") || title.includes("анхаарал")) {
    return {
      kind: "attention",
      icon: "⚠️",
      accent: "#ef4444",
      badge: "Анхаарал",
    };
  }
  if (title.includes("сурагчийн мэдэгдэл") || title.includes("event") || title.includes("дээрэлх")) {
    return {
      kind: "student_event",
      icon: "📝",
      accent: "#3b82f6",
      badge: "Сурагчийн үйл явдал",
    };
  }

  // Fallback
  return { kind: "system", icon: "🔔", accent: "#10b981", badge: "Мэдэгдэл" };
}

export default function NotificationsPage() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const profileNotifications = await apiFetch("/profile/notifications", { token });
        if (role !== "admin") {
          setRows(profileNotifications);
          return;
        }

        const eventReports = await apiFetch("/student/event-reports", { token });
        const reportNotifications = eventReports.map((r) => ({
          id: `report-${r.id}`,
          title: `Сурагчийн мэдэгдэл: ${r.category}`,
          body: `ID #${r.id} | class=${r.class_id}${r.lesson_id ? `, lesson=${r.lesson_id}` : ""}\nТөлөв: ${r.status}\n${r.description}`,
          read: false,
          _priority: r.id,
        }));
        const merged = [...reportNotifications, ...profileNotifications.map((n) => ({ ...n, _priority: n.id }))].sort(
          (a, b) => (b._priority || 0) - (a._priority || 0),
        );
        setRows(merged);
      } catch (e) {
        setErr(e?.message || "Мэдэгдэл ачаалж чадсангүй");
      }
    })();
  }, [token, role]);

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
              const meta = getNotificationKind(n);
              const link = extractLink(n.body);
              const isOpen = expandedId === n.id || expandedId === String(n.id);
              const bins = parseAttentionBinsFromBody(n.body);
              const binsData =
                bins && typeof bins === "object"
                  ? [
                      { name: "80+", value: bins["80+"] ?? 0 },
                      { name: "60-79", value: bins["60-79"] ?? 0 },
                      { name: "40-59", value: bins["40-59"] ?? 0 },
                      { name: "20-39", value: bins["20-39"] ?? 0 },
                      { name: "<20", value: bins["<20"] ?? 0 },
                    ]
                  : null;
              const cleanedBody = stripAttentionBinsMarker(n.body);
              const preview = cleanedBody.split("\n")[0]?.slice(0, 120) || "";
              const binsTotal = binsData ? binsData.reduce((s, x) => s + Number(x.value || 0), 0) : null;
              return (
                <div
                  key={String(n.id)}
                  style={{
                    border: "1px solid var(--es-border)",
                    borderLeft: `5px solid ${meta.accent}`,
                    borderRadius: 12,
                    padding: 10,
                    background: isOpen ? "var(--es-surface-soft)" : "transparent",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : String(n.id))}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: `color-mix(in srgb, ${meta.accent} 16%, transparent)`,
                              border: `1px solid color-mix(in srgb, ${meta.accent} 30%, var(--es-border))`,
                              flexShrink: 0,
                            }}
                          >
                            {meta.icon}
                          </div>
                          <strong style={{ color: "var(--es-text)" }}>{n.title}</strong>
                        </div>

                        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              color: meta.accent,
                              background: `color-mix(in srgb, ${meta.accent} 16%, transparent)`,
                              border: `1px solid color-mix(in srgb, ${meta.accent} 25%, var(--es-border))`,
                            }}
                          >
                            {meta.badge}
                          </span>
                          {meta.kind === "attention" && binsTotal != null && (
                            <span style={{ fontSize: "0.75rem", color: "var(--es-muted)", fontWeight: 800 }}>
                              Нийт: {binsTotal}
                            </span>
                          )}
                        </div>

                        <p style={{ margin: "6px 0 0", color: "var(--es-muted)", fontSize: "0.85rem" }}>
                          {preview || "Дэлгэрэнгүй үзэх…"}
                        </p>
                      </div>
                      <div style={{ color: "var(--es-muted)", fontWeight: 800, whiteSpace: "nowrap" }}>
                        {isOpen ? "▲" : "▼"}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ marginTop: 10 }}>
                      {binsData && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontWeight: 900, marginBottom: 6, color: "var(--es-text)" }}>Анхаарал тархалт (distribution)</div>
                          <div style={{ height: 190 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Tooltip />
                                <Pie data={binsData} dataKey="value" nameKey="name" outerRadius={75} innerRadius={45} label>
                                  {binsData.map((e) => (
                                    <Cell key={e.name} fill={attentionBinColor(e.name)} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--es-text)", fontSize: "0.92rem" }}>{cleanedBody}</p>

                      {link && (
                        <div style={{ marginTop: 10 }}>
                          <Link className="es-btn es-btn-secondary" to={link}>
                            Нээх
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {link && (
                    <div style={{ marginTop: 8, display: isOpen ? "none" : "block" }}>
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
