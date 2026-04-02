import { useEffect, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

export default function StudentGradePredictionsPage() {
  const token = useAuthStore((s) => s.token);
  const [insights, setInsights] = useState([]);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [out, li] = await Promise.all([
          apiFetch("/grades/me/predictions", { token }),
          apiFetch("/grades/me/lesson-insights", { token }),
        ]);
        setItems(out);
        setInsights(li);
      } catch (e) {
        setErr(e?.message || "Таамаг ачаалж чадсангүй");
      }
    })();
  }, [token]);

  const getFailColor = (failProb) => {
     if (failProb == null) return "transparent";
     if (failProb >= 50) return "rgba(239, 68, 68, 0.15)";
     if (failProb >= 20) return "rgba(245, 158, 11, 0.15)";
     return "rgba(16, 185, 129, 0.1)";
  };

  return (
    <div className="es-page">
      <h1 className="es-page-title">Миний ирээдүйн дүнгийн таамаг</h1>
      <p className="es-page-desc">Хичээл тус бүрийн багш, дүн, анхаарал/ирцийн эрсдэлийг ойлгомжтой харуулна.</p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}
      <div className="es-section">
        <h3 className="es-section-title">Хичээл + багш + эрсдэлийн дэлгэрэнгүй</h3>
        {insights.length === 0 ? (
          <p className="es-empty">Оноо хараахан ороогүй.</p>
        ) : (
          <div className="es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
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
                  <tr key={`${r.student_id}-${r.class_id}-${r.teacher_id}-${idx}`} style={{ backgroundColor: getFailColor(r.fail_probability) }}>
                    <td style={{ fontWeight: "bold" }}>{r.lesson_title}</td>
                    <td>{r.teacher_name}</td>
                    <td>{r.term}</td>
                    <td>{r.final_exam}</td>
                    <td>
                      {r.predicted_grade ? `${r.predicted_grade} (${r.predicted_score}%)` : "-"}
                      {r.fail_probability != null && (
                        <div style={{ fontSize: "0.85rem", color: r.fail_probability >= 50 ? "var(--es-danger)" : "inherit" }}>
                          Эрсдэл: {r.fail_probability}%
                        </div>
                      )}
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
