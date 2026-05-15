import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { AdminDepartmentForm } from "@/components/AdminDepartmentForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditDepartmentPage({ params }: { params: { id: string } }) {
  requireAdmin();

  const departmentData = await prisma.teacherDepartment.findUnique({
    where: { id: params.id },
  });

  if (!departmentData) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-brand-navy">Нэгдэл засах: {departmentData.fullName}</h1>
        <p className="mt-1 text-slate-500">Нэгдлийн үндсэн мэдээлэл болон контентыг засах</p>
      </div>

      <AdminDepartmentForm initialData={departmentData} />
    </AdminShell>
  );
}
