import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const riskColor = (level) => {
  if (level === "high") return "#ef4444";
  if (level === "medium") return "#f59e0b";
  return "#22c55e";
};

const riskLabel = (level) => {
  if (level === "high") return "Өндөр";
  if (level === "medium") return "Дунд";
  return "Бага";
};

const gradeColor = (grade) => {
  if (!grade) return "var(--es-muted)";
  if (grade === "A") return "#22c55e";
  if (grade === "B") return "#3b82f6";
  if (grade === "C") return "#f59e0b";
  if (grade === "D") return "#f97316";
  return "#ef4444";
};

const fmt = (v) => (v != null ? Number(v).toFixed(1) : "-");

export default function StudentGradePredictionsPage() {
  const token = useAuthStore((s) => s.token);
  const [insights, setInsights] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [, li] = await Promise.all([
          apiFetch("/grades/me/predictions", { token }),
          apiFetch("/grades/me/lesson-insights", { token }),
        ]);
        setInsights(li);
      } catch (e) {
        setErr(e?.message || "Таамаг ачаалж чадсангүй");
      }
    })();
  }, [token]);

  return (
    <div className="es-page">
      <h1 className="es-page-title">Миний дүнгийн таамаг</h1>
      <p className="es-page-desc">Хичээл тус бүрийн дүн, эрсдэл, ирц, анхааралын мэдээллийг нэг дороос харна.</p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      {insights.length === 0 && !err && <p className="es-empty">Оноо хараахан ороогүй.</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {insights.map((r, idx) => {
          const key = `${r.student_id}-${r.class_id}-${r.teacher_id}-${idx}`;
          const isOpen = expanded === key;
          const risk = r.risk_level || "low";
          const hasAttentionIssue = r.low_attention_dates?.length > 0;
          const hasAbsent = r.absent_dates?.length > 0;
          const hasLate = r.late_dates?.length > 0;

          return (
            <div
              key={key}
              style={{
                background: "var(--es-card-bg, #fff)",
                border: `1px solid ${riskColor(risk)}33`,
                borderLeft: `4px solid ${riskColor(risk)}`,
                borderRadius: 12,
                overflow: "hidden",
                transition: "box-shadow 0.2s",
                boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Header - clickable */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : key)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  alignItems: "center",
                  gap: 16,
                  width: "100%",
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {/* Subject & teacher */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--es-text)" }}>
                    {r.lesson_title || `Хичээл #${r.class_id}`}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--es-muted)", marginTop: 2 }}>
                    {r.teacher_name} · {r.term || "-"}
                  </div>
                </div>

                {/* Predicted grade badge */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `${gradeColor(r.predicted_grade)}18`,
                      color: gradeColor(r.predicted_grade),
                      fontWeight: 800,
                      fontSize: "1.2rem",
                    }}
                  >
                    {r.predicted_grade || "-"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--es-muted)", marginTop: 2 }}>
                    Таамаг
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: "center", minWidth: 60 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--es-text)" }}>
                    {fmt(r.predicted_score)}%
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--es-muted)" }}>Оноо</div>
                </div>

                {/* Risk badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: `${riskColor(risk)}18`,
                    color: riskColor(risk),
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: riskColor(risk),
                    display: "inline-block",
                  }} />
                  {riskLabel(risk)}
                </div>
              </button>

              {/* Expandable detail */}
              {isOpen && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--es-border, #eee)" }}>
                  {/* Score breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginTop: 16 }}>
                    {[
                      { label: "Гэрийн даалгавар", value: r.homework_avg },
                      { label: "Quiz", value: r.quiz_avg },
                      { label: "Бие даалт", value: r.project_score },
                      { label: "Ирц", value: r.attendance_rate },
                      { label: "Мидтерм", value: r.midterm_exam },
                      { label: "Эцсийн шалгалт", value: r.final_exam },
                      { label: "Зан төлөв", value: r.behavior_score },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          background: "var(--es-bg, #f8f9fa)",
                          borderRadius: 10,
                          padding: "12px 14px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "0.78rem", color: "var(--es-muted)", marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--es-text)" }}>{fmt(item.value)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Fail probability bar */}
                  {r.fail_probability != null && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 6 }}>
                        <span style={{ color: "var(--es-muted)" }}>Унах эрсдэл</span>
                        <span style={{ fontWeight: 700, color: r.fail_probability >= 50 ? "#ef4444" : r.fail_probability >= 20 ? "#f59e0b" : "#22c55e" }}>
                          {Number(r.fail_probability).toFixed(1)}%
                        </span>
                      </div>
                      <div className="es-progress-track">
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, r.fail_probability)}%`,
                            borderRadius: 4,
                            background: r.fail_probability >= 50 ? "#ef4444" : r.fail_probability >= 20 ? "#f59e0b" : "#22c55e",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Attention & attendance alerts */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                    {hasAttentionIssue && (
                      <div className="es-badge-warn" style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", fontSize: "0.85rem",
                      }}>
                        <span style={{ fontWeight: 600 }}>Анхаарал сул:</span>
                        {r.low_attention_dates.join(", ")}
                      </div>
                    )}
                    {hasAbsent && (
                      <div className="es-badge-danger" style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", fontSize: "0.85rem",
                      }}>
                        <span style={{ fontWeight: 600 }}>Тасалсан:</span>
                        {r.absent_dates.join(", ")}
                      </div>
                    )}
                    {hasLate && (
                      <div className="es-badge-yellow" style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", fontSize: "0.85rem",
                      }}>
                        <span style={{ fontWeight: 600 }}>Хоцорсон:</span>
                        {r.late_dates.join(", ")}
                      </div>
                    )}
                    {!hasAttentionIssue && !hasAbsent && !hasLate && (
                      <div className="es-badge-success" style={{
                        padding: "8px 14px", fontSize: "0.85rem",
                      }}>
                        Ирц, анхааралын асуудал бүртгэгдээгүй
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
