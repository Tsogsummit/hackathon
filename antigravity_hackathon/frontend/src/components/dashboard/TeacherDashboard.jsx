import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function TeacherDashboard() {
  const token = useAuthStore((s) => s.token);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [subjectFilter, setSubjectFilter] = useState("Бүгд");

  const [dashboardData, setDashboardData] = useState({
    attendanceTotal: 25,
    attendancePresent: 21,
    attendanceAbsent: 3,
    attendanceLate: 1,
    avgGrade: 70.6,
    avgAttention: 92.8,
    missingExams: 0,
    lowAttentionStudents: [],
    materialHasLatest: true,
    materialHomework: true,
    materialDocs: 2,
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
              avgAttention: Number(stats.avgAttention || 0).toFixed(1)
          });
        }
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      }
    };
    loadDashboardStats();
    return () => { off = true; };
  }, [selectedLesson, token]);

  if (loading) return <div className="es-skeleton" style={{height: "400px"}}></div>;
  if (!lessons || lessons.length === 0) {
    return <div className="es-section"><p className="es-empty">Танд хуваарилагдсан хичээл байхгүй байна.</p></div>;
  }

  // Handle unique subjects
  const uniqueSubjects = ["Бүгд", ...new Set(lessons.map(l => l.subject_name || "Бусад"))];
  const filteredLessons = lessons.filter(l => subjectFilter === "Бүгд" || l.subject_name === subjectFilter);
  const activeLessonOb = lessons.find(l => String(l.id) === String(selectedLesson)) || filteredLessons[0];

  return (
    <div className="es-section fade-in" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
      
      {/* Header Area */}
      <div className="es-card" style={{ marginBottom: "20px" }}>
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
                background: subjectFilter === sub ? "var(--es-primary)" : "rgba(255,255,255,0.6)", 
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
              <div style={{ fontSize: "0.75rem", color: "var(--es-muted)", marginTop: "8px" }}>Төлөв: Хэвийн</div>
            </div>
            <div className="es-kpi">
              <div className="es-kpi-label">📈 Ангийн дундаж дүн</div>
              <div className="es-kpi-value">{dashboardData.avgGrade}%</div>
              <div style={{ fontSize: "0.75rem", color: "var(--es-success)", marginTop: "8px" }}>+2.4% Өсөлттэй</div>
            </div>
            <div className="es-kpi">
              <div className="es-kpi-label">👁️ Дундаж Attention</div>
              <div className="es-kpi-value">{dashboardData.avgAttention}%</div>
              <div style={{ fontSize: "0.75rem", color: "var(--es-danger)", marginTop: "8px" }}>Анхаарах шаардлагатай</div>
            </div>
          </div>

          {/* 4 Detailed Grid Cards */}
          <div className="es-grid-2" style={{ gap: "20px" }}>
            
            {/* Attendance Details */}
            <div className="es-card">
              <h3 className="es-label" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>📅 Ирц ({activeLessonOb?.class_name})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontWeight: "600" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--es-success)" }}>
                  <span>Ирсэн:</span> <span>{dashboardData.attendancePresent}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--es-danger)" }}>
                  <span>Тасалсан:</span> <span>{dashboardData.attendanceAbsent}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--es-warning)" }}>
                  <span>Хоцорсон:</span> <span>{dashboardData.attendanceLate}</span>
                </div>
              </div>
              <button className="es-btn es-btn-secondary" style={{ width: "100%", marginTop: "1rem" }}>
                Ирцийг засах →
              </button>
            </div>

            {/* Low Attention Students */}
            <div className="es-card">
              <h3 className="es-label" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>👁️ Анхаарал сул сурагчид</h3>
              {dashboardData.lowAttentionStudents.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "180px", overflowY: "auto" }}>
                    {dashboardData.lowAttentionStudents.map((st, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i !== dashboardData.lowAttentionStudents.length - 1 ? "1px solid var(--es-border)" : "none", paddingBottom: "8px" }}>
                        <div>
                          <div style={{ fontWeight: "700", color: "var(--es-text)", fontSize: "0.95rem" }}>{st.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--es-muted)" }}>{st.class}</div>
                        </div>
                        <div style={{ background: "rgba(245, 158, 11, 0.15)", color: "#b45309", padding: "4px 8px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "bold" }}>
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
            <div className="es-card">
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
            <div className="es-card">
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
    </div>
  );
}
