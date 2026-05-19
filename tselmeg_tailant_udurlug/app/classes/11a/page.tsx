import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "section-1",
    tone: "blue",
    icon: "trophy",
    label: "Танилцуулга",
    title: "1A CLASS",
    achievements: [
      { badge: "Онцлох", name: "ТАНИЛЦУУЛГА" },
      { badge: "Онцлох", name: "Б. Мөнхтуяа багштай" },
      { badge: "Онцлох", name: "11a" },
      { badge: "Онцлох", name: "нгийн" },
      { badge: "Онцлох", name: "ТАНИЛЦУУЛГА" },
      { badge: "Онцлох", name: "11" },
      { badge: "Онцлох", name: "А анги нийт" },
      { badge: "Онцлох", name: "24" },
      { badge: "Онцлох", name: "суралцагчтай ба" },
      { badge: "Онцлох", name: "12" },
      { badge: "Онцлох", name: "эмэгтэй," },
      { badge: "Онцлох", name: "12" },
      { badge: "Онцлох", name: "эрэгтэй Ангийн дарга М. Итгэлт" },
      { badge: "Онцлох", name: "УРИА:" },
      { badge: "Онцлох", name: "ИРЭЭДҮЙГ БИД БҮТЭЭНЭ, БИДНИЙ ИРЭЭДҮЙ БИДНИЙ ГАРТ" },
      { badge: "Онцлох", name: "ЗОРИЛГО:" },
      { badge: "Онцлох", name: "Шилдэгийн шилдэг нь байж, оргил өөд хамтдаа" },
    ],
    images: [
      { src: "/slides/11a/image1.jpeg", caption: "1A CLASS 1" },
      { src: "/slides/11a/image2.jpeg", caption: "1A CLASS 2" },
      { src: "/slides/11a/image3.jpeg", caption: "1A CLASS 3" },
    ],
  },
  {
    id: "section-2",
    tone: "pink",
    icon: "star",
    label: "Амжилт",
    title: "Сургуулийн сагс, гар бөмбөгийн АШТ",
    achievements: [
      { badge: "Онцлох", name: "Гар бөмбөг САШТ" },
      { badge: "Онцлох", name: "Хүрэл" },
      { badge: "Онцлох", name: "Т. Эрдэнэдорж, Б. Хасар," },
      { badge: "Онцлох", name: "М. Итгэлт,Б. Амин-Эрдэнэ," },
      { badge: "Онцлох", name: "Г. Түвшинтөр,Б. Чинхүслэн," },
      { badge: "Онцлох", name: "2." },
      { badge: "Онцлох", name: "vs3" },
      { badge: "Онцлох", name: "САШТ Алт" },
      { badge: "Онцлох", name: "Б. Хасар, М. Итгэлт, Б. Амин-Эрдэнэ," },
      { badge: "Онцлох", name: "Т. Эрдэнэдорж, Б. Хасар" },
      { badge: "Онцлох", name: "3. 5vs5" },
      { badge: "Онцлох", name: "САШТ Алт" },
      { badge: "Онцлох", name: "Б. Чинхүслэн, Б. Хүслэн-Эрдэнэ," },
      { badge: "Онцлох", name: "Г. Түвшинтөр, О. Одбаяр," },
      { badge: "Онцлох", name: "Т. Эрдэнэдорж, Б. Амин-Эрдэнэ," },
      { badge: "Онцлох", name: "М. Итгэлт" },
    ],
    images: [
      { src: "/slides/11a/image4.jpeg", caption: "Сургуулийн сагс, гар бөмбөгийн АШТ 1" },
      { src: "/slides/11a/image5.jpeg", caption: "Сургуулийн сагс, гар бөмбөгийн АШТ 2" },
    ],
  },
  {
    id: "section-3",
    tone: "green",
    icon: "award",
    label: "Амжилт",
    title: "Сургуулийн урлагын наадам",
    achievements: [
      { badge: "Онцлох", name: "Урлагын үзлэг" },
      { badge: "Онцлох", name: "1." },
      { badge: "Онцлох", name: "Гоцлол бүжиг" },
      { badge: "Онцлох", name: "Дэд байр" },
      { badge: "Онцлох", name: "2." },
      { badge: "Онцлох", name: "Найрал дуу" },
      { badge: "Онцлох", name: "Тэргүүн байр" },
    ],
    images: [
      { src: "/slides/11a/image6.jpeg", caption: "Сургуулийн урлагын наадам 1" },
      { src: "/slides/11a/image7.jpeg", caption: "Сургуулийн урлагын наадам 2" },
    ],
  },
  {
    id: "section-4",
    tone: "amber",
    icon: "medal",
    label: "Амжилт",
    title: "Сургуулийн спортын наадам",
    achievements: [
      { badge: "Онцлох", name: "М. Итгэлт" },
      { badge: "Онцлох", name: "100 м гүйлт" },
      { badge: "Онцлох", name: "хүрэл" },
      { badge: "Онцлох", name: "Г. Түвшинтөр" },
      { badge: "Онцлох", name: "800 м гүйлт" },
      { badge: "Онцлох", name: "мөнгө" },
      { badge: "1-р байр", name: "А. Тунгалаг-Эрдэнэ", event: "800 м гүйлт" },
      { badge: "Онцлох", name: "Б. Амин-Эрдэнэ" },
      { badge: "Онцлох", name: "холын хариалт" },
      { badge: "Онцлох", name: "мөнгө" },
    ],
    images: [
      { src: "/slides/11a/image8.jpeg", caption: "Сургуулийн спортын наадам 1" },
      { src: "/slides/11a/image9.jpeg", caption: "Сургуулийн спортын наадам 2" },
      { src: "/slides/11a/image10.jpeg", caption: "Сургуулийн спортын наадам 3" },
    ],
  },
  {
    id: "section-5",
    tone: "purple",
    icon: "book",
    label: "Амжилт",
    title: "Б. Хүслэн-Эрдэнэ",
    achievements: [
      { badge: "Онцлох", name: "Даам САШТ" },
      { badge: "Онцлох", name: "Алтан медаль" },
      { badge: "Онцлох", name: "Ж. Энхриймаа" },
      { badge: "Онцлох", name: "1." },
      { badge: "Онцлох", name: "Шатар САШТ" },
      { badge: "Онцлох", name: "Алтан медаль" },
      { badge: "Онцлох", name: "Ганцаарчилсан төрөлд амжилт гаргасан сурагчид" },
      { badge: "Онцлох", name: "2." },
      { badge: "Онцлох", name: "Гар зургийн тэмцээн" },
      { badge: "Онцлох", name: "Тэргүүн байр" },
    ],
    images: [
      { src: "/slides/11a/image11.jpeg", caption: "Б. Хүслэн-Эрдэнэ 1" },
      { src: "/slides/11a/image12.jpeg", caption: "Б. Хүслэн-Эрдэнэ 2" },
    ],
  },
  {
    id: "section-6",
    tone: "red",
    icon: "trophy",
    label: "Амжилт",
    title: "М. Итгэлт",
    achievements: [
      { badge: "Онцлох", name: "Ширээний теннис САШТ" },
      { badge: "Онцлох", name: "Мөнгөн медаль" },
      { badge: "Онцлох", name: "С. Маралмаа" },
      { badge: "Онцлох", name: "Ганцаарчилсан төрөлд амжилт гаргасан сурагчид" },
      { badge: "Онцлох", name: "МХБ" },
      { badge: "Онцлох", name: "н ЭЕШ" },
      { badge: "Онцлох", name: "735" },
      { badge: "Онцлох", name: "оноо" },
    ],
    images: [
      { src: "/slides/11a/image13.jpeg", caption: "М. Итгэлт 1" },
      { src: "/slides/11a/image14.jpeg", caption: "М. Итгэлт 2" },
    ],
  },
  {
    id: "section-7",
    tone: "sky",
    icon: "star",
    label: "Амжилт",
    title: "Ганцаарчилсан төрөлд амжилт гаргасан сурагчид",
    achievements: [
      { badge: "Тэргүүн байр", name: "Б. Арвижихнинжимаа", event: "“Торгоны зам” хүүхдийн олон улсын урлагийн наадам, Хөх хот" },
      { badge: "Тэргүүн байр", name: "Б. Арвижихнинжимаа", event: "Монголын үндэсний Cheerleading аварга шалгаруулах тэмцээн - Team Jazz төрөл" },
      { badge: "Тэргүүн байр", name: "Б. Арвижихнинжимаа", event: "Монголын үндэсний Cheerleading аварга шалгаруулах тэмцээн - Team High Kick төрөл" },
    ],
    images: [
      { src: "/slides/11a/image15.jpeg", caption: "Б. Арвижихнинжимаа - Олон улсын урлагийн наадам" },
      { src: "/slides/11a/image16.jpeg", caption: "Cheerleading - Team Jazz" },
      { src: "/slides/11a/image17.jpeg", caption: "Cheerleading - Team High Kick" },
    ],
  },
  {
    id: "section-8",
    tone: "teal",
    icon: "award",
    label: "Амжилт",
    title: "Загварын тэмцээн болон спорт өдөрлөг",
    achievements: [
      { badge: "Алтан медаль", name: "О. Гэгээнхишиг", event: "Загварын тэмцээн - Шилдэг загвар өмсөгч" },
      { badge: "1-р байр", name: "Б. Мичид-Эрдэнэ", event: "Загварын тэмцээн - Загвар зохион бүтээгч" },
      { badge: "1-р байр", name: "А. Тунгалаг-Эрдэнэ", event: "Спорт өдөрлөг - 800 м гүйлт" },
    ],
    images: [
      { src: "/slides/11a/image18.jpeg", caption: "О. Гэгээнхишиг, Б. Мичид-Эрдэнэ - Загварын тэмцээн" },
      { src: "/slides/11a/image19.jpeg", caption: "А. Тунгалаг-Эрдэнэ - Спорт өдөрлөг" },
    ],
  },
  {
    id: "section-9",
    tone: "indigo",
    icon: "medal",
    label: "Амжилт",
    title: "Хөл бөмбөг, англи хэлний илтгэл, IELTS",
    achievements: [
      { badge: "Алтан медаль", name: "Г. Түвшинтөр", event: "Хөл бөмбөгийн УАШТ" },
      { badge: "Тэргүүн байр", name: "Т. Намулун", event: "Англи хэлний илтгэлийн тэмцээн" },
      { badge: "Дэд байр", name: "Л. Дмитрий", event: "Англи хэлний илтгэлийн тэмцээн" },
      { badge: "IELTS 8.0", name: "Ү. Цахирмаа", event: "IELTS шалгалт" },
    ],
    images: [
      { src: "/slides/11a/image20.jpeg", caption: "Г. Түвшинтөр - Хөл бөмбөгийн УАШТ" },
      { src: "/slides/11a/image21.jpeg", caption: "Т. Намулун, Л. Дмитрий, Ү. Цахирмаа - Англи хэлний амжилт" },
    ],
  },
  {
    id: "section-10",
    tone: "blue",
    icon: "book",
    label: "Амжилт",
    title: "Багийн төрөлд амжилт гаргасан сурагчид",
    achievements: [
      { badge: "Тэргүүн байр", name: "Т. Эрдэнэдорж, Б. Амин-Эрдэнэ, Г. Түвшинтөр, М. Итгэлт, С. Маралмаа, Ж. Энхриймаа, Б. Мичид-Эрдэнэ, А. Хулан, Д. Дөлгөөн, Б. Чинхүслэн", event: "Өсвөрийн парламент" },
      { badge: "III байр", name: "11А анги", event: "Counter-Strike II e-sport тэмцээн" },
      { badge: "Алтан медаль", name: "Д. Дөлгөөн, Ж. Энхриймаа, А. Тунгалаг-Эрдэнэ, О. Гэгээнхишиг", event: "3vs3 сургуулийн спорт өдөрлөг" },
    ],
    images: [
      { src: "/slides/11a/image22.jpeg", caption: "Өсвөрийн парламент - Тэргүүн байр" },
      { src: "/slides/11a/image23.jpg", caption: "Counter-Strike II e-sport тэмцээн - III байр" },
      { src: "/slides/11a/image24.jpeg", caption: "3vs3 спорт өдөрлөг - Алтан медаль" },
    ],
  },
  {
    id: "section-11",
    tone: "pink",
    icon: "trophy",
    label: "Амжилт",
    title: "11-р хэсэг",
    achievements: [
      { badge: "Онцлох", name: "Тайлант өдөрлөгийн материал" },
    ],
    images: [
      { src: "/slides/11a/image25.png", caption: "11-р хэсэг 1" },
      { src: "/slides/11a/image26.png", caption: "11-р хэсэг 2" },
    ],
  },
  {
    id: "section-12",
    tone: "green",
    icon: "star",
    label: "Амжилт",
    title: "info@tselmeg.edu.mn",
    achievements: [
      { badge: "Онцлох", name: "tselmeg.edu.mn" },
      { badge: "Онцлох", name: "БАЯРЛАЛАА" },
      { badge: "Онцлох", name: "АНХААРАЛ ХАНДУУЛСАН ТА БҮХЭНД" },
    ],
    images: [
      { src: "/slides/11a/image27.png", caption: "info@tselmeg.edu.mn 1" },
      { src: "/slides/11a/image28.png", caption: "info@tselmeg.edu.mn 2" },
    ],
  }
];

export default function Class11APage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="11А"
      totalStudents={21}
      maleStudents={11}
      femaleStudents={10}
      teacher="Б.Ууганбаяр"
      coverImage={{ src: "/slides/11a/image1.jpeg", alt: "11А анги", caption: "11А ангийн тайлант өдөрлөг" }}
      intro={
        <>
          ТАНИЛЦУУЛГА
        </>
      }
      sections={sections}
      footer="11А анги - Тайлант өдөрлөг 2025-2026"
    />
  );
}
