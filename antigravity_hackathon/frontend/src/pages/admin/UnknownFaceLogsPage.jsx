import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

import { apiFetch } from "../../api/client.js";
import { useAuthStore } from "../../store/authStore.js";

const STATUSES = ["open", "reviewed", "ignored"];
const MODEL_BASE = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

function confidenceFromDistance(distance, threshold) {
  if (distance <= threshold * 0.85) return { label: "high", color: "var(--es-success)" };
  if (distance <= threshold) return { label: "medium", color: "var(--es-warning)" };
  return { label: "low", color: "var(--es-danger)" };
}

export default function UnknownFaceLogsPage() {
  const token = useAuthStore((s) => s.token);
  const [rows, setRows] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [modelReady, setModelReady] = useState(false);
  const [suggestingId, setSuggestingId] = useState(null);
  const [suggestThreshold, setSuggestThreshold] = useState(0.48);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const out = await apiFetch("/admin/unknown-face-logs", { token });
      setRows(out);
    } catch (e) {
      setErr(e?.message || "Unknown face log ачаалж чадсангүй");
    } finally {
      setLoading(false);
    }
  }

  async function loadProfiles() {
    try {
      const out = await apiFetch("/admin/student-face-profiles", { token });
      setProfiles(out);
    } catch {
      // silent optional
    }
  }

  async function ensureModels() {
    if (modelReady) return;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_BASE),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_BASE),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_BASE),
    ]);
    setModelReady(true);
  }

  async function descriptorFromUrlWithToken(url) {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) return null;
    const blob = await resp.blob();
    const objUrl = URL.createObjectURL(blob);
    const img = await faceapi.fetchImage(objUrl);
    const d = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    URL.revokeObjectURL(objUrl);
    return d?.descriptor || null;
  }

  async function suggestForRow(r) {
    setSuggestingId(r.id);
    setErr("");
    try {
      await ensureModels();
      const unknownDescriptor = await descriptorFromUrlWithToken(`${r.image_url}?access_token=${encodeURIComponent(token)}`);
      if (!unknownDescriptor) {
        setErr("Unknown зурагнаас descriptor гаргаж чадсангүй.");
        return;
      }
      const candidates = profiles.filter((p) => p.class_ids?.includes(r.class_id));
      const scored = [];
      for (const c of candidates) {
        const d = await descriptorFromUrlWithToken(`${c.image_url}?access_token=${encodeURIComponent(token)}`);
        if (!d) continue;
        const distance = faceapi.euclideanDistance(unknownDescriptor, d);
        scored.push({ ...c, distance });
      }
      scored.sort((a, b) => a.distance - b.distance);
      setSuggestions((prev) => ({ ...prev, [r.id]: scored.slice(0, 3) }));
    } catch (e) {
      setErr(e?.message || "Suggestion тооцоолох үед алдаа гарлаа");
    } finally {
      setSuggestingId(null);
    }
  }

  useEffect(() => {
    load();
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function patchRow(r, patch) {
    setErr("");
    try {
      const out = await apiFetch(`/admin/unknown-face-logs/${r.id}`, {
        method: "PATCH",
        token,
        body: patch,
      });
      setRows((prev) => prev.map((x) => (x.id === r.id ? out : x)));
    } catch (e) {
      setErr(e?.message || "Шинэчилж чадсангүй");
    }
  }

  async function applySuggestion(r, s, confidenceLabel) {
    const yes = window.confirm(
      `Энэ unknown нүүрийг ${s.student_name} (#${s.student_id}) сурагчтай холбож,\n` +
        `тухайн хичээлийн ирцэд present болгох уу?`,
    );
    if (!yes) return;
    const autoNote =
      `Auto-suggested student: ${s.student_name} (#${s.student_id}), ` +
      `distance=${s.distance.toFixed(3)}, confidence=${confidenceLabel}, threshold=${suggestThreshold.toFixed(2)}`;
    setErr("");
    try {
      const out = await apiFetch(`/admin/unknown-face-logs/${r.id}/apply-to-attendance`, {
        method: "POST",
        token,
        body: { student_id: s.student_id },
      });
      setRows((prev) => prev.map((x) => (x.id === r.id ? out.updated_log : x)));
    } catch (e) {
      // fallback to note-only patch
      await patchRow(r, { status: "reviewed", note: autoNote });
      setErr(e?.message || "Ирцтэй холбож чадсангүй, зөвхөн log шинэчлэгдлээ.");
    }
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Unknown нүүрний лог</h1>
      <p className="es-page-desc">Камер таньж чадаагүй нүүрнүүдийг багшийн хичээлээр review хийх хэсэг.</p>
      {err && <p className="es-alert es-alert-danger">{err}</p>}

      <div className="es-section">
        <div className="es-toolbar">
          <button type="button" className="es-btn es-btn-secondary" onClick={load} disabled={loading}>
            {loading ? "Шинэчилж байна..." : "Дахин ачаалах"}
          </button>
          <span className="es-pill">Нийт: {rows.length}</span>
          <div style={{ minWidth: 260 }}>
            <label className="es-label">Suggestion threshold: {suggestThreshold.toFixed(2)}</label>
            <input
              type="range"
              min="0.35"
              max="0.65"
              step="0.01"
              value={suggestThreshold}
              onChange={(e) => setSuggestThreshold(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <div className="es-section">
        {rows.length === 0 ? (
          <p className="es-empty">Одоогоор unknown log байхгүй.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {rows.map((r) => (
              <div key={r.id} style={{ border: "1px solid var(--es-border)", borderRadius: 12, padding: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12 }}>
                  <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--es-border)" }}>
                    <img src={`${r.image_url}?access_token=${encodeURIComponent(token)}`} alt={`unknown-${r.id}`} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div>
                      <strong>#{r.id}</strong> • Class: {r.class_name} • Teacher: {r.teacher_name}
                    </div>
                    <div style={{ color: "var(--es-muted)", fontSize: "0.88rem" }}>
                      Lesson #{r.lesson_id} • detected: {r.detected_at || "-"} • created: {r.created_at || "-"}
                    </div>
                    <div className="es-toolbar">
                      <select className="es-select" value={r.status} onChange={(e) => patchRow(r, { status: e.target.value })} style={{ maxWidth: 160 }}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <input
                        className="es-input"
                        placeholder="Note"
                        defaultValue={r.note || ""}
                        onBlur={(e) => patchRow(r, { note: e.target.value })}
                      />
                      <button type="button" className="es-btn es-btn-secondary" onClick={() => suggestForRow(r)} disabled={suggestingId === r.id}>
                        {suggestingId === r.id ? "Тооцоолж байна..." : "Possible сурагч олох"}
                      </button>
                    </div>
                    {Array.isArray(suggestions[r.id]) && suggestions[r.id].length > 0 && (
                      <div style={{ display: "grid", gap: 6 }}>
                        <strong style={{ fontSize: "0.88rem" }}>Top-3 possible сурагч</strong>
                        {suggestions[r.id].map((s) => {
                          const c = confidenceFromDistance(s.distance, suggestThreshold);
                          return (
                            <div key={`${r.id}-${s.student_id}`} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                              <span className="es-pill">{s.student_name} (#{s.student_id})</span>
                              <span className="es-pill">distance {s.distance.toFixed(3)}</span>
                              <span className="es-pill" style={{ borderColor: c.color, color: c.color }}>
                                confidence: {c.label}
                              </span>
                              {c.label === "high" && (
                                <button
                                  type="button"
                                  className="es-btn es-btn-primary"
                                  style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                                  onClick={() => applySuggestion(r, s, c.label)}
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
