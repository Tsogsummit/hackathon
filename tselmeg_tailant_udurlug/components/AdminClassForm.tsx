"use client";

import { useState } from "react";
import Link from "next/link";
import { ClassGroup, SchoolClass } from "@prisma/client";
import { groupLabels } from "@/lib/content";
import { saveClass } from "@/app/admin/actions";
import { Card } from "@/components/Card";
import { Label, Select, SubmitButton, TextInput } from "@/components/FormControls";
import { BlockEditor } from "@/components/BlockEditor";

export function AdminClassForm({ initialData }: { initialData?: SchoolClass | null }) {
  const [introductionHtml, setIntroductionHtml] = useState(initialData?.introduction || "");

  return (
    <Card className="mb-6">
      <form action={saveClass} encType="multipart/form-data" className="grid gap-4 sm:grid-cols-2">
        {initialData && <input type="hidden" name="id" value={initialData.id} />}

        <div>
          <Label>Бүлэг</Label>
          <Select name="group" defaultValue={initialData?.group || "HIGH"}>
            {Object.values(ClassGroup).map((g) => (
              <option key={g} value={g}>{groupLabels[g]}</option>
            ))}
          </Select>
        </div>

        <div><Label>Ангийн нэр</Label><TextInput name="name" defaultValue={initialData?.name || ""} required placeholder="9A" /></div>
        <div><Label>Slug</Label><TextInput name="slug" defaultValue={initialData?.slug || ""} required placeholder="9a" /></div>
        <div><Label>Ангийн багш</Label><TextInput name="homeroomTeacher" defaultValue={initialData?.homeroomTeacher || ""} /></div>

        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
          <div><Label>Нийт сурагч</Label><TextInput name="totalStudents" type="number" defaultValue={initialData?.totalStudents || 0} /></div>
          <div><Label>Эрэгтэй</Label><TextInput name="maleStudents" type="number" defaultValue={initialData?.maleStudents || 0} /></div>
          <div><Label>Эмэгтэй</Label><TextInput name="femaleStudents" type="number" defaultValue={initialData?.femaleStudents || 0} /></div>
        </div>

        <div><Label>Дараалал (эрэмбэ)</Label><TextInput name="displayOrder" type="number" defaultValue={initialData?.displayOrder || 0} /></div>
        <div><Label>Үндсэн зураг</Label><TextInput name="mainImage" type="file" accept="image/*" /></div>

        <div className="sm:col-span-2">
          <Label>Контент (Block Editor)</Label>
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
          <Link href="/admin/classes" className="rounded-lg bg-slate-100 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-200">
            Буцах
          </Link>
          {initialData && (
             <Link href={`/admin/classes/${initialData.id}/sections`} className="rounded-lg border border-brand-line bg-white px-5 py-3 font-semibold text-brand-blue transition hover:bg-brand-mist">
               Туслах хуудсууд (Sections)
             </Link>
          )}
        </div>
      </form>
    </Card>
  );
}
