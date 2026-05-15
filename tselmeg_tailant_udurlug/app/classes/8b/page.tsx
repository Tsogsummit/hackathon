import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, Users, Star, Award, Medal, BookOpen, Plane } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { prisma } from "@/lib/prisma";

// ─── Slide data extracted from 8b.pptx ────────────────────────────
const slides = [
  {
    id: "sports",
    icon: Trophy,
    color: "brand-blue",
    bg: "from-blue-50 to-white",
    border: "border-blue-200",
    label: "Спорт",
    title: "Намрын спортын наадам — 'Шилдэг анги'",
    achievements: [
      { name: "Учрал", event: "100м гүйлт", place: 1 },
      { name: "М.Эрхэс", event: "100м гүйлт", place: 3 },
      { name: "Мишээл", event: "800м гүйлт", place: 1 },
      { name: "М.Эрхэс", event: "800м гүйлт", place: 3 },
      { name: "Тогтуунцэлмэг", event: "Гар дарж сунайх", place: 1 },
      { name: "Мөнхномин", event: "Гар дарж сунайх", place: 3 },
      { name: "Г.Эрхэс", event: "Уртын харайлт", place: 2 },
      { name: "8Б анги", event: "Олс таталт", place: 1 },
      { name: "Эмэгтэй баг", event: "Буухиа гүйлт", place: 1 },
      { name: "Эрэгтэй баг", event: "Буухиа гүйлт", place: 3 },
    ],
    images: [
      { src: "/slides/8b/image2.jpg", caption: "Спортын наадам" },
      { src: "/slides/8b/image3.jpg", caption: "Спортын наадам" },
    ],
  },
  {
    id: "arts",
    icon: Star,
    color: "purple-600",
    bg: "from-purple-50 to-white",
    border: "border-purple-200",
    label: "Урлаг",
    title: "Урлагийн наадам",
    achievements: [
      { name: "Мөнхтайшир", event: "Гоцлол дуу", place: 3 },
      { name: "8Б анги", event: "Найрал дуу", place: 3 },
    ],
    images: [
      { src: "/slides/8b/image4.jpg", caption: "Найрал дуу" },
      { src: "/slides/8b/image5.jpg", caption: "Урлагийн наадам" },
    ],
  },
  {
    id: "basketball",
    icon: Trophy,
    color: "brand-red",
    bg: "from-red-50 to-white",
    border: "border-red-200",
    label: "Сагсан бөмбөг",
    title: "Сургуулийн аварга шалгаруулах тэмцээн",
    achievements: [
      { name: "Эмэгтэй баг", event: "Сагсан бөмбөг", place: 3 },
    ],
    images: [
      { src: "/slides/8b/image6.jpg", caption: "Сагсан бөмбөгийн тэмцээн" },
    ],
  },
  {
    id: "math",
    icon: BookOpen,
    color: "brand-sky",
    bg: "from-sky-50 to-white",
    border: "border-sky-200",
    label: "Математик",
    title: "Алгебрын илэрхийллийн бодлогын аварга анги",
    achievements: [
      { name: "8Б анги", event: "8-9 ангиудын дунд", place: 1, special: "Цомын эзэн" },
    ],
    images: [
      { src: "/slides/8b/image7.jpg", caption: "Алгебрын бодлогын аварга" },
    ],
  },
  {
    id: "calligraphy",
    icon: Award,
    color: "amber-600",
    bg: "from-amber-50 to-white",
    border: "border-amber-200",
    label: "Монгол бичиг",
    title: "Сайхан бичигтэн анги",
    achievements: [
      { name: "8Б анги", event: "Дунд ангиудын дунд", place: 1 },
    ],
    images: [
      { src: "/slides/8b/image8.jpg", caption: "Сайхан бичигтэн анги" },
    ],
  },
  {
    id: "checkers",
    icon: Medal,
    color: "green-600",
    bg: "from-green-50 to-white",
    border: "border-green-200",
    label: "100 буудалт даам",
    title: "Сургууль болон ХУД-ийн аварга шалгаруулах тэмцээн",
    achievements: [
      { name: "Д.Ананд", event: "Сургуулийн аварга", place: 1 },
      { name: "М.Эрхэс", event: "Сургуулийн аварга", place: 3 },
      { name: "Д.Ананд", event: "ХУД-ын аварга", place: 0, special: "2-р зэрэг" },
      { name: "М.Эрхэс", event: "ХУД-ын аварга", place: 0, special: "3-р зэрэг" },
    ],
    images: [
      { src: "/slides/8b/image9.jpg", caption: "ХУД-ын 100 буудалт даамны АШТ" },
    ],
  },
  {
    id: "fieldtrips",
    icon: Plane,
    color: "pink-600",
    bg: "from-pink-50 to-white",
    border: "border-pink-200",
    label: "Аялал & Танин мэдэхүй",
    title: "Үйлдвэртэй танилцах болон явган аялал",
    achievements: [
      { name: "8Б анги", event: "'Миний мэргэжил' Үйлдвэртэй танилцах аялал", place: 0, special: "Оролцсон" },
      { name: "8Б анги", event: "Бие даалтын долоо хоногт 'Явган аялал'", place: 0, special: "Оролцсон" },
    ],
    images: [
      { src: "/slides/8b/image10.jpg", caption: "Үйлдвэртэй танилцах аялал" },
      { src: "/slides/8b/image11.jpg", caption: "Үйлдвэртэй танилцах аялал" },
      { src: "/slides/8b/image12.jpg", caption: "Явган аялал" },
    ],
  },
  {
    id: "excursion",
    icon: Plane,
    color: "teal-600",
    bg: "from-teal-50 to-white",
    border: "border-teal-200",
    label: "Экскурс аялал",
    title: "ЭКСКУРС Аялалт хичээл",
    achievements: [
      { name: "8Б анги", event: "ЭКСКУРС Аялалт хичээл", place: 0, special: "Оролцсон" },
    ],
    images: [
      { src: "/slides/8b/image13.jpg", caption: "Экскурс аялал" },
      { src: "/slides/8b/image14.jpg", caption: "Экскурс аялал" },
    ],
  },
];

