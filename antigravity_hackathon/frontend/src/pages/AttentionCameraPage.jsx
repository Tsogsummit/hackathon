import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const MODEL_BASE = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
const UNKNOWN_CAPTURE_INTERVAL_MS = 6000;
const MAX_UNKNOWN_LOG = 12;

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
  const [matchThreshold, setMatchThreshold] = useState(0.5);
  const [markAbsentOthers, setMarkAbsentOthers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingUnknown, setUploadingUnknown] = useState(false);

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
        const det = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        URL.revokeObjectURL(objUrl);
        if (det?.descriptor) {
          descriptors.push({
            studentId: r.student_id,
            name: r.student_name || `Student #${r.student_id}`,
            descriptor: det.descriptor,
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
    if (!best || best.distance > matchThreshold) return null;
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
    if (!lessonId) {
      setErr("Эхлээд хичээл сонгоно уу.");
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
      if (!labeled.length) {
        setErr("Камер ассан. Гэхдээ face profile зураг холбоогүй тул танилт ажиллахгүй байна. Админ student face profile холбоно уу.");
        return;
      }
      knownDescriptorsRef.current = labeled;

      timerRef.current = window.setInterval(async () => {
        if (!v || v.readyState < 2) return;
        const faceapi = faceApiRef.current;
        if (!faceapi) return;
        const all = await faceapi
          .detectAllFaces(v, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.45 }))
          .withFaceLandmarks()
          .withFaceDescriptors();
        let unknown = 0;
        const matched = [];
        for (const d of all) {
          const best = bestMatchFor(d.descriptor);
          if (!best) {
            unknown += 1;
            captureUnknownShot(v);
          } else {
            matched.push(best);
          }
        }
        if (unknown > 0) setUnknownCount((x) => x + unknown);
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
      const res = await apiFetch(`/teacher/lessons/${lessonId}/attendance/auto-face`, {
        method: "POST",
        token,
        body: {
          detected_student_ids: detectedIds,
          mark_absent_others: markAbsentOthers,
          note: "camera-face-recognition",
        },
      });
      setOk(`Ирц хадгаллаа. Танигдсан: ${res.recognized_count}, Present: ${res.present_saved}, Absent: ${res.absent_saved}`);
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
      <p className="es-page-desc">Хичээл сонгоод камер асаахад танигдсан сурагчид автоматаар бүртгэгдэнэ.</p>

      <div className="es-section">
        <div className="es-toolbar">
          <div style={{ minWidth: 280, flex: 1 }}>
            <label className="es-label">Хичээл сонгох</label>
            <select className="es-select" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
              {!lessons.length && <option value="">— Хичээл алга —</option>}
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title || `Хичээл #${l.id}`} — {l.class_name}
                </option>
              ))}
            </select>
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
          <div style={{ minWidth: 220 }}>
            <label className="es-label">Танилтын босго (lower=stricter): {matchThreshold.toFixed(2)}</label>
            <input
              type="range"
              min="0.35"
              max="0.75"
              step="0.01"
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <div className="es-section">
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#000", maxWidth: 900 }}>
          <video ref={videoRef} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", transform: "scaleX(-1)" }} />
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
                    <td>{r.has_face_profile ? "Тийм" : "Үгүй"}</td>
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
