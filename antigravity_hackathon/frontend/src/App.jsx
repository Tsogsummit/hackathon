import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { useAuthStore } from "./store/authStore.js";

const AppLayout = lazy(() => import("./layouts/AppLayout.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const AttentionCameraPage = lazy(() => import("./pages/AttentionCameraPage.jsx"));
const UsersManagePage = lazy(() => import("./pages/admin/UsersManagePage.jsx"));
const SchoolSetupPage = lazy(() => import("./pages/admin/SchoolSetupPage.jsx"));
const UnknownFaceLogsPage = lazy(() => import("./pages/admin/UnknownFaceLogsPage.jsx"));
const LessonAIPage = lazy(() => import("./pages/teacher/LessonAIPage.jsx"));
const GradePredictorPage = lazy(() => import("./pages/teacher/GradePredictorPage.jsx"));
const TeacherTimetablePage = lazy(() => import("./pages/teacher/TeacherTimetablePage.jsx"));
const StudentEventReportPage = lazy(() => import("./pages/StudentEventReportPage.jsx"));
const StudentGradePredictionsPage = lazy(() => import("./pages/StudentGradePredictionsPage.jsx"));
const StudentTimetablePage = lazy(() => import("./pages/student/StudentTimetablePage.jsx"));
const SchoolEventReportsPage = lazy(() => import("./pages/SchoolEventReportsPage.jsx"));
const SchoolAcademicRiskPage = lazy(() => import("./pages/SchoolAcademicRiskPage.jsx"));
const StudentHomePage = lazy(() => import("./pages/StudentHomePage.jsx"));
const ParentAcademicPage = lazy(() => import("./pages/ParentAcademicPage.jsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.jsx"));
const AcademicBreakdownPage = lazy(() => import("./pages/AcademicBreakdownPage.jsx"));

function RouteFallback() {
  return (
    <div className="es-section" style={{ maxWidth: 360, margin: "40px auto" }}>
      <div className="es-skeleton" style={{ height: 16, width: "60%", marginBottom: 10 }} />
      <div className="es-skeleton" style={{ height: 12, width: "100%" }} />
    </div>
  );
}

function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (token && !user) {
      refreshMe().catch(() => logout());
    }
  }, [token, user, refreshMe, logout]);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <p>Профайл ачаалж байна…</p>
      </div>
    );
  }
  return <Outlet />;
}

function RequireRole({ role }) {
  const user = useAuthStore((s) => s.user);
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user?.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/academic-breakdown" element={<AcademicBreakdownPage />} />
              <Route path="/attention" element={<AttentionCameraPage />} />

              <Route element={<RequireRole role="admin" />}>
                <Route path="/admin/users" element={<UsersManagePage />} />
                <Route path="/admin/school" element={<SchoolSetupPage />} />
                <Route path="/admin/unknown-faces" element={<UnknownFaceLogsPage />} />
              </Route>

              <Route element={<RequireRole role="teacher" />}>
                <Route path="/teacher/lesson-ai" element={<LessonAIPage />} />
                <Route path="/teacher/grade-predictor" element={<GradePredictorPage />} />
                <Route path="/teacher/timetable" element={<TeacherTimetablePage />} />
              </Route>

              <Route element={<RequireRole role="student" />}>
                <Route path="/student/event-report" element={<StudentEventReportPage />} />
                <Route path="/student/grade-predictions" element={<StudentGradePredictionsPage />} />
                <Route path="/student/timetable" element={<StudentTimetablePage />} />
              </Route>
              <Route element={<RequireRole role={["admin", "principal"]} />}>
                <Route path="/school/event-reports" element={<SchoolEventReportsPage />} />
                <Route path="/school/academic-risk" element={<SchoolAcademicRiskPage />} />
                <Route path="/school/unknown-faces" element={<UnknownFaceLogsPage />} />
              </Route>
              <Route element={<RequireRole role="student" />}>
                <Route path="/student" element={<StudentHomePage />} />
              </Route>
              <Route element={<RequireRole role="parent" />}>
                <Route path="/parent" element={<ParentAcademicPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
