import { useCallback, useEffect, useRef, useState } from "react";

const MAX_MS = () =>
  Number(import.meta.env.VITE_MAX_RECORDING_MINUTES || import.meta.env.REACT_APP_MAX_RECORDING_MINUTES || 60) *
  60 *
  1000;

export default function AudioRecorder({ onRecordingComplete, disabled }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hasTake, setHasTake] = useState(false);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const startedAtRef = useRef(0);
  const lastBlobRef = useRef(null);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(data);
    ctx.fillStyle = "#0d47a1";
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#90caf9";
    ctx.beginPath();
    const slice = w / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * h) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += slice;
    }
    ctx.stroke();
    rafRef.current = requestAnimationFrame(drawWave);
  }, []);

  const teardownAudioGraph = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, []);

  const stopMicOnly = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    teardownAudioGraph();
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
    }
    mediaRecorderRef.current = null;
    stopTracks();
    setRecording(false);
  }, [stopTracks, teardownAudioGraph]);

  const start = async () => {
    setError("");
    lastBlobRef.current = null;
    setHasTake(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        lastBlobRef.current = blob;
        setHasTake(true);
      };
      mr.start(200);
      mediaRecorderRef.current = mr;

      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;
      drawWave();

      startedAtRef.current = Date.now();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAtRef.current;
        setSeconds(Math.floor(elapsed / 1000));
        if (elapsed >= MAX_MS()) {
          stopMicOnly();
        }
      }, 500);
    } catch (e) {
      setError("Микрофоны эрх авахад алдаа гарлаа.");
    }
  };

  const toggleMic = () => {
    if (recording) {
      stopMicOnly();
    } else {
      start();
    }
  };

  const transcribeClick = () => {
    if (!lastBlobRef.current) return;
    onRecordingComplete?.(lastBlobRef.current);
  };

  useEffect(() => () => stopMicOnly(), [stopMicOnly]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={320}
        height={80}
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 8,
          background: "#0d47a1",
          marginBottom: 12,
        }}
      />
      <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>{fmt(seconds)}</div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={disabled}
          onClick={toggleMic}
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: "none",
            background: recording ? "#c62828" : "#1565c0",
            color: "#fff",
            fontSize: 36,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          aria-label={recording ? "Зогсоох" : "Эхлүүлэх"}
        >
          {recording ? "■" : "●"}
        </button>
        <button
          type="button"
          disabled={!hasTake || disabled}
          onClick={transcribeClick}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            background: "#2e7d32",
            color: "#fff",
            fontWeight: 600,
            cursor: !hasTake || disabled ? "not-allowed" : "pointer",
            alignSelf: "center",
          }}
        >
          Зогсоож текст болгох
        </button>
      </div>
      {error && <p style={{ color: "#c62828" }}>{error}</p>}
      <p style={{ color: "#666", fontSize: 14 }}>Эхлээд микрофон, дараа нь &quot;Зогсоож текст болгох&quot; дарна уу.</p>
    </div>
  );
}
