"use client";

import { useState } from "react";
import { Announcement } from "@prisma/client";
import { saveAnnouncement } from "@/app/admin/actions";
import { Label, SubmitButton, TextInput } from "@/components/FormControls";
import { BlockEditor } from "@/components/BlockEditor";

export function AdminAnnouncementForm({ initialData }: { initialData?: Announcement | null }) {
  const [bodyHtml, setBodyHtml] = useState(initialData?.body || "");

  return (
    <form action={saveAnnouncement} className="grid gap-3">
      <div>
        <Label>Гарчиг</Label>
        <TextInput name="title" defaultValue={initialData?.title || ""} />
      </div>

      <div>
        <Label>Зарлал (Block Editor)</Label>
        <p className="mb-2 text-xs text-slate-500">
          WordPress шиг блокууд ашиглан засах боломжтой.
        </p>
        <input type="hidden" name="body" value={bodyHtml} />
        <BlockEditor defaultValue={initialData?.body || ""} onChange={setBodyHtml} />
      </div>

      <label className="flex items-center gap-2 pt-2">
        <input name="enabled" type="checkbox" defaultChecked={initialData?.enabled} />
        <span className="font-semibold text-brand-navy">Нийтийн хуудсуудад харуулах</span>
      </label>

      <div className="pt-2">
        <SubmitButton>Зар шинэчлэх</SubmitButton>
      </div>
    </form>
  );
}
