import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "section-1",
    tone: "blue",
    icon: "trophy",
    label: "Танилцуулга",
    title: "Цэлмэг Дижитал Интернейшнл сургуулийн Ж.Янжинлхам багштай 7 а анги йн танилцуулга",
    achievements: [
      { badge: "Онцлох", name: "Манай анги нь нийт 26 суралцагчтай ба үүнээс 15 эрэгтэй, 11 эмэгтэй." },
    ],
    images: [
      { src: "/slides/7a/image1.png", caption: "Цэлмэг Дижитал Интернейшнл сургуулийн Ж.Янжинлхам багштай 7 а анги йн танилцуулга 1" },
    ],
  },
  {
    id: "section-2",
    tone: "pink",
    icon: "star",
    label: "Амжилт",
    title: "Ангийн дарга С.Оюударь Ш.Дөлгөөн",
    achievements: [
      { badge: "Онцлох", name: "Манай ангийн сурагчид хичээл сурлага, урлаг, спортын чиглэлээр өндөр авьяас чадвар, амжилт гарган суралцдаг бөгөөд хүмүүжил, ёс зүй, харилцаа хандлагын хувьд төлөвшсөн, хамт олонч сурагчид юм. А нги хамт олны үйл ажиллагаанд өөрийн боломжит бүхийл чадвараа дайчлан , суралцах үйл ажиллагаанд идэвх санаачилгатай оролцдог . Мөн сургуулиас зохион байгуулдаг уралдаан тэмцээн, урлаг спортын арга хэмжээ, олон нийтийн болон хүмүүжлийн ажлуудад тогтмол идэвхтэй оролцож, амжилт бүтээл гарган, үе тэнгийн сурагчидтайгаа мөр зэрэгцэн явдаг" },
    ],
    images: [
      { src: "/slides/7a/image2.jpeg", caption: "Ангийн дарга С.Оюударь Ш.Дөлгөөн 1" },
    ],
  },
  {
    id: "section-3",
    tone: "green",
    icon: "award",
    label: "Амжилт",
    title: "Сургуулийн спортын наадам",
    achievements: [
      { badge: "Онцлох", name: "Гар дээр суниалт" },
    ],
    images: [
      { src: "/slides/7a/image3.jpeg", caption: "Сургуулийн спортын наадам 1" },
    ],
  },
  {
    id: "section-4",
    tone: "amber",
    icon: "medal",
    label: "Амжилт",
    title: "Эрэгтэй төрөлд хүрэл медаль",
    achievements: [
      { badge: "Онцлох", name: "Б. Эрдэнэ-Очир" },
    ],
    images: [
      { src: "/slides/7a/image4.jpeg", caption: "Эрэгтэй төрөлд хүрэл медаль 1" },
    ],
  },
  {
    id: "section-5",
    tone: "purple",
    icon: "book",
    label: "Амжилт",
    title: "Эмэгтэй төрөлд алтан медаль",
    achievements: [
      { badge: "Онцлох", name: "Н. Мишээл" },
    ],
    images: [
      { src: "/slides/7a/image5.jpg", caption: "Эмэгтэй төрөлд алтан медаль 1" },
    ],
  },
  {
    id: "section-6",
    tone: "red",
    icon: "trophy",
    label: "Амжилт",
    title: "Гар дээр суниалт",
    achievements: [
      { badge: "Онцлох", name: "Эрэгтэй төрөлд хүрэл медаль" },
    ],
    images: [

    ],
  },
  {
    id: "section-7",
    tone: "sky",
    icon: "star",
    label: "Амжилт",
    title: "Б. Эрдэнэ-Очир",
    achievements: [
      { badge: "Онцлох", name: "Эмэгтэй төрөлд алтан медаль" },
    ],
    images: [
      { src: "/slides/7a/image6.jpg", caption: "Б. Эрдэнэ-Очир 1" },
    ],
  },
  {
    id: "section-8",
    tone: "teal",
    icon: "award",
    label: "Амжилт",
    title: "Н. Мишээл",
    achievements: [
      { badge: "Онцлох", name: "Байрнаас уртын харайлт" },
    ],
    images: [
      { src: "/slides/7a/image7.jpg", caption: "Н. Мишээл 1" },
    ],
  },
  {
    id: "section-9",
    tone: "indigo",
    icon: "medal",
    label: "Амжилт",
    title: "Эмэгтэй төрөлд алт",
    achievements: [
      { badge: "Онцлох", name: "Э. Индра" },
    ],
    images: [
      { src: "/slides/7a/image8.jpg", caption: "Эмэгтэй төрөлд алт 1" },
    ],
  },
  {
    id: "section-10",
    tone: "blue",
    icon: "book",
    label: "Амжилт",
    title: "Байрнаас уртын харайлт",
    achievements: [
      { badge: "Онцлох", name: "Эмэгтэй төрөлд алт" },
    ],
    images: [
      { src: "/slides/7a/image9.jpg", caption: "Байрнаас уртын харайлт 1" },
    ],
  },
  {
    id: "section-11",
    tone: "pink",
    icon: "trophy",
    label: "Амжилт",
    title: "Э. Индра",
    achievements: [
      { badge: "Онцлох", name: "Буухиа гүйлт" },
    ],
    images: [
      { src: "/slides/7a/image10.jpeg", caption: "Э. Индра 1" },
    ],
  },
  {
    id: "section-12",
    tone: "green",
    icon: "star",
    label: "Амжилт",
    title: "Эмэгтэй төрөлд хүрэл",
    achievements: [
      { badge: "Онцлох", name: "В. Сувд, Б.Анужин, Э. Индра, М. Оюу" },
    ],
    images: [

    ],
  },
  {
    id: "section-13",
    tone: "amber",
    icon: "award",
    label: "Амжилт",
    title: "Урлагийн наадам",
    achievements: [
      { badge: "Онцлох", name: "Энэ хүү үйл ажиллагаанд а нги хамт олноороо амжилттай оролцсон." },
    ],
    images: [
      { src: "/slides/7a/image11.jpg", caption: "Урлагийн наадам 1" },
    ],
  },
  {
    id: "section-14",
    tone: "purple",
    icon: "medal",
    label: "Амжилт",
    title: "Хамтлаг бүжгийн төрөлд алт",
    achievements: [
      { badge: "Онцлох", name: "М. Батбаясгалан, А.Билгүүн, Т. Чингим , Б. Заяабилэг, Б.Анужин, Э. Индра Г. Тэлмэн, С. Оюударь" },
    ],
    images: [
      { src: "/slides/7a/image12.jpeg", caption: "Хамтлаг бүжгийн төрөлд алт 1" },
    ],
  },
  {
    id: "section-15",
    tone: "red",
    icon: "book",
    label: "Амжилт",
    title: "Ангийн хүүхдүүдийн амжилт",
    achievements: [
      { badge: "Онцлох", name: "С.Шандас" },
      { badge: "Онцлох", name: "Анги хамт олноо манлайлан суралцсан тул 2025-2026 хичээлийн жилд ОНЫ ТЭРГҮҮНИЙ СУРАГЧ-аар шагнагдав." },
    ],
    images: [
      { src: "/slides/7a/image13.jpg", caption: "Ангийн хүүхдүүдийн амжилт 1" },
    ],
  },
  {
    id: "section-16",
    tone: "sky",
    icon: "trophy",
    label: "Амжилт",
    title: "Олон улсын Кенгуру олимпиадаас:",
    achievements: [
      { badge: "Онцлох", name: "3-р зэрэг хүртсэн." },
    ],
    images: [
      { src: "/slides/7a/image14.jpeg", caption: "Олон улсын Кенгуру олимпиадаас: 1" },
    ],
  },
  {
    id: "section-17",
    tone: "teal",
    icon: "star",
    label: "Амжилт",
    title: "Н.Мишээл",
    achievements: [
      { badge: "Онцлох", name: "Цэлмэг Дижитал Интернейшнл сургуулиас зохион байгуулсан 100 буудалт даамны тэмцээнд 1 байр эзэлсэн." },
      { badge: "Онцлох", name: "Хан- Уул дүүргийн 100 буудал даамны өсвөрийн аварга шалгаруулах тэмцээнд 5-р байранд шалгарсан." },
      { badge: "Онцлох", name: "Цэлмэг Дижитал Интернейшнл сургуулиас зохион байгуулсан шатрын тэмцээнд 2-р байр тус тус эзлэв." },
      { badge: "Онцлох", name: "Хувцас загварын 7 хоног загварын зураг төрлөөр 3-р байр тус тус шалгарав." },
      { badge: "Онцлох", name: "Цэлмэг Дижитал Интернейшнл сургуулиас зохион байгуулсан шатрын тэмцээнд М.Батбаясгалан 1-р байр" },
    ],
    images: [
      { src: "/slides/7a/image15.jpg", caption: "Н.Мишээл 1" },
    ],
  },
  {
    id: "section-18",
    tone: "indigo",
    icon: "award",
    label: "Амжилт",
    title: "Н. Маргад-Эрдэнэ 2 -р байр",
    achievements: [
      { badge: "Онцлох", name: "Олон улсын Кенгуру олимпиадаас :" },
    ],
    images: [

    ],
  },
  {
    id: "section-19",
    tone: "blue",
    icon: "medal",
    label: "Амжилт",
    title: "Н.Маргад-Эрдэнэ 3-р зэрэг",
    achievements: [
      { badge: "Онцлох", name: "С.Шандас 3 -р зэрэг" },
    ],
    images: [
      { src: "/slides/7a/image16.jpeg", caption: "Н.Маргад-Эрдэнэ 3-р зэрэг 1" },
    ],
  },
  {
    id: "section-20",
    tone: "pink",
    icon: "book",
    label: "Амжилт",
    title: "Н.Мишээл 3 - зэрэг",
    achievements: [
      { badge: "Онцлох", name: "Б.Ундрахбаяр 3 -р зэрэг тус тус эзлэв." },
    ],
    images: [
      { src: "/slides/7a/image17.jpg", caption: "Н.Мишээл 3 - зэрэг 1" },
    ],
  },
  {
    id: "section-21",
    tone: "green",
    icon: "trophy",
    label: "Амжилт",
    title: "Т.Чингим",
    achievements: [
      { badge: "Онцлох", name: "1.2025 оны 3 р сард Япон улс зохиогдсон Саятама 2025 ОУ- ын нээлттэй тэмцээний 11-13 насны 35кг жинд тулалдаж 11 улсын 46 тамирчидаас 3р байр эзэлж Хүрэл медаль" },
      { badge: "Онцлох", name: "2. 2026оны 2р сард Мөнх хөх сүлд клубын нэрэмжит тэмцээний -40 кг жинд түрүүлж Алтан медаль энэхүү тэмцээний шилдэг өсвөрийн тамирчин шагналын н эзэн болсон ." },
      { badge: "Онцлох", name: "3. Монголын гардан тулааны холбооны 2026 оны Аварга шалгаруулах тэмцээний өсвөр нас 11-13 насны -45 кг жинд тулалдаж Алтан медаль" },
      { badge: "Онцлох", name: "4. Бага тэнгэр Ахан дүүс анхдугаар нээлттэй тэмцээн 2026 оны Тулааны -35 кг Мөнгөн медаль" },
    ],
    images: [
      { src: "/slides/7a/image18.jpeg", caption: "Т.Чингим 1" },
    ],
  },
  {
    id: "section-22",
    tone: "amber",
    icon: "star",
    label: "Амжилт",
    title: "А.Билгүүн",
    achievements: [
      { badge: "Онцлох", name: "1. МУБИС Биеийн тамирын сургуулийн 70 жилийн ойн тэмцээнд хүрэл медаль" },
      { badge: "Онцлох", name: "2. Jiu Jitsu AJP tour олон улсын тэмцээний хүрэл медаль" },
      { badge: "Онцлох", name: "3. Улсыг аварга шалгаруулах тэмцээний мөнгөн медаль" },
      { badge: "Онцлох", name: "Номтой 7 хоног аяны гар зургийн уралдаанд Б. Анужин гар зургийн уралдаанд 2-р байр" },
      { badge: "Онцлох", name: "Цагаан сарын 7 хоногийн аяны хүрээнд гар зургийн уралдаанд Б.Анужин 3-р байр" },
    ],
    images: [
      { src: "/slides/7a/image19.jpeg", caption: "А.Билгүүн 1" },
    ],
  },
  {
    id: "section-23",
    tone: "purple",
    icon: "award",
    label: "Амжилт",
    title: "Оюударь эр цэргийн баярт зориулсан гар зургийн уралдаанд 3-р байр",
    achievements: [
      { badge: "Онцлох", name: "Номтой 7 хоног аяны гар зургийн уралдаанд Э.Индра 1-р байр тус тус эзлэв." },
    ],
    images: [
      { src: "/slides/7a/image20.jpeg", caption: "Оюударь эр цэргийн баярт зориулсан гар зургийн уралдаанд 3-р байр 1" },
    ],
  },
  {
    id: "section-24",
    tone: "red",
    icon: "medal",
    label: "Амжилт",
    title: "Дуу бүжгийн улсын анх дугаар уралдаанд Тэлмэн 1-р байр",
    achievements: [
      { badge: "Онцлох", name: "Хамтын бүжгийн төрөлд Тэлмэн 2-р байр мөн тус тус эзэлсэн" },
      { badge: "Онцлох", name: "Манай а нгийн нь зохион байгуул с ан үйл ажиллагаанд бүх нийтээр идэвх санаачлагатай оролцдог эвсэг хамт олон юм." },
      { badge: "Онцлох", name: "Чингис хааны музей үзэж танилцав." },
      { badge: "Онцлох", name: "Бие даалтын 7 хоногоор ангиараа чөлөөт цагаа өнгөрөөв." },
    ],
    images: [

    ],
  }
];

export default function Class7APage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="7А"
      totalStudents={26}
      maleStudents={15}
      femaleStudents={11}
      teacher="Ж.Янжинлхам"
      coverImage={{ src: "/slides/7a/image1.png", alt: "7А анги", caption: "7А ангийн тайлант өдөрлөг" }}
      intro={
        <>
          Манай анги нь нийт 26 суралцагчтай ба үүнээс 15 эрэгтэй, 11 эмэгтэй.
        </>
      }
      sections={sections}
      footer="7А анги - Тайлант өдөрлөг 2025-2026"
    />
  );
}
