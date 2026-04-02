import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export default function LessonTermGrades({ classId, token }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const loadData = async () => {
    if (!classId || !token) return;
    setLoading(true);
    setErr("");
    setOk("");
    try {
      const gradesData = await apiFetch(`/grades/class/${classId}/student-details`, { token });
      const mapped = gradesData.map(g => ({
        ...g,
        term: g.term || "2026-Q2",
        homework_avg: g.homework_avg ?? 0,
        quiz_avg: g.quiz_avg ?? 0,
        project_score: g.project_score ?? 0,
        midterm_exam: g.midterm_exam ?? 0,
        final_exam: g.final_exam ?? 0,
        attendance_rate: g.attendance_rate ?? 100,
        behavior_score: g.behavior_score ?? 100,
      }));
      setRows(mapped);
    } catch (e) {
      setErr(e?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, token]);

  const handleChange = (studentId, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.student_id === studentId) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const saveGrades = async () => {
    setErr("");
    setOk("");
    setSaving(true);
    try {
      let count = 0;
      for (const r of rows) {
        await apiFetch(`/grades/predict`, {
          method: "POST",
          token,
          body: {
            student_id: r.student_id,
            class_id: classId,
            term: r.term,
            homework_avg: Number(r.homework_avg || 0),
            quiz_avg: Number(r.quiz_avg || 0),
            project_score: Number(r.project_score || 0),
            attendance_rate: Number(r.attendance_rate || 0),
            midterm_exam: Number(r.midterm_exam || 0),
            final_exam: Number(r.final_exam || 0),
            behavior_score: Number(r.behavior_score || 0),
          },
        });
        count++;
      }
      setOk(`Улирлын дүн хадгаллаа! (${count} сурагч) - Уналын эрсдэл шинэчлэгдлээ`);
    } catch (e) {
      setErr(e?.message || "Дүн хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: "var(--es-muted)", marginTop: 20 }}>Ачаалж байна...</div>;

  return (
    <div style={{ marginTop: 20 }}>
      {err && <p className="es-alert es-alert-danger">{err}</p>}
      {ok && <p className="es-alert es-alert-success">{ok}</p>}

      <div style={{ overflowX: "auto", border: "1px solid var(--es-border)", borderRadius: 8 }}>
        <table className="es-table" style={{ width: "100%", whiteSpace: "nowrap" }}>
          <thead>
            <tr>
              <th>Сурагч</th>
              <th>Шалгалт (Quiz Avg)</th>
              <th>Бие даалт (Project)</th>
              <th>Мидтерм</th>
              <th>Эцсийн шалгалт</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.student_id}>
                <td>{row.student_name}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="es-input"
                    style={{ width: 70, padding: "4px 8px" }}
                    value={row.quiz_avg}
                    onChange={(e) => handleChange(row.student_id, "quiz_avg", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="es-input"
                    style={{ width: 70, padding: "4px 8px" }}
                    value={row.project_score}
                    onChange={(e) => handleChange(row.student_id, "project_score", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="es-input"
                    style={{ width: 70, padding: "4px 8px" }}
                    value={row.midterm_exam}
                    onChange={(e) => handleChange(row.student_id, "midterm_exam", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="es-input"
                    style={{ width: 70, padding: "4px 8px" }}
                    value={row.final_exam}
                    onChange={(e) => handleChange(row.student_id, "final_exam", e.target.value)}
                  />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#666" }}>Одоогоор сурагч бүртгэгдээгүй байна.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          className="es-btn es-btn-primary"
          onClick={saveGrades}
          disabled={saving || rows.length === 0}
        >
          {saving ? "Хадгалж байна..." : "Улирлын дүнг хадгалах"}
        </button>
      </div>
    </div>
  );
}
