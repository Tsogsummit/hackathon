import { AdminShell } from "@/components/AdminShell";
import { AdminClassForm } from "@/components/AdminClassForm";
import { requireAdmin } from "@/lib/auth";

export default function NewClassPage() {
  requireAdmin();

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-brand-navy">Шинэ анги нэмэх</h1>
        <p className="mt-1 text-slate-500">Шинэ ангийн мэдээллийг оруулна уу.</p>
      </div>

      <AdminClassForm />
    </AdminShell>
  );
}
