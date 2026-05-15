import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { ClassSectionBlockForm } from "@/components/ClassSectionBlockForm";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteClassSection, saveClassSection } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ClassSectionsPage({ params }: { params: { id: string } }) {
  requireAdmin();
  const schoolClass = await prisma.schoolClass.findUnique({
    where: { id: params.id },
    include: { sections: { orderBy: { displayOrder: "asc" } } }
  });
  if (!schoolClass) return null;

  return (
    <AdminShell>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="brand-kicker mb-2">Block Builder</p>
          <h1 className="text-3xl font-black text-brand-navy">{schoolClass.name} танилцуулга</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-600">
            Доорх блокуудыг сонгож өрөөд ангийн хуудсаа хүссэн бүтэцтэйгээр бүтээнэ.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <ClassSectionBlockForm
          action={saveClassSection}
          submitLabel="Шинэ блок нэмэх"
          section={{
            classId: schoolClass.id,
            layout: "TEXT",
            active: true,
            displayOrder: schoolClass.sections.length + 1
          }}
        />
      </Card>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-black text-brand-navy">Одоогийн блокууд</h2>
        <span className="rounded-full bg-brand-mist px-3 py-1 text-sm font-black text-brand-blue">{schoolClass.sections.length}</span>
      </div>

      <div className="grid gap-4">
        {schoolClass.sections.length === 0 ? (
          <Card className="text-center text-sm font-semibold text-slate-500">Одоогоор блок нэмэгдээгүй байна.</Card>
        ) : (
          schoolClass.sections.map((section) => (
            <details key={section.id} className="surface-card group overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <span>
                  <span className="block text-sm font-black uppercase tracking-wide text-brand-blue">{section.layout}</span>
                  <span className="mt-1 block text-lg font-black text-brand-navy">{section.title}</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-500">
                    Дараалал: {section.displayOrder} · {section.active ? "Нийтэд харагдана" : "Нуусан"}
                  </span>
                </span>
                <span className="rounded-lg bg-brand-mist px-3 py-2 text-sm font-black text-brand-blue group-open:hidden">Засах</span>
                <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-sm font-black text-slate-600 group-open:inline">Хаах</span>
              </summary>
              <div className="border-t border-brand-line p-4">
                <ClassSectionBlockForm action={saveClassSection} section={{ ...section, classId: schoolClass.id }} />
                <form action={deleteClassSection} className="mt-3">
                  <input type="hidden" name="id" value={section.id} />
                  <DeleteButton />
                </form>
              </div>
            </details>
          ))
        )}
      </div>
    </AdminShell>
  );
}
