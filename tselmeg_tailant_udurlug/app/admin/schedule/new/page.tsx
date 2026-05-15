import { AdminShell } from "@/components/AdminShell";
import { AdminScheduleForm } from "@/components/AdminScheduleForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewSchedulePage() {
  requireAdmin();

  const classes = await prisma.schoolClass.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-brand-navy">Шинэ хуваарь нэмэх</h1>
        <p className="mt-1 text-slate-500">Цагийн хуваарьт шинэ хөтөлбөр нэмнэ.</p>
      </div>

      <AdminScheduleForm classes={classes} />
    </AdminShell>
  );
}
