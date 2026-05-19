import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "national-script",
    tone: "amber",
    icon: "book",
    label: "Үндэсний бичиг",
    title: "Үндэсний бичгийн амжилтууд",
    achievements: [
      { badge: "Тайлан", name: "6Б анги", event: "Үндэсний бичгээр алдаагүй уншиж, бичих чадвараа амжилттай тайлагнав" },
      { badge: "Хичээнгүй бичигтэн", name: "Т.Хулан", event: "Үндэсний бичгийн хичээнгүй сайхан бичигтэн" },
      { badge: "Зөв, түргэн уншигч", name: "М.Цогт-Эрдэнэ", event: "Үндэсний бичиг" },
      { badge: "2-р байр", name: "6Б анги", event: "Цагаан толгойн баярын үг бүтээх тэмцээн" },
      { badge: "1-р байр" , name: "Ч. Амин-эрдэнэ" , event: "Үндэсний бичиг"}
    ],
    images: [
      { src: "/slides/6b/image11.png", caption: "Үндэсний бичгийн тайлан" },
      { src: "/slides/6b/image13.png", caption: "Хичээнгүй сайхан бичигтэн" },
      { src: "/slides/6b/image15.png", caption: "Зөв, түргэн уншигч" },
      { src: "/slides/6b/image16.png", caption: "Цагаан толгойн баяр" },
    ],
  },
  {
    id: "arts",
    tone: "pink",
    icon: "star",
    label: "Урлаг",
    title: "Урлагийн наадам, бүжгийн амжилт",
    achievements: [
      { badge: "3-р байр", name: "6Б ангийн охид", event: "Урлагийн наадмын хамтлаг бүжиг" },
      { badge: "Хүрэл медаль", name: "Э.Номиндалай", event: "Дэлхийн үндэстнүүдийн олон ардын бүжгийн улсын их наадам" },
      { badge: "3-р байр", name: "Б.Саран", event: "The Grand dance festival" },
    ],
    images: [
      { src: "/slides/6b/image12.png", caption: "Урлагийн наадам - хамтлаг бүжиг" },
    ],
  },
  {
    id: "kangaroo-saran",
    tone: "purple",
    icon: "medal",
    label: "Математик",
    title: "Kangaroo, German Math Olympiad",
    achievements: [
      { badge: "2-р зэрэг", name: "Т.Хулан", event: "Kangaroo Math Olympiad 2-р шат" },
      { badge: "1-р байр", name: "Б.Саран", event: "German Math Olympiad 1-р шат" },
      { badge: "1-р байр", name: "Б.Саран", event: "German Math Olympiad 2-р шат" },
    ],
    images: [
      { src: "/slides/6b/image14.png", caption: "Kangaroo and German Math Olympiad" },
    ],
  },
  {
    id: "chess-rubik",
    tone: "blue",
    icon: "trophy",
    label: "Оюуны спорт",
    title: "Шатар болон Tselmeg Cube Cup 2026",
    achievements: [
      { badge: "Тэргүүн байр", name: "Ч.Амин-Эрдэнэ", event: "Сургуулийн шатрын аварга 6-8-р ангийн төрөл" },
      { badge: "Тэргүүн байр", name: "Т.Очирсүлд", event: "Tselmeg Cube Cup 2026 3x3x3 төрөл, 29.05 сек" },
    ],
    images: [
      { src: "/slides/6b/image17.png", caption: "Шатрын аварга" },
      { src: "/slides/6b/image18.png", caption: "Tselmeg Cube Cup 2026" },
    ],
  },
  {
    id: "ochirsuld",
    tone: "indigo",
    icon: "award",
    label: "Сурагч Т.Очирсүлд",
    title: "Олон улсын математик, рубик шооны амжилт",
    achievements: [
      { badge: "Алтан медаль", name: "Т.Очирсүлд", event: "AMO олон улсын математикийн олимпиад" },
      { badge: "1-р байр", name: "Т.Очирсүлд", event: "SIMCC олон улсын математикийн олимпиад" },
      { badge: "Тусгай байр", name: "Т.Очирсүлд", event: "Khan-Uul Cup 2026 рубик шооны тэмцээн" },
      { badge: "Тусгай байр", name: "Т.Очирсүлд", event: "Zamiin-Uud Cup 2026 рубик шооны тэмцээн" },
    ],
    images: [{ src: "/slides/6b/image19.png", caption: "Т.Очирсүлд - олон улсын амжилт" }],
  },
  {
    id: "yesui",
    tone: "red",
    icon: "trophy",
    label: "Сурагч Э.Есүй",
    title: "Спортын дэд мастер, олон улсын амжилт",
    achievements: [
      { badge: "Спортын дэд мастер", name: "Э.Есүй", event: "Улс болон олон улсын тэмцээнүүд" },
      { badge: "1-р байр", name: "Э.Есүй", event: "Suld Cup 2025" },
      { badge: "Цомын аварга", name: "Э.Есүй", event: "Хаадын зарлиг клуб" },
      { badge: "2-р байр", name: "Э.Есүй", event: "Таеквондо Монголын холбоо" },
      { badge: "3-р байр", name: "Э.Есүй", event: "Олон улсын хар бүс VIII дант мастер МҮН САН ИЛ тэмцээн" },
    ],
    images: [
      { src: "/slides/6b/image21.png", caption: "Э.Есүй - спортын амжилт" },
      { src: "/slides/6b/image22.png", caption: "Э.Есүй - олон улсын амжилт" },
    ],
  },
];

