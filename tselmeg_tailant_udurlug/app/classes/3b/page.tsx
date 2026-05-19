import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "sports-day",
    tone: "blue",
    icon: "trophy",
    label: "Спорт",
    title: "Сургуулийн спортын наадам",
    achievements: [
      { badge: "Алтан медаль", name: "3Б анги", event: "Буухиа гүйлт" },
      { badge: "Алтан медаль", name: "Ү.Чинбилэг", event: "Байрнаас уртын харайлт - эрэгтэй төрөл" },
      { badge: "Мөнгөн медаль", name: "О.Нинжин", event: "Байрнаас уртын харайлт - эмэгтэй төрөл" },
      { badge: "Мөнгөн медаль", name: "В.Ананд-Очир", event: "100 метр гүйлт - эрэгтэй төрөл" },
      { badge: "Алтан медаль", name: "А.Урангоо", event: "100 метр гүйлт - эмэгтэй төрөл" },
      { badge: "Алтан медаль", name: "М.Хүсэлбаатар", event: "Гар дарж сунайх - эрэгтэй төрөл" },
    ],
    images: [
      { src: "/slides/3b/image2.jpeg", caption: "Байрнаас уртын харайлт" },
      { src: "/slides/3b/image3.jpeg", caption: "Сургуулийн спортын наадам" },
    ],
  },
  {
    id: "arts",
    tone: "pink",
    icon: "star",
    label: "Урлаг",
    title: "Урлагийн наадам",
    achievements: [
      { badge: "Мөнгөн медаль", name: "Э.Билэгт, Б.Одбаяр, Б.Азбаяр, Л.Бөхбилэгт, Ц.Тэмүүжин, М.Билгүтэ", event: "Язгуур урлаг" },
      { badge: "1-р байр", name: "А.Урангоо, Б.Мишээл, Э.Мөнх-Од, Ү.Чинбилэг, Б.Эрхэтгүн, О.Нинжин", event: "Бөөгийн бүжиг" },
      { badge: "1-р байр", name: "Э.Мөнх-Од", event: "Гоцлол бүжиг" },
      { badge: "Алтан медаль", name: "Э.Мөнх-Од, А.Урангоо", event: "Хамтлаг бүжиг" },
    ],
    images: [],
  },
  {
    id: "best-students",
    tone: "amber",
    icon: "award",
    label: "Манлайлал",
    title: "Сургуулийн оны шилдэг сурагч",
    achievements: [
      { badge: "Оны тэргүүний сурагч", name: "Б.Азбаяр, Э.Мөнх-Од", event: "Сургуулийн оны шилдэг сурагч" },
      { badge: "Хөгжимлөг хүүхэд", name: "А.Урангоо, О.Нинжин" },
    ],
    images: [],
  },
  {
    id: "drawing",
    tone: "green",
    icon: "medal",
    label: "Гар зураг",
    title: "Монгол бахархал гар зургийн уралдаан",
    achievements: [
      { badge: "Алтан медаль", name: "М.Билгүтэ", event: "Монгол бахархал гар зургийн уралдаан" },
    ],
    images: [],
  },
  {
    id: "little-spellers",
    tone: "sky",
    icon: "book",
    label: "Англи хэл",
    title: "Little Spellers - Англи хэлний үсэглэлийн тэмцээн",
    achievements: [
      { badge: "1-р байр", name: "Э.Мөнх-Од", event: "Шилдэг үсэглэгч" },
      { badge: "2-р байр", name: "О.Нинжин", event: "Шилдэг үсэглэгч" },
    ],
    images: [
      { src: "/slides/3b/image4.jpeg", caption: "Little Spellers тэмцээн" },
      { src: "/slides/3b/image5.jpeg", caption: "Little Spellers амжилт" },
    ],
  },
  {
    id: "taekwondo",
    tone: "red",
    icon: "trophy",
    label: "Таеквондо",
    title: "Монгол Улсын аварга шалгаруулах тэмцээн",
    achievements: [
      { badge: "Алтан медаль", name: "Э.Шинэсондор", event: "Монгол Улсын аварга шалгаруулах таеквондогийн тэмцээн" },
    ],
    images: [],
  },
  {
    id: "kangaroo",
    tone: "teal",
    icon: "award",
    label: "Математик",
    title: "Кенгуру математикийн цахим сорилго",
    achievements: [
      { badge: "1-р зэрэг", name: "Б.Одбаяр, Б.Азбаяр, Э.Мөнх-Од, О.Нинжин", event: "Кенгуру математикийн цахим сорилго" },
    ],
    images: [],
  },
  {
    id: "amo",
    tone: "purple",
    icon: "medal",
    label: "Олимпиад",
    title: "АМО олон улсын олимпиад",
    achievements: [
      { badge: "Хүрэл медаль", name: "Б.Азбаяр", event: "АМО олон улсын олимпиад" },
    ],
    images: [],
  },
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
      coverImage={{ src: "/slides/3b/image1.png", alt: "3Б анги", caption: "Э.Оюунбилэг багштай 3Б анги" }}
      intro={
        <>
          Ангийн нийт сурагчид хичээл сурлага, урлаг, спортын авьяастай, хүмүүжил төлөвшил сайтай бөгөөд анги,
          сургууль, улс орноос зохион байгуулдаг үйл ажиллагаанд идэвхтэй оролцдог сургуулийн шилдэг хамт олны нэг юм.
        </>
      }
      sections={sections}
      footer="3Б анги - Авьяаслаг, идэвхтэй, шилдэг хамт олон"
    />
  );
}
