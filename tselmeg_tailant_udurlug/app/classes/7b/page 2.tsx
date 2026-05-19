import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, Users, Star, Award, Medal, BookOpen } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

// ─── Slide data extracted from 7b.docx ────────────────────────────
const slides = [
  {
    id: "sports",
    icon: Trophy,
    color: "brand-blue",
    bg: "from-blue-50 to-white",
    border: "border-blue-200",
    label: "Спорт",
    title: "Намрын спартакиад",
    achievements: [
      { name: "Б.Баяр", event: "100м гүйлт эрэгтэй", place: 2 },
      { name: "7Б анги", event: "Буухиа гүйлт", place: 2 },
      { name: "Т.Гэгээнсувд", event: "100м гүйлт эмэгтэй", place: 3 },
      { name: "7Б анги", event: "Олс таталт", place: 2 },
    ],
    images: [
      { src: "/slides/7b/image2.jpg", caption: "Намрын спартакиад" },
      { src: "/slides/7b/image3.jpg", caption: "Спортын тэмцээн" },
      { src: "/slides/7b/image4.jpg", caption: "Спортын тэмцээн" },
    ],
  },
  {
    id: "arts",
    icon: Star,
    color: "purple-600",
    bg: "from-purple-50 to-white",
    border: "border-purple-200",
    label: "Урлаг",
    title: "Урлагийн үзлэг",
    achievements: [
      { name: "7Б анги", event: "Найрал дуу", place: 1 },
      { name: "7Б анги", event: "Хамтлаг бүжиг", place: 2 },
      { name: "7Б анги", event: "Язгуур урлаг", place: 3 },
      { name: "7Б анги", event: "Гоцлол дуу", place: 4 },
      { name: "7Б анги", event: "Гоцлол бүжиг", place: 4 },
    ],
    images: [
      { src: "/slides/7b/image5.png", caption: "Урлагийн үзлэг" },
      { src: "/slides/7b/image6.png", caption: "Урлагийн үзлэг" },
      { src: "/slides/7b/image7.png", caption: "Урлагийн үзлэг" },
      { src: "/slides/7b/image8.png", caption: "Урлагийн үзлэг" },
      { src: "/slides/7b/image9.png", caption: "Урлагийн үзлэг" },
    ],
  },
  {
    id: "math",
    icon: BookOpen,
    color: "brand-sky",
    bg: "from-sky-50 to-white",
    border: "border-sky-200",
    label: "Математик & Олимпиад",
    title: "Ангиараа бодлого бодох уралдаан & Кенгуру олимпиад",
    achievements: [
      { name: "7Б анги", event: "6-7 ангийн ангиараа бодлого бодох уралдаан", place: 1 },
    ],
    images: [
      { src: "/slides/7b/image10.jpg", caption: "Ангиараа бодлого бодох уралдаан" },
    ],
  },
  {
    id: "undarga",
    icon: Award,
    color: "amber-600",
    bg: "from-amber-50 to-white",
    border: "border-amber-200",
    label: "Сурагч Ж.Ундарга",
    title: "Ж.Ундарга — Олон талын амжилт",
    achievements: [
      { name: "Ж.Ундарга", event: "Үндэсний бичгийн 'Цэвэр сайхан бичигтэн'", place: 0, special: "Шагнагдсан" },
      { name: "Ж.Ундарга", event: "Кенгуру-2026 математикын олимпиад (цахим)", place: 2 },
      { name: "Ж.Ундарга", event: "Кенгуру-2026 математикын олимпиад (танхим)", place: 2 },
    ],
    images: [
      { src: "/slides/7b/image11.jpeg", caption: "Ж.Ундарга" },
    ],
  },
  {
    id: "uyangg",
    icon: Star,
    color: "green-600",
    bg: "from-green-50 to-white",
    border: "border-green-200",
    label: "Сурагч Г.Уянга",
    title: "Г.Уянга — Зураг & Математик & Шатар",
    achievements: [
      { name: "Г.Уянга", event: "'Монгол бахархал' гар зургийн уралдаан", place: 1 },
      { name: "Г.Уянга", event: "Кенгуру-2026 математикын олимпиад", place: 1 },
      { name: "Г.Уянга", event: "Кенгуру-2026 математикын олимпиад (танхим)", place: 3 },
      { name: "Г.Уянга", event: "Ангийн шатрын аварга", place: 1 },
      { name: "Г.Уянга", event: "Ангийн даамны аварга", place: 2 },
    ],
    images: [
      { src: "/slides/7b/image12.jpeg", caption: "Г.Уянга" },
    ],
  },
  {
    id: "tselmun",
    icon: Star,
    color: "pink-600",
    bg: "from-pink-50 to-white",
    border: "border-pink-200",
    label: "Сурагч Б.Цэлмүүн",
    title: "Б.Цэлмүүн — Урлаг & Математик",
    achievements: [
      { name: "Б.Цэлмүүн", event: "'Монгол бахархал' гар зургийн уралдаан", place: 3 },
      { name: "Б.Цэлмүүн", event: "'Миний мөрөөдлийн дүр' аниме дүр бүтээх уралдаан", place: 1 },
      { name: "Б.Цэлмүүн", event: "Кенгуру-2026 математикын олимпиад", place: 1 },
      { name: "Б.Цэлмүүн", event: "Химийн хичээлийн шилдэг сурагч", place: 0, special: "Батламж" },
    ],
    images: [
      { src: "/slides/7b/image13.jpeg", caption: "Б.Цэлмүүн" },
    ],
  },
  {
    id: "bilguundulai",
    icon: Medal,
    color: "indigo-600",
    bg: "from-indigo-50 to-white",
    border: "border-indigo-200",
    label: "Сурагч Г.Билгүүндалай",
    title: "Г.Билгүүндалай — Рубик & Шатар & Математик",
    achievements: [
      { name: "Г.Билгүүндалай", event: "Сургуулийн рубик шооны аварга", place: 3 },
      { name: "Г.Билгүүндалай", event: "Сургуулийн шатрын аварга", place: 2 },
      { name: "Г.Билгүүндалай", event: "Кенгуру-2026 математикын олимпиад", place: 2 },
      { name: "Г.Билгүүндалай", event: "Ангийн шатрын аварга", place: 2 },
      { name: "Г.Билгүүндалай", event: "Ангийн даамны аварга", place: 1 },
    ],
    images: [
      { src: "/slides/7b/image14.jpeg", caption: "Г.Билгүүндалай" },
      { src: "/slides/7b/image15.jpg", caption: "Г.Билгүүндалай" },
    ],
  },
  {
    id: "bayar",
    icon: Trophy,
    color: "brand-red",
    bg: "from-red-50 to-white",
    border: "border-red-200",
    label: "Сурагч Б.Баяр",
    title: "Б.Баяр — Олон улсын хөл бөмбөгийн аварга",
    achievements: [
      { name: "Б.Баяр", event: "U-12 УАШТ", place: 3 },
      { name: "Б.Баяр", event: "U-13 УАШТ", place: 1 },
      { name: "Б.Баяр", event: "U-14 УАШТ", place: 1 },
      { name: "Б.Баяр", event: "Yongshou Cup 2025", place: 1 },
      { name: "Б.Баяр", event: "Deven Summer Cup 2025", place: 1 },
      { name: "Б.Баяр", event: "Deven Cup 2026", place: 2 },
      { name: "Б.Баяр", event: "Storsjocupen 2025", place: 1 },
      { name: "Б.Баяр", event: "Helsinki Cup 2025", place: 3 },
      { name: "Б.Баяр", event: "Russia Cup 2026", place: 1 },
      { name: "Б.Баяр", event: "Сандагдорж Cup 2025", place: 1 },
    ],
    images: [
      { src: "/slides/7b/image16.jpeg", caption: "Б.Баяр — Хөл бөмбөг" },
    ],
  },
  {
    id: "odbayar",
    icon: Award,
    color: "teal-600",
    bg: "from-teal-50 to-white",
    border: "border-teal-200",
    label: "Сурагч Б.Одбаяр",
    title: "Б.Одбаяр — Оны тэргүүний сурагч",
    achievements: [
      { name: "Б.Одбаяр", event: "Монголын багш нарын холбооны 'Оны тэргүүний сурагч'", place: 1 },
      { name: "Б.Одбаяр", event: "SASMO олон улсын олимпиад", place: 2 },
      { name: "Б.Одбаяр", event: "АМО олон улсын олимпиад", place: 2 },
    ],
    images: [
      { src: "/slides/7b/image17.jpeg", caption: "Б.Одбаяр — Тэргүүний сурагч" },
    ],
  },
];

