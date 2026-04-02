import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore.js";

const navItem = ({ isActive }) => ({
  display: "block",
  padding: "10px 14px",
  borderRadius: 8,
  textDecoration: "none",
  color: "var(--es-sidebar-text)",
  fontWeight: isActive ? 700 : 500,
  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
  marginBottom: 4,
});

const PATH_LABELS = {
  "/": "Үндсэн самбар",
  "/attention": "Анхааралын камер",
  "/admin/users": "Хэрэглэгчид",
  "/admin/school": "Анги ба хичээл",
  "/teacher/lesson-ai": "Хичээлийн AI туслах",
  "/teacher/timetable": "Хичээлийн хуваарь",
  "/teacher/grade-predictor": "Дүнгийн таамаг",
  "/student": "Сурагчийн хэсэг",
  "/student/event-report": "Үйл явдал мэдэгдэх",
  "/student/grade-predictions": "Миний дүнгийн таамаг",
  "/student/timetable": "Хичээлийн хуваарь",
  "/parent": "Эцэг эхийн хяналт",
  "/school/event-reports": "Сурагчийн мэдэгдлүүд",
  "/school/academic-risk": "Эрсдэлийн самбар",
};

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("es-theme") || "light");
  const [toast, setToast] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const role = user?.role;
  const currentLabel = useMemo(() => PATH_LABELS[location.pathname] || "Хуудас", [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("es-theme", theme);
  }, [theme]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className={`es-shell ${sidebarOpen ? "es-shell-sidebar-open" : ""}`}>
      <aside className="es-sidebar">
        <div style={{ marginBottom: "2rem", padding: "0 8px" }}>
          <div className="es-sidebar-title">EduSmart MN</div>
          <div className="es-sidebar-subtitle">Next-gen EdTech Platform</div>
        </div>

        <nav style={{ flex: 1 }}>
          <NavLink to="/" end style={navItem}>
            🏠 Үндсэн самбар
          </NavLink>
          <NavLink to="/notifications" style={navItem}>
            🔔 Мэдэгдэл
          </NavLink>
          {(role === "student" || role === "parent") && (
            <NavLink to="/academic-breakdown" style={navItem}>
              🧾 Хичээлийн дэлгэрэнгүй
            </NavLink>
          )}
          <NavLink to="/attention" style={navItem}>
            📷 Анхааралын камер (тест)
          </NavLink>

          {role === "admin" && (
            <>
              <div style={{ fontSize: "0.7rem", opacity: 0.6, margin: "16px 8px 8px", textTransform: "uppercase" }}>
                Админ
              </div>
              <NavLink to="/admin/users" style={navItem}>
                👥 Хэрэглэгчид (нэмэх / засах)
              </NavLink>
              <NavLink to="/admin/school" style={navItem}>
                🏫 Анги &amp; хичээл тохируулах
              </NavLink>
              <NavLink to="/admin/unknown-faces" style={navItem}>
                🕵️ Unknown нүүрний лог
              </NavLink>
              <NavLink to="/school/unknown-faces" style={navItem}>
                🎯 Танигдаагүй нүүр
              </NavLink>
              <NavLink to="/school/academic-risk" style={navItem}>
                📉 Дүнгийн эрсдэлийн самбар
              </NavLink>
            </>
          )}

          {role === "teacher" && (
            <>
              <div style={{ fontSize: "0.7rem", opacity: 0.6, margin: "16px 8px 8px", textTransform: "uppercase" }}>
                Багш
              </div>
              <NavLink to="/teacher/lesson-ai" style={navItem}>
                🎙️ Хичээлийн AI туслах
              </NavLink>
              <NavLink to="/teacher/timetable" style={navItem}>
                🗓️ Хичээлийн хуваарь
              </NavLink>
              <NavLink to="/teacher/grade-predictor" style={navItem}>
                📈 Дүнгийн таамаг (AI)
              </NavLink>
            </>
          )}

          {role === "student" && (
            <>
              <NavLink to="/student/event-report" style={navItem}>
                🚨 Үйл явдал мэдэгдэх
              </NavLink>
              <NavLink to="/student/grade-predictions" style={navItem}>
                📊 Миний дүнгийн таамаг
              </NavLink>
              <NavLink to="/student/timetable" style={navItem}>
                🗓️ Хичээлийн хуваарь
              </NavLink>
            </>
          )}

          {role === "parent" && (
            <>
              <NavLink to="/parent" style={navItem}>
                👨‍👩‍👧 Хүүхдийн дүн
              </NavLink>
            </>
          )}

          {role === "principal" && (
            <>
              <div style={{ fontSize: "0.7rem", opacity: 0.6, margin: "16px 8px 8px", textTransform: "uppercase" }}>
                Захирал
              </div>
              <NavLink to="/school/event-reports" style={navItem}>
                🧾 Сурагчийн мэдэгдлүүд
              </NavLink>
              <NavLink to="/school/academic-risk" style={navItem}>
                📉 Дүнгийн эрсдэлийн самбар
              </NavLink>
              <NavLink to="/school/unknown-faces" style={navItem}>
                🎯 Танигдаагүй нүүр
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <NavLink to="/school/event-reports" style={navItem}>
              🧾 Сурагчийн мэдэгдлүүд
            </NavLink>
          )}
        </nav>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 12,
            fontSize: "0.85rem",
          }}
        >
          <div style={{ padding: "0 8px", marginBottom: 8 }}>
            <strong>{user?.full_name || user?.email}</strong>
            <div style={{ opacity: 0.75, fontSize: "0.8rem" }}>{user?.role}</div>
          </div>
          <button
            type="button"
            className="es-btn es-btn-ghost"
            style={{ width: "100%", marginBottom: 8, color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              setToast(next === "dark" ? "Dark mode идэвхжлээ" : "Light mode идэвхжлээ");
            }}
          >
            {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
          <button type="button" className="es-btn es-btn-ghost" style={{ width: "100%", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }} onClick={handleLogout}>
            Гарах
          </button>
        </div>
      </aside>

      <button
        type="button"
        className="es-sidebar-overlay"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />

      <main className="es-main">
        <div className="es-topbar">
          <div className="es-toolbar">
            <button type="button" className="es-btn es-btn-secondary es-sidebar-toggle" onClick={() => setSidebarOpen((p) => !p)}>
              ☰
            </button>
            <div className="es-chip">Role: {user?.role}</div>
            <div className="es-chip">{user?.full_name || user?.email}</div>
          </div>
          <div className="es-chip">Home / {currentLabel}</div>
        </div>
        <Outlet />
      </main>
      {toast && <div className="es-toast">{toast}</div>}
    </div>
  );
}
