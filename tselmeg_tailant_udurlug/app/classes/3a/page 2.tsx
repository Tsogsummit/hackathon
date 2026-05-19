import Image from "next/image";
import { PublicShell } from "@/components/PublicShell";

const slides = [
  {
    title: "Ангийн танилцуулга",
    lines: ["3А", "Ж.Загджав багштай 3А анги"],
    images: ["/slides/3a/image17.png"],
  },
  {
    title: "3А ангийн хамт олон",
    lines: [
      "2025-2026 оны хичээлийн жилд 10 охин, 17 хөвгүүнтэй суралцаж байна.",
      "Ангийн сурагчид хичээл сурлага, урлаг, спортын авьяастай, сэргэлэн цовоо, эв нэгдэлтэй хамт олон юм.",
      "Анги болон сургуулиас зохион байгуулагддаг бүх үйл ажиллагаанд идэвхтэй оролцдог сургуулийн шилдэг ангийн нэг юм.",
    ],
    images: ["/slides/3a/image17.png"],
  },
  {
    title: "Спорт наадам",
    lines: [
      "100 метр, буухиа гүйлт: Я.Очирбат - алтан медаль, З.Гэрэлт-Эрдэнэ - мөнгөн медаль.",
      "Багийн буухиа тэмцээн /эмэгтэй/ - мөнгөн медаль.",
      "Багийн олс таталт - цом.",
      "Гар дээр сунайх: Б.Түвшинжаргал - мөнгөн медаль, Г.Гарьд - хүрэл медаль.",
    ],
    images: ["/slides/3a/image21.jpg", "/slides/3a/image22.jpg", "/slides/3a/image23.jpg", "/slides/3a/image24.jpg"],
  },
  {
    title: "Spelling Bee ба Happy Halloween",
    lines: [
      "Halloween баярыг угтаж англи хэлний үсэглэлийн аварга шалгаруулах тэмцээн болов.",
      "Я.Нандин, Би.Цэлмэг, Б.Анунаран нар нэг, хоёр, гуравдугаар байр эзлэв.",
      "Happy Halloween үйл ажиллагаанд ангиараа идэвхтэй оролцов.",
    ],
    images: ["/slides/3a/image26.png", "/slides/3a/image27.png"],
  },
  {
    title: "Урлагийн наадам",
    lines: ["Найрал дуу - 2-р байр.", "Гоцлол дуу - 2-р байр."],
    images: ["/slides/3a/image31.png", "/slides/3a/image32.png"],
  },
  {
    title: "АМО олон улсын математикийн олимпиад",
    lines: [
      "Б.Түвшинжаргал - хүрэл медаль.",
      "П.Нандин - хүрэл медаль.",
      "Э.Мөнхцэлмэг - тусгай байр.",
    ],
    images: ["/slides/3a/image33.png"],
  },
  {
    title: "Кенгуру олимпиад",
    lines: ["Кенгуру олимпиадын сорилгод амжилттай оролцож батламжаа гардан авлаа."],
    images: ["/slides/3a/image34.png"],
  },
  {
    title: "Б.Түвшинжаргалын амжилт",
    lines: [
      "ХУД-ийн даамны төрөлд хүрэл медаль, спортын 2-р зэрэг.",
      "Хөх дөл бүжгийн тэмцээнд 3-р байр.",
    ],
    images: ["/slides/3a/image35.png"],
  },
  {
    title: "Г.Гарьдын амжилт",
    lines: [
      "Бага тэнгэр ахан дүүс клубын нэрэмжит тэмцээн - алтан медаль.",
      "Монгол улсын аварга шалгаруулах 31 дэх удаагийн тэмцээн - алт, мөнгөн медаль.",
      "Монгол улсын спортын дэд мастер цол.",
      "Хөх дөл бүжгийн тэмцээн - хүрэл медаль.",
    ],
    images: ["/slides/3a/image36.png"],
  },
  {
    title: "Я.Очирбатын таеквондогийн амжилтууд",
    lines: [
      "Suld Cup 2025 нээлттэй тэмцээн -29кг төрөлд 1-р байр, алтан медаль.",
      "Хос Аварга Кап-2026 -29кг төрөлд 3-р байр, хүрэл медаль.",
      "Хаадын Зарлиг клубийн нэрэмжит цомын аварга шалгаруулах тэмцээн -32кг төрөлд 3-р байр, хүрэл медаль.",
      "Бага тэнгэр ахан дүүс анхдугаар тэмцээн 2026 -32кг төрөлд 2-р байр, мөнгөн медаль.",
      "Хөх дөл бүжгийн тэмцээн - хүрэл медаль.",
    ],
    images: ["/slides/3a/image41.png", "/slides/3a/image42.png", "/slides/3a/image43.png"],
  },
  {
    title: "SASMO олон улсын математикийн олимпиад",
    lines: ["П.Нандин - мөнгөн медаль.", "Би.Цэлмэг - хүрэл медаль."],
    images: ["/slides/3a/image44.png", "/slides/3a/image45.png"],
  },
  {
    title: "Д.Гүнчин ба Б.Содгэрэлийн амжилт",
    lines: [
      "Д.Гүнчин: САШ шатрын тэмцээн - 3-р байр.",
      "Д.Гүнчин: Хөх дөл бүжгийн тэмцээн - хүрэл медаль.",
      "Б.Содгэрэл: ХУД-ийн рубик шооны тэмцээнд амжилттай оролцсон.",
      "Б.Содгэрэл: Шидэт квадрат математикийн олимпиадын мөнгөн медаль.",
      "Б.Содгэрэл: Хөх дөл бүжгийн тэмцээн - хүрэл медаль.",
    ],
    images: ["/slides/3a/image46.png", "/slides/3a/image47.png"],
  },
  {
    title: "Оны шилдэг сурагч",
    lines: [
      "АМО олон улсын математикийн олимпиад - тусгай байр.",
      "Шидэт квадрат - алтан медаль.",
      "Хөх дөл бүжгийн тэмцээн - хүрэл медаль.",
    ],
    images: ["/slides/3a/image48.png"],
  },
  {
    title: "Б.Энх-Ундрахын амжилт",
    lines: ["Бага тэнгэр ахан дүүс анхдугаар тэмцээн 2026 -32кг төрөлд 2-р байр, мөнгөн медаль."],
    images: ["/slides/3a/image49.jpeg"],
  },
  {
    title: "Талархлаа",
    lines: ["3А ангийн тайлант өдөрлөгийн танилцуулга."],
    images: [],
  },
];

