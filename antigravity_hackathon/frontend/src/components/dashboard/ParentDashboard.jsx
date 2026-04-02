import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const PIE_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#14b8a6",
];

export default function ParentDashboard() {
  const token = useAuthStore((s) => s.token);
  const [childrenPredictions, setChildrenPredictions] = useState([]);
  const [lessonInsights, setLessonInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        const [preds, insights] = await Promise.all([
          apiFetch("/profile/parent/children-predictions", { token }),
          apiFetch("/grades/parent/children/lesson-insights", { token }),
        ]);
        if (!off) {
          setChildrenPredictions(Array.isArray(preds) ? preds : []);
          setLessonInsights(Array.isArray(insights) ? insights : []);
          if (preds.length > 0) setSelectedChild(preds[0].student_id);
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

  const activeData =
    childrenPredictions.find((c) => String(c.student_id) === String(selectedChild)) || childrenPredictions[0] || null;

  const latestGradeText = activeData?.predicted_grade
    ? `${activeData.predicted_grade} (${Number(activeData.predicted_score || 0).toFixed(1)}%)`
    : "-";

  const allChildrenSubjectAverages = useMemo(() => {
    const latestByChildSubject = new Map();
    for (const row of lessonInsights) {
      if (row?.student_id == null || !row?.class_name || row?.predicted_score == null) continue;
      const key = `${row.student_id}::${row.class_name}`;
      const prev = latestByChildSubject.get(key);
      if (!prev || (row.term || "") > (prev.term || "")) {
        latestByChildSubject.set(key, row);
      }
    }

    const aggregate = new Map();
    for (const row of latestByChildSubject.values()) {
      const prev = aggregate.get(row.class_name) || { total: 0, count: 0 };
      aggregate.set(row.class_name, {
        total: prev.total + Number(row.predicted_score),
        count: prev.count + 1,
      });
    }

    return Array.from(aggregate.entries())
      .map(([subject, value]) => ({
        subject,
        score: Number((value.total / Math.max(1, value.count)).toFixed(1)),
      }))
      .sort((a, b) => b.score - a.score);
  }, [lessonInsights]);

  if (loading) return <div className="es-skeleton">Ачаалж байна...</div>;
  if (!childrenPredictions || childrenPredictions.length === 0) {
    return <div className="es-section"><p className="es-empty">Хүүхдийн мэдээлэл олдсонгүй.</p></div>;
  }

  return (
    <div className="es-dashboard-stack fade-in">
      <div className="es-toolbar" style={{ marginBottom: "1.5rem" }}>
        <h2 className="es-section-title" style={{ margin: 0 }}>Хүүхдийн сурлагын явц</h2>
        <select
          className="es-select"
          style={{ width: "250px", marginLeft: "auto" }}
          value={selectedChild || ""}
          onChange={(e) => setSelectedChild(String(e.target.value))}
        >
          {childrenPredictions.map((c) => (
            <option key={c.student_id} value={c.student_id}>
              {c.student_name}
            </option>
          ))}
        </select>
      </div>

      <div className="es-kpi-grid">
        <div className="es-kpi">
          <div className="es-kpi-label">Ерөнхий дүнгийн таамаг</div>
          <div className="es-kpi-value">{activeData?.predicted_score != null ? `${Number(activeData.predicted_score).toFixed(1)}%` : "-"}</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Сүүлийн таамагласан үнэлгээ</div>
          <div className="es-kpi-value">{latestGradeText}</div>
        </div>
        <div className="es-kpi">
          <div className="es-kpi-label">Эрсдэлийн түвшин</div>
          <div className="es-kpi-value" style={{ color: activeData?.risk_level === "high" ? "var(--es-danger)" : "var(--es-success)" }}>
            {activeData?.risk_level || "-"}
          </div>
        </div>
      </div>

      <div className="es-chart-container es-chart-card" style={{ height: "360px" }}>
        <h3 className="es-label">Хүүхдүүдийн бүх хичээлийн дундаж үнэлгээ</h3>
        {allChildrenSubjectAverages.length === 0 ? (
          <p className="es-empty">Хүүхдүүдийн хичээлийн дундаж мэдээлэл алга.</p>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={allChildrenSubjectAverages}
                dataKey="score"
                nameKey="subject"
                cx="40%"
                cy="50%"
                outerRadius={105}
                innerRadius={48}
                paddingAngle={2}
              >
                {allChildrenSubjectAverages.map((entry, idx) => (
                  <Cell key={entry.subject} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, "Дундаж"]} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
