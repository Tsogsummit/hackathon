import { useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

export default function SchoolAcademicRiskPage() {
  const token = useAuthStore((s) => s.token);
  const [classId, setClassId] = useState("");
  const [records, setRecords] = useState([]);
  const [preds, setPreds] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    if (!classId) return;
    setErr("");
    try {
      const [r, p] = await Promise.all([
        apiFetch(`/grades/class/${Number(classId)}/records`, { token }),
        apiFetch(`/grades/class/${Number(classId)}/predictions`, { token }),
      ]);
      setRecords(r);
      setPreds(p);
    } catch (e) {
      setErr(e?.message || "Ачаалж чадсангүй");
    }
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Сургуулийн дүнгийн эрсдэлийн самбар</h1>
      <p className="es-page-desc">Ангиар нь сурагчдын улирлын оноо болон унах магадлалыг хянадаг.</p>
      <div className="es-section">
        <label className="es-label">Анги ID</label>
        <div className="es-toolbar">
          <input className="es-input" value={classId} onChange={(e) => setClassId(e.target.value)} placeholder="Жишээ: 1" />
          <button className="es-btn es-btn-primary" onClick={load}>
            Харах
          </button>
        </div>
        {err && <p className="es-alert es-alert-danger" style={{ marginTop: 10 }}>{err}</p>}
      </div>
      <div className="es-section">
        <h3 className="es-section-title">Оруулсан улирлын үнэлгээ</h3>
        {records.length === 0 ? (
          <p className="es-empty">Мэдээлэл алга.</p>
        ) : (
          <div className="es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Term</th>
                  <th>HW</th>
                  <th>Quiz</th>
                  <th>Project</th>
                  <th>Attendance</th>
                  <th>Midterm</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.student_name || `#${r.student_id}`}</td>
                    <td>{r.term}</td>
                    <td>{r.homework_avg}</td>
                    <td>{r.quiz_avg}</td>
                    <td>{r.project_score}</td>
                    <td>{r.attendance_rate}</td>
                    <td>{r.midterm_exam}</td>
                    <td>{r.final_exam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="es-section">
        <h3 className="es-section-title">Унах магадлалын таамаг</h3>
        {preds.length === 0 ? (
          <p className="es-empty">Мэдээлэл алга.</p>
        ) : (
          <div className="es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Term</th>
                  <th>Grade</th>
                  <th>Score</th>
                  <th>Fail %</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {preds.map((p) => (
                  <tr key={p.id}>
                    <td>{p.student_name || `#${p.student_id}`}</td>
                    <td>{p.term}</td>
                    <td>{p.predicted_grade}</td>
                    <td>{p.predicted_score}%</td>
                    <td>{p.fail_probability}%</td>
                    <td><span className="es-pill">{p.risk_level}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
