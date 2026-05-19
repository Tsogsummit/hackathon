import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "class-profile",
    tone: "blue",
    icon: "star",
    label: "Танилцуулга",
    title: "С. Алтанзул багштай 5А анги",
    achievements: [
      { badge: "24 сурагч", name: "5А анги", event: "14 эрэгтэй, 10 эмэгтэй сурагчтай хамт олон" },
      { badge: "Хамт олон", name: "Сурлага, урлаг, спорт, олон нийтийн үйл ажиллагаанд идэвхтэй оролцдог анги." },
    ],
    images: [
      { src: "/slides/5a/image1.jpg", caption: "С. Алтанзул багштай 5А ангийн хамт олон" },
    ],
  },
  {
    id: "dance-club",
    tone: "purple",
    icon: "medal",
    label: "Урлагийн амжилт",
    title: "Бүжгийн дугуйлангийн сурагчид",
    achievements: [
      { badge: "Хүрэл медаль", name: "Бүжгийн дугуйлангийн сурагчид" },
    ],
    images: [],
  },
];

export default function Class5APage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="5А"
      totalStudents={24}
      maleStudents={14}
      femaleStudents={10}
      teacher="С. Алтанзул"
      coverImage={{
        src: "/slides/5a/image1.jpg",
        alt: "5А ангийн хамт олон",
        caption: "С. Алтанзул багштай 5А ангийн хамт олон",
      }}
      intro={
        <>
          5А анги нь нийт 24 сурагчтай. Манай ангийн сурагчид хичээл сурлага, урлаг, спорт болон
          сургуулийн үйл ажиллагаанд идэвхтэй оролцдог, эвсэг хамт олон юм.
        </>
      }
      sections={sections}
      footer="5А анги - Тайлант өдөрлөг 2025-2026"
    />
  );
}