const placeBadge = (place: number, special?: string) => {
  if (special) return { label: special, classes: "bg-purple-100 text-purple-700" };
  if (place === 1) return { label: "🥇 1-р байр", classes: "bg-yellow-100 text-yellow-700" };
  if (place === 2) return { label: "🥈 2-р байр", classes: "bg-slate-100 text-slate-600" };
  if (place === 3) return { label: "🥉 3-р байр", classes: "bg-amber-100 text-amber-700" };
  if (place === 4) return { label: "4-р байр", classes: "bg-slate-50 text-slate-500" };
  return { label: "✨ Шилдэг", classes: "bg-brand-mist text-brand-blue" };
};

export default async function EightBPage() {
  const schoolClass = await prisma.schoolClass.findUnique({
    where: { slug: "8b" },
  });
  if (!schoolClass || !schoolClass.active) notFound();

  return (
    <PublicShell showBack>
      {/* Hero */}
      <section className="mb-6 overflow-hidden rounded-2xl bg-brand-navy text-white shadow-soft">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-sky via-white to-brand-red" />
          <div className="relative p-6 sm:p-10">
            {schoolClass.mainImageUrl && (
              <div className="absolute inset-0 opacity-10">
                <Image src={schoolClass.mainImageUrl} alt="8B" fill className="object-cover" />
              </div>
            )}
            <div className="relative">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-brand-sky">
                Дунд бүлэг
              </p>
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">8Б</h1>
              <p className="mt-2 text-lg font-semibold text-slate-300">
                Тайлант өдөрлөг 2025–2026
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-slate-300">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-brand-sky" />
                  Нийт 26 сурагч
                </span>
                <span>♂ 14 эрэгтэй</span>
                <span>♀ 12 эмэгтэй</span>
                <span>Ангийн багш: Б.Далайсүрэн</span>
                <span>Ангийн дарга: М.Есүй</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <div className="mb-6 overflow-hidden rounded-2xl shadow-soft">
        <Image
          src="/slides/8b/image1.jpg"
          alt="8Б анги — ангийн зураг"
          width={960}
          height={540}
          className="w-full h-auto"
          priority
        />
        <div className="bg-brand-navy px-5 py-3 text-center text-sm font-semibold text-slate-300">
          Ангийн багш:{" "}
          <span className="text-white">
            {schoolClass.homeroomTeacher || "Б.Далайсүрэн"}
          </span>
          {" "}&nbsp;|&nbsp;{" "}
          Ангийн дарга:{" "}
          <span className="text-white">М.Есүй</span>
        </div>
      </div>

      {/* Introduction text */}
      <div className="mb-8 rounded-xl border border-brand-line bg-white p-5 text-center shadow-soft sm:p-7">
        <p className="text-base leading-8 text-slate-700 sm:text-lg">
          8Б ангийн сурагчид{" "}
          <span className="font-black text-brand-navy">хичээл сурлага төдийгүй урлаг, спортын</span>{" "}
          өндөр авьяастай, хүмүүжил төлөвшил сайтай сурагчид юм. Анги болон сургуулиас зохион байгуулсан{" "}
          аливаа уралдаан тэмцээн, үйл ажиллагаанд{" "}
          <span className="font-black text-brand-red">идэвхтэй сайн оролцдог</span> хамт олон билээ.
        </p>
      </div>

      {/* Achievement slides */}
      <div className="space-y-8">
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <section
              key={slide.id}
              className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${slide.bg} ${slide.border} shadow-soft`}
            >
              {/* Section header */}
              <div className={`flex items-center gap-3 border-b ${slide.border} bg-white/60 px-5 py-4`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-${slide.color}/10 text-${slide.color}`}>
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {slide.label}
                  </p>
                  <h2 className="text-lg font-black leading-tight text-brand-navy sm:text-xl">
                    {slide.title}
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Achievement badges */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {slide.achievements.map((a, i) => {
                    const badge = placeBadge(a.place, (a as any).special);
                    return (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-brand-line bg-white px-3 py-2 shadow-sm">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-black ${badge.classes}`}>
                          {badge.label}
                        </span>
                        <span className="text-sm font-bold text-brand-navy">{a.name}</span>
                        {a.event && (
                          <span className="text-xs text-slate-500">— {a.event}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Images grid */}
                {slide.images.length > 0 && (
                  <div
                    className={`grid gap-3 ${slide.images.length === 1
                      ? "grid-cols-1"
                      : slide.images.length === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : slide.images.length >= 5
                          ? "grid-cols-2 sm:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-3"
                      }`}
                  >
                    {slide.images.map((img, i) => (
                      <figure key={i} className="overflow-hidden rounded-xl shadow-sm">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                          <Image
                            src={img.src}
                            alt={img.caption}
                            fill
                            className="object-contain transition duration-300 hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <figcaption className="bg-white px-3 py-2 text-center text-xs font-semibold text-slate-500">
                          {img.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-brand-navy text-white shadow-soft">
        <div className="p-6 text-center sm:p-8">
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-brand-sky">
            2025–2026 оны хичээлийн жил
          </p>
          <h3 className="text-2xl font-black">
            8Б анги — Амжилт, хөгжил, нэгдмэл хамт олон 💙
          </h3>
        </div>
      </div>
    </PublicShell>
  );
}
