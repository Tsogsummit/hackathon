import { AdminShell } from "@/components/AdminShell";
import { AdminDepartmentForm } from "@/components/AdminDepartmentForm";
import { requireAdmin } from "@/lib/auth";

export default function NewDepartmentPage() {
  requireAdmin();

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-brand-navy">Шинэ заах аргын нэгдэл нэмэх</h1>
        <p className="mt-1 text-slate-500">Нэгдлийн мэдээллийг оруулна уу.</p>
      </div>

      <AdminDepartmentForm />
    </AdminShell>
  );
}
