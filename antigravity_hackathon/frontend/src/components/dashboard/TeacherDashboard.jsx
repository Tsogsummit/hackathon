import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const STATUS_OPTIONS = [
  { value: "present", label: "Ирсэн", color: "var(--es-success)", bg: "rgba(16, 185, 129, 0.08)" },
  { value: "absent", label: "Тасалсан", color: "var(--es-danger)", bg: "rgba(239, 68, 68, 0.08)" },
  { value: "late", label: "Хоцорсон", color: "var(--es-warning)", bg: "rgba(245, 158, 11, 0.08)" },
  { value: "excused", label: "Чөлөөтэй", color: "var(--es-accent)", bg: "rgba(99, 102, 241, 0.08)" },
];

function statusMeta(s) {
  return STATUS_OPTIONS.find((o) => o.value === s) || STATUS_OPTIONS[0];
}

export default function TeacherDashboard() {
  const token = useAuthStore((s) => s.token);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [subjectFilter, setSubjectFilter] = useState("Бүгд");

  // Attendance edit modal (тогтмол хаалттай; энэ UI дээрх "засах" товч устсан)
  const [attOpen, setAttOpen] = useState(false);
  const [attRows, setAttRows] = useState([]);
  const [attLoading, setAttLoading] = useState(false);
  const [attSaving, setAttSaving] = useState(false);
  const [attMsg, setAttMsg] = useState("");

  const [weekAttLoading, setWeekAttLoading] = useState(false);
  const [weekAttErr, setWeekAttErr] = useState("");
  const [weekAtt, setWeekAtt] = useState({
    class_name: "",
    week_start: "",
    week_end: "",
    days: [],
    students: [],
  });

  const [dashboardData, setDashboardData] = useState({
    attendanceTotal: 0,
    attendancePresent: 0,
    attendanceAbsent: 0,
    attendanceLate: 0,
    avgGrade: 0,
    avgAttention: 0,
    hasAttentionData: false,
    missingExams: 0,
    lowAttentionStudents: [],
    materialHasLatest: false,
    materialHomework: false,
    materialDocs: 0,
    gradeDistribution: [],
  });

  useEffect(() => {
    let off = false;
    const loadClasses = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/teacher/lessons", { token });
        if (!off) {
          setLessons(data);
          if (data.length > 0) setSelectedLesson(data[0].id);
        }
      } catch (e) {
        console.error("Teacher lessons load fail", e);
      } finally {
        if (!off) setLoading(false);
      }
    };
    loadClasses();
    return () => { off = true; };
  }, [token]);

  useEffect(() => {
    let off = false;
    if (!selectedLesson) return;

    const loadDashboardStats = async () => {
      try {
        const stats = await apiFetch(`/teacher/lessons/${selectedLesson}/dashboard-stats`, { token });
        if (!off) {
          setDashboardData({
              ...stats,
              avgGrade: Number(stats.avgGrade || 0).toFixed(1),
              avgAttention: Number(stats.avgAttention || 0).toFixed(1),
          });
        }
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      }
    };
    loadDashboardStats();
    return () => { off = true; };
  }, [selectedLesson, token]);

  // 12A ангийн тухайн долоо хоногийн ирцийн diagram өгөгдөл
  useEffect(() => {
    let off = false;
    const loadWeek = async () => {
      try {
        setWeekAttLoading(true);
        setWeekAttErr("");
        const today = new Date().toISOString().slice(0, 10);
        const attLesson = lessons.find((l) => String(l.class_name || "").toUpperCase() === "12A");
        if (!attLesson) {
          if (!off) {
            setWeekAtt({ class_name: "12A", week_start: "", week_end: "", days: [], students: [] });
          }
          return;
        }
        const data = await apiFetch(`/teacher/lessons/${attLesson.id}/attendance-week?date_filter=${today}`, { token });
        if (!off) setWeekAtt(data || { class_name: attLesson.class_name, week_start: "", week_end: "", days: [], students: [] });
      } catch (e) {
        if (!off) setWeekAttErr(e?.message || "Ирцийн долоо хоногийн мэдээлэл ачаалж чадсангүй");
      } finally {
        if (!off) setWeekAttLoading(false);
      }
    };
    if (!lessons?.length) return;
    loadWeek();
    return () => {
      off = true;
    };
  }, [lessons, token]);

  if (loading) return <div className="es-skeleton" style={{height: "400px"}}></div>;
  if (!lessons || lessons.length === 0) {
    return <div className="es-section"><p className="es-empty">Танд хуваарилагдсан хичээл байхгүй байна.</p></div>;
  }

  // Handle unique subjects
  const uniqueSubjects = ["Бүгд", ...new Set(lessons.map(l => l.subject_name || "Бусад"))];
  const filteredLessons = lessons.filter(l => subjectFilter === "Бүгд" || l.subject_name === subjectFilter);
  const activeLessonOb = lessons.find(l => String(l.id) === String(selectedLesson)) || filteredLessons[0];
  const attendanceRate = dashboardData.attendanceTotal > 0
    ? Math.round((dashboardData.attendancePresent / dashboardData.attendanceTotal) * 100)
    : null;

  return (
    <div className="es-dashboard-stack fade-in">
      
      {/* Header Area */}
      <div className="es-card es-dashboard-header-card">
        <h2 className="es-section-title" style={{ fontSize: "1.4rem", margin: 0 }}>
          🏠 Үндсэн самбар — Багшийн хяналт
        </h2>
        
        {/* Subject Filters */}
        <div style={{ display: "flex", gap: "10px", marginTop: "1rem", flexWrap: "wrap" }}>
          {uniqueSubjects.map(sub => (
            <span 
              key={sub}
              className="es-chip" 
              style={{ 
                background: subjectFilter === sub ? "var(--es-primary)" : "var(--es-surface-soft)", 
                color: subjectFilter === sub ? "white" : "var(--es-primary-dark)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onClick={() => {
                setSubjectFilter(sub);
                const related = lessons.filter(l => sub === "Бүгд" || l.subject_name === sub);
                if (related.length > 0) {
                   setSelectedLesson(related[0].id);
                } else {
                   setSelectedLesson(null);
                }
              }}
            >
              {sub}
            </span>
          ))}
        </div>

        {/* Real Dynamic Class Selector */}
        {filteredLessons.length > 0 ? (
           <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "12px" }}>
             <strong style={{ color: "var(--es-primary-dark)" }}>Анги сонгох: </strong>
             <select
               className="es-select"
               style={{ width: "220px", padding: "8px", cursor: "pointer" }}
               value={selectedLesson || ""}
               onChange={(e) => setSelectedLesson(e.target.value)}
             >
               {filteredLessons.map((l) => (
                 <option key={l.id} value={l.id}>
                   {l.class_name} - {l.subject_name}
                 </option>
               ))}
             </select>
           </div>
        ) : (
           <p className="es-empty" style={{ marginTop: "15px" }}>Энэ хичээл дээр анги алга байна.</p>
        )}
      </div>

      {/* 4 Main KPI Cards */}
      {selectedLesson && (
        <>
          <div className="es-kpi-grid">
            <div className="es-kpi">
              <div className="es-kpi-label">📊 Өнөөдрийн ирц</div>
              <div className="es-kpi-value">{dashboardData.attendancePresent}/{dashboardData.attendanceTotal}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--es-muted)", marginTop: "8px" }}>
                {attendanceRate == null ? "Ирцийн бичлэг алга" : `Ирц: ${attendanceRate}%`}
              </div>
            </div>
            <div className="es-kpi">
              <div className="es-kpi-label">📈 Ангийн дундаж дүн</div>
              <div className="es-kpi-value">{dashboardData.avgGrade}%</div>
              <div style={{ fontSize: "0.75rem", color: "var(--es-muted)", marginTop: "8px" }}>Backend нэгтгэл</div>
            </div>
            <div className="es-kpi">
              <div className="es-kpi-label">👁️ Дундаж Attention</div>
              <div className="es-kpi-value">{dashboardData.hasAttentionData ? `${dashboardData.avgAttention}%` : "-"}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--es-muted)", marginTop: "8px" }}>
                {dashboardData.hasAttentionData ? "Backend тайлан" : "Attention өгөгдөл хараахан алга"}
              </div>
            </div>
          </div>

          {/* 4 Detailed Grid Cards */}
          <div className="es-dashboard-detail-grid">
            
            {/* Attendance Details */}
            <div className="es-card es-equal-card">
              <h3 className="es-label" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                📅 12А анги — {weekAtt.week_start && weekAtt.week_end ? `(${weekAtt.week_start.slice(5)} - ${weekAtt.week_end.slice(5)})` : "энэ долоо хоног"}
              </h3>

              {weekAttErr && <p className="es-alert es-alert-danger" style={{ marginBottom: 10 }}>{weekAttErr}</p>}

              {weekAttLoading ? (
                <div style={{ height: 220 }} className="es-skeleton" />
              ) : weekAtt.students.length === 0 ? (
                <p className="es-empty">12А ангид зориулсан ирцийн долоо хоногийн мэдээлэл олдсонгүй.</p>
              ) : (
                <div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                    {STATUS_OPTIONS.map((o) => (
                      <span
                        key={o.value}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          color: o.color,
                          background: o.bg,
                          border: `1px solid color-mix(in srgb, ${o.color} 25%, var(--es-border))`,
                        }}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: 99, background: o.color, display: "inline-block" }} />
                        {o.label}
                      </span>
                    ))}
                  </div>

                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={weekAtt.days.map((day, idx) => {
                        const dayStats = { name: day.slice(5), present: 0, absent: 0, late: 0, excused: 0 };
                        weekAtt.students.forEach((st) => {
                          const s = st.statuses[idx]?.status;
                          if (s === "present") dayStats.present++;
                          else if (s === "absent") dayStats.absent++;
                          else if (s === "late") dayStats.late++;
                          else if (s === "excused") dayStats.excused++;
                        });
                        return dayStats;
                      })}
                      margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" tick={{ fill: "var(--es-text)", fontSize: 13 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "var(--es-text)", fontSize: 13 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--es-surface)", borderColor: "var(--es-border)", borderRadius: 8, color: "var(--es-text)" }} 
                        itemStyle={{ fontWeight: "bold" }}
                        cursor={{ fill: "var(--es-surface-soft)" }}
                      />
                      <Bar dataKey="present" name="Ирсэн" stackId="a" fill="var(--es-success)" />
                      <Bar dataKey="late" name="Хоцорсон" stackId="a" fill="var(--es-warning)" />
                      <Bar dataKey="excused" name="Чөлөөтэй" stackId="a" fill="var(--es-accent)" />
                      <Bar dataKey="absent" name="Тасалсан" stackId="a" fill="var(--es-danger)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Low Attention Students */}
            <div className="es-card es-equal-card">
              <h3 className="es-label" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>👁️ Анхаарал сул сурагчид</h3>
              {dashboardData.lowAttentionStudents.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "180px", overflowY: "auto" }}>
                    {dashboardData.lowAttentionStudents.map((st, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i !== dashboardData.lowAttentionStudents.length - 1 ? "1px solid var(--es-border)" : "none", paddingBottom: "8px" }}>
                        <div>
                          <div style={{ fontWeight: "700", color: "var(--es-text)", fontSize: "0.95rem" }}>{st.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--es-muted)" }}>{st.class_name}</div>
                        </div>
                        <div className="es-badge-warn" style={{ padding: "4px 8px", fontWeight: "bold" }}>
                          {st.times} удаа
                        </div>
                      </div>
                    ))}
                  </div>
              ) : (
                  <p className="es-empty">Одоогоор анхаарал сул сурагч бүртгэгдээгүй байна.</p>
              )}
            </div>

            {/* Materials & Homework */}
            <div className="es-card es-equal-card">
              <h3 className="es-label" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>📝 Даалгавар / Материал</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontWeight: "600", fontSize: "0.95rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--es-muted)" }}>Сүүлд үүсгэсэн материал:</span> 
                  <span style={{ color: "var(--es-primary-dark)" }}>{dashboardData.materialHasLatest ? "Тийм" : "Үгүй"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--es-muted)" }}>Нэмэлт даалгавар:</span> 
                  <span style={{ color: "var(--es-primary-dark)" }}>{dashboardData.materialHomework ? "Олгосон" : "Байхгүй"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--es-muted)" }}>Нийт файлын тоо:</span> 
                  <span style={{ color: "var(--es-primary-dark)" }}>{dashboardData.materialDocs} файл</span>
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="es-card es-equal-card es-chart-card">
              <h3 className="es-label" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>📊 Дүнгийн тархалт ({activeLessonOb?.class_name})</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={dashboardData.gradeDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: "600", fill: "var(--es-text)" }} />
                  <Tooltip cursor={{fill: "transparent"}} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: "var(--es-text)" }}>
                    {dashboardData.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Attendance Edit Modal */}
      {attOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setAttOpen(false); }}
        >
          <div
            style={{
              background: "var(--es-card-bg, #fff)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 600,
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--es-border, #eee)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Ирц засах</div>
                <div style={{ fontSize: "0.82rem", color: "var(--es-muted)" }}>
                  {activeLessonOb?.class_name} · {new Date().toLocaleDateString("mn-MN")}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--es-muted)" }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {attLoading && <p style={{ textAlign: "center", color: "var(--es-muted)" }}>Ачаалж байна...</p>}
              {attMsg && <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>{attMsg}</p>}
              {!attLoading && attRows.length === 0 && !attMsg && (
                <p style={{ textAlign: "center", color: "var(--es-muted)" }}>Энэ ангид сурагч бүртгэгдээгүй.</p>
              )}
              {!attLoading && attRows.length > 0 && (
                <div style={{ display: "grid", gap: 8 }}>
                  {attRows.map((row, idx) => {
                    const meta = statusMeta(row.status);
                    return (
                      <div
                        key={row.student_id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          borderRadius: 10,
                          background: meta.bg,
                          border: `1px solid ${meta.color}33`,
                          transition: "background 0.2s",
                        }}
                      >
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: `${meta.color}22`,
                          color: meta.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          flexShrink: 0,
                        }}>
                          {(row.student_name || "?")[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {row.student_name}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          {STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                const next = [...attRows];
                                next[idx] = { ...next[idx], status: opt.value };
                                setAttRows(next);
                              }}
                              style={{
                                padding: "5px 10px",
                                borderRadius: 8,
                                border: row.status === opt.value ? `2px solid ${opt.color}` : "1px solid var(--es-border, #ddd)",
                                background: row.status === opt.value ? opt.bg : "var(--es-card-bg, #fff)",
                                color: row.status === opt.value ? opt.color : "var(--es-muted)",
                                fontWeight: row.status === opt.value ? 700 : 500,
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 24px",
              borderTop: "1px solid var(--es-border, #eee)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ fontSize: "0.82rem", color: "var(--es-muted)" }}>
                {attRows.length > 0 && (
                  <>
                    Ирсэн: {attRows.filter(r => r.status === "present").length} · 
                    Тасалсан: {attRows.filter(r => r.status === "absent").length} · 
                    Хоцорсон: {attRows.filter(r => r.status === "late").length}
                  </>
                )}
              </div>
              <button
                type="button"
                disabled={attSaving || attRows.length === 0}
                onClick={async () => {
                  setAttSaving(true);
                  setAttMsg("");
                  try {
                    const today = new Date().toISOString().slice(0, 10);
                    await apiFetch(`/teacher/lessons/${selectedLesson}/attendance`, {
                      method: "POST",
                      body: {
                        date_filter: today,
                        records: attRows.map((r) => ({
                          student_id: r.student_id,
                          status: r.status,
                          note: r.note || null,
                        })),
                      },
                      token,
                    });
                    setAttMsg("Ирц амжилттай хадгалагдлаа!");
                    const stats = await apiFetch(`/teacher/lessons/${selectedLesson}/dashboard-stats`, { token });
                    setDashboardData({
                      ...stats,
                      avgGrade: Number(stats.avgGrade || 0).toFixed(1),
                      avgAttention: Number(stats.avgAttention || 0).toFixed(1),
                    });
                    setTimeout(() => setAttOpen(false), 800);
                  } catch (e) {
                    setAttMsg(e?.message || "Хадгалахад алдаа гарлаа");
                  } finally {
                    setAttSaving(false);
                  }
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: attSaving ? "#d1d5db" : "#22c55e",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: attSaving ? "wait" : "pointer",
                }}
              >
                {attSaving ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
