import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function ParentDashboard() {
  const token = useAuthStore((s) => s.token);
  const [childrenInsights, setChildrenInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        const data = await apiFetch("/profile/parent/children-predictions", { token });
        // NOTE: we use predictions or insights endpoint
        if (!off) {
          setChildrenInsights(data);
          if (data.length > 0) setSelectedChild(data[0].student_id);
        }
      } catch (e) {
        console.error("Failed to load parent insights", e);
      } finally {
        if (!off) setLoading(false);
      }
    };
    load();
    return () => { off = true; };
  }, [token]);

  if (loading) return <div className="es-skeleton">Ачаалж байна...</div>;
  if (!childrenInsights || childrenInsights.length === 0) {
    return <div className="es-section"><p className="es-empty">Хүүхдийн мэдээлэл олдсонгүй.</p></div>;
  }

  const activeData = childrenInsights.find(c => c.student_id === selectedChild) || childrenInsights[0];

  const mockGrades = [
    { subject: "Математик", score: activeData?.predicted_score || 88 },
    { subject: "Монгол хэл", score: 92 },
    { subject: "Физик", score: 79 },
    { subject: "Мэдээлэл зүй", score: 95 }
  ];

  return (
    <div className="es-section fade-in">
      <div className="es-toolbar" style={{ marginBottom: "1.5rem" }}>
        <h2 className="es-section-title" style={{ margin: 0 }}>Хүүхдийн сурлагын явц</h2>
        <select
          className="es-select"
          style={{ width: "250px", marginLeft: "auto" }}
          value={selectedChild || ""}
          onChange={(e) => setSelectedChild(e.target.value)}
        >
          {childrenInsights.map((c) => (
            <option key={c.student_id} value={c.student_id}>
              {c.student_name}
            </option>
          ))}
        </select>
      </div>

      <div className="es-kpi-grid">
        <div className="es-kpi">
          <div className="es-kpi-label">Ерөнхий дүнгийн таамаг</div>
          <div className="es-kpi-value">{activeData?.predicted_score || "88"}%</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Сүүлийн шалгалт</div>
          <div className="es-kpi-value">А (92%)</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Даалгавар гүйцэтгэл</div>
          <div className="es-kpi-value" style={{color: "var(--es-success)"}}>100%</div>
        </div>
      </div>

      <div className="es-chart-container" style={{height: "300px"}}>
        <h3 className="es-label">Хичээл бүрийн дундаж үзүүлэлт</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={mockGrades} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--es-border)" />
            <XAxis dataKey="subject" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(99, 102, 241, 0.05)" }} />
            <Bar dataKey="score" fill="var(--es-accent)" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
