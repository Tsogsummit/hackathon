import { useEffect, useMemo, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

export default function StudentDashboard() {
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const attendanceItems = breakdown?.attendance || [];

  const attendanceHistory = useMemo(() => {
    const byWeek = new Map();
    for (const item of attendanceItems) {
      const value = String(item.value || "").toLowerCase();
      const attended = value.startsWith("present") || value.startsWith("late") || value.startsWith("excused") ? 1 : 0;
      const date = item.date ? new Date(item.date) : null;
      if (!date || Number.isNaN(date.getTime())) continue;
      const weekKey = `${date.getFullYear()}-${Math.ceil(date.getDate() / 7)}`;
      byWeek.set(weekKey, (byWeek.get(weekKey) || 0) + attended);
    }
    return Array.from(byWeek.entries())
      .map(([week, attended]) => ({ week, attended }))
      .slice(-6);
  }, [attendanceItems]);

  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        setLoading(true);
        const [insightData, breakdownData] = await Promise.all([
          apiFetch("/grades/me/lesson-insights", { token }).catch(() => []),
          apiFetch("/profile/student/academic-breakdown", { token }).catch(() => null),
        ]);
        if (!off) {
          setInsights(Array.isArray(insightData) ? insightData : []);
          setBreakdown(breakdownData);
        }
      } catch (e) {
        console.error("Failed to load student insights", e);
      } finally {
        if (!off) setLoading(false);
      }
    };
    load();
    return () => { off = true; };
  }, [token]);

  if (loading) return <div className="es-skeleton" style={{height: "400px"}}>Ачаалж байна...</div>;

  const riskyInsights = insights.filter((x) => x.risk_level === "high");
  const riskyCount = riskyInsights.length;
  const riskySubjectsText =
    riskyInsights.length > 0 ? Array.from(new Set(riskyInsights.map((x) => x.class_name))).join(", ") : "Байхгүй";

  const totalLowAttentionFlags = insights.reduce((sum, x) => sum + (x.low_attention_dates?.length || 0), 0);
  const globalAttention = insights.length ? Math.max(0, Math.min(100, 100 - totalLowAttentionFlags * 6)) : null;

  const attendedCount = attendanceItems.filter((x) => {
    const value = String(x.value || "").toLowerCase();
    return value.startsWith("present") || value.startsWith("late") || value.startsWith("excused");
  }).length;
  const globalAttendance =
    attendanceItems.length > 0 ? Math.round((attendedCount / attendanceItems.length) * 100) : null;

  const getAttentionColor = (score) => {
    if (score == null) return "var(--es-muted)";
    if (score >= 85) return "var(--es-success)";
    if (score >= 70) return "var(--es-warning)";
    return "var(--es-danger)";
  };

  return (
    <div className="es-dashboard-stack fade-in">
      {/* KPI Cards */}
      <div className="es-kpi-grid">
        <div className="es-kpi">
          <div className="es-kpi-label">Унах эрсдэлтэй хичээл (AI)</div>
          <div className="es-kpi-value" style={{ color: riskyCount === 0 ? "var(--es-success)" : "var(--es-danger)" }}>{riskyCount}</div>
          <div style={{ fontSize: "0.8rem", color: riskyCount === 0 ? "var(--es-success)" : "var(--es-danger)", marginTop: "8px", fontWeight: "bold" }}>ХИЧЭЭЛ: {riskySubjectsText}</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Ерөнхий анхаарлын дундаж</div>
          <div className="es-kpi-value" style={{ color: getAttentionColor(globalAttention) }}>
            {globalAttention == null ? "-" : `${globalAttention}%`}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--es-muted)", marginTop: "8px" }}>Бүх хичээлийн нэгтгэл</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Нийт ирцийн хувь</div>
          <div className="es-kpi-value">{globalAttendance == null ? "-" : `${globalAttendance}%`}</div>
          <div style={{ fontSize: "0.8rem", color: (globalAttendance ?? 0) > 80 ? "var(--es-success)" : "var(--es-danger)", marginTop: "8px" }}>
             {globalAttendance == null ? "Ирцийн өгөгдөл алга" : globalAttendance > 80 ? "Маш сайн" : "Эрсдэлтэй байгаа"}
          </div>
        </div>
      </div>

      {/* Grid container can still be used or just a single card now */}
      <div className="es-dashboard-detail-grid">
        
        {/* Attendance Timeline Line Chart */}
        <div className="es-card es-equal-card es-chart-card">
          <h3 className="es-label" style={{ marginBottom: "1rem" }}>📅 Нийт ирцийн түүх (7 хоногоор)</h3>
          {attendanceHistory.length === 0 ? (
            <p className="es-empty">Ирцийн түүхийн өгөгдөл алга.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceHistory} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--es-border)" opacity={0.5} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--es-muted)", fontWeight: "600" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--es-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} formatter={(value) => [`${value} өдөр`, "Сургууль дээр ирсэн"]} />
                <Line type="monotone" dataKey="attended" stroke="var(--es-success)" strokeWidth={4} dot={{ r: 6, fill: "var(--es-success)" }} activeDot={{ r: 8, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}
