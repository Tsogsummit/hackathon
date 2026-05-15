import { ClassGroup, MapMarkerType } from "@prisma/client";

export const schoolName = "Tselmeg Digital International School";
export const eventTitle = "2025 - 2026 оны хичээлийн жилийн тайлант өдөрлөг";

export const groupLabels: Record<ClassGroup, string> = {
  HIGH: "Ахлах бүлэг",
  MIDDLE: "Дунд бүлэг",
  PRIMARY: "Бага бүлэг"
};

export const groupSlugToEnum: Record<string, ClassGroup> = {
  high: "HIGH",
  middle: "MIDDLE",
  primary: "PRIMARY"
};

export const groupEnumToSlug: Record<ClassGroup, string> = {
  HIGH: "high",
  MIDDLE: "middle",
  PRIMARY: "primary"
};

export const markerTypeLabels: Record<MapMarkerType, string> = {
  STAGE: "Тайз",
  BOOTH: "Саравч",
  CLASS_LOCATION: "Анги",
  INFO: "Мэдээллийн хэсэг",
  ENTRANCE: "Орц/Гарц",
  CUSTOM: "Бусад"
};

export function isActiveEmpty<T extends { active: boolean }>(items: T[]) {
  return items.filter((item) => item.active).length === 0;
}