const sourceSlides = [
  {
    id: "source-1",
    icon: BookOpen,
    color: "brand-blue",
    bg: "from-sky-50 to-white",
    border: "border-sky-200",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 1",
    achievements: [
      { name: "Цэлмэг дижитал интернэйшнл сургуул ийн Б. Уранчимэг багштай 7 b ангийн 2025-2026 оны хичээлийн жилийн танилцуулга", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "7 b анги нь нийт 2 4 сурагчтай. Үүнээс 1 3 хөвгүүн , 11 охин", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Манай анги сурлага, танин мэдэхүй, урлаг спорт болон нийгмийн идэвх оролцооны бүхий л олон нийтийн арга хэмжээнүүдэд ангиараа нэгдмэл зохион байгуулалттай, идэвхтэй оролцсон нь хамт олны уур амьсгал эрүүл, бие биеэ дэмждэг сургуульдаа түүчээлэгч, жишиг анги болон төлөвшсөн .", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "1. Цэлмэг дижитал интернэйшнл сургуулиас зохион байгуулсан намрын спартакиад ад амжилттай оролцсон.", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Үүнд гаргасан амжилтууд :", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Буухиа багаараа 2р байр 🥈", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "2. Цэлмэг дижитал интернэйшнл сургуулиас зохион байгуулсан урлагийн үзлэгт амжилттай оролцсон.", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "3 .Цэлмэг дижитал интернэйшнл сургуулиас зохион байгуулсан 6-7 ангийн АНГИАРАА БОДЛОГО БОДОХ уралдаанд амжилттай оролцож 1р байр", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "7 b ангийн сурагчдын хувийн амжилтуудаас :", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Цэлмэг дижитал сургуулийн сурагчдын дунд Үндэсний бичгийн төрлөөр \"Цэвэр сайхан бичигтэн\"", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Кенгуру-2026 математикын олимпиадад 2-р зэрэг \\цахим\\", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Кенгуру-2026 математикын олимпиадад 2-р зэрэг \\ танхим \\", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "\"Монгол бахархал\"гар зургийн уралдаанд алт медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Кенгуру-2026 математикын олимпиадад 3 -р зэрэг", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
    ],
    images: [],
  },
  {
    id: "source-2",
    icon: BookOpen,
    color: "brand-blue",
    bg: "from-sky-50 to-white",
    border: "border-sky-200",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 2",
    achievements: [
      { name: "Кенгуру-2026 математикын олимпиадад 1 -р зэрэг алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "\"Монгол бахархал\"гар зургийн уралдаанд хүрэл медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Кенгуру-2026 математикын олимпиадад 1 -р зэрэг", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Химийн хичээл дээр шилдэг сурагч батламж", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Г. Б илгүүндалай :", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Сургуулийн аварга шалгаруулах р убик шоо ны тэмцээнд 3-р бай р", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "С ургуулийн аварга шалгаруулах шатрын тэмцээнд 2р байр", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Кенгуру-2026 математикын олимпиадад 2 -р зэрэг", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "U- 12 УАШТ хүрэл медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "U-13 УАШТ алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "U-14 УАШТ алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Yougshou cup 2025 алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Deven summer cup 2025 алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Deven cup 2026 мөнгөн медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
    ],
    images: [],
  },
  {
    id: "source-3",
    icon: BookOpen,
    color: "brand-blue",
    bg: "from-sky-50 to-white",
    border: "border-sky-200",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 3",
    achievements: [
      { name: "Storsjocupen 2025 алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Helsinki cup 2025 хүрэл медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Russia cup 2026 алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Сандагдорж cup 2025 алтан медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Намрын спартикад 100м гүйлт мөнгөн медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Намрын спартикад буухиа гүйлт мөнгөн медал ь", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Б.О дбаяр :", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Бусдыгаа манлайлан гаргасан амжилтуудыг нь онцлон “ Монголын багш нарын холбоо ”- ны ОНЫ ТЭРГҮҮНИЙ СУРАГЧ алтан медалиар шагнагдлаа .", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "Sasmo олон улсын олимпиадад 2р байр мөнгөн медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
      { name: "АМО олон улсын олимпиадад 2-р байр мөнгөн медаль", event: "Эх баримтын текст", place: 0, special: "Эх баримт" },
    ],
    images: [],
  }
];

const placeBadge = (place: number, special?: string) => {
  if (special) return { label: special, classes: "bg-purple-100 text-purple-700" };
  if (place === 1) return { label: "🥇 1-р байр", classes: "bg-yellow-100 text-yellow-700" };
  if (place === 2) return { label: "🥈 2-р байр", classes: "bg-slate-100 text-slate-600" };
  if (place === 3) return { label: "🥉 3-р байр", classes: "bg-amber-100 text-amber-700" };
  if (place === 4) return { label: "4-р байр", classes: "bg-slate-50 text-slate-500" };
  return { label: "✨ Шилдэг", classes: "bg-brand-mist text-brand-blue" };
};

export default function SevenBPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="7Б"
      totalStudents={24}
      maleStudents={13}
      femaleStudents={11}
      teacher="Б.Уранчимэг"
      coverImage={{ src: "/slides/7b/image1.png", alt: "7Б анги", caption: "Ангийн багш: Б.Уранчимэг" }}
      intro={
        <>
          7Б ангийн сурагчид <span className="font-black text-brand-navy">сурлага, танин мэдэхүй, урлаг, спорт болон нийгмийн идэвх оролцооны</span>{" "}
          бүхий л арга хэмжээнд нэгдмэл, зохион байгуулалттай оролцдог сургуулийн жишиг анги.
        </>
      }
      sections={[...slides, ...sourceSlides]}
      footer="7Б анги - Нэгдмэл, авьяаслаг хамт олон"
    />
  );
}
