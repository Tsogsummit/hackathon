import { useEffect, useState } from "react";

import LessonAIAssistant from "@components/LessonAIAssistant/index.jsx";
import LessonGradesAttendance from "../../components/LessonGradesAttendance.jsx";
import LessonTermGrades from "../../components/LessonTermGrades.jsx";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

export default function LessonAIPage() {
  const token = useAuthStore((s) => s.token);
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState(null);
  const [err, setErr] = useState("");
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState("ai");

  const selectedLesson = lessons.find((l) => l.id === lessonId);
  const classId = selectedLesson?.class_id;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await apiFetch("/teacher/lessons", { token });
        if (!cancelled) {
          setLessons(list);
          if (list.length) setLessonId((prev) => prev ?? list[0].id);
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Хичээл ачаалахад алдаа");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div>
      <h1 className="es-page-title">Хичээлийн AI туслах</h1>
      <p className="es-page-desc">
        Эхлээд өөрийн хичээлээ сонгоно уу. Дараа нь аудио оруулж, текст болгож, сурагчдад зориулсан материал үүсгэнэ.
      </p>

      {err && <p style={{ color: "var(--es-danger)", marginBottom: 16 }}>{err}</p>}

      <div className="es-card" style={{ marginBottom: 20, maxWidth: 480 }}>
        <label className="es-label">Аль хичээл дээр ажиллах вэ?</label>
        <select className="es-select" value={lessonId ?? ""} onChange={(e) => setLessonId(Number(e.target.value))}>
          {lessons.length === 0 && <option value="">— Хичээл алга (админ холбоно) —</option>}
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title || `Хичээл #${l.id}`} — {l.class_name}
            </option>
          ))}
        </select>
      </div>

      {lessonId ? (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button
               className={`es-btn ${tab === "ai" ? "es-btn-primary" : "es-btn-secondary"}`}
               onClick={() => setTab("ai")}
             >
               AI Туслах
             </button>
             <button
               className={`es-btn ${tab === "daily" || tab === "grades" ? "es-btn-primary" : "es-btn-secondary"}`}
               onClick={() => setTab("daily")}
               disabled={!classId}
             >
               Өдөр тутмын (Ирц, Даалгавар)
             </button>
             <button
               className={`es-btn ${tab === "term" ? "es-btn-primary" : "es-btn-secondary"}`}
               onClick={() => setTab("term")}
               disabled={!classId}
             >
               Улирлын дүн & Шалгалт
             </button>
           </div>

          {tab === "ai" && (
            <>
              <div className="es-card" style={{ marginBottom: 12 }}>
                <strong>Энэ хичээлтэй холбогдсон сурагчид</strong>
                <p style={{ margin: "6px 0 10px", color: "var(--es-muted)" }}>
                  Хичээл-сурагч холбоо нь ангийн enrollment-оос автоматаар татагдана.
                </p>
                <button
                  type="button"
                  className="es-btn es-btn-secondary"
                  onClick={async () => {
                    if (students.length > 0) {
                      setStudents([]);
                    } else {
                      try {
                        const out = await apiFetch(`/teacher/lessons/${lessonId}/students`, { token });
                        setStudents(out);
                      } catch (e) {
                        setErr(e?.message || "Сурагчид ачаалж чадсангүй");
                      }
                    }
                  }}
                >
                  {students.length > 0 ? "Сурагчийн жагсаалт нуух" : "Сурагчийн жагсаалт харах"}
                </button>
                {students.length > 0 && (
                  <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                    {students.slice(0, 12).map((s) => (
                      <div key={s.id} style={{ border: "1px solid var(--es-border)", borderRadius: 8, padding: "6px 8px" }}>
                        {s.full_name || s.email}
                      </div>
                    ))}
                    {students.length > 12 && <p style={{ margin: 0, color: "var(--es-muted)" }}>... нийт {students.length} сурагч</p>}
                  </div>
                )}
              </div>
              <LessonAIAssistant lessonId={lessonId} authToken={token} />
            </>
          )}

          {(tab === "daily" || tab === "grades") && classId && (
            <LessonGradesAttendance lessonId={lessonId} classId={classId} token={token} />
          )}

          {tab === "term" && classId && (
            <LessonTermGrades classId={classId} token={token} />
          )}
        </>
      ) : (
        <div className="es-card">Админ танд хичээл хуваарилаагүй байна. &quot;Анги &amp; хичээл тохируулах&quot; хэсгээр үүсгүүлнэ үү.</div>
      )}
    </div>
  );
}
