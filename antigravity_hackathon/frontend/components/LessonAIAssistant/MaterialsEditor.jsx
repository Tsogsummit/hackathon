import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TABS = [
  { id: "summary", icon: "📄", label: "Товчлол" },
  { id: "homework", icon: "📝", label: "Гэрийн даалгавар" },
  { id: "exercises", icon: "🧩", label: "Дасгал" },
  { id: "exam", icon: "📋", label: "Шалгалтын асуулт" },
  { id: "next", icon: "📅", label: "Дараагийн хичээл" },
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: tab === t.id ? "2px solid #1565c0" : "1px solid #ccc",
              background: tab === t.id ? "#e3f2fd" : "#fff",
              cursor: "pointer",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div style={{ background: "#fff", borderRadius: 8 }}>
          <ReactQuill theme="snow" value={m.summary || ""} onChange={(html) => update({ summary: html })} modules={quillModules} />
        </div>
      )}

      {tab === "homework" && (
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            Тайлбар
            <textarea
              value={homework.description || ""}
              onChange={(e) => update({ homework: { ...homework, description: e.target.value } })}
              rows={3}
              style={{ width: "100%", marginTop: 4, padding: 8 }}
            />
          </label>
          <p style={{ fontWeight: 600 }}>Даалгаврууд</p>
          {(homework.tasks || []).map((task, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <input
                value={task}
                onChange={(e) => {
                  const tasks = [...(homework.tasks || [])];
                  tasks[i] = e.target.value;
                  update({ homework: { ...homework, tasks } });
                }}
                style={{ flex: 1, padding: 8 }}
              />
              <button
                type="button"
                onClick={() => {
                  const tasks = (homework.tasks || []).filter((_, j) => j !== i);
                  update({ homework: { ...homework, tasks } });
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update({ homework: { ...homework, tasks: [...(homework.tasks || []), ""] } })
            }
          >
            Мөр нэмэх
          </button>
        </div>
      )}

      {tab === "exercises" && (
        <div style={{ display: "grid", gap: 12 }}>
          {(m.exercises || []).map((ex, i) => (
            <div key={i} style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 12, background: "#fff" }}>
              <label>
                Асуулт {i + 1}
                <input
                  value={ex.question || ""}
                  onChange={(e) => {
                    const exercises = [...(m.exercises || [])];
                    exercises[i] = { ...ex, question: e.target.value };
                    update({ exercises });
                  }}
                  style={{ width: "100%", marginTop: 4, padding: 8 }}
                />
              </label>
              <label style={{ display: "block", marginTop: 8 }}>
                Төрөл
                <select
                  value={ex.type || "open_ended"}
                  onChange={(e) => {
                    const exercises = [...(m.exercises || [])];
                    exercises[i] = { ...ex, type: e.target.value };
                    update({ exercises });
                  }}
                  style={{ marginLeft: 8 }}
                >
                  <option value="multiple_choice">Олон сонголт</option>
                  <option value="open_ended">Нээлттэй</option>
                  <option value="calculation">Тооцоо</option>
                </select>
              </label>
              {ex.type === "multiple_choice" && (
                <div style={{ marginTop: 8 }}>
                  {(ex.options || ["", "", "", ""]).map((op, j) => (
                    <input
                      key={j}
                      value={op}
                      placeholder={`Сонголт ${j + 1}`}
                      onChange={(e) => {
                        const exercises = [...(m.exercises || [])];
                        const opts = [...(ex.options || ["", "", "", ""])];
                        opts[j] = e.target.value;
                        exercises[i] = { ...ex, options: opts };
                        update({ exercises });
                      }}
                      style={{ width: "100%", marginBottom: 4, padding: 6 }}
                    />
                  ))}
                </div>
              )}
              <label style={{ display: "block", marginTop: 8 }}>
                Хариулт
                <input
                  value={ex.answer || ""}
                  onChange={(e) => {
                    const exercises = [...(m.exercises || [])];
                    exercises[i] = { ...ex, answer: e.target.value };
                    update({ exercises });
                  }}
                  style={{ width: "100%", marginTop: 4, padding: 8 }}
                />
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === "exam" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#e3f2fd" }}>
                <th style={{ padding: 8, border: "1px solid #ccc" }}>#</th>
                <th style={{ padding: 8, border: "1px solid #ccc" }}>Асуулт</th>
                <th style={{ padding: 8, border: "1px solid #ccc" }}>Төрөл</th>
                <th style={{ padding: 8, border: "1px solid #ccc" }}>Хэцүү байдал</th>
                <th style={{ padding: 8, border: "1px solid #ccc" }}>Хариулт</th>
              </tr>
            </thead>
            <tbody>
              {(m.exam_questions || []).map((q, i) => (
                <tr key={i}>
                  <td style={{ padding: 8, border: "1px solid #ccc" }}>{i + 1}</td>
                  <td style={{ padding: 8, border: "1px solid #ccc" }}>
                    <textarea
                      value={q.question || ""}
                      onChange={(e) => {
                        const exam_questions = [...(m.exam_questions || [])];
                        exam_questions[i] = { ...q, question: e.target.value };
                        update({ exam_questions });
                      }}
                      rows={2}
                      style={{ width: 220 }}
                    />
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ccc" }}>
                    <select
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
                  <td style={{ padding: 8, border: "1px solid #ccc" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          q.difficulty === "hard" ? "#ffccbc" : q.difficulty === "easy" ? "#c8e6c9" : "#fff9c4",
                      }}
                    >
                      {q.difficulty || "medium"}
                    </span>
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ccc" }}>
                    <input
                      value={q.answer || ""}
                      onChange={(e) => {
                        const exam_questions = [...(m.exam_questions || [])];
                        exam_questions[i] = { ...q, answer: e.target.value };
                        update({ exam_questions });
                      }}
                      style={{ width: 160 }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "next" && (
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            Санал болгох сэдэв
            <input
              value={nextPlan.suggested_topic || ""}
              onChange={(e) =>
                update({
                  next_lesson_plan: { ...nextPlan, suggested_topic: e.target.value },
                })
              }
              style={{ width: "100%", marginTop: 4, padding: 8 }}
            />
          </label>
          <p style={{ fontWeight: 600 }}>Зорилго</p>
          {(nextPlan.learning_objectives || []).map((o, i) => (
            <input
              key={i}
              value={o}
              onChange={(e) => {
                const learning_objectives = [...(nextPlan.learning_objectives || [])];
                learning_objectives[i] = e.target.value;
                update({ next_lesson_plan: { ...nextPlan, learning_objectives } });
              }}
              style={{ padding: 8 }}
            />
          ))}
          <p style={{ fontWeight: 600 }}>Үйл ажиллагаа</p>
          {(nextPlan.recommended_activities || []).map((o, i) => (
            <input
              key={i}
              value={o}
              onChange={(e) => {
                const recommended_activities = [...(nextPlan.recommended_activities || [])];
                recommended_activities[i] = e.target.value;
                update({ next_lesson_plan: { ...nextPlan, recommended_activities } });
              }}
              style={{ padding: 8 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
