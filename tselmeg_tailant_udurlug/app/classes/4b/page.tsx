import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "sports",
    tone: "blue",
    icon: "trophy",
    label: "Спорт",
    title: "Сургуулийн спортын наадам",
    achievements: [
      { badge: "3-р байр", name: "Я.Мөнхгэрэл", event: "100 метрийн гүйлт" },
      { badge: "3-р байр", name: "Хосбишрэлт", event: "Гар дээр суниалт" },
    ],
    images: [
      { src: "/slides/4b/image3.jpg", caption: "Спортын наадам" },
      { src: "/slides/4b/image4.jpg", caption: "4В ангийн хамт олон" },
    ],
  },
  {
    id: "arts",
    tone: "pink",
    icon: "star",
    label: "Урлаг",
    title: "Сургуулийн урлагийн наадам",
    achievements: [
      { badge: "Алтан медаль", name: "Б.Чинхүслэн", event: "Гоцлол дуу" },
      { badge: "Хүрэл медаль", name: "Я.Мөнхгэрэл", event: "Гоцлол бүжиг" },
      { badge: "Хүрэл медаль", name: "Цэцэнгоо, Ундрам, Түвшинтөгөлдөр, Билгүүн, Сара, Тэмүлэн, Ананд, Хасар, Аминхүслэн", event: "Чөлөөт үзүүлбэр" },
    ],
    images: [
      { src: "/slides/4b/image5.jpg", caption: "Урлагийн наадам" },
      { src: "/slides/4b/image6.jpg", caption: "Гоцлол дуу" },
      { src: "/slides/4b/image7.jpg", caption: "Чөлөөт үзүүлбэр" },
    ],
  },
  {
    id: "math-iq",
    tone: "amber",
    icon: "medal",
    label: "Олимпиад",
    title: "Математик, IQ, Шидэт квадрат",
    achievements: [
      { badge: "1-р зэрэг", name: "Х.Цэцэнгоо, Я.Мөнхгэрэл", event: "Кенгуру олимпиад" },
      { badge: "2-р зэрэг", name: "М.Хасар, Ц.Гэгээ", event: "Кенгуру олимпиад" },
      { badge: "3-р зэрэг", name: "М.Мөнх-Эрдэнэ", event: "Кенгуру олимпиад" },
      { badge: "Топ үнэлгээ", name: "Я.Мөнхгэрэл, Сондор", event: "IQ сорилго" },
      { badge: "28-р байр", name: "О.Төгсболд", event: "IQ академи олимпиад" },
      { badge: "79-р байр", name: "Я.Мөнхгэрэл", event: "IQ академи олимпиад" },
      { badge: "Диплом 2", name: "Я.Мөнхгэрэл, М.Мөнх-Эрдэнэ", event: "Шидэт квадрат" },
    ],
    images: [
      { src: "/slides/4b/image10.jpg", caption: "Математикийн амжилт" },
      { src: "/slides/4b/image11.jpg", caption: "Олимпиадын оролцогч" },
      { src: "/slides/4b/image12.jpg", caption: "Математикийн амжилтууд" },
      { src: "/slides/4b/image13.jpg", caption: "Олимпиадын өдөр" },
      { src: "/slides/4b/image14.png", caption: "Шагналт сурагчид" },
      { src: "/slides/4b/image16.jpg", caption: "Өргөмжлөл" },
      { src: "/slides/4b/image17.jpg", caption: "Олимпиадын амжилт" },
      { src: "/slides/4b/image18.jpg", caption: "Олимпиадын амжилт" },
    ],
  },
  {
    id: "aha-books",
    tone: "green",
    icon: "book",
    label: "Танин мэдэхүй",
    title: "АХА тэмцээн ба Дэлхийн номын баяр",
    achievements: [
      { badge: "1-р байр", name: "М.Аминхүслэн", event: "АХА тэмцээн" },
      { badge: "2-р байр", name: "М.Хасар", event: "АХА тэмцээн" },
      { badge: "3-р байр", name: "Б.Төвшинтөр", event: "АХА тэмцээн" },
      { badge: "Өргөмжлөл", name: "4В анги", event: "Шилдэг номын булантай анги" },
      { badge: "Алтан медаль", name: "Я.Мөнхгэрэл", event: "Уран жиргээ" },
      { badge: "Алтан медаль", name: "Б.Ялгуун", event: "Номын зургийн уралдаан" },
    ],
    images: [
      { src: "/slides/4b/image20.jpg", caption: "АХА тэмцээн" },
      { src: "/slides/4b/image21.jpg", caption: "АХА тэмцээний амжилт" },
      { src: "/slides/4b/image27.jpg", caption: "Рубик шооны амжилт" },
    ],
  },
  {
    id: "clubs-english",
    tone: "purple",
    icon: "award",
    label: "Дугуйлан",
    title: "Бүжиг, хөгжим, рубик, Puppet Show",
    achievements: [
      { badge: "Хүрэл медаль", name: "Б.Сондор, Д.Дөлгөөн, Х.Цэцэнгоо", event: "Хан-Уул дүүргийн бүжгийн тэмцээн" },
      { badge: "Өргөмжлөл", name: "Б.Чинхүслэн", event: "Хөгжимлөг хүүхэд" },
      { badge: "Алтан медаль", name: "Х.Цэцэнгоо", event: "Рубик шооны тэмцээн" },
      { badge: "2-р байр", name: "М.Хасар, М.Аминхүслэн, Х.Цэцэнгоо, Т.Наранбилиг болон багийнхан", event: "Puppet Show Competition" },
      { badge: "Тусгай байр", name: "Г.Билгүүн, Д.Дөлгөөн, Я.Мөнхгэрэл болон багийнхан", event: "Puppet Show Competition" },
    ],
    images: [
      { src: "/slides/4b/image22.jpg", caption: "Бүжгийн тэмцээн" },
      { src: "/slides/4b/image23.jpg", caption: "Puppet Show Competition" },
      { src: "/slides/4b/image24.jpg", caption: "Puppet Show Competition" },
      { src: "/slides/4b/image25.jpg", caption: "Дугуйлангийн амжилт" },
      { src: "/slides/4b/image26.png", caption: "Дугуйлангийн амжилт" },
    ],
  },
  {
    id: "drawing",
    tone: "sky",
    icon: "star",
    label: "Гар зураг",
    title: "Сургуулийн зургийн тэмцээнүүд",
    achievements: [
      { badge: "1-р байр", name: "М.Аминхүслэн", event: "Мартын 8 зургийн уралдаан" },
      { badge: "1-р байр", name: "Я.Мөнхгэрэл", event: "Цэргийн баяр зургийн уралдаан" },
      { badge: "Алтан медаль", name: "Б.Ялгуун", event: "Монгол бахархал зургийн уралдаан" },
      { badge: "Мөнгөн медаль", name: "Я.Мөнхгэрэл", event: "Монгол бахархал зургийн уралдаан" },
      { badge: "Алтан медаль", name: "Б.Ялгуун", event: "Шүд эрүүл ахуй зургийн уралдаан" },
      { badge: "Тусгай байр", name: "М.Хасар", event: "Шүд эрүүл ахуй зургийн уралдаан" },
      { badge: "1-р байр", name: "Б.Ялгуун", event: "Цэнхэр дэлхийгээс Сансар руу" },
      { badge: "2-р байр", name: "Х.Цэцэнгоо", event: "Цэнхэр дэлхийгээс Сансар руу" },
    ],
    images: [
      { src: "/slides/4b/image28.jpg", caption: "Гар зургийн бүтээлүүд" },
      { src: "/slides/4b/image29.jpeg", caption: "Гар зургийн амжилт" },
      { src: "/slides/4b/image30.jpg", caption: "Сансар руу" },
      { src: "/slides/4b/image31.jpg", caption: "Гар зургийн амжилт" },
      { src: "/slides/4b/image32.jpg", caption: "Сансар руу" },
    ],
  },
];

export default function FourBPage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="4В"
      totalStudents={23}
      maleStudents={11}
      femaleStudents={12}
      teacher="Ж.Анужин"
      leader="М.Аминхүслэн"
      coverImage={{ src: "/slides/4b/image1.jpeg", alt: "4В анги", caption: "Ангийн багш: Ж.Анужин | Ангийн дарга: М.Аминхүслэн" }}
      intro={
        <>
          4В анги нь нийт <span className="font-black text-brand-navy">23 сурагчтай</span>, 11 эрэгтэй, 12 эмэгтэй.
          Хичээл сурлага, урлаг, спортын авьяастай, сургуулийн үйл ажиллагаанд идэвхтэй оролцдог хамт олон.
        </>
      }
      sections={sections}
      footer="4В анги - Өсөж дэвжих хүсэлтэй, идэвхтэй хамт олон"
    />
  );
}
