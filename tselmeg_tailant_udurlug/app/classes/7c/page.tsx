import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "hsk",
    tone: "red",
    icon: "book",
    label: "Хятад хэл",
    title: "HSK2 түвшний шалгалт",
    achievements: [
      { badge: "Амжилттай тэнцсэн", name: "23 сурагч", event: "Хятад хэлний HSK2 түвшин" },
    ],
    images: [],
  },
  {
    id: "dance",
    tone: "pink",
    icon: "star",
    label: "Урлаг",
    title: "Сурагч нас 2026 бүжгийн их наадам",
    achievements: [
      { badge: "Дэд байр", name: "Б.Анирхатан, Отгон-Эрдэнэ", event: "Дэлхийн үндэстнүүдийн олон ардын бүжиг" },
    ],
    images: [{ src: "/slides/7c/image1.jpeg", caption: "Бүжгийн их наадам" }],
  },
  {
    id: "rubik",
    tone: "purple",
    icon: "trophy",
    label: "Оюуны спорт",
    title: "Рубик шооны аварга",
    achievements: [
      { badge: "Алтан медаль", name: "Энхбилиг", event: "Сургуулийн рубик шооны аварга" },
      { badge: "Хүрэл медаль", name: "Бархас", event: "Сургуулийн рубик шооны аварга" },
    ],
    images: [{ src: "/slides/7c/image2.jpeg", caption: "Рубик шооны аварга шалгаруулах тэмцээн" }],
  },
  {
    id: "cs2",
    tone: "blue",
    icon: "award",
    label: "Цахим спорт",
    title: "CS2 6-8-р ангийн тэмцээн",
    achievements: [
      { badge: "2-р байр", name: "7С анги", event: "CS2 тэмцээн" },
      { badge: "Шилдэг тоглогч", name: "7С анги", event: "CS2 6-8-р ангийн тэмцээн" },
    ],
    images: [{ src: "/slides/7c/image3.jpeg", caption: "CS2 тэмцээний амжилт" }],
  },
  {
    id: "letters-art",
    tone: "amber",
    icon: "medal",
    label: "Захидал & Зураг",
    title: "Талархлын захидал болон гар зургийн уралдаанууд",
    achievements: [
      { badge: "2-р байр", name: "Б.Анирхатан", event: "Талархлын захидлын тэмцээн" },
      { badge: "2-р байр", name: "Ц.Анужин", event: "Beautiful women гар зургийн уралдаан" },
      { badge: "3-р байр", name: "7С анги", event: "2026 урлагийн үзлэгийн чөлөөт үзүүлбэр" },
      { badge: "2-р байр", name: "Т.Ирмүүн", event: "Монгол бахархал гар зургийн уралдаан" },
    ],
    images: [{ src: "/slides/7c/image5.jpeg", caption: "Талархлын захидал, гар зургийн уралдаан" }],
  },
  {
    id: "academic-sport",
    tone: "green",
    icon: "trophy",
    label: "Сурлага & Спорт",
    title: "Олимпиад, спартакиад, шинжлэх ухааны 7 хоног",
    achievements: [
      { badge: "1-р байр", name: "Б.Дөлгөөн", event: "Намрын спартакиад 800 метрийн гүйлт" },
      { badge: "7-р байр", name: "Номтойбаяр", event: "Дүүргийн физикийн олимпиад" },
      { badge: "Алтан медаль", name: "Номтойбаяр", event: "Кенгуру олон улсын олимпиад" },
      { badge: "2-р зэрэг", name: "Бархас", event: "Кенгуру олон улсын олимпиад" },
      { badge: "3-р зэрэг", name: "Маргад, Төгсбилэг, Энхбилиг", event: "Кенгуру олон улсын олимпиад" },
      { badge: "1-р байр", name: "7С анги", event: "Химийн Үсэглэлийн хаад тэмцээн" },
    ],
    images: [{ src: "/slides/7c/image6.jpeg", caption: "Олимпиадын амжилтууд" }],
  },
];

export default function SevenCPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="7С"
      totalStudents={25}
      maleStudents={17}
      femaleStudents={8}
      coverImage={{ src: "/slides/7c/image4.jpeg", alt: "7С анги", caption: "7С анги - HSK2 түвшний шалгалтын амжилт" }}
      intro={
        <>
          7С анги нь <span className="font-black text-brand-navy">25 сурагчтай</span>, хэл, урлаг, спорт, цахим спорт,
          олимпиадын чиглэлүүдээр идэвхтэй оролцож олон төрлийн амжилт гаргасан хамт олон.
        </>
      }
      sections={sections}
      footer="7С анги - Олон талын амжилттай, идэвхтэй хамт олон"
    />
  );
}
