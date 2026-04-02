import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const CATEGORIES = [
  { value: "bully", label: "Дээрэлхэлт, дарамт (Bully)" },
  { value: "smoke", label: "Тамхи татаж байна" },
  { value: "vape", label: "Электрон тамхи (Vape)" },
  { value: "violence", label: "Хүчирхийлэл, зодоон" },
  { value: "hazard", label: "Аюултай нөхцөл байдал" },
];

const LOCATIONS = [
  { value: "floor1_restroom", label: "1-р давхрын ариун цэврийн өрөө" },
  { value: "floor2_restroom", label: "2-р давхрын ариун цэврийн өрөө" },
  { value: "floor3_restroom", label: "3-р давхрын ариун цэврийн өрөө" },
  { value: "floor4_restroom", label: "4-р давхрын ариун цэврийн өрөө" },
  { value: "floor1_stairs", label: "1-р давхрын шат" },
  { value: "floor2_stairs", label: "2-р давхрын шат" },
  { value: "floor3_stairs", label: "3-р давхрын шат" },
  { value: "floor4_stairs", label: "4-р давхрын шат" },
  { value: "hallway", label: "Коридор" },
  { value: "classroom", label: "Анги дотор" },
  { value: "outside", label: "Сургуулийн гадаах талбай" }
];

const categoryLabels = CATEGORIES.reduce((acc, c) => ({...acc, [c.value]: c.label}), {});
const locationLabels = LOCATIONS.reduce((acc, l) => ({...acc, [l.value]: l.label}), {});

export default function StudentEventReportPage() {
  const token = useAuthStore((s) => s.token);
  const [category, setCategory] = useState("bully");
  const [location, setLocation] = useState("floor1_restroom");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOk("");
    try {
      await apiFetch("/student/event-reports", {
        method: "POST",
        token,
        body: {
          class_id: 1, // keeping logic format but ignoring input
          lesson_id: null,
          category,
          description: `Байршил: ${locationLabels[location]}`,
        },
      });
      setOk(`"${categoryLabels[category]}" мэдэгдэл шуурхай илгээгдлээ. Сургуулийн удирдлага шалгах болно.`);
    } catch (e2) {
      setErr(e2?.message || "Илгээж чадсангүй. Та түр хүлээгээд дахин үзнэ үү.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="es-page fade-in">
      <h1 className="es-page-title">🚨 Шуурхай үйл явдал мэдэгдэх</h1>
      <p className="es-page-desc">Сургуулийн орчинд болж буй доорх зөрчлүүдийг маш хурдан 1 товшилтоор мэдэгдэх.</p>

      <div className="es-section" style={{ maxWidth: 640 }}>
        <form onSubmit={onSubmit} className="es-form-grid" style={{ gap: "20px" }}>
          
          <label className="es-label" style={{ fontSize: "1.1rem" }}>Зөрчлийн төрлийг дарж сонгоно уу:</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {CATEGORIES.map((c) => (
               <button 
                  type="button" 
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`es-btn ${category === c.value ? "es-btn-danger" : "es-btn-secondary"}`}
                  style={{ textAlign: "left", padding: "16px 20px", fontSize: "1.1rem", borderRadius: "12px", border: category === c.value ? "2px solid #ef4444" : "1px solid var(--es-border)" }}
               >
                 {category === c.value ? "🔴 " : "⚪ "} {c.label}
               </button>
            ))}
          </div>

          <label className="es-label" style={{ fontSize: "1.1rem", marginTop: "10px" }}>Үйл явдал болж буй байршлыг сонгох:</label>
          <select className="es-select" value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: "12px", fontSize: "1.05rem", borderRadius: "8px" }}>
             {LOCATIONS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
             ))}
          </select>

          <button type="submit" className="es-btn es-btn-danger" style={{ padding: "16px", fontSize: "1.15rem", fontWeight: "bold", marginTop: "10px" }} disabled={loading}>
            {loading ? "Илгээж байна..." : "🚨 ЯАРАЛТАЙ ИЛГЭЭХ"}
          </button>
        </form>

        {ok && <p className="es-alert es-alert-success" style={{ marginTop: 20 }}>{ok}</p>}
        {err && <p className="es-alert es-alert-danger" style={{ marginTop: 20 }}>{err}</p>}
      </div>
    </div>
  );
}
