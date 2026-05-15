import { AdminShell } from "@/components/AdminShell";
import { AdminAnnouncementForm } from "@/components/AdminAnnouncementForm";
import { Card } from "@/components/Card";
import { Label, Select, SubmitButton, TextArea, TextInput } from "@/components/FormControls";
import { saveAnnouncement, saveLive } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLivePage() {
  requireAdmin();
  const [live, announcement, classes] = await Promise.all([
    prisma.liveStatus.findUnique({ where: { id: "main-live" } }),
    prisma.announcement.findUnique({ where: { id: "main-announcement" } }),
    prisma.schoolClass.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AdminShell>
      <h1 className="mb-5 text-3xl font-extrabold text-brand-navy">Live мэдээлэл</h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Тайзны одоогийн үзүүлбэр</h2>
          <form action={saveLive} className="grid gap-3">
            <div><Label>Текст</Label><TextInput name="currentStage" defaultValue={live?.currentStage || ""} placeholder="12A ангийн үзүүлбэр" /></div>
            <div><Label>Холбогдох анги</Label><Select name="currentClassId" defaultValue={live?.currentClassId || ""}><option value="">-</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
            <SubmitButton>Live шинэчлэх</SubmitButton>
          </form>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-bold">Зарлал</h2>
          <AdminAnnouncementForm initialData={announcement} />
        </Card>
      </div>
    </AdminShell>
  );
}
