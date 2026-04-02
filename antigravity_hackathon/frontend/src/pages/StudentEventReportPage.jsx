import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

export default function StudentEventReportPage() {
  const token = useAuthStore((s) => s.token);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [classId, setClassId] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const tt = await apiFetch("/student/timetable", { token });
        const map = new Map();
        for (const row of tt || []) {
          const key = String(row.class_id);
          if (!map.has(key)) {
            map.set(key, { id: row.class_id, name: row.class_name || `#${row.class_id}` });
          }
        }
        const classes = Array.from(map.values());
        setClassOptions(classes);
        if (classes[0]) setClassId(String(classes[0].id));
      } catch {
        setClassOptions([]);
      }
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const out = await apiFetch("/student/event-report-options", { token });
        const cats = Array.isArray(out?.categories) ? out.categories : [];
        const locs = Array.isArray(out?.locations) ? out.locations : [];
        setCategories(cats);
        setLocations(locs);
        if (cats[0]) setCategory(cats[0].value);
        if (locs[0]) setLocation(locs[0].value);
      } catch {
        setCategories([]);
        setLocations([]);
      }
    })();
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!classId) {
      setErr("Анги олдсонгүй. Эхлээд timetable үүссэн эсэхийг шалгана уу.");
      return;
    }
    if (!category || !location) {
      setErr("Мэдэгдлийн тохиргоо ачаалагдаагүй байна.");
      return;
    }
    setLoading(true);
    setErr("");
    setOk("");
    try {
      await apiFetch("/student/event-reports", {
        method: "POST",
        token,
        body: {
          class_id: Number(classId),
          lesson_id: null,
          category,
          description: `Байршил: ${locations.find((l) => l.value === location)?.label || location}`,
        },
      });
      setOk(`"${categories.find((c) => c.value === category)?.label || category}" мэдэгдэл шуурхай илгээгдлээ. Сургуулийн удирдлага шалгах болно.`);
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
          <label className="es-label" style={{ fontSize: "1.1rem" }}>Анги:</label>
          <select className="es-select" value={classId} onChange={(e) => setClassId(e.target.value)} style={{ padding: "12px", fontSize: "1.05rem", borderRadius: "8px" }}>
            {classOptions.length === 0 && <option value="">— Анги олдсонгүй —</option>}
            {classOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          
          <label className="es-label" style={{ fontSize: "1.1rem" }}>Зөрчлийн төрлийг дарж сонгоно уу:</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {categories.map((c) => (
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
             {locations.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
             ))}
          </select>

          <button type="submit" className="es-btn es-btn-danger" style={{ padding: "16px", fontSize: "1.15rem", fontWeight: "bold", marginTop: "10px" }} disabled={loading || !classId || !category || !location}>
            {loading ? "Илгээж байна..." : "🚨 ЯАРАЛТАЙ ИЛГЭЭХ"}
          </button>
        </form>

        {ok && <p className="es-alert es-alert-success" style={{ marginTop: 20 }}>{ok}</p>}
        {err && <p className="es-alert es-alert-danger" style={{ marginTop: 20 }}>{err}</p>}
      </div>
    </div>
  );
}
