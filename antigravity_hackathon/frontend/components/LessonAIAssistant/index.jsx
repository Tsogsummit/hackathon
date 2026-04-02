import { useRef, useState } from "react";
import { apiFetch, pollJob } from "./api.js";
import { useLessonAIStore } from "./store.js";
import Step1AudioInput from "./Step1_AudioInput.jsx";
import Step2Processing from "./Step2_Processing.jsx";
import Step3ReviewEdit from "./Step3_ReviewEdit.jsx";
import Step4Distribute from "./Step4_Distribute.jsx";

export default function LessonAIAssistant({ lessonId, authToken }) {
  const abortRef = useRef(null);
  const [tab, setTab] = useState("record");
  const [file, setFile] = useState(null);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [localMaterials, setLocalMaterials] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    step,
    date,
    subject,
    grade,
    topic,
    transcriptId,
    transcriptText,
    transcriptWarnings,
    materialId,
    materials,
    processingStep,
    processingMessage,
    error,
    selectedClassId,
    notifyParents,
    setField,
    resetWizard,
  } = useLessonAIStore();

  const token = authToken?.trim();

  const mergeMaterialsFromStore = () => {
    if (localMaterials) return localMaterials;
    if (materials) return materials;
    return {};
  };

  const setMergedMaterials = (m) => {
    setLocalMaterials(m);
    setField({ materials: m });
  };

  const cancelProcessing = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setField({ step: 1, processingStep: 1, error: "", processingMessage: "" });
  };

  const runTranscribeAndGenerate = async (blobOrFile) => {
    if (!token) {
      setField({ error: "JWT токен оруулна уу (.env эсвэл props)." });
      return;
    }
    const ac = new AbortController();
    abortRef.current = ac;
    setField({ step: 2, error: "", processingStep: 1, processingMessage: "" });
    try {
      setField({ processingStep: 1 });
      const fd = new FormData();
      if (blobOrFile instanceof Blob) {
        fd.append("audio", blobOrFile, "recording.webm");
      } else {
        fd.append("audio", blobOrFile);
      }

      setField({ processingStep: 2 });
      const tr = await apiFetch(`/lessons/${lessonId}/transcribe`, {
        method: "POST",
        body: fd,
        token,
        signal: ac.signal,
      });

      const warns = tr.warnings || [];
      let warnMsg = "";
      if (warns.includes("empty_transcript")) {
        warnMsg = " Текст хоосон байна — дахин бичлэг хийнэ үү.";
      }
      if (warns.includes("language_warning")) {
        warnMsg += " Аудио монгол биш байж магадгүй — анхаарна уу.";
      }

      setField({
        transcriptId: tr.transcript_id,
        transcriptText: tr.text,
        transcriptWarnings: warns,
        sttSource: tr.stt_source,
        processingStep: 3,
        processingMessage: warnMsg,
      });

      const metadata = {};
      if (date) metadata.date = date;
      if (subject) metadata.subject = subject;
      if (grade) metadata.grade = grade;
      if (topic) metadata.topic = topic;

      const gen = await apiFetch(`/lessons/${lessonId}/generate-materials`, {
        method: "POST",
        body: { transcript_id: tr.transcript_id, metadata },
        token,
        signal: ac.signal,
      });
      setField({ jobId: gen.job_id });

      const job = await pollJob(gen.job_id, token, { signal: ac.signal });
      if (job.status === "failed") {
        throw new Error(job.error || "Материал үүсгэхэд алдаа");
      }
      setLocalMaterials(job.result);
      setField({
        materials: job.result,
        materialId: job.material_id,
        step: 3,
        error: "",
      });
    } catch (e) {
      const msg = e?.message || String(e);
      if (msg.includes("Цуцлагдсан") || e?.name === "AbortError") {
        setField({ step: 1, error: "" });
      } else {
        setField({ step: 1, error: msg });
      }
    } finally {
      abortRef.current = null;
    }
  };

  const runRegenerate = async () => {
    if (!token || !transcriptId) return;
    setBusy(true);
    const ac = new AbortController();
    try {
      setField({ step: 2, processingStep: 3, error: "" });
      const metadata = {};
      if (date) metadata.date = date;
      if (subject) metadata.subject = subject;
      if (grade) metadata.grade = grade;
      if (topic) metadata.topic = topic;
      const gen = await apiFetch(`/lessons/${lessonId}/generate-materials`, {
        method: "POST",
        body: { transcript_id: transcriptId, metadata },
        token,
        signal: ac.signal,
      });
      const job = await pollJob(gen.job_id, token, { signal: ac.signal });
      if (job.status === "failed") throw new Error(job.error || "Алдаа");
      setLocalMaterials(job.result);
      setField({ materials: job.result, materialId: job.material_id, step: 3 });
    } catch (e) {
      setField({ step: 3, error: e?.message || String(e) });
    } finally {
      setBusy(false);
    }
  };

  const onApproveSave = async () => {
    const mid = materialId;
    if (!token || !mid) return;
    setSaving(true);
    try {
      const m = mergeMaterialsFromStore();
      const body = {
        summary: m.summary,
        key_points: m.key_points,
        homework: m.homework,
        exercises: m.exercises,
        exam_questions: m.exam_questions,
        next_lesson_plan: m.next_lesson_plan,
        subject_detected: m.subject_detected,
        grade_detected: m.grade_level_detected ?? m.grade_detected,
        quality_warning: m.quality_warning,
      };
      await apiFetch(`/lessons/${lessonId}/materials/${mid}`, {
        method: "PATCH",
        body,
        token,
      });
    } finally {
      setSaving(false);
    }
  };

  const onDistribute = async () => {
    const mid = materialId;
    if (!token || !mid) return;
    setBusy(true);
    try {
      await apiFetch(`/lessons/${lessonId}/materials/${mid}/distribute`, {
        method: "POST",
        body: {
          class_id: selectedClassId,
          notify_parents: notifyParents,
        },
        token,
      });
      setSent(true);
    } catch (e) {
      setField({ error: e?.message || String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="es-card" style={{ maxWidth: 960, margin: "0 auto" }}>
      <h2 className="es-page-title" style={{ fontSize: "1.25rem" }}>
        Алхам {step} / 4 — аудио → текст → материал
      </h2>
      <p style={{ color: "var(--es-muted)", marginTop: 0, marginBottom: 20, fontSize: "0.9rem" }}>
        Дараалал: аудио оруулах → Chimege текст → Gemini материал → засвар → сурагчдад илгээх
      </p>

      {step === 1 && (
        <Step1AudioInput
          tab={tab}
          setTab={setTab}
          file={file}
          setFile={setFile}
          metadataOpen={metadataOpen}
          setMetadataOpen={setMetadataOpen}
          date={date}
          setDate={(v) => setField({ date: v })}
          subject={subject}
          setSubject={(v) => setField({ subject: v })}
          grade={grade}
          setGrade={(v) => setField({ grade: v })}
          topic={topic}
          setTopic={(v) => setField({ topic: v })}
          onSubmitBlob={(blob) => runTranscribeAndGenerate(blob)}
          onSubmitFile={(f) => runTranscribeAndGenerate(f)}
          disabled={!token}
        />
      )}

      {step === 2 && (
        <Step2Processing
          activeStep={processingStep}
          transcriptPreview={transcriptText}
          error={error || processingMessage}
          onCancel={cancelProcessing}
        />
      )}

      {step === 3 && (
        <Step3ReviewEdit
          materials={mergeMaterialsFromStore()}
          setMaterials={setMergedMaterials}
          transcriptText={transcriptText}
          onApproveSave={onApproveSave}
          onRegenerate={runRegenerate}
          onNext={() => {
            setSent(false);
            setField({ step: 4 });
          }}
          saving={saving}
          busy={busy}
        />
      )}

      {step === 4 && (
        <Step4Distribute
          materials={mergeMaterialsFromStore()}
          classId={selectedClassId}
          setClassId={(v) => setField({ selectedClassId: v })}
          notifyParents={notifyParents}
          setNotifyParents={(v) => setField({ notifyParents: v })}
          onSend={onDistribute}
          sent={sent}
          busy={busy}
        />
      )}

      {error && step !== 2 && <p style={{ color: "#c62828", marginTop: 16 }}>{error}</p>}

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        <button type="button" onClick={() => resetWizard()} style={{ border: "none", background: "none", color: "#666" }}>
          Ноорог цэвэрлэх
        </button>
        {step > 1 && step < 4 && (
          <button type="button" onClick={() => setField({ step: Math.max(1, step - 1) })}>
            Буцах
          </button>
        )}
      </div>
    </div>
  );
}
