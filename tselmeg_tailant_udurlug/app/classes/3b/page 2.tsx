import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "section-1",
    tone: "blue",
    icon: "trophy",
    label: "Танилцуулга",
    title: "Э.Оюунбилэг багштай 3B ангийн танилцуулга",
    achievements: [
      { badge: "Онцлох", name: "3B анги нь 15 эрэгтэй, 5 эмэгтэй нийт 20 сурагчтай ." },
      { badge: "Онцлох", name: "Ангийн нийт сурагчид хичээл сурлага , урлаг, спортын авьяастай, хүмүүжил төлөвшил сайтай ба анги , сургуул ь, улс орноос зохион байгуулдаг үйл ажиллагаанд идэвхтэй оролцдог сургуулийн шилдэг хамт олны нэг юм." },
    ],
    images: [
      { src: "/slides/3b/image1.png", caption: "Э.Оюунбилэг багштай 3B ангийн танилцуулга 1" },
    ],
  },
  {
    id: "section-2",
    tone: "pink",
    icon: "star",
    label: "Амжилт",
    title: "Сургуулийн спортын наадам",
    achievements: [
      { badge: "Онцлох", name: "Буухиа Гүйл т – Алтан медаль" },
    ],
    images: [

    ],
  },
  {
    id: "section-3",
    tone: "green",
    icon: "award",
    label: "Амжилт",
    title: "Байрнаас уртын харайлт",
    achievements: [
      { badge: "Онцлох", name: "Ү.Чинбилэг – Эрэгтэй төрөлд Алтан медаль" },
    ],
    images: [
      { src: "/slides/3b/image2.jpeg", caption: "Байрнаас уртын харайлт 1" },
    ],
  },
  {
    id: "section-4",
    tone: "amber",
    icon: "medal",
    label: "Амжилт",
    title: "О.Нинжин – Эмэгтэй төрөлд Мөнгөн медаль",
    achievements: [
      { badge: "Онцлох", name: "- 100 метр гүйлт" },
    ],
    images: [

    ],
  },
  {
    id: "section-5",
    tone: "purple",
    icon: "book",
    label: "Амжилт",
    title: "В.Ананд - Очир - Э р эгтэй төрөлд Мөнгөн медаль",
    achievements: [
      { badge: "Онцлох", name: "А.Урангоо - Эмэгтэй төрөлд Алтан медаль" },
      { badge: "Онцлох", name: "- Гар дарж сунайх" },
    ],
    images: [

    ],
  },
  {
    id: "section-6",
    tone: "red",
    icon: "trophy",
    label: "Амжилт",
    title: "М.Хүсэлбаатар - Эрэгтэй төрөлд Алтан медаль",
    achievements: [
      { badge: "Онцлох", name: "Урлагийн наадам" },
      { badge: "Онцлох", name: "– Язгуур урлаг" },
      { badge: "Онцлох", name: "Э.Билэгт, Б.Одбаяр, Б.Азбаяр, Л.Бөхбилэгт, Ц.Тэмүүжин , М.Билгүтэ – Мөнгөн медаль" },
      { badge: "Онцлох", name: "- Бүжиг" },
      { badge: "Онцлох", name: "А.Урангоо , Б.Мишээл, Э.Мөнх - Од, Ү.Чинбилиг, Б.Эрхэтгүн О.Нинжин – Бөөгийн бүжиг – I байр" },
    ],
    images: [
      { src: "/slides/3b/image3.jpeg", caption: "М.Хүсэлбаатар - Эрэгтэй төрөлд Алтан медаль 1" },
    ],
  },
  {
    id: "section-7",
    tone: "sky",
    icon: "star",
    label: "Амжилт",
    title: "Э.Мөнх - Од – Гоцлол бүжиг – I байр",
    achievements: [
      { badge: "Онцлох", name: "Э.Мөнх - Од , А.Урангоо – Хамтлаг бүжиг – Алтан медаль" },
    ],
    images: [

    ],
  },
  {
    id: "section-8",
    tone: "teal",
    icon: "award",
    label: "Амжилт",
    title: "Сургуулийн оны шилдэг сурагч",
    achievements: [
      { badge: "Онцлох", name: "Б.Азбаяр, Э.Мөнх - Од – Оны тэргүүний сурагч" },
    ],
    images: [

    ],
  },
  {
    id: "section-9",
    tone: "indigo",
    icon: "medal",
    label: "Амжилт",
    title: "А.Урангоо , О.Нинжин – Хөгжимл ө г хүүхэд",
    achievements: [
      { badge: "Онцлох", name: "Монгол бахархал гар зургийн уралдаан" },
    ],
    images: [
      { src: "/slides/3b/image4.jpeg", caption: "А.Урангоо , О.Нинжин – Хөгжимл ө г хүүхэд 1" },
    ],
  },
  {
    id: "section-10",
    tone: "blue",
    icon: "book",
    label: "Амжилт",
    title: "М.Билгүтэ – Алтан медаль",
    achievements: [
      { badge: "Онцлох", name: "“Little spellers” – Англи хэлний үсэглэлийн тэмцээн" },
    ],
    images: [

    ],
  },
  {
    id: "section-11",
    tone: "pink",
    icon: "trophy",
    label: "Амжилт",
    title: "Э. Мөнх - Од – Шилдэг үсэглэгч I байр -",
    achievements: [
      { badge: "Онцлох", name: "О.Нинжин – II байр" },
    ],
    images: [

    ],
  },
  {
    id: "section-12",
    tone: "green",
    icon: "star",
    label: "Амжилт",
    title: "Таеквондо",
    achievements: [
      { badge: "Онцлох", name: "Э.Шинэсондор - “ Монгол Улсын Аварга шалгаруулах Таеквондогийн ” тэмцээн – Алтан медаль" },
    ],
    images: [
      { src: "/slides/3b/image5.jpeg", caption: "Таеквондо 1" },
    ],
  },
  {
    id: "section-13",
    tone: "amber",
    icon: "award",
    label: "Амжилт",
    title: "Кенгуру математикийн цахим сорилго",
    achievements: [
      { badge: "Онцлох", name: "Б.Одбаяр, Б.Азбаяр , Э.Мөнх - од, О.Нинжин – I зэрэг" },
    ],
    images: [

    ],
  },
  {
    id: "section-14",
    tone: "purple",
    icon: "medal",
    label: "Амжилт",
    title: "АМО олон улсын олим п иад",
    achievements: [
      { badge: "Онцлох", name: "Б.Азбаяр – Хүрэл медаль" },
    ],
    images: [

    ],
  }
];

export default function Class3BPage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="3Б"
      totalStudents={20}
      maleStudents={15}
      femaleStudents={5}
      teacher="Э.Оюунбилэг"
      coverImage={{ src: "/slides/3b/image1.png", alt: "3Б анги", caption: "3Б ангийн тайлант өдөрлөг" }}
      intro={
        <>
          3B анги нь 15 эрэгтэй, 5 эмэгтэй нийт 20 сурагчтай .
        </>
      }
      sections={sections}
      footer="3Б анги - Тайлант өдөрлөг 2025-2026"
    />
  );
}
