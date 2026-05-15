import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { DeleteButton } from "@/components/DeleteButton";
import { Label, Select, SubmitButton, TextArea, TextInput } from "@/components/FormControls";
import { MarkerPositionPicker } from "@/components/MarkerPositionPicker";
import { deleteMarker, saveMap, saveMarker } from "@/app/admin/actions";
import { markerTypeLabels } from "@/lib/content";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapMarkerType } from "@prisma/client";

export default async function AdminMapPage() {
  requireAdmin();
  const [eventMap, classes, departments] = await Promise.all([
    prisma.eventMap.findUnique({ where: { id: "main-map" }, include: { markers: true } }),
    prisma.schoolClass.findMany({ orderBy: { name: "asc" } }),
    prisma.teacherDepartment.findMany({ orderBy: { displayOrder: "asc" } })
  ]);

  return (
    <AdminShell>
      <h1 className="mb-5 text-3xl font-extrabold text-brand-navy">Мап удирдах</h1>
      <Card className="mb-6">
        <form action={saveMap} encType="multipart/form-data" className="grid gap-3">
          <div><Label>Мап зураг солих</Label><TextInput name="background" type="file" accept="image/*" /></div>
          <div><Label>Google Maps холбоос</Label><TextInput name="googleMapsUrl" defaultValue={eventMap?.googleMapsUrl || ""} /></div>
          <SubmitButton />
        </form>
      </Card>
      <Card className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Шинэ marker</h2>
        <form action={saveMarker} className="grid gap-3">
          <div><Label>Нэр</Label><TextInput name="name" required /></div>
          <div><Label>Төрөл</Label><Select name="type">{Object.values(MapMarkerType).map((type) => <option key={type} value={type}>{markerTypeLabels[type]}</option>)}</Select></div>
          <MarkerPositionPicker backgroundUrl={eventMap?.backgroundUrl} />
          <div><Label>Анги холбох</Label><Select name="classId"><option value="">-</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
          <div><Label>Заах аргын нэгдэл холбох</Label><Select name="departmentId"><option value="">-</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}</Select></div>
          <div><Label>Тайлбар</Label><TextArea name="description" /></div>
          <div><Label>Төлөв</Label><TextInput name="status" /></div>
          <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked /> Идэвхтэй</label>
          <SubmitButton />
        </form>
      </Card>
      <div className="grid gap-4">
        {(eventMap?.markers || []).map((marker) => (
          <Card key={marker.id}>
            <form action={saveMarker} className="grid gap-3">
              <input type="hidden" name="id" value={marker.id} />
              <div><Label>Нэр</Label><TextInput name="name" defaultValue={marker.name} required /></div>
              <div><Label>Төрөл</Label><Select name="type" defaultValue={marker.type}>{Object.values(MapMarkerType).map((type) => <option key={type} value={type}>{markerTypeLabels[type]}</option>)}</Select></div>
              <MarkerPositionPicker backgroundUrl={eventMap?.backgroundUrl} defaultX={marker.xPercent} defaultY={marker.yPercent} />
              <div><Label>Анги</Label><Select name="classId" defaultValue={marker.classId || ""}><option value="">-</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
              <div><Label>Заах аргын нэгдэл</Label><Select name="departmentId" defaultValue={marker.departmentId || ""}><option value="">-</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}</Select></div>
              <div><Label>Тайлбар</Label><TextArea name="description" defaultValue={marker.description || ""} /></div>
              <div><Label>Төлөв</Label><TextInput name="status" defaultValue={marker.status || ""} /></div>
              <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked={marker.active} /> Идэвхтэй</label>
              <SubmitButton />
            </form>
            <form action={deleteMarker} className="mt-3"><input type="hidden" name="id" value={marker.id} /><DeleteButton /></form>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
