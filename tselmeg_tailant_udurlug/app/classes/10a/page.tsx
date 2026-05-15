import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "teacher",
    tone: "sky",
    icon: "award",
    label: "Ангийн багш",
    title: "Б.Мөнхцэцэг багштай 10А анги",
    achievements: [
      { badge: "20 сурагч", name: "10А анги", event: "13 эрэгтэй, 7 эмэгтэй" },
    ],
    images: [{ src: "/slides/10a/image1.jpg", caption: "Ангийн багш Б.Мөнхцэцэг" }],
  },
  {
    id: "parliament-script",
    tone: "amber",
    icon: "book",
    label: "Оролцоо",
    title: "Өсвөрийн парламент, үндэсний бичиг, төгсөлт",
    achievements: [
      { badge: "Сертификат", name: "10А анги", event: "Өсвөрийн парламент" },
      { badge: "Тэргүүн байр", name: "10А анги", event: "10-р анги дундах үндэсний бичиг унших тэмцээн" },
      { badge: "Дүүрэгт оролцох эрх", name: "10А анги", event: "Үндэсний бичгийн тэмцээн" },
    ],
    images: [{ src: "/slides/10a/image3.jpg", caption: "Төгсөлт, ангийн үйл ажиллагаа" }],
  },
  {
    id: "sports",
    tone: "blue",
    icon: "trophy",
    label: "Спорт",
    title: "САШТ болон гар бөмбөгийн амжилт",
    achievements: [
      { badge: "Хүрэл медаль", name: "Эрэгтэй баг", event: "САШТ 2026" },
      { badge: "Хүрэл медаль", name: "Эрэгтэй баг", event: "САШТ 2025" },
      { badge: "Мөнгөн медаль", name: "10А анги", event: "2025 оны гар бөмбөгийн тэмцээн" },
      { badge: "MVP", name: "10А анги", event: "2025 оны гар бөмбөг" },
    ],
    images: [
      { src: "/slides/10a/image4.jpg", caption: "САШТ багийн амжилт" },
      { src: "/slides/10a/image5.jpg", caption: "Гар бөмбөгийн тэмцээн" },
    ],
  },
  {
    id: "arts",
    tone: "pink",
    icon: "star",
    label: "Урлаг",
    title: "Урлагийн үзлэг",
    achievements: [
      { badge: "Идэвхтэй оролцоо", name: "10А анги", event: "Урлагийн үзлэг" },
    ],
    images: [
      { src: "/slides/10a/image6.jpg", caption: "Урлагийн үзлэг" },
      { src: "/slides/10a/image7.jpg", caption: "Урлагийн үзлэг" },
      { src: "/slides/10a/image8.jpg", caption: "Хөгжмийн үзүүлбэр" },
    ],
  },
  {
    id: "trip-3x3",
    tone: "green",
    icon: "medal",
    label: "Аялал & Спорт",
    title: "Намрын аялал, олс таталт, 3x3",
    achievements: [
      { badge: "Цом", name: "10А анги", event: "Олс таталт" },
      { badge: "Хүрэл медаль", name: "10А анги", event: "3x3 сагсан бөмбөг" },
      { badge: "Дурсамж", name: "10А анги", event: "2025 намрын аялал" },
    ],
    images: [
      { src: "/slides/10a/image9.jpg", caption: "Намрын аялал" },
      { src: "/slides/10a/image10.jpg", caption: "Намрын аялал" },
      { src: "/slides/10a/image11.jpg", caption: "Аяллын дурсамж" },
    ],
  },
  {
    id: "exams-olympiads",
    tone: "teal",
    icon: "book",
    label: "Сурлага",
    title: "МХБ шалгалт болон олон улсын олимпиадууд",
    achievements: [
      { badge: "700 оноо", name: "Батмөрөн", event: "МХБ шалгалт" },
      { badge: "685 оноо", name: "Мичидмаа", event: "МХБ шалгалт" },
      { badge: "Тэтгэлэг", name: "Ч.Анар-Эрдэнэ", event: "Хятадын их сургуулийн зуны хөтөлбөр" },
      { badge: "Оролцсон", name: "Мөнхжин, Билгүүнтөгөлдөр, Баярт-Од", event: "АМО олон улсын олимпиад" },
      { badge: "Оролцсон", name: "Итгэл, Эрхэс, Баярт-Од", event: "SASMO олон улсын олимпиад" },
    ],
    images: [],
  },
  {
    id: "bayartod",
    tone: "indigo",
    icon: "award",
    label: "Сурагч Баярт-Од",
    title: "IT, хакатон, сурагчдын холбооны амжилт",
    achievements: [
      { badge: "3-р байр", name: "Баярт-Од", event: "Дүүргийн IT-ийн олимпиад" },
      { badge: "Шагнал", name: "Баярт-Од", event: "Монголын сурагчдын холбооны Эрдэм Оюу" },
      { badge: "4-р байр", name: "Баярт-Од", event: "Tomyo hackathon" },
      { badge: "7-р байр", name: "Баярт-Од", event: "Харуул Занги 2026 U18" },
      { badge: "9-р байр", name: "Баярт-Од", event: "Харуул Занги 2025 U18" },
    ],
    images: [
      { src: "/slides/10a/image12.jpg", caption: "Баярт-Од - амжилт" },
      { src: "/slides/10a/image13.jpg", caption: "Эрдэм Оюу шагнал" },
      { src: "/slides/10a/image14.jpg", caption: "Election day 2026" },
    ],
  },
  {
    id: "munkhjin",
    tone: "purple",
    icon: "medal",
    label: "Сурагч Мөнхжин",
    title: "IT олимпиад, Tomyo hackathon, Харуул Занги",
    achievements: [
      { badge: "13-р байр", name: "Мөнхжин", event: "Дүүргийн IT-ийн олимпиад" },
      { badge: "4-р байр", name: "Мөнхжин", event: "Tomyo hackathon" },
      { badge: "7-р байр", name: "Мөнхжин", event: "Харуул Занги 2026 U18" },
    ],
    images: [
      { src: "/slides/10a/image15.jpg", caption: "IT, хакатон амжилт" },
      { src: "/slides/10a/image16.jpg", caption: "Tomyo hackathon" },
    ],
  },
];

export default function TenAPage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="10А"
      totalStudents={20}
      maleStudents={13}
      femaleStudents={7}
      teacher="Б.Мөнхцэцэг"
      coverImage={{ src: "/slides/10a/image2.jpg", alt: "10А анги", caption: "Ангийн багш: Б.Мөнхцэцэг" }}
      intro={
        <>
          10А анги нь <span className="font-black text-brand-navy">20 сурагчтай</span>, спорт, урлаг, үндэсний бичиг,
          олимпиад, технологи болон нийгмийн оролцооны чиглэлээр амжилт гаргасан ахлах ангийн хамт олон.
        </>
      }
      sections={sections}
      footer="10А анги - Хичээл, спорт, технологиор манлайлсан хамт олон"
    />
  );
}
