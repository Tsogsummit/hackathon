import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { AdminClassForm } from "@/components/AdminClassForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditClassPage({ params }: { params: { id: string } }) {
  requireAdmin();

  const classData = await prisma.schoolClass.findUnique({
    where: { id: params.id },
  });

  if (!classData) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-brand-navy">Анги засах: {classData.name}</h1>
        <p className="mt-1 text-slate-500">Ангийн үндсэн мэдээлэл болон контентыг засах</p>
      </div>

      <AdminClassForm initialData={classData} />
    </AdminShell>
  );
}
