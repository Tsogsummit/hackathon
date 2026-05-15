import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { AdminScheduleForm } from "@/components/AdminScheduleForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditSchedulePage({ params }: { params: { id: string } }) {
  requireAdmin();

  const [scheduleData, classes] = await Promise.all([
    prisma.scheduleItem.findUnique({ where: { id: params.id } }),
    prisma.schoolClass.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!scheduleData) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-brand-navy">Хуваарь засах: {scheduleData.title}</h1>
        <p className="mt-1 text-slate-500">Хөтөлбөрийн мэдээллийг засах</p>
      </div>

      <AdminScheduleForm initialData={scheduleData} classes={classes} />
    </AdminShell>
  );
}
