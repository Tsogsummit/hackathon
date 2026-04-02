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

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <h3 style={{ marginTop: 0 }}>Илгээхийн өмнөх тойм</h3>
      <div style={{ textAlign: "left", background: "#fff", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <p>
          <strong>Товчлол:</strong> {(materials?.summary || "").replace(/<[^>]+>/g, "").slice(0, 200)}…
        </p>
        <p>
          <strong>Дасгал:</strong> {(materials?.exercises || []).length} даалгавар
        </p>
        <p>
          <strong>Шалгалт:</strong> {(materials?.exam_questions || []).length} асуулт
        </p>
      </div>
      <label style={{ display: "block", marginBottom: 12, textAlign: "left" }}>
        Ангийн ID (олон ангитай бол)
        <input
          type="number"
          value={classId ?? ""}
          onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : null)}
          placeholder="Хоосон — хичээлийн анги"
          style={{ width: "100%", marginTop: 4, padding: 8 }}
        />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" checked={notifyParents} onChange={(e) => setNotifyParents(e.target.checked)} />
        Эцэг эхэд мэдэгдэл илгээх
      </label>
      <button
        type="button"
        disabled={busy}
        onClick={handleSend}
        style={{
          padding: "16px 32px",
          fontSize: 18,
          fontWeight: 700,
          background: "#1565c0",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: busy ? "wait" : "pointer",
          transform: pulse ? "scale(1.05)" : "none",
          transition: "transform 0.3s ease",
        }}
      >
        Сурагчдад илгээх
      </button>
      {sent && (
        <p style={{ marginTop: 24, color: "#2e7d32", fontWeight: 700, fontSize: 18 }}>
          ✓ Амжилттай илгээгдлээ
        </p>
      )}
    </div>
  );
}
