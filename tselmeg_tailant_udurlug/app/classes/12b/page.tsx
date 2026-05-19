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

const sourceSections: ClassReportSection[] = [
  {
    id: "source-1",
    tone: "sky",
    icon: "book",
    label: "Эх баримт",
    title: "Баримтаас нэмсэн агуулга 1",
    achievements: [
      { badge: "Эх баримт", name: "Слайд 1: info@tselmeg.edu.mn" },
      { badge: "Эх баримт", name: "tselmeg.edu.mn" },
      { badge: "Эх баримт", name: "TSELMEG DIGITAL" },
      { badge: "Эх баримт", name: "INTERNATIONAL" },
      { badge: "Эх баримт", name: "SCHOOL" },
      { badge: "Эх баримт", name: "12b class" },
      { badge: "Эх баримт", name: "Слайд 2: 12b c" },
      { badge: "Эх баримт", name: "lass" },
      { badge: "Эх баримт", name: "12b" },
      { badge: "Эх баримт", name: "анги нь нийт" },
      { badge: "Эх баримт", name: "сурагчтай. Үүнээс" },
      { badge: "Эх баримт", name: "эмэгтэй сурагчтай. Тус анги хичээл сурлага төдийгүй сургуулийн болон ангийн олон нийтийн ажилд тогтмол идэвхтэй оролцдог. Спорт, урлагийн чиглэлээр гаргасан амжилттай. Хариуцлагатай, зөв төлөвшилтэй сурагчид юм. Мөн хүмүүнлэгийн болон сайн дурын үйл ажиллагаанд оролцдог бусдын болон нийгмийн сайн сайхан байдлын төлөө санаа тавьдаг сурагчидтай анги." },
      { badge: "Эх баримт", name: "Слайд 3: 1A CLASS" },
      { badge: "Эх баримт", name: "12B CLASS" },
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
      { badge: "Эх баримт", name: "УРИА:" },
      { badge: "Эх баримт", name: "ИРЭЭДҮЙГ БИД БҮТЭЭНЭ, БИДНИЙ ИРЭЭДҮЙ ЦЭЛМЭГ БАЙГ" },
      { badge: "Эх баримт", name: "ЗОРИЛГО:" },
      { badge: "Эх баримт", name: "САЙХАН ДУРСАМЖ БҮТЭЭНЭ," },
      { badge: "Эх баримт", name: "САЙН ХИЧЭЭЦГЭЭНЭ." },
      { badge: "Эх баримт", name: "Монгол Улсын Их Хурлаас зохион байгуулж буй 2025 Өсвөрийн Парламентын гишүүн сурагч Б. Содбилэг" },
      { badge: "Эх баримт", name: "Слайд 4: Пи тооны Аварга” шалгаруулах уралдаанд" },
      { badge: "Эх баримт", name: "Намрын спартакиадад 3" },
      { badge: "Эх баримт", name: "сагсан бөмбөгийн эмэгтэй төрөлд мөнгөн медаль" },
      { badge: "Эх баримт", name: "Слайд 5: Сургуулийн шатрын аварга шалгаруулах тэмцээний мөнгөн медал У. Түмэн" },
      { badge: "Эх баримт", name: "Слайд 6: e Sport" },
      { badge: "Эх баримт", name: "” тэмцээнийн мөнгөн медаль" },
      { badge: "Эх баримт", name: "Сургуулийн урлагын үзлэгт амжилттай оролцон язгуур урлаг төрлөөр өрсөлдөн хүрэл медаль, чөлөөт үзүүлбэрийн төрөлд мөнгөн медаль авсан авсан" },
      { badge: "Эх баримт", name: "Слайд 9: Энтерпернер" },
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
      { badge: "Эх баримт", name: "хөтөлбөрийн хүрээнд бизнес судлагаа хийх аялал" },
      { badge: "Эх баримт", name: "Слайд 10: info@tselmeg.edu.mn" },
      { badge: "Эх баримт", name: "tselmeg.edu.mn" },
      { badge: "Эх баримт", name: "БАЯРЛАЛАА" },
      { badge: "Эх баримт", name: "АНХААРАЛ ХАНДУУЛСАН ТА БҮХЭНД" },
    ],
    images: [],
  }
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
      sections={[...sections, ...sourceSections]}
      footer="12Б анги - Ирээдүйг бид бүтээнэ"
    />
  );
}
