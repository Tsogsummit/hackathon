import { useState } from "react";

export default function Step4Distribute({
  materials,
  classId,
  setClassId,
  notifyParents,
  setNotifyParents,
  onSend,
  sent,
  busy,
}) {
  const [pulse, setPulse] = useState(false);

  const handleSend = async () => {
    await onSend();
    setPulse(true);
    setTimeout(() => setPulse(false), 2000);
  };

  const summaryPlain = (materials?.summary || "").replace(/<[^>]+>/g, "").slice(0, 220);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h3 className="es-section-title" style={{ marginTop: 0, marginBottom: 12 }}>
        Илгээхийн өмнөх тойм
      </h3>
      <div
        style={{
          textAlign: "left",
          background: "var(--es-card-bg)",
          padding: "1rem 1.15rem",
          borderRadius: "var(--radius-sm)",
          marginBottom: 20,
          border: "1px solid var(--es-border)",
          fontSize: "0.9rem",
          lineHeight: 1.55,
          color: "var(--es-text)",
        }}
      >
        <p style={{ margin: "0 0 10px" }}>
          <span style={{ color: "var(--es-muted)", fontWeight: 600 }}>Товчлол: </span>
          {summaryPlain || "—"}
          {(materials?.summary || "").length > 220 ? "…" : ""}
        </p>
        <p style={{ margin: "0 0 6px" }}>
          <span style={{ color: "var(--es-muted)", fontWeight: 600 }}>Дасгал: </span>
          {(materials?.exercises || []).length} даалгавар
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ color: "var(--es-muted)", fontWeight: 600 }}>Шалгалтын асуулт: </span>
          {(materials?.exam_questions || []).length}
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="es-label" htmlFor="ai-dist-class-id">
          Ангийн ID (сонголттой)
        </label>
        <p style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "var(--es-muted)" }}>
          Хоосон үлдээвэл одоогийн хичээлийн ангид холбогдоно. Олон ангид зэрэг илгээх бол ID оруулна.
        </p>
        <input
          id="ai-dist-class-id"
          type="number"
          className="es-input"
          value={classId ?? ""}
          onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : null)}
          placeholder="Жишээ: 1"
        />
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 22,
          cursor: "pointer",
          fontSize: "0.92rem",
          color: "var(--es-text)",
        }}
      >
        <input type="checkbox" checked={notifyParents} onChange={(e) => setNotifyParents(e.target.checked)} />
        Эцэг эхэд мэдэгдэл илгээх
      </label>

      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          disabled={busy}
          className="es-btn es-btn-primary"
          onClick={handleSend}
          style={{
            padding: "14px 28px",
            fontSize: "1.02rem",
            transform: pulse ? "scale(1.03)" : "none",
            transition: "transform 0.25s ease",
          }}
        >
          {busy ? "Илгээж байна…" : "Сурагчдад илгээх"}
        </button>
        {sent && (
          <p className="es-alert es-alert-success" style={{ marginTop: 20, textAlign: "center" }}>
            Амжилттай илгээгдлээ. Сурагчийн хэсэгт материал харагдана.
          </p>
        )}
      </div>
    </div>
  );
}
