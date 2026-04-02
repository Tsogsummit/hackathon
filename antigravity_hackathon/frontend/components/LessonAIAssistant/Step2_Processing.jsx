const STEPS = [
  { n: 1, label: "Аудио байршуулж байна..." },
  { n: 2, label: "Chimege-ээр текст болгож байна..." },
  { n: 3, label: "Gemini материал үүсгэж байна..." },
];

export default function Step2Processing({ activeStep, transcriptPreview, error, onCancel }) {
  const pct = ((activeStep - 1) / 3) * 100 + 10;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div
        style={{
          height: 12,
          borderRadius: 6,
          background: "var(--es-surface-soft)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, pct)}%`,
            background: "linear-gradient(90deg, var(--es-primary), var(--es-accent))",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <ol style={{ textAlign: "left", paddingLeft: 20, lineHeight: 2 }}>
        {STEPS.map((s) => (
          <li
            key={s.n}
            style={{
              fontWeight: activeStep === s.n ? 700 : 400,
              color: activeStep >= s.n ? "var(--es-primary)" : "var(--es-muted)",
            }}
          >
            Алхам {s.n}/3: {s.label}
          </li>
        ))}
      </ol>
      {transcriptPreview && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "var(--es-card-bg, #fff)",
            borderRadius: 8,
            textAlign: "left",
            maxHeight: 160,
            overflow: "auto",
            fontSize: 14,
            border: "1px solid var(--es-border)",
            color: "var(--es-text)",
          }}
        >
          <strong>Текст (урьдчилан харах):</strong>
          <p style={{ whiteSpace: "pre-wrap" }}>{transcriptPreview}</p>
        </div>
      )}
      {error && <p style={{ color: "var(--es-danger)", marginTop: 16 }}>{error}</p>}
      <button
        type="button"
        onClick={onCancel}
        style={{ marginTop: 24, padding: "10px 24px", borderRadius: 8, border: "1px solid var(--es-border)", background: "var(--es-card-bg, #fff)", color: "var(--es-text)", cursor: "pointer" }}
      >
        Цуцлах
      </button>
    </div>
  );
}
