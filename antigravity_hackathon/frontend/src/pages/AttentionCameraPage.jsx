import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const MODEL_BASE = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
const UNKNOWN_CAPTURE_INTERVAL_MS = 6000;
const MAX_UNKNOWN_LOG = 12;
const MATCH_THRESHOLD = 0.58;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return "";
  }
}

function toCameraErrorMessage(err) {
  const name = err?.name || "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Камерын зөвшөөрөл өгөөгүй байна. Browser дээр Camera permission-ээ Allow хийнэ үү.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "Камер төхөөрөмж олдсонгүй.";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "Камер өөр апп дээр ашиглагдаж байна. Бусад апп-аас камерыг чөлөөлөөд дахин оролдоно уу.";
  }
  if (name === "OverconstrainedError" || name === "ConstraintNotSatisfiedError") {
    return "Камерын тохиргоо дэмжигдэхгүй байна. Дахин оролдоно уу.";
  }
  return err?.message || "Камер эсвэл нүүр танилт эхлүүлэхэд алдаа гарлаа.";
}

export default function AttentionCameraPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(0);
  const knownDescriptorsRef = useRef([]);
  const unknownCaptureTsRef = useRef(0);
  const faceApiRef = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState("");
  const [roster, setRoster] = useState([]);
  const [faceReady, setFaceReady] = useState(false);
  const [detectedStats, setDetectedStats] = useState({});
  const [unknownCount, setUnknownCount] = useState(0);
  const [unknownLog, setUnknownLog] = useState([]);
  const [liveAttentionScore, setLiveAttentionScore] = useState(0);
  const [liveFaces, setLiveFaces] = useState(0);
  const [markAbsentOthers, setMarkAbsentOthers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingUnknown, setUploadingUnknown] = useState(false);
  const scoreHistoryRef = useRef([]);

  const detectedIds = useMemo(() => Object.keys(detectedStats).map(Number), [detectedStats]);
  const rosterRows = useMemo(
    () =>
      roster.map((r) => {
        const stat = detectedStats[r.student_id];
        return {
          ...r,
          detected: !!stat,
          detect_count: stat?.count || 0,
          last_seen: stat?.lastSeen || null,
          best_distance: stat?.bestDistance ?? null,
        };
      }),
    [roster, detectedStats],
  );
  const attentionMeta = useMemo(() => {
    if (liveAttentionScore >= 75) return { label: "Сайн", cls: "es-risk-low" };
    if (liveAttentionScore >= 45) return { label: "Дунд", cls: "es-risk-medium" };
    return { label: "Сул", cls: "es-risk-high" };
  }, [liveAttentionScore]);

  useEffect(() => {
    if (user?.role !== "teacher") return;
    (async () => {
      try {
        const ls = await apiFetch("/teacher/lessons", { token });
        setLessons(ls);
        if (ls[0]) setLessonId(String(ls[0].id));
      } catch (e) {
        setErr(e?.message || "Хичээл ачаалж чадсангүй");
      }
    })();
  }, [token, user?.role]);

  useEffect(() => {
    if (!lessonId || user?.role !== "teacher") return;
    (async () => {
      try {
        const rows = await apiFetch(`/teacher/lessons/${lessonId}/face-roster`, { token });
        setRoster(rows);
        setDetectedStats({});
        setUnknownCount(0);
        setUnknownLog([]);
      } catch (e) {
        setErr(e?.message || "Face roster ачаалж чадсангүй");
      }
    })();
  }, [lessonId, token, user?.role]);

  const stopCamera = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = 0;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setLiveAttentionScore(0);
    setLiveFaces(0);
    scoreHistoryRef.current = [];
    setPhase("idle");
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  async function ensureFaceApi() {
    if (faceApiRef.current) return faceApiRef.current;
    const mod = await import("face-api.js");
    faceApiRef.current = mod;
    return mod;
  }

  async function loadModels() {
    if (faceReady) return;
    const faceapi = await ensureFaceApi();
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_BASE),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_BASE),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_BASE),
    ]);
    setFaceReady(true);
  }

  async function loadLabeledDescriptors() {
    const faceapi = faceApiRef.current ?? (await ensureFaceApi());
    const valid = roster.filter((r) => r.has_face_profile && r.image_url);
    const descriptors = [];
    for (const r of valid) {
      try {
        const resp = await fetch(r.image_url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) continue;
        const blob = await resp.blob();
        const objUrl = URL.createObjectURL(blob);
        const img = await faceapi.fetchImage(objUrl);
        // Use TinyFaceDetector explicitly (we load only tiny model in this page).
        const dets = await faceapi
          .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.35 }))
          .withFaceLandmarks()
          .withFaceDescriptors();
        URL.revokeObjectURL(objUrl);
        if (dets?.length) {
          const best = dets.sort(
            (a, b) => b.detection.box.width * b.detection.box.height - a.detection.box.width * a.detection.box.height,
          )[0];
          descriptors.push({
            studentId: r.student_id,
            name: r.student_name || `Student #${r.student_id}`,
            descriptor: best.descriptor,
          });
        }
      } catch {
        // skip invalid profile image
      }
    }
    return descriptors;
  }

  function bestMatchFor(descriptor) {
    const faceapi = faceApiRef.current;
    if (!faceapi) return null;
    let best = null;
    for (const item of knownDescriptorsRef.current) {
      const distance = faceapi.euclideanDistance(descriptor, item.descriptor);
      if (!best || distance < best.distance) {
        best = { studentId: item.studentId, distance };
      }
    }
    if (!best || best.distance > MATCH_THRESHOLD) return null;
    return best;
  }

  function captureUnknownShot(video) {
    const now = Date.now();
    if (now - unknownCaptureTsRef.current < UNKNOWN_CAPTURE_INTERVAL_MS) return;
    unknownCaptureTsRef.current = now;
    const c = document.createElement("canvas");
    c.width = video.videoWidth || 640;
    c.height = video.videoHeight || 360;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, c.width, c.height);
    const image = c.toDataURL("image/jpeg", 0.75);
    setUnknownLog((prev) => [{ id: now, at: now, image, uploaded: false, logId: null }, ...prev].slice(0, MAX_UNKNOWN_LOG));
  }

  async function startCamera() {
    if (user?.role !== "teacher") {
      setErr("Энэ хэсгийг зөвхөн багш ашиглана.");
      return;
    }
    setErr("");
    setOk("");
    setPhase("loading");
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Энэ browser камер дэмжихгүй байна.");
      }
      clearInterval(timerRef.current);
      timerRef.current = 0;
      const attempts = [
        { video: { facingMode: { ideal: "user" }, width: { ideal: 960 }, height: { ideal: 540 } }, audio: false },
        { video: { width: { ideal: 960 }, height: { ideal: 540 } }, audio: false },
        { video: true, audio: false },
      ];
      let stream = null;
      let lastErr = null;
      for (const constraints of attempts) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (e) {
          lastErr = e;
        }
      }
      if (!stream) throw lastErr || new Error("Камер нээж чадсангүй.");
      streamRef.current = stream;
      const v = videoRef.current;
      if (!v) {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setPhase("idle");
        return;
      }
      v.srcObject = stream;
      v.muted = true;
      v.playsInline = true;
      await v.play();
      setPhase("running");

      await loadModels();
      const labeled = await loadLabeledDescriptors();
      knownDescriptorsRef.current = labeled;
      if (!labeled.length) {
        setErr("Камер ассан. Face profile байхгүй тул танилт/ирцийн холболт хязгаарлагдана.");
      } else {
        setOk(`Face profile ачааллаа: ${labeled.length} сурагч`);
      }

      timerRef.current = window.setInterval(async () => {
        if (!v || v.readyState < 2) return;
        const faceapi = faceApiRef.current;
        if (!faceapi) return;
        const all = await faceapi
          .detectAllFaces(v, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.45 }))
          .withFaceLandmarks()
          .withFaceDescriptors();
        const totalFaces = all.length;
        let unknown = 0;
        const matched = [];
        for (const d of all) {
          const best = knownDescriptorsRef.current.length ? bestMatchFor(d.descriptor) : null;
          if (!best) {
            unknown += 1;
            captureUnknownShot(v);
          } else {
            matched.push(best);
          }
        }
        if (unknown > 0) setUnknownCount((x) => x + unknown);
        // Live attention score should reflect "face is present and centered",
        // not whether profile matching succeeded.
        let frameScore = 10;
        if (totalFaces > 0) {
          const bestFace = [...all].sort(
            (a, b) => b.detection.box.width * b.detection.box.height - a.detection.box.width * a.detection.box.height,
          )[0];
          const box = bestFace.detection.box;
          const score = Number(bestFace.detection.score || 0);

          const vw = Math.max(1, v.videoWidth || 1);
          const vh = Math.max(1, v.videoHeight || 1);
          const cx = (box.x + box.width / 2) / vw;
          const cy = (box.y + box.height / 2) / vh;
          const centerDist = Math.hypot(cx - 0.5, cy - 0.45);
          const centerScore = clamp(100 - centerDist * 220, 0, 100);

          const faceAreaRatio = (box.width * box.height) / (vw * vh);
          const sizeScore = clamp((faceAreaRatio / 0.12) * 100, 0, 100);
          const detectScore = clamp(score * 100, 0, 100);

          frameScore = Math.round(centerScore * 0.45 + sizeScore * 0.35 + detectScore * 0.2);
          if (totalFaces > 1) frameScore = Math.max(0, frameScore - 15);
        }
        scoreHistoryRef.current.push(frameScore);
        if (scoreHistoryRef.current.length > 10) scoreHistoryRef.current.shift();
        const smoothed = Math.round(scoreHistoryRef.current.reduce((a, b) => a + b, 0) / scoreHistoryRef.current.length);
        setLiveAttentionScore(smoothed);
        setLiveFaces(totalFaces);

        if (matched.length) {
          const ts = Date.now();
          setDetectedStats((prev) => {
            const next = { ...prev };
            for (const m of matched) {
              const old = next[m.studentId] || { count: 0, bestDistance: 9 };
              next[m.studentId] = {
                count: old.count + 1,
                bestDistance: Math.min(old.bestDistance, m.distance),
                lastSeen: ts,
              };
            }
            return next;
          });
        }
      }, 1200);
    } catch (e) {
      // If camera stream is already active, keep preview on and only report recognition/init error.
      if (streamRef.current) {
        setPhase("running");
        setErr(`Камер ассан боловч танилт эхлүүлэхэд алдаа гарлаа: ${toCameraErrorMessage(e)}`);
        return;
      }
      setErr(toCameraErrorMessage(e));
      stopCamera();
    }
  }

  async function saveAutoAttendance() {
    if (!lessonId) return;
    setSaving(true);
    setErr("");
    setOk("");
    try {
      const maxDetect = Math.max(
        1,
        ...rosterRows.map((r) => Number(r.detect_count || 0)),
      );
      const attentionRecords = rosterRows.map((r) => {
        const detectCount = Number(r.detect_count || 0);
        const ratio = detectCount / maxDetect;
        const score = detectCount > 0 ? Math.round(55 + ratio * 45) : Math.max(0, Math.round(liveAttentionScore * 0.35));
        return {
          student_id: r.student_id,
          attention_score: score,
          notes: "camera-live-attention",
        };
      });

      const [res] = await Promise.all([
        apiFetch(`/teacher/lessons/${lessonId}/attendance/auto-face`, {
          method: "POST",
          token,
          body: {
            detected_student_ids: detectedIds,
            mark_absent_others: markAbsentOthers,
            note: "camera-face-recognition",
          },
        }),
        apiFetch(`/teacher/lessons/${lessonId}/attention-report`, {
          method: "POST",
          token,
          body: { records: attentionRecords },
        }),
      ]);

      setOk(
        `Ирц хадгаллаа. Танигдсан: ${res.recognized_count}, Present: ${res.present_saved}, Absent: ${res.absent_saved}`,
      );
    } catch (e) {
      setErr(e?.message || "Ирц хадгалах үед алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadUnknownLogs() {
    if (!lessonId) return;
    const targets = unknownLog.filter((u) => !u.uploaded);
    if (!targets.length) {
      setOk("Шинэ unknown screenshot байхгүй.");
      return;
    }
    setUploadingUnknown(true);
    setErr("");
    setOk("");
    let uploaded = 0;
    for (const item of targets) {
      try {
        const out = await apiFetch(`/teacher/lessons/${lessonId}/unknown-face-logs`, {
          method: "POST",
          token,
          body: {
            image_data_url: item.image,
            detected_at: new Date(item.at).toISOString(),
            note: "camera-unknown-face",
          },
        });
        uploaded += 1;
        setUnknownLog((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, uploaded: true, logId: out.id } : x)),
        );
      } catch {
        // continue uploading remaining logs
      }
    }
    setUploadingUnknown(false);
    setOk(`Unknown log upload дууслаа: ${uploaded}/${targets.length}`);
  }

  if (user?.role !== "teacher") {
    return (
      <div className="es-page">
        <h1 className="es-page-title">Камерын ирц</h1>
        <p className="es-alert es-alert-danger">Энэ хэсэг зөвхөн багшийн эрхтэй.</p>
      </div>
    );
  }

  return (
    <div className="es-page">
      <h1 className="es-page-title">Камераар царай таньж ирц бүртгэх</h1>
      <p className="es-page-desc">Тест горим: камер асаагаад танилтыг шалгана. Хичээл сонгох шаардлагагүй.</p>

      <div className="es-section">
        <div className="es-toolbar">
          <div style={{ minWidth: 280, flex: 1, color: "var(--es-muted)" }}>
            {lessonId
              ? `Сонгогдсон хичээл: ${lessons.find((l) => String(l.id) === String(lessonId))?.title || `#${lessonId}`}`
              : "Холбох хичээл олдсонгүй (тест камер ажиллана)"}
          </div>
          {phase !== "running" ? (
            <button type="button" className="es-btn es-btn-primary" onClick={startCamera} disabled={phase === "loading"}>
              {phase === "loading" ? "Ачаалж байна..." : "Камер асаах"}
            </button>
          ) : (
            <button type="button" className="es-btn es-btn-danger" onClick={stopCamera}>
              Камер унтраах
            </button>
          )}
          <button type="button" className="es-btn es-btn-secondary" onClick={() => setDetectedStats({})}>
            Танигдсан жагсаалт цэвэрлэх
          </button>
        </div>
      </div>

      <div className="es-section">
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#000", maxWidth: 900 }}>
          <video ref={videoRef} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", transform: "scaleX(-1)" }} />
          {phase === "running" && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(15,23,42,0.75)",
                color: "#fff",
                borderRadius: 10,
                padding: "10px 12px",
                minWidth: 190,
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div style={{ fontSize: "0.8rem", opacity: 0.9, marginBottom: 4 }}>Live анхаарлын оноо</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>{liveAttentionScore}%</div>
              <div style={{ marginTop: 6 }}>
                <span className={`es-risk-badge ${attentionMeta.cls}`}>{attentionMeta.label}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: "0.78rem", opacity: 0.9 }}>Илэрсэн царай: {liveFaces}</div>
            </div>
          )}
          {phase !== "running" && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", background: "rgba(0,0,0,0.45)" }}>
              Камер унтарсан
            </div>
          )}
        </div>
      </div>

      <div className="es-grid-2">
        <div className="es-section">
          <h3 className="es-section-title">Танигдсан сурагчид ({detectedIds.length})</h3>
          <div className="es-table-wrap">
            <table className="es-table">
              <thead>
                <tr>
                  <th>Сурагч</th>
                  <th>Профайл</th>
                  <th>Төлөв</th>
                  <th>Detect count</th>
                  <th>Best distance</th>
                  <th>Сүүлд</th>
                </tr>
              </thead>
              <tbody>
                {rosterRows.map((r) => (
                  <tr key={r.student_id}>
                    <td>{r.student_name}</td>
                    <td>
                      {r.has_face_profile ? (
                        r.image_url ? (
                          <img
                            src={r.image_url}
                            alt={r.student_name || "profile"}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 999,
                              objectFit: "cover",
                              border: "1px solid var(--es-border)",
                              background: "var(--es-surface-soft)",
                            }}
                          />
                        ) : (
                          "Тийм"
                        )
                      ) : (
                        "Үгүй"
                      )}
                    </td>
                    <td>{r.detected ? "Танигдсан" : "Хүлээгдэж байна"}</td>
                    <td>{r.detect_count}</td>
                    <td>{r.best_distance != null ? r.best_distance.toFixed(3) : "-"}</td>
                    <td>{r.last_seen ? formatTime(r.last_seen) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 10, color: "var(--es-muted)" }}>Unknown detection: {unknownCount}</p>
        </div>

        <div className="es-section">
          <h3 className="es-section-title">Ирц хадгалах</h3>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="es-empty">Анхаарлын оноо</span>
              <strong>{liveAttentionScore}%</strong>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "rgba(148,163,184,.25)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${liveAttentionScore}%`,
                  height: "100%",
                  transition: "width .25s ease",
                  background:
                    liveAttentionScore >= 75
                      ? "linear-gradient(90deg,#10b981,#34d399)"
                      : liveAttentionScore >= 45
                        ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                        : "linear-gradient(90deg,#ef4444,#f87171)",
                }}
              />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <input type="checkbox" checked={markAbsentOthers} onChange={(e) => setMarkAbsentOthers(e.target.checked)} />
            Танигдаагүй бусад сурагчдыг absent болгох
          </label>
          <button type="button" className="es-btn es-btn-primary" onClick={saveAutoAttendance} disabled={saving || !lessonId}>
            {saving ? "Хадгалж байна..." : "Ирцийг автоматаар хадгалах"}
          </button>
          <p style={{ marginTop: 10, color: "var(--es-muted)", fontSize: "0.86rem" }}>
            Зөвлөмж: эхлээд 10-20 секунд танилт ажиллуулаад дараа нь хадгална.
          </p>
        </div>
      </div>

      <div className="es-section">
        <h3 className="es-section-title">Unknown нүүрний screenshot log</h3>
        <div className="es-toolbar" style={{ marginBottom: 8 }}>
          <button type="button" className="es-btn es-btn-secondary" onClick={uploadUnknownLogs} disabled={uploadingUnknown || !unknownLog.length}>
            {uploadingUnknown ? "Upload хийж байна..." : "Серверт upload хийх"}
          </button>
        </div>
        {unknownLog.length === 0 ? (
          <p className="es-empty">Одоогоор unknown нүүр бүртгэгдээгүй.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
            {unknownLog.map((u) => (
              <div key={u.id} style={{ border: "1px solid var(--es-border)", borderRadius: 10, overflow: "hidden" }}>
                <img src={u.image} alt="unknown face snapshot" style={{ width: "100%", height: 120, objectFit: "cover" }} />
                <div style={{ padding: 8, fontSize: "0.82rem", color: "var(--es-muted)" }}>
                  {formatTime(u.at)} • {u.uploaded ? `uploaded #${u.logId || ""}` : "not uploaded"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {ok && <p className="es-alert es-alert-success">{ok}</p>}
      {err && <p className="es-alert es-alert-danger">{err}</p>}
    </div>
  );
}
