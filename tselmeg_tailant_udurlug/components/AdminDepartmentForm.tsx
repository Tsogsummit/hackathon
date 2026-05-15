"use client";

import { useState } from "react";
import Link from "next/link";
import { TeacherDepartment } from "@prisma/client";
import { saveDepartment } from "@/app/admin/actions";
import { Card } from "@/components/Card";
import { Label, SubmitButton, TextInput } from "@/components/FormControls";
import { BlockEditor } from "@/components/BlockEditor";

export function AdminDepartmentForm({ initialData }: { initialData?: TeacherDepartment | null }) {
  const [introductionHtml, setIntroductionHtml] = useState(initialData?.introduction || "");

  return (
    <Card className="mb-6">
      <form action={saveDepartment} encType="multipart/form-data" className="grid gap-4 sm:grid-cols-2">
        {initialData && <input type="hidden" name="id" value={initialData.id} />}

        <div><Label>Бүтэн нэр</Label><TextInput name="fullName" defaultValue={initialData?.fullName || ""} required /></div>
        <div><Label>Товч нэр</Label><TextInput name="shortName" defaultValue={initialData?.shortName || ""} required /></div>
        <div><Label>Slug</Label><TextInput name="slug" defaultValue={initialData?.slug || ""} required /></div>
        <div><Label>Дараалал (эрэмбэ)</Label><TextInput name="displayOrder" type="number" defaultValue={initialData?.displayOrder || 0} /></div>
        <div><Label>Үндсэн зураг</Label><TextInput name="mainImage" type="file" accept="image/*" /></div>

        <div className="sm:col-span-2">
          <Label>Танилцуулга (Block Editor)</Label>
          <p className="mb-2 text-xs text-slate-500">
            WordPress шиг блокууд (Гарчиг, Текст, Зураг, Жагсаалт) нэмж засах боломжтой. Enter дарж шинэ блок үүсгэнэ, &apos;/&apos; дарж цэс гаргана.
          </p>
          <input type="hidden" name="introduction" value={introductionHtml} />
          <BlockEditor defaultValue={initialData?.introduction || ""} onChange={setIntroductionHtml} />
        </div>

        <label className="flex items-center gap-2 pt-2 sm:col-span-2">
          <input name="active" type="checkbox" defaultChecked={initialData ? initialData.active : true} />
          <span className="font-semibold text-brand-navy">Идэвхтэй (бусдад харагдах)</span>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-4 sm:col-span-2 border-t border-brand-line">
          <SubmitButton>Хадгалах</SubmitButton>
          <Link href="/admin/teacher-departments" className="rounded-lg bg-slate-100 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-200">
            Буцах
          </Link>
          {initialData && (
             <Link href={`/admin/teacher-departments/${initialData.id}/sections`} className="rounded-lg border border-brand-line bg-white px-5 py-3 font-semibold text-brand-blue transition hover:bg-brand-mist">
               Туслах хуудсууд (Sections)
             </Link>
          )}
        </div>
      </form>
    </Card>
  );
}
