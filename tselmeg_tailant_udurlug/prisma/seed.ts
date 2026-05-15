import { PrismaClient, ClassGroup } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tselmeg.edu.mn";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashPassword(adminPassword) },
    create: { email: adminEmail, passwordHash: hashPassword(adminPassword) }
  });

  const high = ["9A", "9B", "10A", "10B", "10C", "11A", "11B", "11C", "12A", "12B"];
  const middle = ["6A", "6B", "6C", "7A", "7B", "7C", "8A", "8B"];
  const primary = ["2A", "2B", "2C", "3B", "4B"];

  for (const [index, name] of high.entries()) {
    await prisma.schoolClass.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: { name, slug: name.toLowerCase(), group: ClassGroup.HIGH, displayOrder: index + 1 }
    });
  }

  for (const [index, name] of middle.entries()) {
    await prisma.schoolClass.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: { name, slug: name.toLowerCase(), group: ClassGroup.MIDDLE, displayOrder: index + 1 }
    });
  }

  for (const [index, name] of primary.entries()) {
    await prisma.schoolClass.upsert({
      where: { slug: name.toLowerCase() },
      update: { group: ClassGroup.PRIMARY, displayOrder: index + 1, active: true },
      create: { name, slug: name.toLowerCase(), group: ClassGroup.PRIMARY, displayOrder: index + 1 }
    });
  }

  const departments = [
    ["Байгалийн ухааны заах аргын нэгдэл", "БУЗАН", "buzan"],
    ["Гадаад хэлний заах аргын нэгдэл", "ГХЗАН", "ghzan"],
    ["Нийгмийн ухааны заах аргын нэгдэл", "НУЗАН", "nuzan"],
    ["Бага ангийн заах аргын нэгдэл", "БАЗАН", "bazan"],
    ["Хүүхэд хөгжлийн алба", "ХХА", "hha"]
  ];

  for (const [index, [fullName, shortName, slug]] of departments.entries()) {
    await prisma.teacherDepartment.upsert({
      where: { slug },
      update: {},
      create: { fullName, shortName, slug, displayOrder: index + 1 }
    });
  }

  await prisma.eventMap.upsert({
    where: { id: "main-map" },
    update: {},
    create: { id: "main-map", title: "Тайлант өдөрлөгийн мап" }
  });

  await prisma.liveStatus.upsert({
    where: { id: "main-live" },
    update: {},
    create: { id: "main-live", currentStage: "Мэдээлэл удахгүй нэмэгдэнэ." }
  });

  await prisma.announcement.upsert({
    where: { id: "main-announcement" },
    update: {},
    create: { id: "main-announcement", body: "Тайлант өдөрлөгт тавтай морилно уу.", enabled: false }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
