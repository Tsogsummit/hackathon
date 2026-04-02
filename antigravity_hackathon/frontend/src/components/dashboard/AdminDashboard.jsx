import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

export default function AdminDashboard() {
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [schoolStats, setSchoolStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    averageAttendance: "0.0%",
    overallRisk: "Тодорхойгүй",
  });
  const [attendanceTrend, setAttendanceTrend] = useState([]);

  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        setLoading(true);
        setErr("");
        const out = await apiFetch("/admin/dashboard-stats", { token });
        if (off) return;
        setSchoolStats({
          totalStudents: out.totalStudents ?? 0,
          totalTeachers: out.totalTeachers ?? 0,
          averageAttendance: out.averageAttendance ?? "0.0%",
          overallRisk: out.overallRisk ?? "Тодорхойгүй",
        });
        setAttendanceTrend((out.attendanceTrend || []).map((x) => ({ week: x.label, attendance: x.attendance })));
      } catch (e) {
        if (!off) setErr(e?.message || "Админ самбарын мэдээлэл ачаалж чадсангүй");
      } finally {
        if (!off) setLoading(false);
      }
    };
    load();
    return () => {
      off = true;
    };
  }, [token]);

  if (loading) return <div className="es-skeleton" style={{ height: "360px" }} />;

  return (
    <div className="es-dashboard-stack fade-in">
      <h2 className="es-section-title">Сургуулийн Нэгдсэн Мэдээлэл (Admin)</h2>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <div className="es-kpi-grid">
        <div className="es-kpi">
          <div className="es-kpi-label">Нийт Сурагчид</div>
          <div className="es-kpi-value">{schoolStats.totalStudents}</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Нийт Багш нар</div>
          <div className="es-kpi-value">{schoolStats.totalTeachers}</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Дундаж Ирц</div>
          <div className="es-kpi-value" style={{color: "var(--es-primary)"}}>{schoolStats.averageAttendance}</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Үнэлгээний эрсдэл</div>
          <div className="es-kpi-value" style={{color: "var(--es-success)"}}>{schoolStats.overallRisk}</div>
        </div>
      </div>

      <div className="es-chart-container es-chart-card">
        <h3 className="es-label">Сургуулийн Нэгдсэн Ирцийн Хандлага</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={attendanceTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--es-primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--es-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis domain={['dataMin - 2', 100]} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--es-border)" />
            <Tooltip />
            <Area type="monotone" dataKey="attendance" stroke="var(--es-primary)" fillOpacity={1} fill="url(#colorAtt)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
