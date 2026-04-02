import { useEffect, useState } from "react";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

const ROLES = [
  { v: "teacher", l: "Багш" },
  { v: "student", l: "Сурагч" },
  { v: "parent", l: "Эцэг эх" },
  { v: "admin", l: "Админ" },
];

export default function UsersManagePage() {
  const token = useAuthStore((s) => s.token);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "teacher",
  });

  const load = async () => {
    setErr("");
    try {
      const list = await apiFetch("/admin/users", { token });
      setUsers(list);
    } catch (e) {
      setErr(e?.message || "Ачаалахад алдаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const createUser = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await apiFetch("/admin/users", {
        method: "POST",
        token,
        body: {
          email: form.email.trim(),
          password: form.password,
          full_name: form.full_name.trim() || null,
          role: form.role,
        },
      });
      setForm({ email: "", password: "", full_name: "", role: "teacher" });
      await load();
    } catch (e) {
      setErr(e?.message || "Хадгалахад алдаа");
    }
  };

  const toggleActive = async (u) => {
    try {
      await apiFetch(`/admin/users/${u.id}`, {
        method: "PATCH",
        token,
        body: { is_active: !u.is_active },
      });
      await load();
    } catch (e) {
      setErr(e?.message || "Алдаа");
    }
  };

  return (
    <div className="es-page">
      <h1 className="es-page-title">Хэрэглэгчид</h1>
      <p className="es-page-desc">Шинэ хэрэглэгч зөвхөн эндээс нэмэгдэнэ. Бүртгэлийн хуудас оюутнуудад нээгддэггүй.</p>

      <div className="es-section">
        <h2 className="es-section-title">Шинэ хэрэглэгч нэмэх</h2>
        <form onSubmit={createUser} className="es-form-grid" style={{ maxWidth: 520 }}>
          <div>
            <label className="es-label">Бүтэн нэр</label>
            <input className="es-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label className="es-label">И-мэйл (нэвтрэх нэр)</label>
            <input
              className="es-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="es-label">Эхний нууц үг (хамгийн багадаа 6 тэмдэгт)</label>
            <input
              className="es-input"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="es-label">Эрх</label>
            <select className="es-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => (
                <option key={r.v} value={r.v}>
                  {r.l}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="es-btn es-btn-primary">
            Хэрэглэгч үүсгэх
          </button>
        </form>
      </div>

      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <div className="es-section">
        <h2 className="es-section-title">Бүх хэрэглэгч</h2>
        {loading ? (
          <div style={{ display: "grid", gap: 8 }}>
            <div className="es-skeleton" style={{ height: 14, width: "34%" }} />
            <div className="es-skeleton" style={{ height: 14, width: "76%" }} />
            <div className="es-skeleton" style={{ height: 14, width: "61%" }} />
          </div>
        ) : (
          <div className="es-table-wrap">
            <table className="es-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Нэр</th>
                <th>И-мэйл</th>
                <th>Эрх</th>
                <th>Төлөв</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.full_name || "—"}</td>
                  <td>{u.email}</td>
                  <td><span className="es-pill">{u.role}</span></td>
                  <td>{u.is_active ? "Идэвхтэй" : "Идэвхгүй"}</td>
                  <td>
                    <button type="button" className="es-btn es-btn-secondary" style={{ padding: "6px 10px", fontSize: "0.82rem" }} onClick={() => toggleActive(u)}>
                      {u.is_active ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                    </button>
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
