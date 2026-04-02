import { useEffect, useMemo, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const TABS = [
  { key: "materials", label: "AI Хичээл / Даалгавар" },
  { key: "assignments", label: "Даалгавар" },
  { key: "self_study", label: "Бие даалт" },
  { key: "midterm", label: "Мидтерм" },
  { key: "final", label: "Эцсийн шалгалт" },
  { key: "attendance", label: "Ирц" },
  { key: "bonus", label: "Нэмэлт оноо" },
];

const TAB_COLORS = {
  materials: "#6366f1",
  assignments: "#3b82f6",
  self_study: "#8b5cf6",
  midterm: "#f59e0b",
  final: "#ef4444",
  attendance: "#22c55e",
  bonus: "#06b6d4",
};

function SectionCards({ rows, lessonFilter }) {
  const filtered = rows.filter(
    (r) => lessonFilter === "Бүгд" || r.lesson_title === lessonFilter,
  );

  if (filtered.length === 0) {
    return <p className="es-empty">Мэдээлэл алга.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {filtered.map((r, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: 12,
            padding: "14px 18px",
            background: "var(--es-card-bg, #fff)",
            borderRadius: 10,
            border: "1px solid var(--es-border, #eee)",
          }}
        >
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--es-muted)" }}>Огноо</div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {r.date ? String(r.date).replace("T", " ").slice(0, 10) : "-"}
            </div>
            {r.class_name && (
              <div
                className="es-badge-indigo"
                style={{
                  marginTop: 4,
                  display: "inline-block",
                }}
              >
                {r.class_name}
              </div>
            )}
          </div>
          <div>
            {r.lesson_title && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--es-muted)",
                  marginBottom: 4,
                }}
              >
                {r.lesson_title}
              </div>
            )}
            <div style={{ fontSize: "0.92rem", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
              {r.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MaterialsSection({ items, lessonFilter }) {
  const filtered = items.filter(
    (m) => lessonFilter === "Бүгд" || m.lesson_title === lessonFilter,
  );

  if (filtered.length === 0) {
    return <p className="es-empty">Одоогоор AI-аар үүсгэсэн хичээлийн материал алга.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {filtered.map((m, i) => (
        <MaterialCard key={i} mat={m} />
      ))}
    </div>
  );
}

function MaterialCard({ mat }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "var(--es-card-bg, #fff)",
        border: "1px solid #6366f133",
        borderLeft: "4px solid #6366f1",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "14px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--es-text)" }}>
            {mat.lesson_title || "Хичээл"}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--es-muted)", marginTop: 2 }}>
            {mat.class_name || ""} · {mat.date ? String(mat.date).slice(0, 10) : ""}
          </div>
        </div>
        <span
          style={{
            fontSize: "0.8rem",
            color: "#6366f1",
            background: "#6366f112",
            padding: "4px 12px",
            borderRadius: 16,
            fontWeight: 600,
          }}
        >
          {open ? "Хураах" : "Дэлгэрэнгүй"}
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--es-border, #eee)" }}>
          {mat.summary && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--es-muted)", marginBottom: 4 }}>
                Товч тойм
              </div>
              <div
                style={{
                  background: "var(--es-bg, #f8f9fa)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                {mat.summary}
              </div>
            </div>
          )}

          {mat.key_points && mat.key_points.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--es-muted)", marginBottom: 4 }}>
                Гол санаа
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, listStyleType: "disc" }}>
                {mat.key_points.map((p, j) => (
                  <li key={j} style={{ fontSize: "0.9rem", marginBottom: 3, lineHeight: 1.5 }}>
                    {typeof p === "string" ? p : JSON.stringify(p)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mat.homework && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#3b82f6", marginBottom: 4 }}>
                Даалгавар
              </div>
              <div
                className="es-bg-blue-soft"
                style={{
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {typeof mat.homework === "object"
                  ? Object.entries(mat.homework).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 4 }}>
                        <strong>{k}:</strong> {typeof v === "string" ? v : JSON.stringify(v)}
                      </div>
                    ))
                  : mat.homework}
              </div>
            </div>
          )}

          {mat.exercises && mat.exercises.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#8b5cf6", marginBottom: 4 }}>
                Бие даалт / Дасгал
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {mat.exercises.map((ex, j) => (
                  <div
                    key={j}
                    className="es-bg-purple-soft"
                    style={{
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: "0.88rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Дасгал {j + 1}:</strong>{" "}
                    {typeof ex === "object"
                      ? ex.question || ex.title || ex.description || JSON.stringify(ex)
                      : ex}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mat.exam_questions && mat.exam_questions.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#ef4444", marginBottom: 4 }}>
                Шалгалтын асуулт
              </div>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {mat.exam_questions.map((q, j) => (
                  <li key={j} style={{ fontSize: "0.88rem", marginBottom: 4, lineHeight: 1.5 }}>
                    {typeof q === "object"
                      ? q.question || q.title || JSON.stringify(q)
                      : q}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AcademicBreakdownPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [lessonFilter, setLessonFilter] = useState("Бүгд");
  const [activeTab, setActiveTab] = useState("materials");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        if (user?.role === "student") {
          const [bd, timetable] = await Promise.all([
            apiFetch("/profile/student/academic-breakdown", { token }).catch(() => null),
            apiFetch("/student/timetable", { token }).catch(() => []),
          ]);
          if (bd && bd.student_id) {
            setItems([bd]);
            setSelectedStudent(String(bd.student_id));
          }
          await loadMaterials(timetable);
        } else if (user?.role === "parent") {
          const bd = await apiFetch("/profile/parent/children/academic-breakdown", { token }).catch(() => null);
          if (bd && bd.length > 0) {
            setItems(bd);
            setSelectedStudent(String(bd[0].student_id));
          }
        } else {
          setErr("Энэ хуудас зөвхөн сурагч/эцэг эхийн эрхтэй.");
        }
      } catch (e) {
        setErr(e?.message || "Ачаалж чадсангүй");
      }
    })();
  }, [token, user?.role]);

  async function loadMaterials(timetable) {
    const lessonIds = [...new Set((timetable || []).map((r) => r.lesson_id).filter(Boolean))];
    const loaded = [];
    for (const lid of lessonIds) {
      try {
        const mat = await apiFetch(`/student/lessons/${lid}/latest-material`, { token });
        if (mat) {
          const tt = (timetable || []).find((r) => r.lesson_id === lid);
          loaded.push({
            ...mat,
            class_name: tt?.class_name || "",
            lesson_title: tt?.subject_name || tt?.lesson_title || `Хичээл #${lid}`,
            date: null,
          });
        }
      } catch {
        /* skip */
      }
    }
    setMaterials(loaded);
  }

  const current = useMemo(
    () => items.find((x) => String(x.student_id) === String(selectedStudent)),
    [items, selectedStudent],
  );

  const uniqueLessons = useMemo(() => {
    if (!current) return ["Бүгд"];
    const allTitles = [
      ...(current.assignments || []),
      ...(current.self_study || []),
      ...(current.midterm || []),
      ...(current.final || []),
      ...(current.attendance || []),
      ...(current.bonus || []),
      ...materials,
    ]
      .map((r) => r.lesson_title)
      .filter(Boolean);
    return ["Бүгд", ...new Set(allTitles)];
  }, [current, materials]);

  const tabCounts = useMemo(() => {
    if (!current) return {};
    return {
      materials: materials.length,
      assignments: (current.assignments || []).length,
      self_study: (current.self_study || []).length,
      midterm: (current.midterm || []).length,
      final: (current.final || []).length,
      attendance: (current.attendance || []).length,
      bonus: (current.bonus || []).length,
    };
  }, [current, materials]);

  return (
    <div className="es-page fade-in">
      <h1 className="es-page-title">Хичээлийн дэлгэрэнгүй</h1>
      <p className="es-page-desc">
        AI-аар үүсгэсэн хичээлийн материал, даалгавар, бие даалт, шалгалт, ирц зэргийг нэг дороос харна.
      </p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "flex-end" }}>
        {user?.role === "parent" && items.length > 0 && (
          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: "0.8rem", color: "var(--es-muted)", marginBottom: 4 }}>Хүүхэд</div>
            <select
              className="es-select"
              value={selectedStudent}
              onChange={(e) => {
                setSelectedStudent(e.target.value);
                setLessonFilter("Бүгд");
              }}
              style={{ width: "100%" }}
            >
              {items.map((x) => (
                <option key={x.student_id} value={x.student_id}>
                  {x.student_name}
                </option>
              ))}
            </select>
          </div>
        )}
        {uniqueLessons.length > 1 && (
          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: "0.8rem", color: "var(--es-muted)", marginBottom: 4 }}>Хичээлээр шүүх</div>
            <select
              className="es-select"
              value={lessonFilter}
              onChange={(e) => setLessonFilter(e.target.value)}
              style={{ width: "100%" }}
            >
              {uniqueLessons.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      {current && (
        <>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 20,
              borderBottom: "2px solid var(--es-border, #eee)",
              paddingBottom: 0,
            }}
          >
            {TABS.map((t) => {
              const isActive = activeTab === t.key;
              const count = tabCounts[t.key] || 0;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    padding: "10px 18px",
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? TAB_COLORS[t.key] : "var(--es-muted)",
                    background: isActive ? `${TAB_COLORS[t.key]}10` : "transparent",
                    border: "none",
                    borderBottom: isActive ? `3px solid ${TAB_COLORS[t.key]}` : "3px solid transparent",
                    cursor: "pointer",
                    borderRadius: "8px 8px 0 0",
                    transition: "all 0.15s",
                    position: "relative",
                  }}
                >
                  {t.label}
                  {count > 0 && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: "0.72rem",
                        background: isActive ? TAB_COLORS[t.key] : "var(--es-border, #ddd)",
                        color: isActive ? "#fff" : "var(--es-muted)",
                        padding: "1px 7px",
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div style={{ minHeight: 200 }}>
            {activeTab === "materials" && (
              <MaterialsSection items={materials} lessonFilter={lessonFilter} />
            )}
            {activeTab === "assignments" && (
              <SectionCards rows={current.assignments || []} lessonFilter={lessonFilter} />
            )}
            {activeTab === "self_study" && (
              <SectionCards rows={current.self_study || []} lessonFilter={lessonFilter} />
            )}
            {activeTab === "midterm" && (
              <SectionCards rows={current.midterm || []} lessonFilter={lessonFilter} />
            )}
            {activeTab === "final" && (
              <SectionCards rows={current.final || []} lessonFilter={lessonFilter} />
            )}
            {activeTab === "attendance" && (
              <SectionCards rows={current.attendance || []} lessonFilter={lessonFilter} />
            )}
            {activeTab === "bonus" && (
              <SectionCards rows={current.bonus || []} lessonFilter={lessonFilter} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
