import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "sports-day",
    tone: "blue",
    icon: "trophy",
    label: "Спорт",
    title: "Tselmeg Sports Day ба САШТ",
    achievements: [
      { badge: "Мөнгөн медаль", name: "Н.Батсуурь, Б.Золбоот, А.Ананд, М.Батцэрэн", event: "Буухиа гүйлт" },
      { badge: "Алтан медаль", name: "Д.Хулан", event: "100 метрийн гүйлт" },
      { badge: "Хүрэл медаль", name: "М.Эрхсаран", event: "Гүйлтийн төрөл" },
      { badge: "Тэргүүн байр", name: "С.Амартүвшин", event: "Pease Cheorwon Volleyball Challenge 2025" },
      { badge: "Алтан медаль", name: "11В эрэгтэй баг", event: "САШТ волейбол" },
      { badge: "Шилдэг тоглогч", name: "С.Амартүвшин", event: "САШТ волейбол" },
      { badge: "Шилдэг тоглогч", name: "Б.Анирлан", event: "САШТ сагсан бөмбөг" },
      { badge: "Цомын эзэн", name: "11В анги", event: "САШ сагсан бөмбөгийн тэмцээн" },
    ],
    images: [
      { src: "/slides/11b/image3.jpg", caption: "Спартакиад" },
      { src: "/slides/11b/image13.jpeg", caption: "Воллейболлын тэмцээн" },
      { src: "/slides/11b/image14.jpeg", caption: "Воллейболлын тэмцээн" },
      { src: "/slides/11b/image15.jpg", caption: "Сагсан бөмбөгийн тэмцээний MVP" },
      { src: "/slides/11b/image16.jpg", caption: "Багийн амжилт" },
    ],
  },
  {
    id: "culture-week",
    tone: "pink",
    icon: "star",
    label: "Соёл",
    title: "Соёл түгээе, Happy Halloween, Монгол бахархал",
    achievements: [
      { badge: "Тусгай байр", name: "Ж.Төгөлдөр", event: "Мазаалай пост уралдаан" },
      { badge: "Цэвэр сайхан бичигтэн", name: "М.Эрхсаран", event: "Үндэсний бичиг" },
      { badge: "Идэвхтэй оролцоо", name: "11В анги", event: "Happy Halloween" },
    ],
    images: [
      { src: "/slides/11b/image4.png", caption: "Мазаалай пост" },
      { src: "/slides/11b/image5.jpeg", caption: "Мазаалай пост" },
      { src: "/slides/11b/image6.jpeg", caption: "Happy Halloween" },
      { src: "/slides/11b/image7.jpeg", caption: "Happy Halloween" },
      { src: "/slides/11b/image8.jpeg", caption: "Happy Halloween" },
      { src: "/slides/11b/image9.jpeg", caption: "Happy Halloween" },
      { src: "/slides/11b/image10.jpeg", caption: "Happy Halloween" },
      { src: "/slides/11b/image11.jpeg", caption: "Happy Halloween" },
      { src: "/slides/11b/image12.png", caption: "Нийгмийн олимпиад" },
    ],
  },
  {
    id: "arts-new-year",
    tone: "purple",
    icon: "award",
    label: "Урлаг",
    title: "Цэлмэгийн авьяастууд ба ангийн шинэ жил",
    achievements: [
      { badge: "2-р байр", name: "Б.Баяр, Ж.Төгөлдөр, Б.Энхзаяа", event: "Хөгжмийн төрөл" },
      { badge: "Оны тэргүүний сурагч", name: "Б.Золбоот", event: "Ангийн шинэ жил 2025" },
      { badge: "Тэргүүний сурагч", name: "А.Ананд", event: "Ангийн шинэ жил 2025" },
      { badge: "Спортлог сурагч", name: "С.Амартүвшин", event: "Ангийн шинэ жил 2025" },
      { badge: "Алтан Монита", name: "Б.Баяр, Б.Нандин-Эрдэнэ", event: "Ангийн шинэ жил 2025" },
      { badge: "Шилдэг 3", name: "Д.Хулан, М.Эгшиглэн, Б.Баяр", event: "АХА тэмцээн" },
    ],
    images: [
      { src: "/slides/11b/image17.png", caption: "Хөгжмийн төрөл" },
      { src: "/slides/11b/image18.png", caption: "Хөгжмийн үзүүлбэр" },
      { src: "/slides/11b/image19.jpg", caption: "Ангийн шинэ жил" },
      { src: "/slides/11b/image20.jpeg", caption: "Алтан монита" },
      { src: "/slides/11b/image21.jpeg", caption: "АХА тэмцээн" },
    ],
  },
  {
    id: "volunteer",
    tone: "green",
    icon: "book",
    label: "Сайн дурын ажил",
    title: "Нийгмийн оролцоо ба сайн дурын ажлууд",
    achievements: [
      { badge: "21 сурагч", name: "11В анги", event: "TOYA CUP-2026 зохион байгуулалт" },
      { badge: "Guide", name: "11В анги", event: "Open day" },
      { badge: "Хандив", name: "11В анги", event: "ОУ-ын Ихрүүдийн баярын өдөр" },
      { badge: "Сайн дурын ажил", name: "11В анги", event: "ХУД-ын Рубик шооны АШТ" },
    ],
    images: [
      { src: "/slides/11b/image22.jpg", caption: "Сайн дурын ажил" },
      { src: "/slides/11b/image23.jpg", caption: "Сайн дурын ажлын гэрчилгээ" },
      { src: "/slides/11b/image24.jpg", caption: "Ихрүүдийн өдрийн сайн дурын ажил" },
      { src: "/slides/11b/image25.jpeg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image26.jpeg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image27.jpeg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image28.jpeg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image29.jpeg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image30.jpg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image31.jpeg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image34.jpg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/11b/image35.jpg", caption: "Цэлмэг Cube Cup 2026" },
    ],
  },
  {
    id: "olympiads",
    tone: "amber",
    icon: "medal",
    label: "Олимпиад",
    title: "Математик, SASMO, Кенгуру, дизайн",
    achievements: [
      { badge: "Хүрэл медаль", name: "А.Ананд, Б.Золбоот", event: "АМО Америкийн математикийн олимпиад" },
      { badge: "Тусгай байр", name: "М.Батцэрэн", event: "SASMO олимпиад" },
      { badge: "Тусгай байр", name: "С.Түвшинболд", event: "SASMO олимпиад" },
      { badge: "Оролцогчид", name: "11В анги", event: "SASMO олимпиад" },
      { badge: "3-р байр", name: "Ж.Төгөлдөр", event: "Дизайн, зурагзүйн онлайн олимпиад - мультимедиа" },
      { badge: "7-р байр", name: "Э.Уянга", event: "Наран сургуулийн нэрэмжит 2-р олимпиад" },
      { badge: "2-р зэрэг", name: "Д.Хулан, А.Ананд, Б.Өнөболд, Б.Золбоот, Э.Уянга", event: "Кенгуру танхимын олимпиад" },
    ],
    images: [
      { src: "/slides/11b/image41.jpg", caption: "Олимпиадын амжилт" },
      // { src: "/slides/11b/image42.png", caption: "Олимпиадын мэдээлэл" },
      { src: "/slides/11b/image43.png", caption: "SASMO оролцогчид" },
      { src: "/slides/11b/image44.png", caption: "Ж.Төгөлдөр" },
      { src: "/slides/11b/image50.jpg", caption: "Kangaroo math olympiad" },
    ],
  },
  {
    id: "rubik-drawing-fashion",
    tone: "sky",
    icon: "star",
    label: "Хувь хүний амжилт",
    title: "Рубик, гар зураг, гоёо, даам",
    achievements: [
      { badge: "Тэргүүн байр", name: "А.Нандин-Эрдэнэ", event: "Дэлхийн усны өдөр, сансрын өдөрт зориулсан гар зураг" },
      { badge: "5-р зэрэг", name: "А.Нандин-Эрдэнэ", event: "HUGO and COLOR гар зургийн олимпиад" },
      { badge: "Алтан медаль", name: "Ж.Төгөлдөр", event: "САШ Рубик шооны тэмцээн" },
      { badge: "Мөнгөн медаль", name: "Д.Хулан", event: "САШ Рубик шооны тэмцээн" },
      { badge: "Хүрэл медаль", name: "Б.Анирлан, А.Нандин-Эрдэнэ", event: "Цэлмэгийн гоёо - авангард хувцас" },
      { badge: "Хүрэл медаль", name: "Б.Энэрэл", event: "Цэлмэгийн гоёо - гоёлын хувцас" },
      { badge: "Хүрэл медаль", name: "М.Эгшиглэн", event: "Загварын хувцасны зураг" },
      { badge: "Алтан медаль", name: "Ч.Аминхүслэн", event: "100 буудалт даам" },
      { badge: "Мөнгөн медаль", name: "Д.Хулан", event: "100 буудалт даам" },
    ],
    images: [
      { src: "/slides/11b/image32.jpg", caption: "Гар зургийн амжилт" },
      { src: "/slides/11b/image33.jpg", caption: "Гар зургийн оролцоо" },
      { src: "/slides/11b/image36.jpg", caption: "Рубик шооны сайн дурын ажил" },
      { src: "/slides/11b/image37.jpg", caption: "Рубик шооны сайн дурын ажил" },
      { src: "/slides/11b/image38.jpg", caption: "Рубик шооны сайн дурын ажил" },
      { src: "/slides/11b/image39.jpg", caption: "Рубик шооны сайн дурын ажил" },
      { src: "/slides/11b/image40.jpg", caption: "Рубик шооны сайн дурын ажил" },
      { src: "/slides/11b/image45.jpeg", caption: "Гоёлын хувцас" },
      { src: "/slides/11b/image46.jpeg", caption: "Цэлмэгийн гоёо" },

      { src: "/slides/11b/image48.jpeg", caption: "100 буудалт даам" },
      { src: "/slides/11b/image49.png", caption: "Кенгуру олимпиад" },
    ],
  },
  {
    id: "student-leadership-trip",
    tone: "teal",
    icon: "book",
    label: "Манлайлал ба аялал",
    title: "СӨУЗ, мэдээний клуб, номын баяр, Эрдэнэт аялал",
    achievements: [
      { badge: "Гишүүн", name: "Б. Анирлан", event: "СӨУЗ" },
      { badge: "Гадаад харилцааны дарга", name: "Б.Энэрэл", event: "СӨУЗ" },
      { badge: "Мэдээлэл харилцааны дарга", name: "Ж.Төгөлдөр", event: "СӨУЗ" },
      { badge: "Үүсгэн байгуулагчид", name: "Д.Хулан, М.Эрхсаран, М.Энхзаяа", event: "TDIS мэдээний клуб" },
      { badge: "Оролцоо", name: "11В анги", event: "Номын баяр" },
      { badge: "Танилцах аялал", name: "11В анги", event: "Эрдэнэт үйлдвэр" },
    ],
    images: [
      { src: "/slides/11b/image51.jpeg", caption: "Номын баяр" },
      { src: "/slides/11b/image52.jpg", caption: "Бие даалтын 7 хоног" },
      { src: "/slides/11b/image53.jpeg", caption: "Эрдэнэт аялал" },
      { src: "/slides/11b/image54.jpeg", caption: "Эрдэнэт үйлдвэртэй танилцах аялал" },
    ],
  },
];

export default function ElevenBPage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="11В"
      totalStudents={21}
      maleStudents={10}
      femaleStudents={11}
      teacher="Л.Эгиймаа"
      leader="Б.Золбоот, Д.Хулан"
      coverImage={{ src: "/slides/11b/image2.png", alt: "11В анги", caption: "Ангийн багш: Л.Эгиймаа | Ангийн дарга: Б.Золбоот, Д.Хулан" }}
      intro={
        <>
          11В анги нь нийт <span className="font-black text-brand-navy">21 сурагчтай</span>, 10 эрэгтэй, 11 эмэгтэй.
          Сурлага, урлаг, спорт, нийгмийн сайн сайхны сайн дурын ажилд идэвхтэй оролцдог хамт олон.
        </>
      }
      sections={sections}
      footer="11В анги - Манлайлал, оролцоо, амжилтаар тэргүүлэгч хамт олон"
    />
  );
}
