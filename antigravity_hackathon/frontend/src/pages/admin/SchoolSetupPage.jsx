import { useEffect, useState } from "react";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

export default function SchoolSetupPage() {
  const token = useAuthStore((s) => s.token);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [className, setClassName] = useState("");
  const [lessonClassId, setLessonClassId] = useState("");
  const [lessonTeacherId, setLessonTeacherId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");

  const load = async () => {
    setErr("");
    try {
      const [cl, us] = await Promise.all([apiFetch("/admin/classes", { token }), apiFetch("/admin/users", { token })]);
      setClasses(cl);
      setUsers(us);
    } catch (e) {
      setErr(e?.message || "Алдаа");
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const addClass = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/classes", { method: "POST", token, body: { name: className.trim() } });
      setClassName("");
      await load();
    } catch (e) {
      setErr(e?.message || "Алдаа");
    }
  };

  const addLesson = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/lessons", {
        method: "POST",
        token,
        body: {
          class_id: Number(lessonClassId),
          teacher_id: Number(lessonTeacherId),
          title: lessonTitle.trim() || null,
        },
      });
      setLessonTitle("");
      await load();
    } catch (e) {
      setErr(e?.message || "Алдаа");
    }
  };

  const teachers = users.filter((u) => u.role === "teacher" && u.is_active);

  return (
    <div className="es-page">
      <h1 className="es-page-title">Анги &amp; хичээл</h1>
      <p className="es-page-desc">Эхлээд анги үүсгээд, дараа нь багшид хичээл холбоно. Багш &quot;AI туслах&quot;-д зөвхөн өөрт хуваарилсан хичээл сонгоно.</p>

      {err && (
        <p className="es-alert es-alert-danger">
          {err}
        </p>
      )}

      <div className="es-grid-2">
        <div className="es-section">
          <h2 className="es-section-title">Шинэ анги</h2>
          <form onSubmit={addClass}>
            <label className="es-label">Ангийн нэр</label>
            <input
              className="es-input"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Жишээ: 8А"
            />
            <button type="submit" className="es-btn es-btn-primary" style={{ marginTop: 10 }}>
              Анги нэмэх
            </button>
          </form>
          <p className="es-empty" style={{ marginTop: 12 }}>
            Одоогийн ангиуд: {classes.map((c) => c.name).join(", ") || "—"}
          </p>
        </div>

        <div className="es-section">
          <h2 className="es-section-title">Багшид хичээл холбох</h2>
          <form onSubmit={addLesson} className="es-form-grid">
            <label className="es-label">Анги</label>
            <select
              className="es-select"
              required
              value={lessonClassId}
              onChange={(e) => setLessonClassId(e.target.value)}
            >
              <option value="">— Сонгоно уу —</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (id {c.id})
                </option>
              ))}
            </select>
            <label className="es-label">Багш</label>
            <select
              className="es-select"
              required
              value={lessonTeacherId}
              onChange={(e) => setLessonTeacherId(e.target.value)}
            >
              <option value="">— Сонгоно уу —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name || t.email} (id {t.id})
                </option>
              ))}
            </select>
            <label className="es-label">Хичээлийн нэр (сонголттой)</label>
            <input className="es-input" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
            <button type="submit" className="es-btn es-btn-primary">
              Хичээл үүсгэх
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
