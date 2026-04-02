import { useState } from "react";
import MaterialsEditor from "./MaterialsEditor.jsx";

export default function Step3ReviewEdit({
  materials,
  setMaterials,
  transcriptText,
  onApproveSave,
  onRegenerate,
  onNext,
  saving,
  busy,
}) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <MaterialsEditor value={materials} onChange={setMaterials} />

      <div
        style={{
          marginTop: 24,
          padding: "1rem 1.1rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--es-border)",
          background: "var(--es-surface-soft)",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
        }}
      >
        <button type="button" disabled={saving} className="es-btn es-btn-primary" onClick={onApproveSave}>
          {saving ? "Хадгалж байна…" : "Баталгаажуулж хадгалах"}
        </button>
        <button type="button" disabled={busy} className="es-btn es-btn-secondary" onClick={onRegenerate}>
          {busy ? "Түр хүлээнэ үү…" : "Дахин үүсгэх"}
        </button>
        <button type="button" className="es-btn es-btn-primary" onClick={onNext} style={{ marginLeft: "auto" }}>
          Сурагчдад илгээх →
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowRaw(!showRaw)}
        className="es-btn es-btn-ghost"
        style={{ width: "100%", marginTop: 14, justifyContent: "center" }}
      >
        {showRaw ? "▼" : "▶"} Явцын бүрэн текст (STT)
      </button>
      {showRaw && (
        <pre
          style={{
            marginTop: 10,
            padding: 14,
            background: "var(--es-card-bg)",
            color: "var(--es-text)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--es-border)",
            maxHeight: 220,
            overflow: "auto",
            fontSize: "0.82rem",
            whiteSpace: "pre-wrap",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {transcriptText || "—"}
        </pre>
      )}
    </div>
  );
}
