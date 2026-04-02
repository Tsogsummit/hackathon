import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

const riskColor = (l) => (l === "high" ? "#ef4444" : l === "medium" ? "#f59e0b" : "#22c55e");
const riskLabel = (l) => (l === "high" ? "Унах эрсдэлтэй" : l === "medium" ? "Анхаарах шаардлагатай" : "Тэнцэх магадлал өндөр");
const fmt = (v) => (v != null ? Number(v).toFixed(1) : "-");

export default function GradePredictorPage() {
  const token = useAuthStore((s) => s.token);
  const [lessons, setLessons] = useState([]);
  const [classIdView, setClassIdView] = useState("");
  const [preds, setPreds] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const studentNameById = useMemo(
    () => Object.fromEntries(studentDetails.map((x) => [x.student_id, x.student_name])),
    [studentDetails],
  );

  useEffect(() => {
    (async () => {
      try {
        const ls = await apiFetch("/teacher/lessons", { token });
        setLessons(ls);
        if (ls.length) {
          const cid = String(ls[0].class_id);
          setClassIdView(cid);
          await loadClassPredictionsByClass(cid);
          await loadClassStudentDetails(cid);
        }
      } catch (e) {
        setErr(e?.message || "Эхний мэдээлэл ачаалж чадсангүй");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadClassPredictionsByClass(classId = classIdView) {
    if (!classId) return;
    const out = await apiFetch(`/grades/class/${Number(classId)}/predictions`, { token });
    setPreds(out);
  }

  async function loadClassStudentDetails(classId = classIdView) {
    if (!classId) return;
    const out = await apiFetch(`/grades/class/${Number(classId)}/student-details`, { token });
    setStudentDetails(out);
  }

  async function refreshClassData() {
    try {
      setErr("");
      setExpandedId(null);
      await loadClassPredictionsByClass(classIdView);
      await loadClassStudentDetails(classIdView);
    } catch (e) {
      setErr(e?.message || "Жагсаалт ачаалж чадсангүй");
    }
  }

  function riskLevelOf(p) {
    const fp = Number(p.fail_probability || 0);
    const level = String(p.risk_level || "").toLowerCase();
    if (level === "high" || fp >= 55) return "high";
    if (level === "medium" || fp >= 30) return "medium";
    return "low";
  }

  const viewRows = useMemo(() => {
    return [...preds]
      .map((p) => {
        const level = riskLevelOf(p);
        return {
          ...p,
          __risk: level,
          __student: p.student_name || studentNameById[p.student_id] || `#${p.student_id}`,
        };
      })
      .sort((a, b) => Number(b.fail_probability || 0) - Number(a.fail_probability || 0));
  }, [preds, studentNameById]);

  const riskSummary = useMemo(() => {
    const out = { high: 0, medium: 0, low: 0 };
    for (const r of viewRows) out[r.__risk] += 1;
    return out;
  }, [viewRows]);

  function getDetail(studentId) {
    return studentDetails.find((d) => Number(d.student_id) === Number(studentId)) || null;
  }

  function buildNarrative(row, detail) {
    if (!row) return { negatives: [], positives: [] };
    const negatives = [];
    const positives = [];
    if (detail) {
      if (Number(detail.attendance_rate ?? 100) < 80) negatives.push(`Ирц ${fmt(detail.attendance_rate)}% — бага`);
      if (Number(detail.final_exam ?? 100) < 60) negatives.push(`Эцсийн шалгалт ${fmt(detail.final_exam)} — бага`);
      if (Number(detail.homework_avg ?? 100) < 60) negatives.push(`Даалгавар ${fmt(detail.homework_avg)} — бага`);
      if (Number(detail.low_attention_count ?? 0) > 0) negatives.push(`Анхаарал сул ${detail.low_attention_count} удаа`);
      if (Number(detail.absent_count ?? 0) > 0) negatives.push(`Тасалсан ${detail.absent_count} удаа`);
      if (Number(detail.attendance_rate ?? 0) >= 90) positives.push(`Ирц сайн (${fmt(detail.attendance_rate)}%)`);
      if (Number(detail.final_exam ?? 0) >= 75) positives.push(`Эцсийн шалгалт сайн (${fmt(detail.final_exam)})`);
      if (Number(detail.homework_avg ?? 0) >= 75) positives.push(`Даалгавар сайн (${fmt(detail.homework_avg)})`);
      if (Number(detail.absent_count ?? 0) === 0) positives.push("Таслалтгүй");
    }
    if (Number(row.predicted_score || 0) >= 75) positives.push(`Таамаг дүн боломжийн (${fmt(row.predicted_score)}%)`);
    if (Number(row.predicted_score || 0) < 60) negatives.push(`Таамаг дүн бага (${fmt(row.predicted_score)}%)`);
    return { negatives, positives };
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Сурагчийн дүнгийн таамаг (AI)</h1>
      <p className="es-page-desc">Мөр дээр дарж сурагчийн дэлгэрэнгүй мэдээллийг харна уу.</p>

      <div className="es-section">
        <div className="es-toolbar" style={{ marginBottom: 12 }}>
          <select className="es-select" style={{ maxWidth: 360 }} value={classIdView} onChange={(e) => setClassIdView(e.target.value)}>
            {!lessons.length && <option value="">— Хичээл алга —</option>}
            {lessons.map((l) => (
              <option key={l.id} value={l.class_id}>
                {l.class_name} — {l.title || `Хичээл #${l.id}`}
              </option>
            ))}
          </select>
          <button className="es-btn es-btn-secondary" onClick={refreshClassData}>
            Ангийн таамаг харах
          </button>
        </div>
        {err && <p className="es-alert es-alert-danger" style={{ marginBottom: 10 }}>{err}</p>}

        {viewRows.length > 0 && (
          <div className="es-kpi-grid" style={{ marginBottom: 14 }}>
            <div className="es-kpi">
              <div className="es-kpi-label">Нийт сурагч</div>
              <div className="es-kpi-value">{viewRows.length}</div>
            </div>
            <div className="es-kpi">
              <div className="es-kpi-label">Унах эрсдэлтэй</div>
              <div className="es-kpi-value" style={{ color: "var(--es-danger)" }}>{riskSummary.high}</div>
            </div>
            <div className="es-kpi">
              <div className="es-kpi-label">Анхаарах шаардлагатай</div>
              <div className="es-kpi-value" style={{ color: "var(--es-warning)" }}>{riskSummary.medium}</div>
            </div>
            <div className="es-kpi">
              <div className="es-kpi-label">Тэнцэх магадлал өндөр</div>
              <div className="es-kpi-value" style={{ color: "var(--es-success)" }}>{riskSummary.low}</div>
            </div>
          </div>
        )}

        {viewRows.length === 0 ? (
          <p className="es-empty">Одоогоор таамаг алга.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {viewRows.map((p) => {
              const isOpen = expandedId === p.student_id;
              const detail = isOpen ? getDetail(p.student_id) : null;
              const narrative = isOpen ? buildNarrative(p, detail) : null;
              const failPct = Math.max(0, Math.min(100, Number(p.fail_probability || 0)));
              const pieData = [
                { name: "Унах эрсдэл", value: failPct, fill: "#ef4444" },
                { name: "Тэнцэх", value: Math.max(0, 100 - failPct), fill: "#10b981" },
              ];

              return (
                <div
                  key={p.id || p.student_id}
                  style={{
                    background: "var(--es-card-bg, #fff)",
                    border: `1px solid ${riskColor(p.__risk)}33`,
                    borderLeft: `4px solid ${riskColor(p.__risk)}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : p.student_id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto auto auto",
                      alignItems: "center",
                      gap: 16,
                      width: "100%",
                      padding: "14px 20px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--es-text)" }}>{p.__student}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--es-muted)", marginTop: 2 }}>Дэлгэрэнгүй харах</div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 56 }}>
                      <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>
                        {p.predicted_grade || "-"}
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "var(--es-muted)" }}>Таамаг</div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 56 }}>
                      <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{fmt(p.predicted_score)}%</div>
                      <div style={{ fontSize: "0.73rem", color: "var(--es-muted)" }}>Оноо</div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 56 }}>
                      <div style={{ fontWeight: 700, fontSize: "1.05rem", color: failPct >= 50 ? "#ef4444" : failPct >= 20 ? "#f59e0b" : "#22c55e" }}>
                        {failPct.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "var(--es-muted)" }}>Унах</div>
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 14px",
                        borderRadius: 20,
                        background: `${riskColor(p.__risk)}18`,
                        color: riskColor(p.__risk),
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: riskColor(p.__risk), display: "inline-block" }} />
                      {riskLabel(p.__risk)}
                    </div>
                  </button>

                  {/* Expanded detail panel */}
                  {isOpen && (
                    <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--es-border, #eee)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, marginTop: 16 }}>
                        {/* Pie chart */}
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: "0.9rem" }}>Эрсдэлийн харьцаа</div>
                          <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={75} label>
                                  {pieData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Narrative */}
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: "0.9rem" }}>Яагаад ийм эрсдэлтэй гэж үзсэн бэ?</div>
                          {narrative && narrative.negatives.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ fontWeight: 600, color: "#ef4444", fontSize: "0.85rem", marginBottom: 4 }}>Сөрөг нөлөөлөл:</div>
                              <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {narrative.negatives.map((x) => (
                                  <li key={x} style={{ fontSize: "0.88rem", marginBottom: 2 }}>{x}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {narrative && narrative.positives.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ fontWeight: 600, color: "#22c55e", fontSize: "0.85rem", marginBottom: 4 }}>Эерэг нөлөөлөл:</div>
                              <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {narrative.positives.map((x) => (
                                  <li key={x} style={{ fontSize: "0.88rem", marginBottom: 2 }}>{x}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {narrative && !narrative.negatives.length && !narrative.positives.length && (
                            <p style={{ color: "var(--es-muted)", fontSize: "0.88rem" }}>Дэлгэрэнгүй мэдээлэл хүрэлцэхгүй байна.</p>
                          )}
                          {p.summary && (
                            <div style={{ marginTop: 8, fontSize: "0.85rem", color: "var(--es-muted)", fontStyle: "italic" }}>
                              {p.summary}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Score breakdown cards */}
                      {detail && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginTop: 16 }}>
                          {[
                            { label: "Гэрийн даалгавар", value: detail.homework_avg },
                            { label: "Quiz", value: detail.quiz_avg },
                            { label: "Бие даалт", value: detail.project_score },
                            { label: "Ирц", value: detail.attendance_rate },
                            { label: "Мидтерм", value: detail.midterm_exam },
                            { label: "Эцсийн шалгалт", value: detail.final_exam },
                            { label: "Зан төлөв", value: detail.behavior_score },
                          ].map((item) => (
                            <div
                              key={item.label}
                              style={{
                                background: "var(--es-bg, #f8f9fa)",
                                borderRadius: 10,
                                padding: "10px 12px",
                                textAlign: "center",
                              }}
                            >
                              <div style={{ fontSize: "0.75rem", color: "var(--es-muted)", marginBottom: 3 }}>{item.label}</div>
                              <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{fmt(item.value)}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Attendance badges */}
                      {detail && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                          {Number(detail.low_attention_count || 0) > 0 && (
                            <span className="es-badge-warn">
                              Анхаарал сул: {detail.low_attention_count} удаа
                            </span>
                          )}
                          {Number(detail.absent_count || 0) > 0 && (
                            <span className="es-badge-danger">
                              Тасалсан: {detail.absent_count} удаа
                            </span>
                          )}
                          {Number(detail.late_count || 0) > 0 && (
                            <span className="es-badge-yellow">
                              Хоцорсон: {detail.late_count} удаа
                            </span>
                          )}
                          {!Number(detail.low_attention_count || 0) && !Number(detail.absent_count || 0) && !Number(detail.late_count || 0) && (
                            <span className="es-badge-success">
                              Ирц, анхааралын асуудал бүртгэгдээгүй
                            </span>
                          )}
                        </div>
                      )}
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
