import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { DeleteButton } from "@/components/DeleteButton";
import { Label, SubmitButton, TextArea, TextInput } from "@/components/FormControls";
import { deleteDepartmentSection, saveDepartmentSection } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DepartmentSectionsPage({ params }: { params: { id: string } }) {
  requireAdmin();
  const department = await prisma.teacherDepartment.findUnique({
    where: { id: params.id },
    include: { sections: { orderBy: { displayOrder: "asc" } } }
  });
  if (!department) return null;

  return (
    <AdminShell>
      <h1 className="mb-5 text-3xl font-extrabold text-brand-navy">{department.shortName} контент хэсгүүд</h1>
      <Card className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Шинэ хэсэг</h2>
        <form action={saveDepartmentSection} encType="multipart/form-data" className="grid gap-3">
          <input type="hidden" name="departmentId" value={department.id} />
          <div><Label>Гарчиг</Label><TextInput name="title" required /></div>
          <div><Label>Текст</Label><TextArea name="body" /></div>
          <div><Label>Зураг</Label><TextInput name="image" type="file" accept="image/*" /></div>
          <div><Label>Видео URL</Label><TextInput name="videoUrl" /></div>
          <div><Label>Дараалал</Label><TextInput name="displayOrder" type="number" defaultValue={0} /></div>
          <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked /> Идэвхтэй</label>
          <SubmitButton />
        </form>
      </Card>
      <div className="grid gap-4">
        {department.sections.map((section) => (
          <Card key={section.id}>
            <form action={saveDepartmentSection} encType="multipart/form-data" className="grid gap-3">
              <input type="hidden" name="id" value={section.id} />
              <input type="hidden" name="departmentId" value={department.id} />
              <div><Label>Гарчиг</Label><TextInput name="title" defaultValue={section.title} required /></div>
              <div><Label>Текст</Label><TextArea name="body" defaultValue={section.body || ""} /></div>
              <div><Label>Зураг солих</Label><TextInput name="image" type="file" accept="image/*" /></div>
              <div><Label>Видео URL</Label><TextInput name="videoUrl" defaultValue={section.videoUrl || ""} /></div>
              <div><Label>Дараалал</Label><TextInput name="displayOrder" type="number" defaultValue={section.displayOrder} /></div>
              <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked={section.active} /> Идэвхтэй</label>
              <SubmitButton />
            </form>
            <form action={deleteDepartmentSection} className="mt-3">
              <input type="hidden" name="id" value={section.id} />
              <DeleteButton />
            </form>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
