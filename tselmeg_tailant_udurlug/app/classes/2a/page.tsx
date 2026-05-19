import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "spartakiad",
    tone: "blue",
    icon: "trophy",
    label: "Спорт",
    title: "Намрын спартакиад",
    achievements: [
      { badge: "Мөнгөн медаль", name: "Г.Ган-Очир", event: "Гар дээр суниах төрөл" },
      { badge: "Алтан медаль", name: "М.Бүжинлхам", event: "Гар дээр суниах төрөл" },
    ],
    images: [{ src: "/slides/2a/image2.jpeg", caption: "Намрын спартакиад" }],
  },
  {
    id: "arts",
    tone: "pink",
    icon: "star",
    label: "Урлаг",
    title: "Авьяаслаг Цэлмэгчүүд урлагийн наадам",
    achievements: [
      { badge: "Хүрэл медаль", name: "Т.Танан", event: "Гоцлол бүжиг" },
      { badge: "Хүрэл медаль", name: "2А анги", event: "Хамтлаг хөгжим" },
    ],
    images: [
      { src: "/slides/2a/image3.jpeg", caption: "Урлагийн наадам" },
      { src: "/slides/2a/image4.jpeg", caption: "Авьяаслаг Цэлмэгчүүд" },
      { src: "/slides/2a/image5.jpeg", caption: "Гоцлол бүжиг" },
    ],
  },
  {
    id: "amo-kangaroo",
    tone: "amber",
    icon: "medal",
    label: "Олимпиад",
    title: "АМО болон Кенгуру олимпиад",
    achievements: [
      { badge: "Алтан медаль", name: "Г.Итгэлт", event: "АМО олимпиад" },
      { badge: "Хүрэл медаль", name: "О.Минжин", event: "АМО олимпиад" },
      { badge: "1-р зэрэг", name: "Д.Хулангоо, Б.Эмүжин, Г.Итгэлт", event: "Кенгуру олимпиад" },
      { badge: "2-р зэрэг", name: "Б.Бишрэлт, Х.Тэгшжаргал", event: "Кенгуру олимпиад" },
    ],
    images: [
      { src: "/slides/2a/image6.jpeg", caption: "АМО олимпиад" },
      { src: "/slides/2a/image7.jpeg", caption: "АМО олимпиадын амжилт" },
      { src: "/slides/2a/image8.jpeg", caption: "Олимпиадын оролцогчид" },
      { src: "/slides/2a/image9.jpeg", caption: "Кенгуру 2025" },
      { src: "/slides/2a/image10.jpeg", caption: "Кенгуру олимпиад" },
    ],
  },
  {
    id: "daam",
    tone: "green",
    icon: "trophy",
    label: "Оюуны спорт",
    title: "100 буудалт даам",
    achievements: [
      { badge: "Алтан медаль", name: "О.Золбоо", event: "Эрэгтэй төрөл" },
      { badge: "Алтан медаль", name: "Д.Нинж", event: "Эмэгтэй төрөл" },
    ],
    images: [
      { src: "/slides/2a/image11.jpeg", caption: "Даамны аварга" },
      { src: "/slides/2a/image12.jpeg", caption: "100 буудалт даам" },
    ],
  },
  {
    id: "rubik",
    tone: "purple",
    icon: "award",
    label: "Рубик шоо",
    title: "Рубик шооны сургуулийн аварга",
    achievements: [
      { badge: "Алтан медаль", name: "Б.Билгүүтэй", event: "6-7 насны ангилал" },
      { badge: "Хүрэл медаль", name: "М.Бүжинлхам", event: "6-7 насны ангилал" },
    ],
    images: [
      { src: "/slides/2a/image13.jpeg", caption: "Рубик шооны тэмцээн" },
      { src: "/slides/2a/image14.jpeg", caption: "Рубик шооны тэмцээн" },
    ],
  },
  {
    id: "spelling-bee",
    tone: "sky",
    icon: "book",
    label: "Англи хэл",
    title: "Spelling Bee - Үсэглэлийн аварга",
    achievements: [
      { badge: "Өргөмжлөл", name: "С.Сувдансондор, Г.Итгэлт, Д.Нинж, Д.Хулангоо, О.Золбоо", event: "Spelling Bee / Үсэглэлийн аварга" },
    ],
    images: [
      { src: "/slides/2a/image15.jpeg", caption: "Spelling Bee тэмцээн" },
      { src: "/slides/2a/image16.jpeg", caption: "Spelling Bee тэмцээн" },
      { src: "/slides/2a/image17.jpeg", caption: "Spelling Bee тэмцээн" },
    ],
  },
  {
    id: "chess",
    tone: "indigo",
    icon: "medal",
    label: "Шатар",
    title: "Сургуулийн шатрын аварга",
    achievements: [
      { badge: "Хүрэл медаль", name: "Г.Итгэлт", event: "Эрэгтэй төрөл" },
      { badge: "Мөнгөн медаль", name: "О.Минжин", event: "Эмэгтэй төрөл" },
    ],
    images: [
      { src: "/slides/2a/image18.jpeg", caption: "Шатрын тэмцээн" },
      { src: "/slides/2a/image19.jpeg", caption: "Шатрын амжилт" },
    ],
  },
  {
    id: "english-tree-math",
    tone: "sky",
    icon: "book",
    label: "Сургалт",
    title: "Сүлд модоо чимье, Хүрдний АХА",
    achievements: [
      { badge: "1-р байр", name: "Х.Тэгшжаргал", event: "Сүлд модоо чимье" },
      { badge: "Дэд байр", name: "Н.Энэрэл", event: "Хүрдний АХА" },
      { badge: "Гутгаар байр", name: "Г.Итгэлт", event: "Хүрдний АХА" },
    ],
    images: [
      { src: "/slides/2a/image20.jpeg", caption: "Сүлд модоо чимье" },
      { src: "/slides/2a/image21.png", caption: "Сүлд модоо чимье" },
      { src: "/slides/2a/image22.jpeg", caption: "Хүрдний АХА" },
    ],
  },
  {
    id: "experiments",
    tone: "teal",
    icon: "book",
    label: "Хүн орчин",
    title: "Туршилт хичээлүүд",
    achievements: [
      { badge: "Хамтын оролцоо", name: "2А анги", event: "Хүн Орчин хичээлийн туршилт" },
    ],
    images: [
      { src: "/slides/2a/image23.jpeg", caption: "Туршилт хичээлийн үйл явц" },
      { src: "/slides/2a/image24.jpeg", caption: "Сурагчдын туршилтын ажил" },
      { src: "/slides/2a/image25.jpeg", caption: "Туршилт хичээлийн оролцоо" },
      { src: "/slides/2a/image26.jpeg", caption: "Туршилт хичээл" },
      { src: "/slides/2a/image27.jpeg", caption: "Ангидаа туршилт хийсэн нь" },
      { src: "/slides/2a/image28.jpeg", caption: "Хамтын туршилт" },
      { src: "/slides/2a/image29.jpeg", caption: "Сурагчдын тайлбар" },
      { src: "/slides/2a/image30.jpeg", caption: "Хичээлийн танилцуулга" },
      { src: "/slides/2a/image31.jpeg", caption: "Туршилтын үр дүн" },
      { src: "/slides/2a/image32.jpeg", caption: "Бүтээлч ажил" },
      { src: "/slides/2a/image33.jpeg", caption: "Хамтын бүтээл" },
      { src: "/slides/2a/image34.jpeg", caption: "Туршилтын танилцуулга" },
    ],
  },
  {
    id: "trip",
    tone: "green",
    icon: "star",
    label: "Аялал",
    title: "Төл малтай танилцах нэг өдрийн аялал",
    achievements: [
      { badge: "Танин мэдэхүй", name: "2А анги", event: "Нэг өдрийн аялал" },
    ],
    images: [
      { src: "/slides/2a/image35.jpeg", caption: "Монгол ахуйтай танилцсан нь" },
      { src: "/slides/2a/image36.jpeg", caption: "Аяллын дурсамж" },
      { src: "/slides/2a/image37.png", caption: "Төл малтай танилцсан хамт олон" },
      { src: "/slides/2a/image38.jpeg", caption: "Төл малтай танилцах аялал" },
      { src: "/slides/2a/image39.jpeg", caption: "Аяллын өдөр" },
      { src: "/slides/2a/image40.jpeg", caption: "Хамт олны аялал" },
    ],
  },
  {
    id: "abc-party",
    tone: "red",
    icon: "award",
    label: "Англи хэл",
    title: "ABC party",
    achievements: [
      { badge: "Тайлан", name: "2А анги", event: "Англи хэлээр сурсан зүйлээ эцэг эх, асран хамгаалагчдад тайлагнав" },
    ],
    images: [
      { src: "/slides/2a/image41.jpeg", caption: "ABC party" },
      { src: "/slides/2a/image42.jpeg", caption: "ABC party үйл ажиллагаа" },
      { src: "/slides/2a/image43.jpeg", caption: "ABC party хамт олон" },
      { src: "/slides/2a/image44.jpeg", caption: "ABC party тайлан" },
    ],
  },
];

export default function TwoAPage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="2А"
      totalStudents={23}
      maleStudents={11}
      femaleStudents={12}
      teacher="Н.Золзаяа"
      coverImage={{ src: "/slides/2a/image1.jpeg", alt: "2А анги", caption: "Ангийн багш: Н.Золзаяа" }}
      intro={
        <>
          Н.Золзаяа багштай 2А анги нь <span className="font-black text-brand-navy">нийт 23 сурагчтай</span>, хичээл
          сургалт, урлаг, спорт, оюуны тэмцээн болон танин мэдэхүйн үйл ажиллагаанд идэвхтэй оролцдог хамт олон.
        </>
      }
      sections={sections}
      footer="2А анги - Идэвхтэй, бүтээлч, авьяаслаг хамт олон"
    />
  );
}
