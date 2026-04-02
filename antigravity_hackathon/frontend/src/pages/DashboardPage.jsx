import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import StudentDashboard from "../components/dashboard/StudentDashboard.jsx";
import TeacherDashboard from "../components/dashboard/TeacherDashboard.jsx";
import ParentDashboard from "../components/dashboard/ParentDashboard.jsx";
import AdminDashboard from "../components/dashboard/AdminDashboard.jsx";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return (
    <div className="es-page">
      <div>
        <h1 className="es-page-title">Сайн байна уу, {user?.full_name || user?.email}</h1>
        <p className="es-page-desc">ЭдуСмарт системд тавтай морил. Системийн удирдлагын самбар.</p>
      </div>

      {role === "student" && <StudentDashboard />}
      {role === "teacher" && <TeacherDashboard />}
      {role === "parent" && <ParentDashboard />}
      {(role === "admin" || role === "principal") && <AdminDashboard />}

    </div>
  );
}
