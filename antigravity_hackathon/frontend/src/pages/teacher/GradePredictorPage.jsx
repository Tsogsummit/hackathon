import { useEffect, useState } from "react";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

export default function GradePredictorPage() {
  const token = useAuthStore((s) => s.token);
  const [lessons, setLessons] = useState([]);
  const [classIdView, setClassIdView] = useState("");
  const [records, setRecords] = useState([]);
  const [preds, setPreds] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const studentNameById = Object.fromEntries(studentDetails.map((x) => [x.student_id, x.student_name]));

  useEffect(() => {
    (async () => {
      try {
        const ls = await apiFetch("/teacher/lessons", { token });
        setLessons(ls);
        if (ls.length) {
          const cid = String(ls[0].class_id);
          setClassIdView(cid);
          await loadClassRecords(cid);
          await loadClassPredictionsByClass(cid);
          await loadClassStudentDetails(cid);
        }
      } catch (e) {
        setErr(e?.message || "Эхний мэдээлэл ачаалж чадсангүй");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadClassRecords(classId = classIdView) {
    if (!classId) return;
    const out = await apiFetch(`/grades/class/${Number(classId)}/records`, { token });
    setRecords(out);
  }

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
      await loadClassRecords(classIdView);
      await loadClassPredictionsByClass(classIdView);
      await loadClassStudentDetails(classIdView);
    } catch (e) {
      setErr(e?.message || "Жагсаалт ачаалж чадсангүй");
    }
  }

  async function patchRecord(r, key, value) {
    try {
      setErr("");
      await apiFetch(`/grades/records/${r.id}`, {
        method: "PATCH",
        token,
        body: { [key]: Number(value) },
      });
      await loadClassRecords(r.class_id);
      setOk(`Record #${r.id} шинэчлэгдлээ`);
    } catch (e) {
      setErr(e?.message || "Record шинэчилж чадсангүй");
    }
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Сурагчийн дүнгийн таамаг (AI)</h1>
      <p className="es-page-desc">Доорх хүснэгтээс record засахад таамаг автоматаар шинэчлэгдэнэ.</p>

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
        {ok && <p className="es-alert es-alert-success" style={{ marginBottom: 10 }}>{ok}</p>}
        {err && <p className="es-alert es-alert-danger" style={{ marginBottom: 10 }}>{err}</p>}
        {preds.length === 0 ? (
          <p className="es-empty">Одоогоор таамаг алга.</p>
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
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {preds.map((p) => (
                  <tr key={p.id}>
                    <td>{p.student_name || studentNameById[p.student_id] || `#${p.student_id}`}</td>
                    <td>{p.term}</td>
                    <td>{p.predicted_grade}</td>
                    <td>{p.predicted_score}%</td>
                    <td>{p.fail_probability}%</td>
                    <td><span className="es-pill">{p.risk_level}</span></td>
                    <td>{p.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="es-section">
        <h3 className="es-section-title">Ангийн сурагчдын дэлгэрэнгүй (хүснэгт)</h3>
        {studentDetails.length === 0 ? (
          <p className="es-empty">Одоогоор дэлгэрэнгүй мэдээлэл алга.</p>
        ) : (
          <div className="es-table-wrap" style={{ marginBottom: 14 }}>
            <table className="es-table">
              <thead>
                <tr>
                  <th>Сурагч</th>
                  <th>Улирал</th>
                  <th>Final</th>
                  <th>Таамаг</th>
                  <th>Fail%</th>
                  <th>Анхаарал&lt;60</th>
                  <th>Тасалсан</th>
                  <th>Хоцорсон</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.map((d) => (
                  <tr key={d.student_id}>
                    <td>{d.student_name}</td>
                    <td>{d.term || "-"}</td>
                    <td>{d.final_exam ?? "-"}</td>
                    <td>{d.predicted_grade ? `${d.predicted_grade} (${d.predicted_score}%)` : "-"}</td>
                    <td>{d.fail_probability ?? "-"}</td>
                    <td title={d.low_attention_dates?.join(", ") || ""}>{d.low_attention_count}</td>
                    <td>{d.absent_count}</td>
                    <td>{d.late_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h3 className="es-section-title">Оруулсан үнэлгээ (засварлах боломжтой)</h3>
        {records.length === 0 ? (
          <p className="es-empty">Одоогоор record алга.</p>
        ) : (
          <div className="es-form-grid">
            {records.map((r) => (
              <div key={r.id} className="es-section" style={{ padding: 10 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Record #{r.id}</strong> — {studentNameById[r.student_id] || `#${r.student_id}`} — {r.term}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(120px,1fr))", gap: 8 }}>
                  {[
                    "homework_avg",
                    "quiz_avg",
                    "project_score",
                    "attendance_rate",
                    "midterm_exam",
                    "final_exam",
                    "behavior_score",
                  ].map((k) => (
                    <label key={k} style={{ fontSize: "0.85rem" }}>
                      {k}
                      <input
                        className="es-input"
                        defaultValue={r[k]}
                        onBlur={(e) => patchRecord(r, k, e.target.value)}
                        style={{ marginTop: 4 }}
                      />
                    </label>
                  ))}
                </div>
                <p className="es-empty" style={{ marginTop: 10 }}>
                  Record засварлах үед таамаг автоматаар шинэчлэгдэнэ.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
