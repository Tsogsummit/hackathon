"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClassGroup, MapMarkerType } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publishLive } from "@/lib/live-bus";
import { saveUploadedImage } from "@/lib/upload";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function int(formData: FormData, key: string) {
  return Number.parseInt(text(formData, key) || "0", 10) || 0;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function imageUrl(formData: FormData, key: string, fallback?: string | null) {
  const file = formData.get(key);
  if (file instanceof File && file.size > 0) return saveUploadedImage(file);
  return fallback || null;
}

export async function saveClass(formData: FormData) {
  requireAdmin();
  const id = text(formData, "id");
  const existing = id ? await prisma.schoolClass.findUnique({ where: { id } }) : null;
  const data = {
    group: text(formData, "group") as ClassGroup,
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    homeroomTeacher: text(formData, "homeroomTeacher"),
    totalStudents: int(formData, "totalStudents"),
    maleStudents: int(formData, "maleStudents"),
    femaleStudents: int(formData, "femaleStudents"),
    introduction: text(formData, "introduction"),
    mainImageUrl: await imageUrl(formData, "mainImage", existing?.mainImageUrl),
    active: bool(formData, "active"),
    displayOrder: int(formData, "displayOrder")
  };
  if (id) await prisma.schoolClass.update({ where: { id }, data });
  else await prisma.schoolClass.create({ data });
  revalidatePath("/");
  redirect("/admin/classes");
}

export async function deleteClass(formData: FormData) {
  requireAdmin();
  await prisma.schoolClass.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/");
}

export async function saveClassSection(formData: FormData) {
  requireAdmin();
  const id = text(formData, "id");
  const classId = text(formData, "classId");
  const existing = id ? await prisma.classSection.findUnique({ where: { id } }) : null;
  const data = {
    classId,
    layout: text(formData, "layout") || "TEXT",
    eyebrow: text(formData, "eyebrow"),
    title: text(formData, "title"),
    body: text(formData, "body"),
    imageUrl: await imageUrl(formData, "image", existing?.imageUrl),
    videoUrl: text(formData, "videoUrl"),
    buttonLabel: text(formData, "buttonLabel"),
    buttonUrl: text(formData, "buttonUrl"),
    active: bool(formData, "active"),
    displayOrder: int(formData, "displayOrder")
  };
  if (id) await prisma.classSection.update({ where: { id }, data });
  else await prisma.classSection.create({ data });
  revalidatePath("/");
  redirect(`/admin/classes/${classId}/sections`);
}

export async function deleteClassSection(formData: FormData) {
  requireAdmin();
  await prisma.classSection.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/");
}

export async function saveDepartment(formData: FormData) {
  requireAdmin();
  const id = text(formData, "id");
  const existing = id ? await prisma.teacherDepartment.findUnique({ where: { id } }) : null;
  const data = {
    fullName: text(formData, "fullName"),
    shortName: text(formData, "shortName"),
    slug: text(formData, "slug"),
    introduction: text(formData, "introduction"),
    mainImageUrl: await imageUrl(formData, "mainImage", existing?.mainImageUrl),
    active: bool(formData, "active"),
    displayOrder: int(formData, "displayOrder")
  };
  if (id) await prisma.teacherDepartment.update({ where: { id }, data });
  else await prisma.teacherDepartment.create({ data });
  revalidatePath("/");
  redirect("/admin/teacher-departments");
}

export async function saveDepartmentSection(formData: FormData) {
  requireAdmin();
  const id = text(formData, "id");
  const departmentId = text(formData, "departmentId");
  const existing = id ? await prisma.teacherDepartmentSection.findUnique({ where: { id } }) : null;
  const data = {
    departmentId,
    title: text(formData, "title"),
    body: text(formData, "body"),
    imageUrl: await imageUrl(formData, "image", existing?.imageUrl),
    videoUrl: text(formData, "videoUrl"),
    active: bool(formData, "active"),
    displayOrder: int(formData, "displayOrder")
  };
  if (id) await prisma.teacherDepartmentSection.update({ where: { id }, data });
  else await prisma.teacherDepartmentSection.create({ data });
  revalidatePath("/");
  redirect(`/admin/teacher-departments/${departmentId}/sections`);
}

export async function deleteDepartment(formData: FormData) {
  requireAdmin();
  await prisma.teacherDepartment.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/");
}

export async function deleteDepartmentSection(formData: FormData) {
  requireAdmin();
  await prisma.teacherDepartmentSection.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/");
}

export async function saveMap(formData: FormData) {
  requireAdmin();
  const existing = await prisma.eventMap.findUnique({ where: { id: "main-map" } });
  await prisma.eventMap.upsert({
    where: { id: "main-map" },
    update: {
      backgroundUrl: await imageUrl(formData, "background", existing?.backgroundUrl),
      googleMapsUrl: text(formData, "googleMapsUrl")
    },
    create: {
      id: "main-map",
      backgroundUrl: await imageUrl(formData, "background", null),
      googleMapsUrl: text(formData, "googleMapsUrl")
    }
  });
  revalidatePath("/map");
}

export async function saveMarker(formData: FormData) {
  requireAdmin();
  const id = text(formData, "id");
  const data = {
    eventMapId: "main-map",
    name: text(formData, "name"),
    type: text(formData, "type") as MapMarkerType,
    xPercent: Number(text(formData, "xPercent")) || 50,
    yPercent: Number(text(formData, "yPercent")) || 50,
    classId: text(formData, "classId") || null,
    departmentId: text(formData, "departmentId") || null,
    description: text(formData, "description"),
    status: text(formData, "status"),
    active: bool(formData, "active")
  };
  if (id) await prisma.mapMarker.update({ where: { id }, data });
  else await prisma.mapMarker.create({ data });
  revalidatePath("/map");
  redirect("/admin/map");
}

export async function deleteMarker(formData: FormData) {
  requireAdmin();
  await prisma.mapMarker.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/map");
}

export async function saveLive(formData: FormData) {
  requireAdmin();
  const live = await prisma.liveStatus.upsert({
    where: { id: "main-live" },
    update: { currentStage: text(formData, "currentStage"), currentClassId: text(formData, "currentClassId") || null },
    create: { id: "main-live", currentStage: text(formData, "currentStage"), currentClassId: text(formData, "currentClassId") || null }
  });
  publishLive({ type: "stage", data: live });
  revalidatePath("/map");
}

export async function saveAnnouncement(formData: FormData) {
  requireAdmin();
  const announcement = await prisma.announcement.upsert({
    where: { id: "main-announcement" },
    update: { title: text(formData, "title"), body: text(formData, "body"), enabled: bool(formData, "enabled") },
    create: { id: "main-announcement", title: text(formData, "title"), body: text(formData, "body"), enabled: bool(formData, "enabled") }
  });
  publishLive({ type: "announcement", data: announcement });
  revalidatePath("/");
}

export async function saveScheduleItem(formData: FormData) {
  requireAdmin();
  const id = text(formData, "id");
  const data = {
    title: text(formData, "title"),
    description: text(formData, "description"),
    startTime: text(formData, "startTime"),
    endTime: text(formData, "endTime"),
    location: text(formData, "location"),
    classId: text(formData, "classId") || null,
    active: bool(formData, "active"),
    displayOrder: int(formData, "displayOrder")
  };
  if (id) await prisma.scheduleItem.update({ where: { id }, data });
  else await prisma.scheduleItem.create({ data });
  revalidatePath("/schedule");
  redirect("/admin/schedule");
}

export async function deleteScheduleItem(formData: FormData) {
  requireAdmin();
  await prisma.scheduleItem.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/schedule");
}
