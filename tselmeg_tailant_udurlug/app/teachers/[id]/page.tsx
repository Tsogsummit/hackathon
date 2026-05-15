import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { PublicShell } from "@/components/PublicShell";
import fs from "fs";
import path from "path";

const departments: Record<string, { shortName: string; fullName: string }> = {
  bazan: { shortName: "БАЗАН", fullName: "Бага ангийн заах аргын нэгдэл" },
  buzan: { shortName: "БУЗАН", fullName: "Байгалийн ухааны заах аргын нэгдэл" },
  ghzan: { shortName: "ГХЗАН", fullName: "Гадаад хэлний заах аргын нэгдэл" },
  hha: { shortName: "ХХА", fullName: "Хүүхэд хөгжлийн алба" },
  nuzan: { shortName: "НУЗАН", fullName: "Нийгмийн ухааны заах аргын нэгдэл" },
};

export default async function TeacherDepartmentPage({ params }: { params: { id: string } }) {
  const department = departments[params.id];
  if (!department) notFound();

  const cardsDir = path.join(process.cwd(), "public", "uploads", "teachers_cards", params.id);

  let teacherCards: string[] = [];
  let negdelImage: string | null = null;

  try {
    const files = fs.readdirSync(cardsDir);
    teacherCards = files
      .filter((file) => file.includes("_teacher_"))
      // Sort alphabetically which should sort teacher 1, 2, 3 nicely.
      // E.g., БАЗАН_1_teacher_1.png
      .sort((a, b) => a.localeCompare(b));

    const negdelFile = files.find((file) => file.includes("negdel"));
    if (negdelFile) {
      negdelImage = `/uploads/teachers_cards/${params.id}/${negdelFile}`;
    }
  } catch (error) {
    console.error("Error reading teacher cards directory:", error);
  }

  return (
    <PublicShell showBack>
      <div className="mb-5 text-center">
        <p className="brand-kicker mb-2">Academic Team</p>
        <h1 className="section-title text-2xl sm:text-3xl">{department.shortName}</h1>
        <p className="mt-1 text-sm font-bold text-slate-600 sm:text-base">{department.fullName}</p>
      </div>

      {negdelImage && (
        <Card className="mb-5 overflow-hidden p-0">
          <Image
            src={negdelImage}
            alt="Нэгдэлийн зураг"
            width={1200}
            height={800}
            className="h-auto w-full object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </Card>
      )}

      {teacherCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teacherCards.map((card) => (
            <div key={card} className="teacher-profile-card">
              <div className="teacher-profile-frame">
                <Image
                  src={`/uploads/teachers_cards/${params.id}/${card}`}
                  alt="Teacher Profile"
                  width={900}
                  height={420}
                  className="teacher-profile-image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center text-slate-600">Энэ хэсгийн мэдээлэл удахгүй нэмэгдэнэ.</Card>
      )}
    </PublicShell>
  );
}
