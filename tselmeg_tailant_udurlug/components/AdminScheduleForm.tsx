"use client";

import { useState } from "react";
import Link from "next/link";
import { ScheduleItem, SchoolClass } from "@prisma/client";
import { saveScheduleItem } from "@/app/admin/actions";
import { Card } from "@/components/Card";
import { Label, Select, SubmitButton, TextInput } from "@/components/FormControls";
import { BlockEditor } from "@/components/BlockEditor";

export function AdminScheduleForm({
  initialData,
  classes
}: {
  initialData?: ScheduleItem | null;
  classes: SchoolClass[];
}) {
  const [descriptionHtml, setDescriptionHtml] = useState(initialData?.description || "");

  return (
    <Card className="mb-6">
      <form action={saveScheduleItem} className="grid gap-4 sm:grid-cols-2">
        {initialData && <input type="hidden" name="id" value={initialData.id} />}

        <div><Label>Гарчиг</Label><TextInput name="title" defaultValue={initialData?.title || ""} required /></div>
        <div><Label>Байршил</Label><TextInput name="location" defaultValue={initialData?.location || ""} /></div>
        <div><Label>Эхлэх цаг</Label><TextInput name="startTime" defaultValue={initialData?.startTime || ""} placeholder="10:00" required /></div>
        <div><Label>Дуусах цаг</Label><TextInput name="endTime" defaultValue={initialData?.endTime || ""} placeholder="10:20" /></div>

        <div>
          <Label>Холбогдох анги</Label>
          <Select name="classId" defaultValue={initialData?.classId || ""}>
            <option value="">-</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        <div><Label>Дараалал</Label><TextInput name="displayOrder" type="number" defaultValue={initialData?.displayOrder || 0} /></div>

        <div className="sm:col-span-2">
          <Label>Тайлбар (Block Editor)</Label>
          <p className="mb-2 text-xs text-slate-500">
            WordPress шиг блокууд (Гарчиг, Текст, Зураг, Жагсаалт) нэмж засах боломжтой. Enter дарж шинэ блок үүсгэнэ, &apos;/&apos; дарж цэс гаргана.
          </p>
          <input type="hidden" name="description" value={descriptionHtml} />
          <BlockEditor defaultValue={initialData?.description || ""} onChange={setDescriptionHtml} />
        </div>

        <label className="flex items-center gap-2 pt-2 sm:col-span-2">
          <input name="active" type="checkbox" defaultChecked={initialData ? initialData.active : true} />
          <span className="font-semibold text-brand-navy">Идэвхтэй</span>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-4 sm:col-span-2 border-t border-brand-line">
          <SubmitButton>Хадгалах</SubmitButton>
          <Link href="/admin/schedule" className="rounded-lg bg-slate-100 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-200">
            Буцах
          </Link>
        </div>
      </form>
    </Card>
  );
}
