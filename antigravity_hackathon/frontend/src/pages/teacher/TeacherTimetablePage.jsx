import { Fragment, useEffect, useMemo, useState } from "react";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

const WDAY = { 1: "Даваа", 2: "Мягмар", 3: "Лхагва", 4: "Пүрэв", 5: "Баасан" };

export default function TeacherTimetablePage() {
  const token = useAuthStore((s) => s.token);
  const [rows, setRows] = useState([]);
  const [classId, setClassId] = useState("");
  const [selected, setSelected] = useState(null);
  const [material, setMaterial] = useState(null);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const out = await apiFetch("/teacher/timetable", { token });
        setRows(out);
      } catch (e) {
        setErr(e?.message || "Хуваарь ачаалж чадсангүй");
      }
    })();
  }, [token]);

  const grouped = useMemo(() => {
    const g = {};
    for (const r of rows) {
      const key = `${r.class_id}-${r.class_name}`;
      if (!g[key]) g[key] = [];
      g[key].push(r);
    }
    return g;
  }, [rows]);

  const classes = useMemo(
    () =>
      Object.entries(grouped).map(([k]) => {
        const idx = k.indexOf("-");
        return { id: k.slice(0, idx), name: k.slice(idx + 1) };
      }),
    [grouped],
  );

  useEffect(() => {
    if (!classId && classes.length) setClassId(classes[0].id);
  }, [classId, classes]);

  const classRows = useMemo(() => rows.filter((r) => String(r.class_id) === String(classId)), [rows, classId]);
  const periods = useMemo(
    () => [...new Set(classRows.map((r) => r.period_index))].sort((a, b) => a - b),
    [classRows],
  );
  const byDayPeriod = useMemo(() => {
    const m = {};
    for (const r of classRows) m[`${r.weekday}-${r.period_index}`] = r;
    return m;
  }, [classRows]);

  async function openLesson(item) {
    setSelected(item);
    setMaterial(null);
    if (!item?.lesson_id) return;
    setMaterialLoading(true);
    try {
      const out = await apiFetch(`/teacher/lessons/${item.lesson_id}/latest-material`, { token });
      setMaterial(out);
    } catch (e) {
      setErr(e?.message || "Материал ачаалж чадсангүй");
    } finally {
      setMaterialLoading(false);
    }
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Багшийн хичээлийн хуваарь</h1>
      <p className="es-page-desc">Хуваарийг долоо хоногоор харж, хичээл дээр дарж дэлгэрэнгүй мэдээлэл авна.</p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <div className="es-section">
        <label className="es-label">Анги сонгох</label>
        <select className="es-select" value={classId} onChange={(e) => setClassId(e.target.value)} style={{ maxWidth: 320 }}>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="es-section">
        <div className="es-tt-grid es-tt-grid-teacher">
          <div className="es-tt-head">Цаг</div>
          {[1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="es-tt-head">
              {WDAY[d]}
            </div>
          ))}
          {periods.map((p) => (
            <Fragment key={`row-${p}`}>
              <div key={`period-${p}`} className="es-tt-period">
                P{p}
              </div>
              {[1, 2, 3, 4, 5].map((d) => {
                const item = byDayPeriod[`${d}-${p}`];
                if (!item) return <div key={`${d}-${p}`} className="es-tt-cell" />;
                if (item.is_lunch) return <div key={`${d}-${p}`} className="es-tt-cell es-tt-lunch">Цайны цаг</div>;
                return (
                  <button key={`${d}-${p}`} type="button" className="es-tt-lesson" onClick={() => openLesson(item)}>
                    <strong>{item.subject_name || "Хичээл"}</strong>
                    <span>
                      {item.start_time}-{item.end_time}
                    </span>
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {selected && (
        <div className="es-section">
          <h3 className="es-section-title">Хичээлийн мэдээлэл</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
            <div><strong>Хичээл:</strong> {selected.subject_name || selected.lesson_title || "-"}</div>
            <div><strong>Багш:</strong> {selected.teacher_name || "-"}</div>
            <div><strong>Анги:</strong> {selected.class_name}</div>
            <div><strong>Өдөр:</strong> {WDAY[selected.weekday]}</div>
            <div><strong>Цаг:</strong> {selected.start_time}-{selected.end_time}</div>
            <div><strong>Period:</strong> P{selected.period_index}</div>
            <div><strong>Lesson ID:</strong> {selected.lesson_id ?? "-"}</div>
          </div>
          <hr style={{ border: 0, borderTop: "1px solid var(--es-border)", margin: "12px 0" }} />
          <h4 style={{ margin: "0 0 8px" }}>Энэ хичээл дээрх материал/даалгавар</h4>
          {materialLoading && <p className="es-empty">Ачаалж байна...</p>}
          {!materialLoading && !material && <p className="es-empty">Материал үүсээгүй байна.</p>}
          {!materialLoading && material && (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ color: "var(--es-muted)", fontSize: "0.85rem" }}>
                Баталсан: {material.teacher_approved ? "Тийм" : "Үгүй"} • Сурагчид руу илгээсэн: {material.sent_to_students ? "Тийм" : "Үгүй"}
              </div>
              {material.summary && <div><strong>Товч:</strong> {material.summary}</div>}
              {Array.isArray(material.key_points) && material.key_points.length > 0 && (
                <div>
                  <strong>Гол санаа:</strong>
                  <ul style={{ margin: "6px 0 0 18px" }}>
                    {material.key_points.map((k, i) => (
                      <li key={i}>{typeof k === "string" ? k : JSON.stringify(k)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {material.homework && (
                <div>
                  <strong>Даалгавар:</strong> <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(material.homework, null, 2)}</pre>
                </div>
              )}
              {Array.isArray(material.exercises) && material.exercises.length > 0 && (
                <div>
                  <strong>Бие даалт/дасгал:</strong>
                  <ul style={{ margin: "6px 0 0 18px" }}>
                    {material.exercises.map((ex, i) => (
                      <li key={i}>{typeof ex === "string" ? ex : JSON.stringify(ex)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
