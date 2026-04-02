import { useEffect, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

export default function ParentAcademicPage() {
  const token = useAuthStore((s) => s.token);
  const [insights, setInsights] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const out = await apiFetch("/grades/parent/children/lesson-insights", { token });
        setInsights(out);
      } catch (e) {
        setErr(e?.message || "Мэдээлэл ачаалж чадсангүй");
      }
    })();
  }, [token]);

  return (
    <div className="es-page">
      <h1 className="es-page-title">Эцэг эхийн дүнгийн хяналт</h1>
      <p className="es-page-desc">Хүүхдийн хичээл тус бүрийн багш, дүн, анхаарал сул/тасалсан өдрүүдийг нэг дор харна.</p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <div className="es-section">
        <h3 className="es-section-title">Хүүхдийн хичээлийн дэлгэрэнгүй</h3>
        {insights.length === 0 ? (
          <p className="es-empty">Одоогоор мэдээлэл алга.</p>
        ) : (
          <div className="es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
                  <th>Хүүхэд</th>
                  <th>Хичээл</th>
                  <th>Багш</th>
                  <th>Улирал</th>
                  <th>Final</th>
                  <th>Таамаг</th>
                  <th>Анхаарал сул өдөр</th>
                  <th>Тасалсан/Хоцорсон өдөр</th>
                </tr>
              </thead>
              <tbody>
                {insights.map((r, idx) => (
                  <tr key={`${r.student_id}-${r.class_id}-${r.teacher_id}-${idx}`}>
                    <td>{r.student_name}</td>
                    <td>{r.lesson_title}</td>
                    <td>{r.teacher_name}</td>
                    <td>{r.term}</td>
                    <td>{r.final_exam}</td>
                    <td>
                      {r.predicted_grade ? `${r.predicted_grade} (${r.predicted_score}%)` : "-"} {r.fail_probability != null ? `• fail ${r.fail_probability}%` : ""}
                    </td>
                    <td>{r.low_attention_dates.length ? r.low_attention_dates.join(", ") : "-"}</td>
                    <td>
                      {r.absent_dates.length ? `Тасалсан: ${r.absent_dates.join(", ")}` : ""}
                      {r.absent_dates.length && r.late_dates.length ? " | " : ""}
                      {r.late_dates.length ? `Хоцорсон: ${r.late_dates.join(", ")}` : ""}
                      {!r.absent_dates.length && !r.late_dates.length ? "-" : ""}
                    </td>
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
