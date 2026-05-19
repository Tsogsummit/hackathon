import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
  {
    id: "section-1",
    tone: "blue",
    icon: "trophy",
    label: "Танилцуулга",
    title: "С. Болортуяа багштай 4а ангийн танилцуулга",
    achievements: [
      { badge: "Онцлох", name: "0 0 4а анги 2025-2026 оны хичээлийн жилд 17 хөвгүүн, 9 охинтойгоор сургалт хүмүүжлийн ажлыг амжилттай зохион байгууллаа." },
      { badge: "Онцлох", name: "Ангий н нийт сурагчид маань хичээл сурлага , урлаг, спортын тэргүүний олон сура лцагчтай хамт олон билээ." },
      { badge: "Онцлох", name: "Хүүхдүүд маань Олон улсын болоод нийслэл, дүүргийн, олимпиад , нэ рэ мжит олимпиад, уралдаан тэмцээнд олон амжилтуудыг гаргалаа." },
      { badge: "Онцлох", name: "А н ги болон сургуулиас зохион байгуулсан үйл ажиллагаанд идэвх санаачлагатай сайн оролцдог сургуулийн шилдэг анги хамт олны нэг билээ." },
      { badge: "Онцлох", name: "Сурлагын амжилтууд." },
    ],
    images: [
      { src: "/slides/4a/image1.jpg", caption: "С. Болортуяа багштай 4а ангийн танилцуулга 1" },
      { src: "/slides/4a/image2.jpeg", caption: "С. Болортуяа багштай 4а ангийн танилцуулга 2" },
      { src: "/slides/4a/image3.png", caption: "С. Болортуяа багштай 4а ангийн танилцуулга 3" },
    ],
  },
  {
    id: "section-2",
    tone: "pink",
    icon: "star",
    label: "Амжилт",
    title: "IQ төвийн намрын сорилгод:",
    achievements: [
      { badge: "Онцлох", name: "Сурагч Б. Азбаяр, У. Содбилэг, Ж. Тэргэл, Б. Гэгээнээ, А. Тэмүүн, Ч. Чинхүслэн нар TOP үнэлгээтэй" },
    ],
    images: [
      { src: "/slides/4a/image4.png", caption: "IQ төвийн намрын сорилгод: 1" },
      { src: "/slides/4a/image5.png", caption: "IQ төвийн намрын сорилгод: 2" },
      { src: "/slides/4a/image6.jpeg", caption: "IQ төвийн намрын сорилгод: 3" },
    ],
  },
  {
    id: "section-3",
    tone: "green",
    icon: "award",
    label: "Амжилт",
    title: "АМО олон улсын математикийн олимпиадад:",
    achievements: [
      { badge: "Онцлох", name: "Сурагч Б. Азбаяр , сурагч У. Содбилэг нар 2-р байр “Мөнгөн медаль”" },
    ],
    images: [
      { src: "/slides/4a/image7.jpeg", caption: "АМО олон улсын математикийн олимпиадад: 1" },
      { src: "/slides/4a/image8.jpeg", caption: "АМО олон улсын математикийн олимпиадад: 2" },
    ],
  },
  {
    id: "section-4",
    tone: "amber",
    icon: "medal",
    label: "Амжилт",
    title: "Сургуулийн ПИ тооны аварга ЦОМ-ын эзэн анги",
    achievements: [
      { badge: "Онцлох", name: "“ Тоо бодож оюунаа хөгжүүлье” Математикийн массын олимпиадад ангиараа 3-р байр" },
    ],
    images: [
      { src: "/slides/4a/image9.jpg", caption: "Сургуулийн ПИ тооны аварга ЦОМ-ын эзэн анги 1" },
      { src: "/slides/4a/image10.jpg", caption: "Сургуулийн ПИ тооны аварга ЦОМ-ын эзэн анги 2" },
      { src: "/slides/4a/image11.jpeg", caption: "Сургуулийн ПИ тооны аварга ЦОМ-ын эзэн анги 3" },
    ],
  },
  {
    id: "section-5",
    tone: "purple",
    icon: "book",
    label: "Амжилт",
    title: "Олон улсын математикийн SASMO – 2026 олимпиадад:",
    achievements: [
      { badge: "Онцлох", name: "Сурагч Б. Азбаяр 1-р байр “Алтан медаль” , Р. Амирлан 2-р байр “ Мөнгөн медаль”" },
    ],
    images: [
      { src: "/slides/4a/image12.jpeg", caption: "Олон улсын математикийн SASMO – 2026 олимпиадад: 1" },
      { src: "/slides/4a/image13.jpg", caption: "Олон улсын математикийн SASMO – 2026 олимпиадад: 2" },
    ],
  },
  {
    id: "section-6",
    tone: "red",
    icon: "trophy",
    label: "Амжилт",
    title: "Шидэт квадрат Математикийн олимпиадад:",
    achievements: [
      { badge: "Онцлох", name: "Сурагч Б. Азбаяр 2-р байр “Мөнгөн медаль” ," },
    ],
    images: [
      { src: "/slides/4a/image14.jpg", caption: "Шидэт квадрат Математикийн олимпиадад: 1" },
      { src: "/slides/4a/image15.jpg", caption: "Шидэт квадрат Математикийн олимпиадад: 2" },
      { src: "/slides/4a/image16.jpg", caption: "Шидэт квадрат Математикийн олимпиадад: 3" },
    ],
  },
  {
    id: "section-7",
    tone: "sky",
    icon: "star",
    label: "Амжилт",
    title: "Р. Амирлан 1-р зэргийн диплом Д. Дагвасүрэн 2-р зэргийн д иплом",
    achievements: [
      { badge: "Онцлох", name: "Англи хэлний хичээлээр: 4, 5-р ангийн нийт сурагчдын англи хэлний “Хүүхэлдэйн жүжиг” уралдаанд : 1-р байр 1-р байр: 4A - The Lion and the Mouse 2-р байр: 4B – The Three Little Fish 3-р байр: 5A – Little Red Riding Hood 4-р байр: - 4B – The Three Little Pigs 5-р байр: - 5A – The Snow White The “Puppet Show” performance was successfully organized with the aim of improving the English language skills of 4th and 5th grade students, as well as developing their teamwork and creative thinking. During the performance, students used hand puppets to bring their prepared characters to life through storytelling. They expressed their talents creatively and worked collaboratively as a team. Thank you to all the students for your creativity and hard work. Winners: First Place: 4A - The Lion and the Mouse Second Place: 4B – The Three Little Fish Third Place: 5A – Little Red Riding Hood Special Place: - 4B – The Three Little Pigs Special Place: - 5A – The Snow White" },
    ],
    images: [
      { src: "/slides/4a/image17.jpg", caption: "Р. Амирлан 1-р зэргийн диплом Д. Дагвасүрэн 2-р зэргийн д иплом 1" },
      { src: "/slides/4a/image18.png", caption: "Р. Амирлан 1-р зэргийн диплом Д. Дагвасүрэн 2-р зэргийн д иплом 2" },
      { src: "/slides/4a/image19.jpeg", caption: "Р. Амирлан 1-р зэргийн диплом Д. Дагвасүрэн 2-р зэргийн д иплом 3" },
    ],
  },
  {
    id: "section-8",
    tone: "teal",
    icon: "award",
    label: "Амжилт",
    title: "Урлагийн амжилтууд",
    achievements: [
      { badge: "Онцлох", name: "Сургуулийн “АВЬЯАСЛАГ ЦЭЛМЭГЧҮҮД – 2026 ” урлагийн наадамд:" },
      { badge: "Онцлох", name: "“ Найрал дуу ” төрөлд 1-р байр" },
      { badge: "Онцлох", name: "“Язгуур урлаг” төрөлд 1-р байр" },
      { badge: "Онцлох", name: "“Хамтлаг хөгжим ” төрөл д 1-р байр “Алтан медаль”" },
      { badge: "Онцлох", name: "“ Хамтлаг бүжиг” төрөлд 2-р байр “Мөнгөн медаль ”" },
      { badge: "Онцлох", name: "“Гоцлол дуу “ төрөлд сурагч М. Хангарьд 3-р байр “Хүрэл медаль ”" },
      { badge: "Онцлох", name: "“Сурагч нас -2026 “ олон улсын бүжгийн уралдаанд сурагч Ж. Тэргэл, Т. Тэмүүлэн, Б. Гэгээнээ нар 3-р байр “Хүрэл медаль”" },
    ],
    images: [
      { src: "/slides/4a/image20.jpeg", caption: "Урлагийн амжилтууд 1" },
      { src: "/slides/4a/image21.jpeg", caption: "Урлагийн амжилтууд 2" },
    ],
  },
  {
    id: "section-9",
    tone: "indigo",
    icon: "medal",
    label: "Амжилт",
    title: "Спортын амжилтууд:",
    achievements: [
      { badge: "Онцлох", name: "Сургуулийн “ T SELMEG SPORTS DAY – 2025 спортын арга хэмжээнд" },
    ],
    images: [
      { src: "/slides/4a/image22.jpeg", caption: "Спортын амжилтууд: 1" },
      { src: "/slides/4a/image23.jpeg", caption: "Спортын амжилтууд: 2" },
      { src: "/slides/4a/image24.jpeg", caption: "Спортын амжилтууд: 3" },
    ],
  },
  {
    id: "section-10",
    tone: "blue",
    icon: "book",
    label: "Амжилт",
    title: "Эрэгтэй “Буухиа гүйлт” төрөлд 1-р байр “Алтан медаль”",
    achievements: [
      { badge: "Онцлох", name: "Эмэгтэй “Буухиа гүйлт” төрөлд 3-р байр “Хүрэл медаль”" },
      { badge: "Онцлох", name: "“ Гар дээр суниах” төрөлд сурагч М. Хангарьд 2-р байр “Мөнгөн медаль”" },
      { badge: "Онцлох", name: "“ Гар дээр суниах” төрөлд сурагч Б. Есүй 3-р байр “Хүрэл медаль”" },
      { badge: "Онцлох", name: "“ 100м-ийн гүйлт” эрэгтэй төрөлд сурагч Б. Өсөхбаяр 3-р байр “Хүрэл медаль”" },
      { badge: "Онцлох", name: "“ Уртын харайлт “ төрөлд сурагч А. Тэмүүн 3-р байр “Хүрэл медаль”" },
      { badge: "Онцлох", name: "Хан – Уул дүүргийн “100 буудалт даам”- ны тэмцээнд сурагч Ч. Чинхүслэн, Б. Дөлгөөн нар 2-р байр “Мөнгөн медаль”" },
      { badge: "Онцлох", name: "Нийслэлийн хувийн сургуулиудын дунд зохион байгуулагдсан “ SMART CUP – 2026 “ шатрын багийн тэмцээнд сурагч Э. Төржаргал, Б. Бат-Оргил, Т. Гэгээн нар 2-р байр “Мөнгөн медаль”" },
      { badge: "Онцлох", name: "Сургуулийн АШТ-ны шатрын тэмцээнд сурагч Д. Дагвасүрэн 1-р байр “Алтан медаль ” , Б. Есүй 1-р байр “Алтан медаль” , Р. Амирлан 3-р байр “Хүрэл медаль ”" },
      { badge: "Онцлох", name: "Сургуулийн АШТ-ний “100 буудалт даам”- ны тэмцээнд сурагч Ч. Чинхүслэн 1-р байр “ Алтан медаль”" },
      { badge: "Онцлох", name: "Сургуулийн АШТ-ны “Рубик шоо”- ны төрөлд сурагч Г. Гэгээн-Үйлс 2-р байр “Мөнгөн медаль” , Б. Азбаяр 3-р байр “Хүрэл медаль”" },
      { badge: "Онцлох", name: "ТАЕКВОН – ДО – гийн “МОНГОЛ УЛСЫН АВАРГА” шалгаруулах 31 дэх удаагийн тэмцээнд сурагч А. Тэмүүн 3-р байр “Хүрэл медаль ”" },
      { badge: "Онцлох", name: "Таеквон- догийн “ SULD CUP 2025 “ тэмцээнд сурагч М. Хангарьд 1-р байр “Алтан медаль”" },
      { badge: "Онцлох", name: "“ХААДЫН ЗАРЛИГ” клубын нэрэмжит цомын аварга шалгаруулах тэмцээнд сурагч М. Хангарьд 2-р байр “Мөнгөн медаль” , А. Тэмүүн 3-р байр “Хүрэл медаль ”, Т. Цэгцбилэг 3-р байр “Хүрэл медаль”" },
      { badge: "Онцлох", name: "“АХАН ДҮҮС” анхдүугаар тэмцээнд сурагч Б. Бат-Оргил 1-р байр “Алтан медаль”, А. Тэмүүн 2-р байр “Мөнгөн медаль" },
      { badge: "Онцлох", name: "“ХОС АВАРГА” тэмцээнд сурагч Б. Бат – Оргил 2-р байр “Мөнгөн медаль” , М. Хангарьд 3-р байр “Хүрэл медаль”" },
    ],
    images: [
      { src: "/slides/4a/image25.jpeg", caption: "Эрэгтэй “Буухиа гүйлт” төрөлд 1-р байр “Алтан медаль” 1" },
      { src: "/slides/4a/image26.jpeg", caption: "Эрэгтэй “Буухиа гүйлт” төрөлд 1-р байр “Алтан медаль” 2" },
    ],
  }
];

export default function Class4APage() {
  return (
    <StaticClassReport
      groupLabel="Бага бүлэг"
      className="4А"
      totalStudents={26}
      maleStudents={17}
      femaleStudents={9}
      teacher="С.Болортуяа"
      coverImage={{ src: "/slides/4a/image1.jpg", alt: "4А анги", caption: "4А ангийн тайлант өдөрлөг" }}
      intro={
        <>
          0 0 4а анги 2025-2026 оны хичээлийн жилд 17 хөвгүүн, 9 охинтойгоор сургалт хүмүүжлийн ажлыг амжилттай зохион байгууллаа.
        </>
      }
      sections={sections}
      footer="4А анги - Тайлант өдөрлөг 2025-2026"
    />
  );
}
