import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

const STATUSES = ["present", "absent", "late", "excused"];

export default function AttendancePage() {
  const [search] = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState("");
  const [records, setRecords] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ls = await apiFetch("/teacher/lessons", { token });
        setLessons(ls);
        const qLesson = search.get("lesson_id");
        if (qLesson && ls.some((x) => String(x.id) === String(qLesson))) {
          setLessonId(String(qLesson));
        } else if (ls[0]) {
          setLessonId(String(ls[0].id));
        }
      } catch (e) {
        setErr(e?.message || "Хичээл ачаалж чадсангүй");
      }
    })();
  }, [token, search]);

  useEffect(() => {
    if (!lessonId) return;
    (async () => {
      try {
        setErr("");
        const out = await apiFetch(`/teacher/lessons/${lessonId}/attendance`, { token });
        setRecords(out);
      } catch (e) {
        setErr(e?.message || "Ирц ачаалж чадсангүй");
      }
    })();
  }, [lessonId, token]);

  const hasRows = useMemo(() => records.length > 0, [records]);

  function updateRow(idx, patch) {
    setRecords((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  async function saveAll() {
    if (!lessonId || !hasRows) return;
    setSaving(true);
    setErr("");
    setOk("");
    try {
      const payload = {
        records: records.map((r) => ({ student_id: r.student_id, status: r.status, note: r.note || null })),
      };
      const res = await apiFetch(`/teacher/lessons/${lessonId}/attendance`, {
        method: "POST",
        token,
        body: payload,
      });
      setOk(`Ирц хадгаллаа. Parent мэдэгдэл: ${res.parent_notified_count}`);
    } catch (e) {
      setErr(e?.message || "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Ирцийн самбар (анги, хичээлээр)</h1>
      <p className="es-page-desc">Багш хичээл тус бүрийн сурагчдын ирцийг бөглөнө. Хадгалахад тухайн сурагчийн эцэг эхэд мэдэгдэл очно.</p>

      <div className="es-section">
        <label className="es-label">Хичээл сонгох</label>
        <select className="es-select" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
          {!lessons.length && <option value="">— Хичээл алга —</option>}
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title || `Хичээл #${l.id}`} — {l.class_name}
            </option>
          ))}
        </select>
      </div>

      <div className="es-section">
        {!hasRows ? (
          <p className="es-empty">Энэ хичээл дээр ирц бүртгэл хараахан алга. (backend дээр сурагчийн жагсаалтаар эхний бүртгэл үүсгэнэ)</p>
        ) : (
          <div className="es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
                  <th>Сурагч</th>
                  <th>Төлөв</th>
                  <th>Тайлбар</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={r.student_id}>
                    <td>{r.student_name}</td>
                    <td>
                      <select className="es-select" value={r.status} onChange={(e) => updateRow(idx, { status: e.target.value })}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="es-input"
                        value={r.note || ""}
                        onChange={(e) => updateRow(idx, { note: e.target.value })}
                        placeholder="Тайлбар (сонголттой)"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button type="button" className="es-btn es-btn-primary" style={{ marginTop: 12 }} onClick={saveAll} disabled={!hasRows || saving}>
          {saving ? "Хадгалж байна..." : "Ирц хадгалах"}
        </button>
        {ok && <p className="es-alert es-alert-success" style={{ marginTop: 10 }}>{ok}</p>}
        {err && <p className="es-alert es-alert-danger" style={{ marginTop: 10 }}>{err}</p>}
      </div>
    </div>
  );
}
