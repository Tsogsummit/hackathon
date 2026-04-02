import { useState } from "react";
import AudioRecorder from "./AudioRecorder.jsx";

const SUBJECTS = [
  { v: "математик", l: "Математик" },
  { v: "шинжлэх ухаан", l: "Шинжлэх ухаан" },
  { v: "монгол хэл", l: "Монгол хэл" },
  { v: "түүх", l: "Түүх" },
  { v: "англи хэл", l: "Англи хэл" },
  { v: "бусад", l: "Бусад" },
];

export default function Step1AudioInput({
  tab,
  setTab,
  file,
  setFile,
  metadataOpen,
  setMetadataOpen,
  date,
  setDate,
  subject,
  setSubject,
  grade,
  setGrade,
  topic,
  setTopic,
  onSubmitBlob,
  onSubmitFile,
  disabled,
}) {
  const [drag, setDrag] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <p style={{ margin: "0 0 16px", fontSize: "0.88rem", color: "var(--es-muted)", lineHeight: 1.55 }}>
        <strong style={{ color: "var(--es-text)" }}>1.</strong> Доорх хоёр сонголтын аль нэгээр аудио бэлтгэнэ.{" "}
        <strong style={{ color: "var(--es-text)" }}>2.</strong> Файл сонгосон бол &quot;Илгээж текст болгох&quot; дарна.
      </p>

      <div className="es-ai-choice-row">
        <button
          type="button"
          onClick={() => setTab("record")}
          className={`es-ai-choice-btn ${tab === "record" ? "is-active" : ""}`}
        >
          Микрофоноор бичих
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`es-ai-choice-btn ${tab === "upload" ? "is-active" : ""}`}
        >
          Файл оруулах
        </button>
      </div>

      {tab === "record" ? (
        <div
          style={{
            padding: "1rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--es-border)",
            background: "var(--es-surface-soft)",
          }}
        >
          <AudioRecorder disabled={disabled} onRecordingComplete={(blob) => onSubmitBlob(blob)} />
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`es-ai-dropzone ${drag ? "is-drag" : ""}`}
        >
          <div style={{ fontWeight: 700, color: "var(--es-text)", marginBottom: 8 }}>Аудио файлыг энд чирж тавина уу</div>
          <p style={{ color: "var(--es-muted)", fontSize: "0.88rem", margin: "0 0 12px", lineHeight: 1.5 }}>
            WAV, MP3, M4A, OGG, WEBM — хамгийн ихдээ ойролцоогоор 50MB
          </p>
          <input
            type="file"
            accept=".wav,.mp3,.m4a,.ogg,.webm,audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ fontSize: "0.85rem" }}
          />
          {file && (
            <p style={{ marginTop: 12, marginBottom: 0, fontWeight: 600, color: "var(--es-primary)" }}>
              Сонгогдсон: {file.name}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setMetadataOpen(!metadataOpen)}
        className="es-btn es-btn-secondary"
        style={{ width: "100%", marginTop: 20, justifyContent: "center" }}
      >
        {metadataOpen ? "▼" : "▶"} Нэмэлт мэдээлэл (сонголттой — илүү нарийвчилсан материал)
      </button>

      {metadataOpen && (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gap: 14,
            padding: "1rem 1.1rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--es-border)",
            background: "var(--es-card-bg)",
          }}
        >
          <div>
            <label className="es-label" htmlFor="ai-meta-date">
              Өдөр
            </label>
            <input
              id="ai-meta-date"
              type="date"
              className="es-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="es-label" htmlFor="ai-meta-subject">
              Хичээлийн төрөл
            </label>
            <select
              id="ai-meta-subject"
              className="es-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">— Сонгохгүй —</option>
              {SUBJECTS.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="es-label" htmlFor="ai-meta-grade">
              Анги (1–12)
            </label>
            <select id="ai-meta-grade" className="es-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">— Сонгохгүй —</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={String(g)}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="es-label" htmlFor="ai-meta-topic">
              Сэдэв
            </label>
            <input
              id="ai-meta-topic"
              className="es-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Жишээ: Квадрат тэгшитгэл"
            />
          </div>
        </div>
      )}

      {tab === "upload" && (
        <button
          type="button"
          disabled={disabled || !file}
          className="es-btn es-btn-primary"
          style={{ width: "100%", marginTop: 24, padding: "14px 18px" }}
          onClick={() => file && onSubmitFile(file)}
        >
          Илгээж текст болгох
        </button>
      )}
    </div>
  );
}
