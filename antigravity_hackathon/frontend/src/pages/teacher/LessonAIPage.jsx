import { useEffect, useMemo, useState } from "react";

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
  const [tab, setTab] = useState("ai");

  const selectedLesson = lessons.find((l) => l.id === lessonId);
  const classId = selectedLesson?.class_id;

  const lessonSummary = useMemo(() => {
    if (!selectedLesson) return null;
    return {
      title: selectedLesson.title || `Хичээл #${selectedLesson.id}`,
      className: selectedLesson.class_name || "",
      subject: selectedLesson.subject_name || "",
    };
  }, [selectedLesson]);

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
    <div className="es-page fade-in es-lesson-ai-workbench">
      <header>
        <h1 className="es-page-title">Хичээлийн AI туслах</h1>
        <p className="es-page-desc">
          Нэг цонхноос: <strong>дуу бичлэг → текст → материал</strong> үүсгэж, сурагчдаа илгээх, мөн{" "}
          <strong>өдрийн ирц / даалгавар</strong> болон <strong>улирлын шалгалтын оноо</strong> оруулах.
        </p>
      </header>

      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <section className="es-lesson-picker-card" aria-label="Хичээл сонгох">
        <label className="es-label" htmlFor="lesson-ai-lesson-select">
          Аль хичээл дээр ажиллах вэ?
        </label>
        <p style={{ margin: "0 0 12px", fontSize: "0.85rem", color: "var(--es-muted)", lineHeight: 1.45 }}>
          Энд сонгосон хичээлд л аудио илгээгдэж, материал хадгалагдана. Өөр хичээл рүү шилжихэд доорх табууд тухайн хичээлд холбогдоно.
        </p>
        <select
          id="lesson-ai-lesson-select"
          className="es-select"
          value={lessonId ?? ""}
          onChange={(e) => setLessonId(Number(e.target.value))}
        >
          {lessons.length === 0 && <option value="">— Хичээл алга (админ холбоно) —</option>}
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title || `Хичээл #${l.id}`} — {l.class_name}
            </option>
          ))}
        </select>
        {lessonSummary && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 10,
              background: "var(--es-accent-soft)",
              border: "1px solid var(--es-border)",
              fontSize: "0.88rem",
            }}
          >
            <span style={{ fontWeight: 700, color: "var(--es-text)" }}>Сонгогдсон: </span>
            <span style={{ color: "var(--es-muted)" }}>
              {lessonSummary.title}
              {lessonSummary.className ? ` · ${lessonSummary.className}` : ""}
              {lessonSummary.subject ? ` · ${lessonSummary.subject}` : ""}
            </span>
          </div>
        )}
      </section>

      {lessonId ? (
        <>
          <nav className="es-segment-tabs" aria-label="Хэсэг сонгох">
            <button
              type="button"
              className={`es-segment-tab ${tab === "ai" ? "is-active" : ""}`}
              onClick={() => setTab("ai")}
            >
              <span className="es-segment-tab__title">AI туслах</span>
              <span className="es-segment-tab__hint">Аудио, текст, материал, сурагчдад илгээх</span>
            </button>
            <button
              type="button"
              className={`es-segment-tab ${tab === "daily" ? "is-active" : ""}`}
              onClick={() => setTab("daily")}
              disabled={!classId}
            >
              <span className="es-segment-tab__title">Өдөр тутам</span>
              <span className="es-segment-tab__hint">Ирц, өдрийн даалгаварын оноо</span>
            </button>
            <button
              type="button"
              className={`es-segment-tab ${tab === "term" ? "is-active" : ""}`}
              onClick={() => setTab("term")}
              disabled={!classId}
            >
              <span className="es-segment-tab__title">Улирал / шалгалт</span>
              <span className="es-segment-tab__hint">Quiz, бие даалт, мидтерм, эцсийн</span>
            </button>
          </nav>

          {tab === "ai" && <LessonAIAssistant lessonId={lessonId} authToken={token} />}

          {tab === "daily" && classId && (
            <section className="es-lesson-subpanel">
              <h2 className="es-lesson-subpanel__title">Өдрийн ирц ба даалгавар</h2>
              <p className="es-lesson-subpanel__desc">
                Сонгосон өдөрт хичээлийн ирцийг тэмдэглэж, өдрийн гэрийн даалгаврын оноо оруулна. Хадгалахад ирц болон оноо нэг дор серверт бичигдэнэ.
              </p>
              <LessonGradesAttendance lessonId={lessonId} classId={classId} token={token} />
            </section>
          )}

          {tab === "term" && classId && (
            <section className="es-lesson-subpanel">
              <h2 className="es-lesson-subpanel__title">Улирлын оноо (дүнгийн таамагт нөлөөлнө)</h2>
              <p className="es-lesson-subpanel__desc">
                Сурагч бүрт шалгалт, бие даалт, мидтерм, эцсийн шалгалтын оноо оруулаад хадгалбал уналтын эрсдэлийн таамаг шинэчлэгдэнэ.
              </p>
              <LessonTermGrades classId={classId} token={token} />
            </section>
          )}
        </>
      ) : (
        <div className="es-card">
          <p style={{ margin: 0, color: "var(--es-muted)", lineHeight: 1.6 }}>
            Танд хуваарилагдсан хичээл алга. Админ &quot;Анги &amp; хичээл тохируулах&quot; хэсгээр хичээл холбогдохыг шийднэ үү.
          </p>
        </div>
      )}
    </div>
  );
}
