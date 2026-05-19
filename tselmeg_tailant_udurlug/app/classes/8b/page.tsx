import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "sports-day",
    tone: "blue",
    icon: "trophy",
    label: "Спортын амжилт",
    title: "Намрын спортын наадам - “Шилдэг анги”",
    achievements: [
      { badge: "1-р байр", name: "Учрал", event: "100м гүйлт" },
      { badge: "3-р байр", name: "М. Эрхэс", event: "100м гүйлт" },
      { badge: "1-р байр", name: "Мишээл", event: "800м гүйлт" },
      { badge: "3-р байр", name: "М. Эрхэс", event: "800м гүйлт" },
      { badge: "1-р байр", name: "Тогтуунцэлмэг", event: "Гар дарж сунайх" },
      { badge: "3-р байр", name: "Мөнхномин", event: "Гар дарж сунайх" },
      { badge: "2-р байр", name: "Г. Эрхэс", event: "Уртын харайлт" },
      { badge: "1-р байр", name: "8Б анги", event: "Олс таталт" },
      { badge: "1-р байр", name: "Эмэгтэй баг", event: "Буухиа гүйлт" },
      { badge: "3-р байр", name: "Эрэгтэй баг", event: "Буухиа гүйлт" },
    ],
    images: [
      { src: "/slides/8b/image2.jpg", caption: "Намрын спортын наадам" },
      { src: "/slides/8b/image3.jpg", caption: "Спортын наадмын шагналтнууд" },
    ],
  },
  {
    id: "arts",
    tone: "purple",
    icon: "star",
    label: "Урлагийн амжилт",
    title: "Урлагийн наадам",
    achievements: [
      { badge: "3-р байр", name: "Мөнхтайшир", event: "Гоцлол дуу" },
      { badge: "3-р байр", name: "8Б анги", event: "Найрал дуу" },
    ],
    images: [
      { src: "/slides/8b/image4.jpg", caption: "Найрал дуу" },
      { src: "/slides/8b/image5.jpg", caption: "Урлагийн наадам" },
    ],
  },
  {
    id: "basketball",
    tone: "red",
    icon: "medal",
    label: "Спортын амжилт",
    title: "Сургуулийн аварга шалгаруулах сагсан бөмбөгийн тэмцээн",
    achievements: [
      { badge: "3-р байр", name: "Эмэгтэй баг", event: "Сагсан бөмбөг" },
    ],
    images: [
      { src: "/slides/8b/image6.jpg", caption: "Сагсан бөмбөгийн эмэгтэй баг" },
    ],
  },
  {
    id: "math",
    tone: "sky",
    icon: "book",
    label: "Сурлагын амжилт",
    title: "Алгебрын илэрхийллийн бодлогын аварга анги",
    achievements: [
      { badge: "Цомын эзэн", name: "8Б анги", event: "8-9-р ангиудын дунд зохион байгуулсан бодлогын уралдаан" },
    ],
    images: [
      { src: "/slides/8b/image7.jpg", caption: "Алгебрын бодлогын аварга анги" },
    ],
  },
  {
    id: "calligraphy",
    tone: "amber",
    icon: "award",
    label: "Монгол бичиг",
    title: "Сайхан бичигтэн анги",
    achievements: [
      { badge: "1-р байр", name: "8Б анги", event: "Дунд ангиудын дунд зохион байгуулсан сайхан бичигтэн тэмцээн" },
    ],
    images: [
      { src: "/slides/8b/image8.jpg", caption: "Сайхан бичигтэн анги" },
    ],
  },
  {
    id: "checkers",
    tone: "green",
    icon: "trophy",
    label: "100 буудалт даам",
    title: "Сургууль болон Хан-Уул дүүргийн аварга шалгаруулах тэмцээн",
    achievements: [
      { badge: "1-р байр", name: "Д. Ананд", event: "Сургуулийн аварга шалгаруулах тэмцээн" },
      { badge: "3-р байр", name: "М. Эрхэс", event: "Сургуулийн аварга шалгаруулах тэмцээн" },
      { badge: "2-р зэрэг", name: "Д. Ананд", event: "Хан-Уул дүүргийн аварга шалгаруулах тэмцээн" },
      { badge: "3-р зэрэг", name: "М. Эрхэс", event: "Хан-Уул дүүргийн аварга шалгаруулах тэмцээн" },
    ],
    images: [
      { src: "/slides/8b/image9.jpg", caption: "Хан-Уул дүүргийн 100 буудалт даамны тэмцээн" },
    ],
  },
  {
    id: "field-trips",
    tone: "pink",
    icon: "star",
    label: "Танин мэдэхүй",
    title: "Үйлдвэртэй танилцах болон явган аялал",
    achievements: [
      { badge: "Оролцсон", name: "8Б анги", event: "“Миний мэргэжил” үйлдвэртэй танилцах аялал" },
      { badge: "Оролцсон", name: "8Б анги", event: "Бие даалтын 7 хоногийн явган аялал" },
    ],
    images: [
      { src: "/slides/8b/image10.jpg", caption: "Үйлдвэртэй танилцах аялал" },
      { src: "/slides/8b/image11.jpg", caption: "Мэргэжил, үйлдвэрлэлийн орчинтой танилцсан нь" },
      { src: "/slides/8b/image12.jpg", caption: "Бие даалтын 7 хоногийн явган аялал" },
    ],
  },
  {
    id: "excursion",
    tone: "teal",
    icon: "award",
    label: "Аялалт хичээл",
    title: "Экскурс аялалт хичээл",
    achievements: [
      { badge: "Оролцсон", name: "8Б анги", event: "Экскурс аялалт хичээлээр танин мэдэхүйн үйл ажиллагаанд хамрагдав." },
    ],
    images: [
      { src: "/slides/8b/image13.jpg", caption: "Экскурс аялалт хичээл" },
      { src: "/slides/8b/image14.jpg", caption: "Анги хамт олны аялалт хичээл" },
    ],
  },
];

export default function EightBPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="8Б"
      totalStudents={26}
      maleStudents={14}
      femaleStudents={12}
      teacher="Б.Далайсүрэн"
      leader="М.Есүй"
      coverImage={{ src: "/slides/8b/image1.jpg", alt: "8Б анги", caption: "Б. Далайсүрэн багштай 8Б анги" }}
      intro={
        <>
          8Б ангийн сурагчид хичээл сурлагаас гадна урлаг, спорт, танин мэдэхүй, олон нийтийн үйл ажиллагаанд идэвхтэй оролцдог, хамтын зохион байгуулалт сайтай хамт олон юм.
        </>
      }
      sections={sections}
      footer="8Б анги - Амжилт, хөгжил, нэгдмэл хамт олон"
    />
  );
}
