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
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <MaterialsEditor value={materials} onChange={setMaterials} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
        <button
          type="button"
          disabled={saving}
          onClick={onApproveSave}
          style={{
            padding: "14px 28px",
            background: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            cursor: saving ? "wait" : "pointer",
          }}
        >
          Баталгаажуулж хадгалах
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onRegenerate}
          style={{ padding: "14px 20px", borderRadius: 8, border: "1px solid #1565c0", background: "#fff" }}
        >
          Дахин үүсгэх
        </button>
        <button type="button" onClick={onNext} style={{ padding: "14px 20px", borderRadius: 8, background: "#1565c0", color: "#fff", border: "none" }}>
          Сурагчдад илгээх алхам руу
        </button>
      </div>
      <button
        type="button"
        onClick={() => setShowRaw(!showRaw)}
        style={{ marginTop: 16, width: "100%", padding: 10, background: "#eceff1", border: "none", borderRadius: 8 }}
      >
        {showRaw ? "▼" : "▶"} Явцын бүрэн текст
      </button>
      {showRaw && (
        <pre
          style={{
            marginTop: 8,
            padding: 12,
            background: "#fff",
            borderRadius: 8,
            maxHeight: 200,
            overflow: "auto",
            fontSize: 13,
            whiteSpace: "pre-wrap",
          }}
        >
          {transcriptText}
        </pre>
      )}
    </div>
  );
}
