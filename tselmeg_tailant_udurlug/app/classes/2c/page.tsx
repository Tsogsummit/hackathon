import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "sports-day",
    tone: "blue",
    icon: "trophy",
    label: "Спорт",
    title: "Намрын спорт наадам",
    achievements: [
      { badge: "Мөнгөн медаль", name: "З.Билгүүн", event: "Байрнаас уртад харайх" },
      { badge: "Хүрэл медаль", name: "М.Сондор", event: "Байрнаас уртад харайх" },
      { badge: "Хүрэл медаль", name: "З.Билгүүн", event: "100 метрийн гүйлт" },
      { badge: "Хүрэл медаль", name: "Н.Энэрэл", event: "Гар дээр суниалт" },
      { badge: "Хүрэл медаль", name: "Ж.Сэцэн, Б.Урандарь, Б.Цогзолмаа, Б.Сийлэн", event: "Буухиа гүйлт - эмэгтэй" },
      { badge: "Мөнгөн медаль", name: "Б.Хангал, З.Билгүүн, Л.Мандахнаран, Б.Мэргэн-Очир", event: "Буухиа гүйлт - эрэгтэй" },
    ],
    images: [{ src: "/slides/2c/image1.jpeg", caption: "2С ангийн хамт олон" }],
  },
  {
    id: "arts-english",
    tone: "pink",
    icon: "star",
    label: "Урлаг ба англи хэл",
    title: "Цэлмэгийн авьяастан, Spelling Bee, Halloween",
    achievements: [
      { badge: "3-р байр", name: "2С анги", event: "Найрал дуу" },
      { badge: "1-р байр", name: "2С ангийн сурагчид", event: "Spelling Bee" },
      { badge: "Идэвхтэй оролцоо", name: "2С анги", event: "Halloween best costume" },
    ],
    images: [
      { src: "/slides/2c/image2.jpeg", caption: "Найрал дууны амжилт" },
      { src: "/slides/2c/image4.jpeg", caption: "Halloween best costume" },
    ],
  },
  {
    id: "math",
    tone: "amber",
    icon: "medal",
    label: "Математик",
    title: "АМО, SASMO, Кенгуру, Хүрдний тэмцээнүүд",
    achievements: [
      { badge: "Хүрэл медаль", name: "Б.Мэргэн-Очир, Г.Бат-Оргил", event: "АМО олимпиад" },
      { badge: "Тусгай байр", name: "Н.Энэрэл, А.Оюунтөгөлдөр", event: "АМО олимпиад" },
      { badge: "Хүрэл медаль", name: "Б.Мэргэн-Очир, Г.Бат-Оргил", event: "SASMO олимпиад" },
      { badge: "1-р зэрэг", name: "Б.Сарангоо, Б.Мэргэн-Очир, З.Бүжинлхам, Б.Цогзолмаа, Б.Цогзолдорж, А.Оюунтөгөлдөр", event: "Кенгуру цахим сорилт" },
      { badge: "2-р зэрэг", name: "Н.Энэрэл, С.Нандин-Эрдэнэ", event: "Кенгуру цахим сорилт" },
      { badge: "Тэргүүн байр", name: "З.Бүжинлхам", event: "Хүрдний АХА" },
      { badge: "Тэргүүн байр", name: "С.Нандин-Эрдэнэ, Д.Марал, А.Нараншижир, Н.Хасуй, Ж.Сэцэн, Б.Урандарь", event: "Хүрдний Хаан" },
    ],
    images: [
      { src: "/slides/2c/image5.jpeg", caption: "Математикийн олимпиадын амжилт" },
      { src: "/slides/2c/image6.jpeg", caption: "Олимпиадын оролцогчид" },
      { src: "/slides/2c/image7.jpeg", caption: "Олимпиадын амжилт" },
      { src: "/slides/2c/image8.jpeg", caption: "Хүрдний баяр" },
      { src: "/slides/2c/image23.jpeg", caption: "Математикийн оролцогчид" },
    ],
  },
  {
    id: "drawing-poetry",
    tone: "green",
    icon: "award",
    label: "Бүтээлч амжилт",
    title: "Гар зураг ба уран уншлага",
    achievements: [
      { badge: "2-р байр", name: "Б.Цогзолмаа", event: "Цагаан сар сэдэвт гар зургийн уралдаан" },
      { badge: "3-р байр", name: "Б.Цогзолмаа", event: "Beautiful women гар зургийн уралдаан" },
      { badge: "Тусгай байр", name: "Б.Цогзолдорж", event: "Beautiful women гар зургийн уралдаан" },
      { badge: "2-р байр", name: "2С ангийн сурагч", event: "Монгол цэргийн баярын гар зургийн уралдаан" },
      { badge: "3-р байр", name: "Б.Цогзолдорж", event: "Үгнээс дүрсэнд гар зургийн уралдаан" },
      { badge: "Алтан медаль", name: "Н.Энэрэл", event: "Уран жиргээ-2026" },
    ],
    images: [
      { src: "/slides/2c/image9.jpeg", caption: "Бүтээлч уралдааны оролцоо" },
      { src: "/slides/2c/image10.jpeg", caption: "Гар зургийн бүтээл" },
      { src: "/slides/2c/image11.jpeg", caption: "Гар зургийн амжилт" },
      { src: "/slides/2c/image12.jpeg", caption: "Бүтээл" },
      { src: "/slides/2c/image13.jpeg", caption: "Гар зургийн бүтээл" },
      { src: "/slides/2c/image14.jpeg", caption: "Шагналт бүтээл" },
      { src: "/slides/2c/image15.jpeg", caption: "Бүтээлийн үзэсгэлэн" },
      { src: "/slides/2c/image16.jpeg", caption: "Уран жиргээ" },
      { src: "/slides/2c/image17.jpeg", caption: "Өргөмжлөл" },
    ],
  },
  {
    id: "dance-taekwondo",
    tone: "purple",
    icon: "trophy",
    label: "Дугуйлан ба спорт",
    title: "Бүжиг, таеквондо, даам, шатар",
    achievements: [
      { badge: "Хүрэл медаль", name: "Б.Цогзолмаа, Н.Энэрэл, Ж.Сэцэн", event: "Уран хэлхээ-2026" },
      { badge: "Шилдэг үзүүлбэр", name: "Хөх дөл хамтлаг", event: "Сурагч нас-2026" },
      { badge: "Улсын хошой аварга", name: "З.Билгүүн", event: "Таеквондо УАШ-2026" },
      { badge: "Мөнгөн медаль", name: "Б.Цогзолдорж", event: "Сургуулийн даамны АШТ" },
      { badge: "Хүрэл медаль", name: "Л.Мандахнаран, С.Нандин-Эрдэнэ", event: "Сургуулийн даамны АШТ" },
      { badge: "Алтан медаль", name: "А.Оюунтөгөлдөр, З.Билгүүн", event: "Сургуулийн шатрын АШТ" },
    ],
    images: [
      { src: "/slides/2c/image18.jpeg", caption: "Бүжгийн амжилт" },
      { src: "/slides/2c/image19.jpeg", caption: "Бүжгийн наадам" },
      { src: "/slides/2c/image20.jpeg", caption: "Сурагч нас-2026" },
      { src: "/slides/2c/image21.jpeg", caption: "Хөх дөл хамтлаг" },
      { src: "/slides/2c/image22.jpeg", caption: "Бүжгийн өргөмжлөл" },
      { src: "/slides/2c/image24.jpeg", caption: "Таеквондогийн амжилт" },
      { src: "/slides/2c/image25.jpeg", caption: "Даамны амжилт" },
      { src: "/slides/2c/image26.jpeg", caption: "Шатрын амжилт" },
    ],
  },
];

export default function TwoCPage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="2С"
      totalStudents={0}
      maleStudents={0}
      femaleStudents={0}
      coverImage={{ src: "/slides/2c/image3.jpeg", alt: "2С анги", caption: "2С ангийн хамт олон" }}
      intro={
        <>
          Цэлмэг дижитал интернэйшнл сургуулийн 2С анги нь спорт, урлаг, математик, англи хэл, гар зураг болон
          дугуйлангийн олон төрлийн үйл ажиллагаанд идэвхтэй оролцож амжилт гаргасан хамт олон.
        </>
      }
      sections={sections}
      footer="2С анги - Авьяас, оролцоо, амжилтаар дүүрэн хамт олон"
    />
  );
}
