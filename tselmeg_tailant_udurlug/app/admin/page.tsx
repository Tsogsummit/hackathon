import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  requireAdmin();
  const [classes, departments, schedules, live, announcement] = await Promise.all([
    prisma.schoolClass.count(),
    prisma.teacherDepartment.count(),
    prisma.scheduleItem.count(),
    prisma.liveStatus.findUnique({ where: { id: "main-live" } }),
    prisma.announcement.findUnique({ where: { id: "main-announcement" } })
  ]);

  return (
    <AdminShell>
      <h1 className="mb-5 text-3xl font-extrabold text-brand-navy">Админ самбар</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Нийт анги</p><b className="text-3xl">{classes}</b></Card>
        <Card><p className="text-sm text-slate-500">Заах аргын нэгдэл</p><b className="text-3xl">{departments}</b></Card>
        <Card><p className="text-sm text-slate-500">Хуваарь</p><b className="text-3xl">{schedules}</b></Card>
        <Card><p className="text-sm text-slate-500">Зар</p><b>{announcement?.enabled ? "Идэвхтэй" : "Идэвхгүй"}</b></Card>
      </div>
      <Card className="mt-4">
        <p className="text-sm text-slate-500">Одоо тайзан дээр</p>
        <p className="text-xl font-bold text-brand-red">{live?.currentStage || "Мэдээлэл ороогүй"}</p>
      </Card>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/admin/classes" className="rounded-lg bg-brand-blue px-4 py-3 font-semibold text-white">Анги удирдах</Link>
        <Link href="/admin/live" className="rounded-lg bg-brand-red px-4 py-3 font-semibold text-white">Live шинэчлэх</Link>
        <Link href="/admin/schedule" className="rounded-lg bg-brand-blue px-4 py-3 font-semibold text-white">Хуваарь нэмэх</Link>
      </div>
    </AdminShell>
  );
}
