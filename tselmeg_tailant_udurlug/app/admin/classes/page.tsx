import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteClass } from "@/app/admin/actions";
import { groupLabels } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PencilLine, Plus } from "lucide-react";

export default async function AdminClassesPage() {
  requireAdmin();
  const classes = await prisma.schoolClass.findMany({ orderBy: [{ group: "asc" }, { displayOrder: "asc" }] });

  return (
    <AdminShell>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-brand-navy">Анги удирдах</h1>
        <Link
          href="/admin/classes/new"
          className="flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 font-bold text-white transition hover:bg-brand-navy"
        >
          <Plus size={20} />
          Шинэ анги нэмэх
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brand-navy">
            <thead className="bg-brand-mist/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-bold">Ангийн нэр</th>
                <th className="px-5 py-4 font-bold">Бүлэг</th>
                <th className="px-5 py-4 font-bold">Багш</th>
                <th className="px-5 py-4 font-bold">Сурагчид</th>
                <th className="px-5 py-4 font-bold text-center">Идэвхтэй</th>
                <th className="px-5 py-4 font-bold text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line/50">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Одоогоор анги бүртгэгдээгүй байна.
                  </td>
                </tr>
              ) : null}
              {classes.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-brand-blue">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    {groupLabels[item.group]}
                  </td>
                  <td className="px-5 py-4">
                    {item.homeroomTeacher || "-"}
                  </td>
                  <td className="px-5 py-4">
                    {item.totalStudents} ({item.maleStudents} эрэгтэй, {item.femaleStudents} эмэгтэй)
                  </td>
                  <td className="px-5 py-4 text-center">
                    {item.active ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">Тийм</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">Үгүй</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/classes/${item.id}/edit`}
                        className="flex items-center gap-1.5 rounded-md bg-brand-mist px-3 py-2 text-xs font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition"
                      >
                        <PencilLine size={15} />
                        Засах
                      </Link>
                      <form action={deleteClass}>
                        <input type="hidden" name="id" value={item.id} />
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
