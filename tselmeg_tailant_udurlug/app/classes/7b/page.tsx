import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "sports",
    tone: "blue",
    icon: "trophy",
    label: "Спортын амжилт",
    title: "Намрын спартакиад",
    achievements: [
      { badge: "2-р байр", name: "Б. Баяр", event: "100м гүйлт, эрэгтэй төрөл" },
      { badge: "2-р байр", name: "7Б анги", event: "Буухиа гүйлт" },
      { badge: "3-р байр", name: "Т. Гэгээнсувд", event: "100м гүйлт, эмэгтэй төрөл" },
      { badge: "2-р байр", name: "7Б анги", event: "Олс таталт" },
    ],
    images: [
      { src: "/slides/7b/image2.jpg", caption: "Намрын спартакиад" },
      { src: "/slides/7b/image3.jpg", caption: "Спортын тэмцээний амжилт" },
      { src: "/slides/7b/image4.jpg", caption: "Спортын багийн оролцоо" },
    ],
  },
  {
    id: "arts",
    tone: "purple",
    icon: "star",
    label: "Урлагийн амжилт",
    title: "Урлагийн үзлэг",
    achievements: [
      { badge: "1-р байр", name: "7Б анги", event: "Найрал дуу" },
      { badge: "2-р байр", name: "7Б анги", event: "Хамтлаг бүжиг" },
      { badge: "3-р байр", name: "7Б анги", event: "Язгуур урлаг" },
      { badge: "4-р байр", name: "7Б анги", event: "Гоцлол дуу" },
      { badge: "4-р байр", name: "7Б анги", event: "Гоцлол бүжиг" },
    ],
    images: [
      { src: "/slides/7b/image5.png", caption: "Урлагийн үзлэг - Найрал дуу" },
      { src: "/slides/7b/image6.png", caption: "Урлагийн үзлэг - Хамтлаг бүжиг" },
      { src: "/slides/7b/image7.png", caption: "Урлагийн үзлэг - Язгуур урлаг" },
      { src: "/slides/7b/image8.png", caption: "Урлагийн үзлэг - Гоцлол дуу" },
      { src: "/slides/7b/image9.png", caption: "Урлагийн үзлэг - Гоцлол бүжиг" },
    ],
  },
  {
    id: "math-team",
    tone: "sky",
    icon: "book",
    label: "Сурлагын амжилт",
    title: "Ангиараа бодлого бодох уралдаан",
    achievements: [
      { badge: "1-р байр", name: "7Б анги", event: "6-7-р ангийн ангиараа бодлого бодох уралдаан" },
    ],
    images: [
      { src: "/slides/7b/image10.jpg", caption: "Ангиараа бодлого бодох уралдаан" },
    ],
  },
  {
    id: "undarga",
    tone: "amber",
    icon: "award",
    label: "Хувийн амжилт",
    title: "Ж. Ундарга",
    achievements: [
      { badge: "Шагнал", name: "Ж. Ундарга", event: "Үндэсний бичгийн “Цэвэр сайхан бичигтэн”." },
      { badge: "2-р зэрэг", name: "Ж. Ундарга", event: "Кенгуру-2026 математикийн олимпиад, цахим." },
      { badge: "2-р зэрэг", name: "Ж. Ундарга", event: "Кенгуру-2026 математикийн олимпиад, танхим." },
    ],
    images: [
      { src: "/slides/7b/image11.jpeg", caption: "Ж. Ундарга - Үндэсний бичиг, Кенгуру олимпиад" },
    ],
  },
  {
    id: "uyangaa",
    tone: "green",
    icon: "star",
    label: "Хувийн амжилт",
    title: "Г. Уянга",
    achievements: [
      { badge: "Алтан медаль", name: "Г. Уянга", event: "“Монгол бахархал” гар зургийн уралдаан." },
      { badge: "1-р зэрэг", name: "Г. Уянга", event: "Кенгуру-2026 математикийн олимпиад." },
      { badge: "3-р зэрэг", name: "Г. Уянга", event: "Кенгуру-2026 математикийн олимпиад, танхим." },
      { badge: "1-р байр", name: "Г. Уянга", event: "Ангийн шатрын аварга." },
      { badge: "2-р байр", name: "Г. Уянга", event: "Ангийн даамны аварга." },
    ],
    images: [
      { src: "/slides/7b/image12.jpeg", caption: "Г. Уянга - Зураг, математик, шатар" },
    ],
  },
  {
    id: "tselmuun",
    tone: "pink",
    icon: "medal",
    label: "Хувийн амжилт",
    title: "Б. Цэлмүүн",
    achievements: [
      { badge: "Хүрэл медаль", name: "Б. Цэлмүүн", event: "“Монгол бахархал” гар зургийн уралдаан." },
      { badge: "1-р байр", name: "Б. Цэлмүүн", event: "“Миний мөрөөдлийн дүр” аниме дүр бүтээх уралдаан." },
      { badge: "1-р зэрэг", name: "Б. Цэлмүүн", event: "Кенгуру-2026 математикийн олимпиад." },
      { badge: "Батламж", name: "Б. Цэлмүүн", event: "Химийн хичээлийн шилдэг сурагч." },
    ],
    images: [
      { src: "/slides/7b/image13.jpeg", caption: "Б. Цэлмүүн - Урлаг, математик, хими" },
    ],
  },
  {
    id: "bilguundalai",
    tone: "indigo",
    icon: "trophy",
    label: "Хувийн амжилт",
    title: "Г. Билгүүндалай",
    achievements: [
      { badge: "3-р байр", name: "Г. Билгүүндалай", event: "Сургуулийн рубик шооны аварга." },
      { badge: "2-р байр", name: "Г. Билгүүндалай", event: "Сургуулийн шатрын аварга." },
      { badge: "2-р зэрэг", name: "Г. Билгүүндалай", event: "Кенгуру-2026 математикийн олимпиад." },
      { badge: "2-р байр", name: "Г. Билгүүндалай", event: "Ангийн шатрын аварга." },
      { badge: "1-р байр", name: "Г. Билгүүндалай", event: "Ангийн даамны аварга." },
    ],
    images: [
      { src: "/slides/7b/image14.jpeg", caption: "Г. Билгүүндалай - Рубик, шатар, математик" },
      { src: "/slides/7b/image15.jpg", caption: "Г. Билгүүндалай - Тэмцээний оролцоо" },
    ],
  },
  {
    id: "bayar",
    tone: "red",
    icon: "award",
    label: "Хөл бөмбөг",
    title: "Б. Баяр",
    achievements: [
      { badge: "Хүрэл медаль", name: "Б. Баяр", event: "U-12 улсын аварга шалгаруулах тэмцээн." },
      { badge: "Алтан медаль", name: "Б. Баяр", event: "U-13 улсын аварга шалгаруулах тэмцээн." },
      { badge: "Алтан медаль", name: "Б. Баяр", event: "U-14 улсын аварга шалгаруулах тэмцээн." },
      { badge: "Алтан медаль", name: "Б. Баяр", event: "Yongshou Cup 2025." },
      { badge: "Алтан медаль", name: "Б. Баяр", event: "Deven Summer Cup 2025." },
      { badge: "Мөнгөн медаль", name: "Б. Баяр", event: "Deven Cup 2026." },
      { badge: "Алтан медаль", name: "Б. Баяр", event: "Storsjocupen 2025." },
      { badge: "Хүрэл медаль", name: "Б. Баяр", event: "Helsinki Cup 2025." },
      { badge: "Алтан медаль", name: "Б. Баяр", event: "Russia Cup 2026." },
      { badge: "Алтан медаль", name: "Б. Баяр", event: "Сандагдорж Cup 2025." },
    ],
    images: [
      { src: "/slides/7b/image16.jpeg", caption: "Б. Баяр - Олон улсын хөл бөмбөгийн амжилт" },
    ],
  },
  {
    id: "odbayar",
    tone: "teal",
    icon: "medal",
    label: "Хувийн амжилт",
    title: "Б. Одбаяр",
    achievements: [
      { badge: "Оны тэргүүний сурагч", name: "Б. Одбаяр", event: "Монголын багш нарын холбооны алтан медаль." },
      { badge: "Мөнгөн медаль", name: "Б. Одбаяр", event: "SASMO олон улсын олимпиад." },
      { badge: "Мөнгөн медаль", name: "Б. Одбаяр", event: "АМО олон улсын олимпиад." },
    ],
    images: [
      { src: "/slides/7b/image17.jpeg", caption: "Б. Одбаяр - Оны тэргүүний сурагч" },
    ],
  },
];

export default function SevenBPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="7Б"
      totalStudents={24}
      maleStudents={13}
      femaleStudents={11}
      teacher="Б.Уранчимэг"
      coverImage={{ src: "/slides/7b/image1.png", alt: "7Б анги", caption: "Б. Уранчимэг багштай 7Б анги" }}
      intro={
        <>
          7Б анги нь 13 хөвгүүн, 11 охин нийт 24 сурагчтай. Сурлага, танин мэдэхүй, урлаг, спорт болон нийгмийн идэвх оролцооны олон арга хэмжээнд нэгдмэл зохион байгуулалттай оролцдог хамт олон.
        </>
      }
      sections={sections}
      footer="7Б анги - Нэгдмэл, авьяаслаг хамт олон"
    />
  );
}