function imageGridClass(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

export default function ThreeAPage() {
  return (
    <PublicShell showBack>
      <section className="mb-6 overflow-hidden rounded-2xl bg-brand-navy text-white shadow-soft">
        <div className="relative p-6 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-sky via-white to-brand-red" />
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-brand-sky">Бага бүлэг</p>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">3А</h1>
          <p className="mt-2 text-lg font-semibold text-slate-300">Тайлант өдөрлөг 2025-2026</p>
        </div>
      </section>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <figure key={slide.title} className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
            <div className="border-b border-brand-line bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{index + 1}-р хуудас</p>
              <h2 className="mt-1 text-lg font-black text-brand-navy sm:text-xl">{slide.title}</h2>
            </div>
            <div className="space-y-4 bg-slate-100 p-3 sm:p-5">
              <div className="rounded-xl border border-brand-line bg-white p-4">
                <div className="space-y-2 text-sm font-semibold leading-7 text-slate-700 sm:text-base">
                  {slide.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              {slide.images.length > 0 && (
                <div className={`grid gap-3 ${imageGridClass(slide.images.length)}`}>
                  {slide.images.map((src, imageIndex) => (
                    <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm">
                      <Image
                        src={src}
                        alt={`${slide.title} ${imageIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index === 0 && imageIndex === 0}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </figure>
        ))}
      </div>
    </PublicShell>
  );
}
