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
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setTab("record")}
          style={{
            flex: 1,
            padding: 12,
            border: tab === "record" ? "2px solid #1565c0" : "1px solid #ccc",
            borderRadius: 8,
            background: tab === "record" ? "#e3f2fd" : "#fff",
            cursor: "pointer",
          }}
        >
          Бичлэг хийх
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          style={{
            flex: 1,
            padding: 12,
            border: tab === "upload" ? "2px solid #1565c0" : "1px solid #ccc",
            borderRadius: 8,
            background: tab === "upload" ? "#e3f2fd" : "#fff",
            cursor: "pointer",
          }}
        >
          Файл оруулах
        </button>
      </div>

      {tab === "record" ? (
        <AudioRecorder
          disabled={disabled}
          onRecordingComplete={(blob) => onSubmitBlob(blob)}
        />
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${drag ? "#1565c0" : "#bbb"}`,
            borderRadius: 12,
            padding: 32,
            textAlign: "center",
            background: drag ? "#e3f2fd" : "#fafafa",
          }}
        >
          <p>Файл чирж тавина уу</p>
          <p style={{ color: "#666", fontSize: 14 }}>WAV, MP3, M4A, OGG, WEBM — хамгийн ихдээ 50MB</p>
          <input
            type="file"
            accept=".wav,.mp3,.m4a,.ogg,.webm,audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ marginTop: 12 }}
          />
          {file && <p style={{ marginTop: 8 }}>Сонгогдсон: {file.name}</p>}
        </div>
      )}

      <button
        type="button"
        onClick={() => setMetadataOpen(!metadataOpen)}
        style={{ marginTop: 20, width: "100%", padding: 10, background: "#eceff1", border: "none", borderRadius: 8 }}
      >
        {metadataOpen ? "▼" : "▶"} Нэмэлт мэдээлэл (сонголттой)
      </button>
      {metadataOpen && (
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <label>
            Өдөр
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", marginTop: 4, padding: 8 }}
            />
          </label>
          <label>
            Хичээлийн төрөл
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: "100%", marginTop: 4, padding: 8 }}
            >
              <option value="">—</option>
              {SUBJECTS.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
          </label>
          <label>
            Анги (1–12)
            <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: "100%", marginTop: 4, padding: 8 }}>
              <option value="">—</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={String(g)}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label>
            Сэдэв
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ width: "100%", marginTop: 4, padding: 8 }}
              placeholder="Жишээ: Квадрат тэгшитгэл"
            />
          </label>
        </div>
      )}

      {tab === "upload" && (
        <button
          type="button"
          disabled={disabled || !file}
          onClick={() => file && onSubmitFile(file)}
          style={{
            marginTop: 24,
            width: "100%",
            padding: 14,
            background: "#1565c0",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            cursor: disabled || !file ? "not-allowed" : "pointer",
          }}
        >
          Илгээж текст болгох
        </button>
      )}
    </div>
  );
}
