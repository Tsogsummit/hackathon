import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "sports",
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
    images: [],
  },
  {
    id: "arts",
    tone: "pink",
    icon: "star",
    label: "Урлаг",
    title: "Урлагийн наадам",
    achievements: [
      { badge: "Мөнгөн медаль", name: "Э.Билэгт, Б.Одбаяр, Б.Азбаяр, Л.Бөхбилэгт, Ц.Тэмүүжин", event: "Язгуур урлаг" },
      { badge: "1-р байр", name: "А.Урангоо, Б.Мишээл, Э.Мөнх-Од, Ү.Чинбилэг, Б.Эрхэтгүн, О.Нинжин", event: "Бөөгийн бүжиг" },
      { badge: "1-р байр", name: "Э.Мөнх-Од", event: "Гоцлол бүжиг" },
    ],
    images: [],
  },
  {
    id: "best-students",
    tone: "amber",
    icon: "award",
    label: "Манлайлал",
    title: "Сургуулийн оны шилдэг сурагчид",
    achievements: [
      { badge: "Оны тэргүүний сурагч", name: "Б.Азбаяр", event: "Сургуулийн оны шилдэг сурагч" },
      { badge: "Оны тэргүүний сурагч", name: "Э.Мөнх-Од", event: "Сургуулийн оны шилдэг сурагч" },
    ],
    images: [],
  },
  {
    id: "english",
    tone: "sky",
    icon: "book",
    label: "Англи хэл",
    title: "Little Spellers үсэглэлийн тэмцээн",
    achievements: [
      { badge: "1-р байр", name: "Э.Мөнх-Од", event: "Шилдэг үсэглэгч" },
    ],
    images: [],
  },
  {
    id: "taekwondo",
    tone: "red",
    icon: "medal",
    label: "Таеквондо",
    title: "Монгол Улсын аварга шалгаруулах тэмцээн",
    achievements: [
      { badge: "Алтан медаль", name: "Э.Шинэсондор", event: "Монгол Улсын аварга шалгаруулах таеквондогийн тэмцээн" },
    ],
    images: [],
  },
  {
    id: "math",
    tone: "purple",
    icon: "medal",
    label: "Математик",
    title: "Кенгуру болон АМО олон улсын олимпиад",
    achievements: [
      { badge: "1-р зэрэг", name: "Б.Одбаяр", event: "Кенгуру математикийн цахим сорилго" },
      { badge: "1-р зэрэг", name: "Б.Азбаяр", event: "Кенгуру математикийн цахим сорилго" },
      { badge: "Хүрэл медаль", name: "Б.Азбаяр", event: "АМО олон улсын олимпиад" },
    ],
    images: [],
  },
];

export default function ThreeBPage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="3Б"
      totalStudents={20}
      maleStudents={15}
      femaleStudents={5}
      teacher="Э.Оюунбилэг"
      intro={
        <>
          Э.Оюунбилэг багштай 3Б анги нь <span className="font-black text-brand-navy">15 эрэгтэй, 5 эмэгтэй нийт 20 сурагчтай</span>.
          Ангийн сурагчид хичээл сурлага, урлаг, спортын авьяастай, хүмүүжил төлөвшил сайтай бөгөөд анги болон сургуулиас
          зохион байгуулдаг үйл ажиллагаанд идэвхтэй оролцдог сургуулийн шилдэг хамт олны нэг юм.
        </>
      }
      sections={sections}
      footer="3Б анги - Авьяаслаг, идэвхтэй, шилдэг хамт олон"
    />
  );
}
