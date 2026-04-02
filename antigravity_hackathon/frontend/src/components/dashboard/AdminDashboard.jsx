import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const schoolStats = {
    totalStudents: 1250,
    totalTeachers: 85,
    averageAttendance: "94.5%",
    overallRisk: "Бага"
  };

  const attendanceTrend = [
    { week: "Долоо хоног 1", attendance: 96 },
    { week: "Долоо хоног 2", attendance: 95.5 },
    { week: "Долоо хоног 3", attendance: 92 },
    { week: "Долоо хоног 4", attendance: 94.5 },
    { week: "Долоо хоног 5", attendance: 97 }
  ];

  return (
    <div className="es-section fade-in">
      <h2 className="es-section-title">Сургуулийн Нэгдсэн Мэдээлэл (Admin)</h2>
      
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

      <div className="es-chart-container">
        <h3 className="es-label">Сургуулийн Нэгдсэн Ирцийн Хандлага</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={attendanceTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--es-primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--es-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
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
