import { useEffect, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const STATUSES = ["open", "investigating", "resolved"];

export default function SchoolEventReportsPage() {
  const token = useAuthStore((s) => s.token);
  const [items, setItems] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [err, setErr] = useState("");

  async function loadData() {
    setErr("");
    try {
      const out = await apiFetch("/student/event-reports", { token });
      setItems(out);
    } catch (e) {
      setErr(e?.message || "Мэдээлэл ачаалж чадсангүй");
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id, status) {
    setLoadingId(id);
    setErr("");
    try {
      const patched = await apiFetch(`/student/event-reports/${id}`, {
        method: "PATCH",
        token,
        body: { status },
      });
      setItems((prev) => prev.map((x) => (x.id === id ? patched : x)));
    } catch (e) {
      setErr(e?.message || "Төлөв шинэчилж чадсангүй");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Сурагчийн үйл явдлын мэдэгдлүүд</h1>
      <p className="es-page-desc">Админ/захирал бүх илгээлтийг хянаж, төлөв шинэчилнэ.</p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <div className="es-section">
        {items.length === 0 ? (
          <p className="es-empty">Одоогоор мэдэгдэл алга.</p>
        ) : (
          <div className="es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Reporter</th>
                  <th>Class/Lesson</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td><span className="es-pill">{r.category}</span></td>
                    <td>#{r.reporter_student_id}</td>
                    <td>
                      class={r.class_id} {r.lesson_id ? `, lesson=${r.lesson_id}` : ""}
                    </td>
                    <td style={{ maxWidth: 420 }}>{r.description}</td>
                    <td>
                  <select
                    className="es-select"
                    value={r.status}
                    disabled={loadingId === r.id}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    style={{ minWidth: 160 }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
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
