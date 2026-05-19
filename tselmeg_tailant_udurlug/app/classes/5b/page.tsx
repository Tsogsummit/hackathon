import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "section-1",
    tone: "blue",
    icon: "trophy",
    label: "Танилцуулга",
    title: "ЦЭЛМЭГ ИНТЕРНЭЙШНЛ СУРГУУЛИЙН ТУЯА БАГШТАЙ 5В АНГИЙН ТАНИЛЦУУЛГА",
    achievements: [
      { badge: "Онцлох", name: "Тайлант өдөрлөгийн материал" },
    ],
    images: [
      { src: "/slides/5b/image1.jpeg", caption: "ЦЭЛМЭГ ИНТЕРНЭЙШНЛ СУРГУУЛИЙН ТУЯА БАГШТАЙ 5В АНГИЙН ТАНИЛЦУУЛГА 1" },
      { src: "/slides/5b/image2.jpeg", caption: "ЦЭЛМЭГ ИНТЕРНЭЙШНЛ СУРГУУЛИЙН ТУЯА БАГШТАЙ 5В АНГИЙН ТАНИЛЦУУЛГА 2" },
    ],
  },
  {
    id: "section-2",
    tone: "pink",
    icon: "star",
    label: "Амжилт",
    title: "МАНАЙ ХАМТ ОЛОН",
    achievements: [
      { badge: "Онцлох", name: "Тайлант өдөрлөгийн материал" },
    ],
    images: [
      { src: "/slides/5b/image3.jpeg", caption: "МАНАЙ ХАМТ ОЛОН 1" },
    ],
  },
  {
    id: "section-3",
    tone: "green",
    icon: "award",
    label: "Амжилт",
    title: "Математик “Намрын их сорилго”",
    achievements: [
      { badge: "Онцлох", name: "уралдааны “ ТОП”" },
      { badge: "Онцлох", name: "үнэлгээтэй сурагчид" },
    ],
    images: [
      { src: "/slides/5b/image4.jpeg", caption: "Математик “Намрын их сорилго” 1" },
    ],
  },
  {
    id: "section-4",
    tone: "amber",
    icon: "medal",
    label: "Амжилт",
    title: "Олон улсын Кенгуру уралдаанд амжилттай оролцсон сурагчид",
    achievements: [
      { badge: "Онцлох", name: "Тайлант өдөрлөгийн материал" },
    ],
    images: [
      { src: "/slides/5b/image5.jpeg", caption: "Олон улсын Кенгуру уралдаанд амжилттай оролцсон сурагчид 1" },
      { src: "/slides/5b/image6.jpeg", caption: "Олон улсын Кенгуру уралдаанд амжилттай оролцсон сурагчид 2" },
    ],
  },
  {
    id: "section-5",
    tone: "purple",
    icon: "book",
    label: "Амжилт",
    title: "Даамын дугуйланд суралцаж зэрэгтэй тамирчид боллоо",
    achievements: [
      { badge: "Онцлох", name: "К.Райса" },
      { badge: "Онцлох", name: "II" },
      { badge: "Онцлох", name: "Т. Ананд" },
      { badge: "Онцлох", name: "II" },
      { badge: "Онцлох", name: "Д.Юмчихай" },
      { badge: "Онцлох", name: "III" },
    ],
    images: [
      { src: "/slides/5b/image7.jpeg", caption: "Даамын дугуйланд суралцаж зэрэгтэй тамирчид боллоо 1" },
    ],
  },
  {
    id: "section-6",
    tone: "red",
    icon: "trophy",
    label: "Амжилт",
    title: "Англи хэлний үсэглэл уралдаанд",
    achievements: [
      { badge: "Онцлох", name: "Г.Мөнх-Очир Э.Тэргэл К. Райса" },
    ],
    images: [
      { src: "/slides/5b/image8.jpeg", caption: "Англи хэлний үсэглэл уралдаанд 1" },
    ],
  },
  {
    id: "section-7",
    tone: "sky",
    icon: "star",
    label: "Амжилт",
    title: "Т.Ананд",
    achievements: [
      { badge: "Онцлох", name: "ХУД ДАШТ “хзрэл” Д.Юмчихай сургуулийн ДАШТ" },
      { badge: "Онцлох", name: "сургуулийн ДАШТ “хүрэл “ “ Мөнгөн “медаль" },
    ],
    images: [
      { src: "/slides/5b/image9.jpeg", caption: "Т.Ананд 1" },
      { src: "/slides/5b/image10.jpeg", caption: "Т.Ананд 2" },
    ],
  },
  {
    id: "section-8",
    tone: "teal",
    icon: "award",
    label: "Амжилт",
    title: "Сургуулийн “ Талархлын захидал” бичих уралдаанд",
    achievements: [
      { badge: "Онцлох", name: "Д.Юмчихай" },
      { badge: "Онцлох", name: "II" },
      { badge: "Онцлох", name: "байр" },
      { badge: "Онцлох", name: "Т.Ананд" },
      { badge: "Онцлох", name: "байр" },
    ],
    images: [
      { src: "/slides/5b/image11.jpeg", caption: "Сургуулийн “ Талархлын захидал” бичих уралдаанд 1" },
    ],
  },
  {
    id: "section-9",
    tone: "indigo",
    icon: "medal",
    label: "Амжилт",
    title: "Урлагийн наадам",
    achievements: [
      { badge: "Онцлох", name: "Гоцлол дуу" },
      { badge: "Онцлох", name: "гоцлол бүжиг" },
      { badge: "Онцлох", name: "гоцлол хөгжим" },
      { badge: "Онцлох", name: "Д. Юмчихай Ж. Энх-Ундрам" },
      { badge: "Онцлох", name: "Б. Саруулцэлмэг" },
      { badge: "Онцлох", name: "“ хүрэл “ “ мөнгө “" },
      { badge: "Онцлох", name: "“мөнгө”" },
    ],
    images: [
      { src: "/slides/5b/image12.jpeg", caption: "Урлагийн наадам 1" },
    ],
  },
  {
    id: "section-10",
    tone: "blue",
    icon: "book",
    label: "Амжилт",
    title: "Чөлөөт үзүүлбэр",
    achievements: [
      { badge: "Онцлох", name: "Т.Ананд" },
      { badge: "Онцлох", name: "М.Баттэнгэр" },
      { badge: "Онцлох", name: "байр “Алт" },
      { badge: "Онцлох", name: "Чөлөөт үзүүлбэр" },
    ],
    images: [
      { src: "/slides/5b/image13.png", caption: "Чөлөөт үзүүлбэр 1" },
      { src: "/slides/5b/image14.png", caption: "Чөлөөт үзүүлбэр 2" },
    ],
  },
  {
    id: "section-11",
    tone: "pink",
    icon: "trophy",
    label: "Амжилт",
    title: "Намрын спартакиад",
    achievements: [
      { badge: "Онцлох", name: "Ганцаарчилсан" },
      { badge: "Онцлох", name: "төрөлд" },
      { badge: "Онцлох", name: "Гар дээр" },
      { badge: "Онцлох", name: "суниалт" },
      { badge: "Онцлох", name: "С.Энхболд “алт”" },
      { badge: "Онцлох", name: "Ч.Одмаа “мөнгө”" },
      { badge: "Онцлох", name: "100" },
      { badge: "Онцлох", name: "м гүйлт" },
      { badge: "Онцлох", name: "Б.Мандуул “алт”" },
      { badge: "Онцлох", name: "М.Цэгц-Үжин" },
      { badge: "Онцлох", name: "“мөнгө" },
      { badge: "Онцлох", name: "Байрнаас" },
      { badge: "Онцлох", name: "уртад" },
      { badge: "Онцлох", name: "Э.Дөлгөөн “мөнгө”" },
      { badge: "Онцлох", name: "З.Оюунтзое" },
      { badge: "Онцлох", name: "“алт”" },
    ],
    images: [
      { src: "/slides/5b/image15.png", caption: "Намрын спартакиад 1" },
    ],
  },
  {
    id: "section-12",
    tone: "green",
    icon: "star",
    label: "Амжилт",
    title: "Буухиа эмэгтэй “мөнгөн” медаль",
    achievements: [
      { badge: "Онцлох", name: "Тайлант өдөрлөгийн материал" },
    ],
    images: [
      { src: "/slides/5b/image16.png", caption: "Буухиа эмэгтэй “мөнгөн” медаль 1" },
    ],
  },
  {
    id: "section-13",
    tone: "amber",
    icon: "award",
    label: "Амжилт",
    title: "Буухай гүйлт эрэгтэй “ мөнгөн” медаль",
    achievements: [
      { badge: "Онцлох", name: "Тайлант өдөрлөгийн материал" },
    ],
    images: [
      { src: "/slides/5b/image17.jpeg", caption: "Буухай гүйлт эрэгтэй “ мөнгөн” медаль 1" },
    ],
  }
];

export default function Class5BPage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="5Б"
      totalStudents={0}
      maleStudents={0}
      femaleStudents={0}
      coverImage={{ src: "/slides/5b/image1.jpeg", alt: "5Б анги", caption: "5Б ангийн тайлант өдөрлөг" }}
      intro={
        <>
          5Б ангийн тайлант өдөрлөгийн материал, амжилт бүтээлийг нэгтгэн харууллаа.
        </>
      }
      sections={sections}
      footer="5Б анги - Тайлант өдөрлөг 2025-2026"
    />
  );
}
