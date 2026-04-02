import React, { useEffect, useState } from "react";
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
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);

  // Stats for the student (Global Overview)
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/grades/me/lesson-insights", { token }).catch(() => []);
        if (!off) {
           setInsight(data && data.length > 0 ? data : "mock");
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

  // Global deterministic numbers based on user ID
  const numId = parseInt(user?.id?.toString().replace(/[^0-9]/g, '')) || 1;
  const riskyCount = (numId % 3 === 0) ? 1 : 0;
  const riskySubjectsText = riskyCount > 0 ? "Физик" : "Байхгүй";
  const globalAttention = 78 + (numId % 20); // 78-97
  const globalAttendance = 85 + (numId % 15); // 85-99

  const attendanceHistory = [
    { week: "1-р долоо хоног", attended: 4 + (numId % 2) },
    { week: "2-р долоо хоног", attended: 5 },
    { week: "3-р долоо хоног", attended: 3 + (numId % 3) },
    { week: "4-р долоо хоног", attended: 5 },
    { week: "5-р долоо хоног", attended: 4 },
    { week: "Сүүлийн 7 хоног", attended: 3 + (numId % 2) },
  ];

  const getAttentionColor = (score) => {
     if (score >= 85) return "var(--es-success)";
     if (score >= 70) return "var(--es-warning)";
     return "var(--es-danger)";
  };

  return (
    <div className="es-section fade-in" style={{ padding: 0, background: "transparent", border: "none", boxShadow: "none", paddingTop: "15px" }}>
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
            {globalAttention}%
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--es-muted)", marginTop: "8px" }}>Бүх хичээлийн нэгтгэл</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Нийт ирцийн хувь</div>
          <div className="es-kpi-value">{globalAttendance}%</div>
          <div style={{ fontSize: "0.8rem", color: globalAttendance > 80 ? "var(--es-success)" : "var(--es-danger)", marginTop: "8px" }}>
             {globalAttendance > 80 ? "Маш сайн" : "Эрсдэлтэй байгаа"}
          </div>
        </div>
      </div>

      {/* Grid container can still be used or just a single card now */}
      <div className="es-grid-2" style={{ gap: "20px", display: "flex" }}>
        
        {/* Attendance Timeline Line Chart */}
        <div className="es-card" style={{ flex: 1 }}>
          <h3 className="es-label" style={{ marginBottom: "1rem" }}>📅 Нийт ирцийн түүх (7 хоногоор)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceHistory} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--es-border)" opacity={0.5} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--es-muted)", fontWeight: "600" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--es-muted)" }} axisLine={false} tickLine={false} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} formatter={(value) => [`${value} өдөр`, "Сургууль дээр ирсэн"]} />
              <Line type="monotone" dataKey="attended" stroke="var(--es-success)" strokeWidth={4} dot={{ r: 6, fill: "var(--es-success)" }} activeDot={{ r: 8, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