const sourceSections: ClassReportSection[] = [
  {
    id: "source-1",
    tone: "sky",
    icon: "book",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 1",
    achievements: [
      { badge: "Эх баримт", name: "Слайд 1: info@" },
      { badge: "Эх баримт", name: ".edu.mn" },
      { badge: "Эх баримт", name: "tselmeg.edu." },
      { badge: "Эх баримт", name: "TSELMEG DIGITAL" },
      { badge: "Эх баримт", name: "INTERNATIONAL" },
      { badge: "Эх баримт", name: "SCHOOL 6b CLASS" },
      { badge: "Эх баримт", name: "May 2026" },
      { badge: "Эх баримт", name: "Слайд 2: Ш. Юмжирдулам багштай" },
      { badge: "Эх баримт", name: "ангийн танилцуулга" },
      { badge: "Эх баримт", name: "202" },
      { badge: "Эх баримт", name: "Цэлмэг" },
      { badge: "Эх баримт", name: "дижитал" },
      { badge: "Эх баримт", name: "интернэйшнл" },
      { badge: "Эх баримт", name: "сургуул" },
    ],
    images: [],
  },
  {
    id: "source-2",
    tone: "teal",
    icon: "award",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 2",
    achievements: [
      { badge: "Эх баримт", name: "Слайд 3: 01" },
      { badge: "Эх баримт", name: "Ангийн танилцуулга" },
      { badge: "Эх баримт", name: "Ангийн сурагчдын 2025-2026 оны хичээлийн жилийн амжилт" },
      { badge: "Эх баримт", name: "Слайд 4: 6b" },
      { badge: "Эх баримт", name: "эрэгтэй," },
      { badge: "Эх баримт", name: "эмэгтэй" },
      { badge: "Эх баримт", name: "буюу нийт" },
      { badge: "Эх баримт", name: "суралцагчидтай." },
      { badge: "Эх баримт", name: "Ангийн дарга" },
      { badge: "Эх баримт", name: "Ли Еээн" },
      { badge: "Эх баримт", name: "ТАНИЛЦУУЛГА" },
      { badge: "Эх баримт", name: "Слайд 5: Манай ангийн сурагчид хичээл сурлагаас гадна урлаг, спортын авьяастай, хүмүүжил төлөвшил сайтай. Мөн анги, сургуулиас зохион байгуулдаг төрөл бүрийн уралдаан тэмцээн, үйл ажиллагаанд идэвхтэй оролцдог, эвсэг найрсаг хамт олон болон төлөвшиж байна." },
      { badge: "Эх баримт", name: "Слайд 6: 6b" },
      { badge: "Эх баримт", name: "ангийн сурагчид үндэсний бичгээрээ алдаагүй уншиж, бичих чадвараа амжилттай тайлагнан оролцлоо." },
    ],
    images: [],
  },
  {
    id: "source-3",
    tone: "indigo",
    icon: "star",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 3",
    achievements: [
      { badge: "Эх баримт", name: "Слайд 7: Урлагийн наадамд" },
      { badge: "Эх баримт", name: "р байр эзэллээ." },
      { badge: "Эх баримт", name: "Слайд 8: 6b" },
      { badge: "Эх баримт", name: "Слайд 9: Сурагч Т. Хулан нь" },
      { badge: "Эх баримт", name: "р шатанд амжилттай оролцож" },
      { badge: "Эх баримт", name: "р зэргийн амжилт гаргалаа." },
      { badge: "Эх баримт", name: "Слайд 10: 6b" },
      { badge: "Эх баримт", name: "Эрдэнэ Үндэсний бичгээрээ зөв, түргэн уншигч сурагчаар шалгарлаа." },
      { badge: "Эх баримт", name: "Слайд 11: 6b" },
      { badge: "Эх баримт", name: "үеэр үг бүтээх тэмцээнд амжилттай оролцож" },
      { badge: "Эх баримт", name: "р байр эзэллээ." },
      { badge: "Эх баримт", name: "Слайд 12: Сургуулийн шатрын аварга шалгаруулах тэмцээнд" },
      { badge: "Эх баримт", name: "р ангийн төрөлд Ч. Амин" },
      { badge: "Эх баримт", name: "Эрдэнэ оролцож тэргүүн байранд шалгарлаа." },
    ],
    images: [],
  },
  {
    id: "source-4",
    tone: "amber",
    icon: "medal",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 4",
    achievements: [
      { badge: "Эх баримт", name: "Цэлмэг Дижитал Интернэйшнл сургуулийн Рубик шооны аварга шалгаруулах" },
      { badge: "Эх баримт", name: "тэмцээнд" },
      { badge: "Эх баримт", name: "шооны төрөлд 6" },
      { badge: "Эх баримт", name: "Слайд 14: Т. Очирсүлд —" },
      { badge: "Эх баримт", name: "Слайд 15: Улс" },
      { badge: "Эх баримт", name: "хэмжээний" },
      { badge: "Эх баримт", name: "тэмцээнд" },
      { badge: "Эх баримт", name: "тасралтгүй" },
      { badge: "Эх баримт", name: "оролцож" },
      { badge: "Эх баримт", name: "өндөр" },
      { badge: "Эх баримт", name: "гаргасан" },
      { badge: "Эх баримт", name: "Слайд 16: Есүй" },
      { badge: "Эх баримт", name: "Хос" },
      { badge: "Эх баримт", name: "Анхдугаар" },
    ],
    images: [],
  },
  {
    id: "source-5",
    tone: "purple",
    icon: "trophy",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 5",
    achievements: [
      { badge: "Эх баримт", name: "Бага" },
      { badge: "Эх баримт", name: "тэнгэр" },
      { badge: "Эх баримт", name: "ахан" },
      { badge: "Эх баримт", name: "дүүс" },
      { badge: "Эх баримт", name: "Слайд 17: Э. Номиндалай" },
      { badge: "Эх баримт", name: "”-аас хүрэл медал хүртлээ" },
      { badge: "Эх баримт", name: "ийн нэгдүгээр шатанд" },
      { badge: "Эх баримт", name: "р байр хоёрдугаар шатанд" },
      { badge: "Эх баримт", name: "р байр тус тус эзлэв. Мөн" },
      { badge: "Эх баримт", name: "бүжгийн тэмцээнд" },
      { badge: "Эх баримт", name: "р байранд шагнагдлаа." },
      { badge: "Эх баримт", name: "Слайд 18: info@tselmeg.edu.mn" },
      { badge: "Эх баримт", name: "tselmeg.edu.mn" },
      { badge: "Эх баримт", name: "БАЯРЛАЛАА" },
    ],
    images: [],
  },
  {
    id: "source-6",
    tone: "green",
    icon: "book",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 6",
    achievements: [
      { badge: "Эх баримт", name: "АНХААРАЛ ХАНДУУЛСАН ТА БҮХЭНД" },
    ],
    images: [],
  }
];

export default function SixBPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="6Б"
      totalStudents={20}
      maleStudents={8}
      femaleStudents={12}
      teacher="Ш.Юмжирдулам"
      leader="М.Цогт-Эрдэнэ, Ли Еээн"
      coverImage={{ src: "/slides/6b/image10.png", alt: "6Б анги", caption: "Ангийн багш: Ш.Юмжирдулам | Ангийн дарга: М.Цогт-Эрдэнэ, Ли Еээн" }}
      intro={
        <>
          6Б ангийн сурагчид <span className="font-black text-brand-navy">хичээл сурлага, үндэсний бичиг, урлаг, спорт,
          оюуны тэмцээнүүдэд</span> идэвхтэй оролцдог, эвсэг найрсаг хамт олон.
        </>
      }
      sections={[...sections, ...sourceSections]}
      footer="6Б анги - Эвсэг, авьяаслаг, амжилтаар дүүрэн хамт олон"
    />
  );
}
