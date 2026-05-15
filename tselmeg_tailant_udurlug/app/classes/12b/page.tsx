import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "introduction",
    tone: "sky",
    icon: "book",
    label: "Ангийн танилцуулга",
    title: "Ц.Алтанзул багштай 12Б анги",
    achievements: [
      { badge: "22 сурагч", name: "12Б анги", event: "12 эрэгтэй, 9 эмэгтэй сурагчтай" },
      { badge: "Идэвхтэй хамт олон", name: "12Б анги", event: "Сурлага, спорт, урлаг, сайн дурын ажилд тогтмол оролцдог" },
    ],
    images: [],
  },
  {
    id: "leaders",
    tone: "amber",
    icon: "award",
    label: "Манлайлал",
    title: "Тэргүүний сурагчид ба Өсвөрийн парламент",
    achievements: [
      { badge: "Тэргүүний сурагч", name: "Б.Содбилэг, С.Ариунжаргал, А.Мандарваа", event: "Монголын багш нарын холбооны шагнал" },
      { badge: "Гишүүн", name: "Б.Содбилэг", event: "2025 Өсвөрийн парламент" },
    ],
    images: [
      { src: "/slides/12b/image6.jpg", caption: "Тэргүүний сурагчдын шагнал" },
      { src: "/slides/12b/image7.jpg", caption: "Өсвөрийн парламент 2025" },
      { src: "/slides/12b/image8.jpg", caption: "12Б ангийн хамт олон" },
    ],
  },
  {
    id: "sports-pi",
    tone: "blue",
    icon: "trophy",
    label: "Спорт & Оюун",
    title: "Пи тооны аварга, намрын спартакиад",
    achievements: [
      { badge: "Тэргүүн байр", name: "Э.Үнэнбат", event: "Пи тооны аварга шалгаруулах уралдаан" },
      { badge: "Мөнгөн медаль", name: "12Б ангийн эмэгтэй баг", event: "Намрын спартакиад 3x3 сагсан бөмбөг" },
    ],
    images: [
      { src: "/slides/12b/image9.jpg", caption: "Пи тооны аварга" },
      { src: "/slides/12b/image10.jpg", caption: "Намрын спартакиад 3x3" },
    ],
  },
  {
    id: "chess-daam",
    tone: "purple",
    icon: "medal",
    label: "Оюуны спорт",
    title: "Шатар, даамын аварга шалгаруулах тэмцээн",
    achievements: [
      { badge: "Мөнгөн медаль", name: "У.Түмэн-Өлзий", event: "Сургуулийн шатрын аварга" },
      { badge: "Хүрэл медаль", name: "Б.Азжаргал", event: "Сургуулийн шатрын аварга" },
      { badge: "Мөнгөн медаль", name: "У.Түмэн-Өлзий", event: "Сургуулийн даамын аварга" },
      { badge: "Хүрэл медаль", name: "Б.Азжаргал", event: "Сургуулийн даамын аварга" },
    ],
    images: [
      { src: "/slides/12b/image11.jpg", caption: "Шатрын тэмцээн" },
      { src: "/slides/12b/image12.jpg", caption: "Даамын тэмцээн" },
    ],
  },
  {
    id: "esport-arts",
    tone: "pink",
    icon: "star",
    label: "Урлаг & Цахим спорт",
    title: "eSport тэмцээн, урлагийн үзлэг",
    achievements: [
      { badge: "Мөнгөн медаль", name: "12Б анги", event: "eSport тэмцээн" },
      { badge: "Хүрэл медаль", name: "12Б анги", event: "Урлагийн үзлэг - язгуур урлаг" },
      { badge: "Мөнгөн медаль", name: "12Б анги", event: "Урлагийн үзлэг - чөлөөт үзүүлбэр" },
    ],
    images: [
      { src: "/slides/12b/image13.jpg", caption: "eSport тэмцээн" },
      { src: "/slides/12b/image14.jpg", caption: "Урлагийн үзлэг" },
    ],
  },
  {
    id: "volunteer-earth",
    tone: "green",
    icon: "award",
    label: "Сайн дурын ажил",
    title: "Эх дэлхийн цэвэрлэгээний өдөр, Нархан төвд хандив",
    achievements: [
      { badge: "Сайн дурын ажил", name: "12Б анги", event: "Эх дэлхийн цэвэрлэгээний өдөр" },
      { badge: "Хандив", name: "12Б анги", event: "Нархан асрамж халамжийн төвд хувцас хандивлав" },
    ],
    images: [
      { src: "/slides/12b/image15.jpg", caption: "Эх дэлхийн цэвэрлэгээний өдөр" },
      { src: "/slides/12b/image16.jpg", caption: "Сайн дурын ажил" },
      { src: "/slides/12b/image17.jpg", caption: "Нархан төвд хандив" },
    ],
  },
  {
    id: "volunteer-foundation-rubik",
    tone: "teal",
    icon: "star",
    label: "Хүмүүнлэг & Рубик",
    title: "Кристина Ноблийн сан, рубик шооны улсын аварга",
    achievements: [
      { badge: "Уулзалт", name: "12Б анги", event: "Кристина Ноблийн Хүүхдийн Сангийн хүмүүнлэгийн үйл ажиллагаатай танилцав" },
      { badge: "Оролцоо", name: "12Б анги", event: "Рубик шооны улсын аварга шалгаруулах тэмцээн" },
    ],
    images: [
      { src: "/slides/12b/image18.jpg", caption: "Кристина Ноблийн Хүүхдийн Сан" },
      { src: "/slides/12b/image19.jpg", caption: "Хүмүүнлэгийн үйл ажиллагаатай танилцах уулзалт" },
      { src: "/slides/12b/image20.jpg", caption: "Рубик шооны улсын аварга" },
    ],
  },
  {
    id: "entrepreneur",
    tone: "indigo",
    icon: "book",
    label: "Энтерпренер",
    title: "Бизнес судалгааны аялал",
    achievements: [
      { badge: "Судалгаа", name: "12Б анги", event: "Энтерпренер хөтөлбөрийн хүрээнд бизнес судалгааны аялал хийв" },
    ],
    images: [
      { src: "/slides/12b/image21.jpg", caption: "Бизнес судалгааны аялал" },
      { src: "/slides/12b/image22.jpg", caption: "Энтерпренер хөтөлбөр" },
      { src: "/slides/12b/image23.jpg", caption: "Судалгааны уулзалт" },
    ],
  },
];

export default function TwelveBPage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="12Б"
      totalStudents={22}
      maleStudents={12}
      femaleStudents={9}
      teacher="Ц.Алтанзул"
      coverImage={{ src: "/slides/12b/image5.png", alt: "12Б анги", caption: "Ангийн багш: Ц.Алтанзул" }}
      intro={
        <>
          12Б анги нь <span className="font-black text-brand-navy">хичээл сурлага, спорт, урлаг, сайн дурын үйл ажиллагаанд</span>{" "}
          идэвхтэй оролцдог, хариуцлагатай, зөв төлөвшилтэй төгсөх ангийн хамт олон.
        </>
      }
      sections={sections}
      footer="12Б анги - Ирээдүйг бид бүтээнэ"
    />
  );
}
