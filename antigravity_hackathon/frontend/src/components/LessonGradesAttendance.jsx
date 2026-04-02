import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export default function LessonGradesAttendance({ lessonId, classId, token }) {
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [savingGrades, setSavingGrades] = useState(false);
  const [rows, setRows] = useState([]);
  const [aiMaterials, setAiMaterials] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split("T")[0]);

  const loadData = async () => {
    if (!lessonId || !classId || !token) return;
    setLoading(true);
    setErr("");
    setOk("");
    try {
      // 1. Fetch attendance for date
      const attData = await apiFetch(`/teacher/lessons/${lessonId}/attendance?date_filter=${targetDate}`, { token });
      const attMap = {};
      attData.forEach((a) => {
        attMap[a.student_id] = { status: a.status, note: a.note || "" };
      });

      // 2. Fetch daily grades for date
      const gradesData = await apiFetch(`/teacher/lessons/${lessonId}/daily-grades?date_filter=${targetDate}`, { token });
      
      const merged = gradesData.map((g) => ({
        ...g,
        status: attMap[g.student_id]?.status || "present",
        note: attMap[g.student_id]?.note || "",
        homework_score: g.homework_score ?? "",
      }));
      setRows(merged);

      // 3. Fetch materials
      const allMaterials = await apiFetch(`/lessons/${lessonId}/materials`, { token }).catch(() => []);
      const todaysMaterials = allMaterials.filter(m => (m.created_at || "").startsWith(targetDate));
      setAiMaterials(todaysMaterials);
    } catch (e) {
      setErr(e?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, classId, token, targetDate]);

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

  const saveAttendance = async () => {
    setErr("");
    setOk("");
    setSavingAttendance(true);
    try {
      const records = rows.map((r) => ({
        student_id: r.student_id,
        status: r.status,
        note: r.note,
      }));
      const res = await apiFetch(`/teacher/lessons/${lessonId}/attendance`, {
        method: "POST",
        token,
        body: { records, date_filter: targetDate },
      });
      setOk(`Өдөр тутмын бүртгэлийг хадгаллаа! (${res.saved_count} сурагч)`);
    } catch (e) {
      setErr(e?.message || "Хадгалахад алдаа гарлаа");
    } finally {
      setSavingAttendance(false);
    }
  };

  const saveGrades = async () => {
    setErr("");
    setOk("");
    setSavingGrades(true);
    try {
      const records = rows.map((r) => ({
        student_id: r.student_id,
        homework_score: r.homework_score === "" ? null : Number(r.homework_score),
      }));

      await apiFetch(`/teacher/lessons/${lessonId}/daily-grades`, {
        method: "POST",
        token,
        body: {
          date_filter: targetDate,
          records
        },
      });
      // Хоёр хадгалалт нэгэн зэрэг явагдаж магадгүй тул Attendance-ийг цуг дуудаж болно
      await saveAttendance(); // Хамтад нь хадгалчихна
    } catch (e) {
      setErr(e?.message || "Дүн хадгалахад алдаа гарлаа");
    } finally {
      setSavingGrades(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <strong>Бүртгэх өдөр:</strong>
        <input 
          type="date" 
          className="es-input" 
          value={targetDate} 
          onChange={(e) => setTargetDate(e.target.value)}
        />
        {loading && <span style={{ color: "var(--es-muted)" }}>Ачаалж байна...</span>}
      </div>

      {err && <p className="es-alert es-alert-danger">{err}</p>}
      {ok && <p className="es-alert es-alert-success">{ok}</p>}

      {!loading && (
        <>
          {aiMaterials.length > 0 && (
            <div className="es-ai-material-wrap" style={{ marginBottom: 20, padding: 16, border: "1px solid var(--es-border)", borderRadius: 8 }}>
              <h4 style={{ margin: "0 0 12px 0" }}>🤖 AI туслахын бэлтгэсэн материалууд</h4>
              {aiMaterials.map((m, idx) => (
                <div key={m.id || idx} style={{ marginBottom: 16 }}>
                  {m.homework && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Гэрийн даалгавар:</strong>
                      <div style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem", color: "var(--es-muted)" }}>
                        {typeof m.homework === "string" ? m.homework : JSON.stringify(m.homework, null, 2)}
                      </div>
                    </div>
                  )}
                  {m.summary && (
                    <div>
                      <strong>Хичээлийн хураангуй:</strong>
                      <div style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem", color: "var(--es-muted)" }}>
                        {m.summary}
                      </div>
                    </div>
                  )}
                  {(!m.homework && !m.summary) && <div style={{ fontSize: "0.85rem", color: "var(--es-muted)" }}>Илүү дэлгэрэнгүй материал байхгүй байна.</div>}
                </div>
              ))}
            </div>
          )}

          <div style={{ overflowX: "auto", border: "1px solid var(--es-border)", borderRadius: 8 }}>
            <table className="es-table" style={{ width: "100%", whiteSpace: "nowrap" }}>
              <thead>
                <tr>
                  <th>Сурагч</th>
                  <th>Ирц</th>
                  <th>Гэрийн даалгавар (0-100)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.student_id}>
                    <td>{row.student_name}</td>
                    <td>
                      <select
                        className="es-select"
                        style={{ padding: "4px 8px" }}
                        value={row.status}
                        onChange={(e) => handleChange(row.student_id, "status", e.target.value)}
                      >
                        <option value="present">Ирсэн (P)</option>
                        <option value="absent">Тасалсан (A)</option>
                        <option value="late">Хоцорсон (L)</option>
                        <option value="excused">Чөлөөтэй (E)</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="es-input"
                        placeholder="-"
                        style={{ width: 100, padding: "4px 8px" }}
                        value={row.homework_score}
                        onChange={(e) => handleChange(row.student_id, "homework_score", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "var(--es-muted)" }}>Одоогоор сурагч бүртгэгдээгүй байна.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              className="es-btn es-btn-primary"
              onClick={saveGrades}
              disabled={savingGrades || savingAttendance || rows.length === 0}
            >
              {savingGrades || savingAttendance ? "Хадгалж байна..." : "Өдрийн бүртгэлийг хадгалах"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
