import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="es-section" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--es-primary-dark)" }}>EduSmart MN</div>
          <p className="es-empty" style={{ marginTop: 8 }}>
            Smart School Management Platform
          </p>
        </div>

        <form onSubmit={onSubmit} className="es-form-grid">
          <label className="es-label">И-мэйл</label>
          <input
            className="es-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@school.mn"
          />

          <label className="es-label">Нууц үг</label>
          <input
            className="es-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {err && <p className="es-alert es-alert-danger">{err}</p>}

          <button type="submit" className="es-btn es-btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled={loading}>
            {loading ? "Нэвтэрч байна…" : "Нэвтрэх"}
          </button>
        </form>

        <div style={{ marginTop: "30px", borderTop: "1px solid var(--es-border)", paddingTop: "20px" }}>
          <p style={{ textAlign: "center", marginBottom: "15px", color: "var(--es-muted)", fontSize: "0.9rem" }}>Туршилтын хэрэглэгчээр хурдан нэвтрэх (Демо):</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button type="button" className="es-btn es-btn-secondary" onClick={() => { setEmail("student1@test.mn"); setPassword("123456"); }}>👦 Сурагч</button>
            <button type="button" className="es-btn es-btn-secondary" onClick={() => { setEmail("teacher1@test.mn"); setPassword("123456"); }}>👨‍🏫 Багш</button>
            <button type="button" className="es-btn es-btn-secondary" onClick={() => { setEmail("parent1@test.mn"); setPassword("123456"); }}>👨‍👩‍👧 Эцэг эх</button>
            <button type="button" className="es-btn es-btn-secondary" onClick={() => { setEmail("admin@test.mn"); setPassword("123456"); }}>👑 Админ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
