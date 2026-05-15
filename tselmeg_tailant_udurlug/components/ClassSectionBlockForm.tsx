"use client";

import { useMemo, useState } from "react";
import { ImageIcon, LayoutTemplate, Megaphone, MessageSquareQuote, PanelTop, PlaySquare, Type, Wand2 } from "lucide-react";
import { Label, SubmitButton, TextArea, TextInput } from "@/components/FormControls";

type SectionDraft = {
  id?: string;
  classId: string;
  layout?: string;
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  active?: boolean;
  displayOrder?: number;
};

const blockTypes = [
  { value: "TEXT", label: "Текст блок", description: "Гарчиг + тайлбар", icon: Type },
  { value: "HERO", label: "Hero блок", description: "Том танилцуулга", icon: PanelTop },
  { value: "IMAGE_TEXT", label: "Зураг + текст", description: "Зурагтай story", icon: ImageIcon },
  { value: "HIGHLIGHT", label: "Онцлох блок", description: "Чухал мэдээлэл", icon: Megaphone },
  { value: "QUOTE", label: "Ишлэл", description: "Уриа, quote", icon: MessageSquareQuote },
  { value: "VIDEO", label: "Видео блок", description: "YouTube/video link", icon: PlaySquare },
  { value: "CTA", label: "Button CTA", description: "Action товч", icon: Wand2 }
];

const templates: Record<string, { title: string; body: string; eyebrow: string; buttonLabel: string }> = {
  TEXT: { title: "Манай ангийн тухай", body: "Энд ангийн танилцуулга, онцлог, амжилтын тухай бичнэ.", eyebrow: "Introduction", buttonLabel: "" },
  HERO: { title: "Бидний суралцах орчин", body: "Сурагчдын бүтээлч байдал, хамтын ажиллагаа, технологийн хэрэглээг харуулсан танилцуулга.", eyebrow: "Class story", buttonLabel: "" },
  IMAGE_TEXT: { title: "Онцлох үйл ажиллагаа", body: "Зурагтай хамт тайлбар гарч, эцэг эхчүүдэд илүү ойлгомжтой харагдана.", eyebrow: "Activity", buttonLabel: "" },
  HIGHLIGHT: { title: "Онцлох амжилт", body: "Тэмцээн, төсөл, багийн амжилт зэрэг хамгийн чухал мэдээллийг энд байрлуулна.", eyebrow: "Highlight", buttonLabel: "" },
  QUOTE: { title: "Бидний уриа", body: "Сурагч бүр өөрийн хурдаар хөгжиж, хамтдаа илүү өндөрт хүрнэ.", eyebrow: "Quote", buttonLabel: "" },
  VIDEO: { title: "Видео танилцуулга", body: "Видеоныхоо товч тайлбарыг энд бичнэ.", eyebrow: "Watch", buttonLabel: "" },
  CTA: { title: "Дэлгэрэнгүй үзэх", body: "Гадаад холбоос, видео, нэмэлт материал руу чиглүүлэх блок.", eyebrow: "Action", buttonLabel: "Нээх" }
};

export function ClassSectionBlockForm({
  action,
  section,
  submitLabel = "Блок хадгалах"
}: {
  action: (formData: FormData) => void;
  section: SectionDraft;
  submitLabel?: string;
}) {
  const initialLayout = section.layout || "TEXT";
  const [layout, setLayout] = useState(initialLayout);
  const template = templates[layout] || templates.TEXT;

  const previewTone = useMemo(() => {
    if (layout === "HERO") return "bg-brand-navy text-white";
    if (layout === "HIGHLIGHT") return "border-brand-red/25 bg-red-50 text-brand-navy";
    if (layout === "QUOTE") return "border-brand-blue/25 bg-brand-mist text-brand-navy";
    return "bg-white text-brand-navy";
  }, [layout]);

  return (
    <form action={action} encType="multipart/form-data" className="grid gap-5">
      {section.id ? <input type="hidden" name="id" value={section.id} /> : null}
      <input type="hidden" name="classId" value={section.classId} />
      <input type="hidden" name="layout" value={layout} />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <LayoutTemplate size={18} className="text-brand-blue" />
          <h2 className="text-lg font-black text-brand-navy">Блокийн төрөл</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {blockTypes.map(({ value, label, description, icon: Icon }) => {
            const selected = layout === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setLayout(value)}
                className={`rounded-lg border p-3 text-left transition ${
                  selected ? "border-brand-blue bg-brand-mist text-brand-navy shadow-crisp" : "border-brand-line bg-white hover:border-brand-blue/40"
                }`}
              >
                <Icon size={20} className={selected ? "text-brand-blue" : "text-slate-500"} />
                <span className="mt-2 block text-sm font-black">{label}</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500">{description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Жижиг label</Label>
              <TextInput name="eyebrow" defaultValue={section.eyebrow || template.eyebrow} placeholder="Activity / Highlight" />
            </div>
            <div>
              <Label>Дараалал</Label>
              <TextInput name="displayOrder" type="number" defaultValue={section.displayOrder ?? 0} />
            </div>
          </div>
          <div>
            <Label>Гарчиг</Label>
            <TextInput name="title" defaultValue={section.title || template.title} required />
          </div>
          <div>
            <Label>Текст</Label>
            <TextArea name="body" defaultValue={section.body || template.body} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Зураг</Label>
              <TextInput name="image" type="file" accept="image/*" />
              {section.imageUrl ? <p className="mt-1 text-xs font-semibold text-slate-500">Одоогийн зураг хадгалагдсан.</p> : null}
            </div>
            <div>
              <Label>Видео URL</Label>
              <TextInput name="videoUrl" defaultValue={section.videoUrl || ""} placeholder="https://..." />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Button текст</Label>
              <TextInput name="buttonLabel" defaultValue={section.buttonLabel || template.buttonLabel} placeholder="Дэлгэрэнгүй" />
            </div>
            <div>
              <Label>Button URL</Label>
              <TextInput name="buttonUrl" defaultValue={section.buttonUrl || ""} placeholder="https://..." />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-black text-brand-navy">
            <input name="active" type="checkbox" defaultChecked={section.active ?? true} />
            Нийтэд харуулах
          </label>
          <div>
            <SubmitButton>{submitLabel}</SubmitButton>
          </div>
        </div>

        <aside className="rounded-lg border border-brand-line bg-slate-50 p-3">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-brand-blue">Preview</p>
          <div className={`rounded-lg border border-brand-line p-4 ${previewTone}`}>
            <p className={layout === "HERO" ? "text-xs font-black uppercase tracking-wide text-brand-sky" : "text-xs font-black uppercase tracking-wide text-brand-blue"}>
              {section.eyebrow || template.eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-black">{section.title || template.title}</h3>
            <p className={layout === "HERO" ? "mt-2 text-sm leading-6 text-slate-200" : "mt-2 text-sm leading-6 text-slate-600"}>
              {section.body || template.body}
            </p>
            {layout === "IMAGE_TEXT" ? <div className="mt-3 h-24 rounded-lg bg-brand-mist" /> : null}
            {layout === "VIDEO" ? <div className="mt-3 flex h-20 items-center justify-center rounded-lg bg-brand-navy text-white">Видео</div> : null}
            {layout === "CTA" ? <span className="brand-button mt-3 inline-flex px-4 py-2 text-sm font-black">{section.buttonLabel || template.buttonLabel || "Нээх"}</span> : null}
          </div>
        </aside>
      </div>
    </form>
  );
}
