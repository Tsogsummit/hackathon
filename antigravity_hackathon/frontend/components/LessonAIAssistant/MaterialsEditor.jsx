import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TABS = [
  { id: "summary", label: "Товчлол" },
  { id: "homework", label: "Гэрийн даалгавар" },
  { id: "exercises", label: "Дасгал" },
  { id: "exam", label: "Шалгалт" },
  { id: "next", label: "Дараагийн хичээл" },
];

export default function MaterialsEditor({ value, onChange }) {
  const [tab, setTab] = useState("summary");

  const m = value || {};

  const update = (patch) => {
    onChange({ ...m, ...patch });
  };

  const homework = m.homework || { description: "", tasks: [] };
  const nextPlan = m.next_lesson_plan || {
    suggested_topic: "",
    learning_objectives: [],
    recommended_activities: [],
  };

  const quillModules = useMemo(() => ({ toolbar: [[{ header: [1, 2, false] }], ["bold", "italic"], ["clean"]] }), []);

  return (
    <div>
      <p style={{ margin: "0 0 14px", fontSize: "0.86rem", color: "var(--es-muted)", lineHeight: 1.5 }}>
        AI-ийн үр дүнг доорх табаар засварлана. Хадгалах товчийг доорх алхмын товчнуудаас дарна.
      </p>
      <div className="es-material-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`es-material-tab ${tab === t.id ? "is-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div className="es-quill-wrap">
          <ReactQuill theme="snow" value={m.summary || ""} onChange={(html) => update({ summary: html })} modules={quillModules} />
        </div>
      )}

      {tab === "homework" && (
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label className="es-label">Тайлбар</label>
            <textarea
              className="es-input"
              value={homework.description || ""}
              onChange={(e) => update({ homework: { ...homework, description: e.target.value } })}
              rows={4}
              style={{ width: "100%", minHeight: 100, resize: "vertical" }}
            />
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--es-text)" }}>Даалгаврууд</div>
          {(homework.tasks || []).map((task, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className="es-input"
                value={task}
                onChange={(e) => {
                  const tasks = [...(homework.tasks || [])];
                  tasks[i] = e.target.value;
                  update({ homework: { ...homework, tasks } });
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="es-btn es-btn-secondary"
                style={{ padding: "8px 12px" }}
                onClick={() => {
                  const tasks = (homework.tasks || []).filter((_, j) => j !== i);
                  update({ homework: { ...homework, tasks } });
                }}
              >
                Устгах
              </button>
            </div>
          ))}
          <button type="button" className="es-btn es-btn-secondary" onClick={() => update({ homework: { ...homework, tasks: [...(homework.tasks || []), ""] } })}>
            Мөр нэмэх
          </button>
        </div>
      )}

      {tab === "exercises" && (
        <div style={{ display: "grid", gap: 12 }}>
          {(m.exercises || []).map((ex, i) => (
            <div key={i} style={{ border: "1px solid var(--es-border)", borderRadius: "var(--radius-sm)", padding: 14, background: "var(--es-card-bg)" }}>
              <label className="es-label">Асуулт {i + 1}</label>
              <input
                className="es-input"
                value={ex.question || ""}
                onChange={(e) => {
                  const exercises = [...(m.exercises || [])];
                  exercises[i] = { ...ex, question: e.target.value };
                  update({ exercises });
                }}
                style={{ width: "100%", marginBottom: 10 }}
              />
              <label className="es-label" style={{ marginTop: 4 }}>
                Төрөл
              </label>
              <select
                className="es-select"
                value={ex.type || "open_ended"}
                onChange={(e) => {
                  const exercises = [...(m.exercises || [])];
                  exercises[i] = { ...ex, type: e.target.value };
                  update({ exercises });
                }}
                style={{ marginBottom: 8 }}
              >
                  <option value="multiple_choice">Олон сонголт</option>
                  <option value="open_ended">Нээлттэй</option>
                  <option value="calculation">Тооцоо</option>
                </select>
              {ex.type === "multiple_choice" && (
                <div style={{ marginTop: 8 }}>
                  {(ex.options || ["", "", "", ""]).map((op, j) => (
                    <input
                      key={j}
                      className="es-input"
                      value={op}
                      placeholder={`Сонголт ${j + 1}`}
                      onChange={(e) => {
                        const exercises = [...(m.exercises || [])];
                        const opts = [...(ex.options || ["", "", "", ""])];
                        opts[j] = e.target.value;
                        exercises[i] = { ...ex, options: opts };
                        update({ exercises });
                      }}
                      style={{ width: "100%", marginBottom: 6 }}
                    />
                  ))}
                </div>
              )}
              <label className="es-label">Хариулт</label>
              <input
                className="es-input"
                value={ex.answer || ""}
                onChange={(e) => {
                  const exercises = [...(m.exercises || [])];
                  exercises[i] = { ...ex, answer: e.target.value };
                  update({ exercises });
                }}
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>
      )}

      {tab === "exam" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--es-accent-soft)" }}>
                <th style={{ padding: 8, border: "1px solid var(--es-border)" }}>#</th>
                <th style={{ padding: 8, border: "1px solid var(--es-border)" }}>Асуулт</th>
                <th style={{ padding: 8, border: "1px solid var(--es-border)" }}>Төрөл</th>
                <th style={{ padding: 8, border: "1px solid var(--es-border)" }}>Хэцүү байдал</th>
                <th style={{ padding: 8, border: "1px solid var(--es-border)" }}>Хариулт</th>
              </tr>
            </thead>
            <tbody>
              {(m.exam_questions || []).map((q, i) => (
                <tr key={i}>
                  <td style={{ padding: 8, border: "1px solid var(--es-border)" }}>{i + 1}</td>
                  <td style={{ padding: 8, border: "1px solid var(--es-border)" }}>
                    <textarea
                      className="es-input"
                      value={q.question || ""}
                      onChange={(e) => {
                        const exam_questions = [...(m.exam_questions || [])];
                        exam_questions[i] = { ...q, question: e.target.value };
                        update({ exam_questions });
                      }}
                      rows={2}
                      style={{ width: "min(100%, 260px)", minHeight: 64, resize: "vertical" }}
                    />
                  </td>
                  <td style={{ padding: 8, border: "1px solid var(--es-border)" }}>
                    <select
                      className="es-select"
                      value={q.type || "open_ended"}
                      onChange={(e) => {
                        const exam_questions = [...(m.exam_questions || [])];
                        exam_questions[i] = { ...q, type: e.target.value };
                        update({ exam_questions });
                      }}
                    >
                      <option value="multiple_choice">Олон сонголт</option>
                      <option value="open_ended">Нээлттэй</option>
                    </select>
                  </td>
                  <td style={{ padding: 8, border: "1px solid var(--es-border)" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background:
                          q.difficulty === "hard"
                            ? "color-mix(in srgb, var(--es-danger) 22%, transparent)"
                            : q.difficulty === "easy"
                              ? "color-mix(in srgb, var(--es-success) 22%, transparent)"
                              : "color-mix(in srgb, var(--es-warning) 28%, transparent)",
                        color: "var(--es-text)",
                      }}
                    >
                      {q.difficulty === "hard" ? "Хэцүү" : q.difficulty === "easy" ? "Хялбар" : "Дунд"}
                    </span>
                  </td>
                  <td style={{ padding: 8, border: "1px solid var(--es-border)" }}>
                    <input
                      className="es-input"
                      value={q.answer || ""}
                      onChange={(e) => {
                        const exam_questions = [...(m.exam_questions || [])];
                        exam_questions[i] = { ...q, answer: e.target.value };
                        update({ exam_questions });
                      }}
                      style={{ width: "min(100%, 180px)" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "next" && (
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label className="es-label">Санал болгох сэдэв</label>
            <input
              className="es-input"
              value={nextPlan.suggested_topic || ""}
              onChange={(e) =>
                update({
                  next_lesson_plan: { ...nextPlan, suggested_topic: e.target.value },
                })
              }
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--es-text)" }}>Зорилго</div>
          {(nextPlan.learning_objectives || []).map((o, i) => (
            <input
              key={i}
              className="es-input"
              value={o}
              onChange={(e) => {
                const learning_objectives = [...(nextPlan.learning_objectives || [])];
                learning_objectives[i] = e.target.value;
                update({ next_lesson_plan: { ...nextPlan, learning_objectives } });
              }}
              style={{ width: "100%" }}
            />
          ))}
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--es-text)" }}>Үйл ажиллагаа</div>
          {(nextPlan.recommended_activities || []).map((o, i) => (
            <input
              key={i}
              className="es-input"
              value={o}
              onChange={(e) => {
                const recommended_activities = [...(nextPlan.recommended_activities || [])];
                recommended_activities[i] = e.target.value;
                update({ next_lesson_plan: { ...nextPlan, recommended_activities } });
              }}
              style={{ width: "100%" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
