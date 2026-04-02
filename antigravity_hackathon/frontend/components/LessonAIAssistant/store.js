import { create } from "zustand";
import { persist } from "zustand/middleware";

const initial = {
  step: 1,
  date: "",
  subject: "",
  grade: "",
  topic: "",
  transcriptId: null,
  transcriptText: "",
  transcriptWarnings: [],
  sttSource: null,
  jobId: null,
  materialId: null,
  materials: null,
  processingStep: 1,
  processingMessage: "",
  error: "",
  selectedClassId: null,
  notifyParents: true,
};

export const useLessonAIStore = create(
  persist(
    (set) => ({
      ...initial,
      resetWizard: () => set({ ...initial }),
      setField: (patch) => set(patch),
    }),
    {
      name: "edusmart-lesson-ai-draft",
      partialize: (state) => ({
        step: state.step,
        date: state.date,
        subject: state.subject,
        grade: state.grade,
        topic: state.topic,
        transcriptId: state.transcriptId,
        transcriptText: state.transcriptText,
        materialId: state.materialId,
        materials: state.materials,
        selectedClassId: state.selectedClassId,
        notifyParents: state.notifyParents,
      }),
    }
  )
);
