import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, Users, Star, Award, Medal, BookOpen } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { prisma } from "@/lib/prisma";

type Achievement = {
  name: string;
  event: string;
  place: number;
  special?: string;
};

// ─── Slide data extracted from 11a.pptx ────────────────────────────
const slides = [
  {
    id: "basketball-volleyball",
    icon: Trophy,
    bg: "from-blue-50 to-white",
    border: "border-blue-200",
    iconTone: "bg-blue-100 text-blue-700",
    badgeTone: "bg-blue-100 text-blue-700",
    label: "Спорт",
    title: "Сургуулийн сагс, гар бөмбөгийн АШТ",
    achievements: [
      { name: "Т. Эрдэнэдорж, Б. Хасар, М. Итгэлт, Б. Амин-Эрдэнэ, Г. Түвшинтөр, Б. Чинхүслэн", event: "Гар бөмбөг САШТ", place: 3 },
      { name: "Б. Хасар, М. Итгэлт, Б. Амин-Эрдэнэ, Т. Эрдэнэдорж", event: "3vs3 САШТ", place: 1 },
      { name: "Б. Чинхүслэн, Б. Хүслэн-Эрдэнэ, Г. Түвшинтөр, О. Одбаяр, Т. Эрдэнэдорж, Б. Амин-Эрдэнэ, М. Итгэлт", event: "5vs5 САШТ", place: 1 },
    ],
    images: [
      { src: "/slides/11a/image3.jpeg", caption: "Гар бөмбөг САШТ" },
      { src: "/slides/11a/image4.jpeg", caption: "3vs3 САШТ" },
      { src: "/slides/11a/image5.jpeg", caption: "5vs5 САШТ" },
    ],
  },
  {
    id: "arts",
    icon: Star,
    bg: "from-purple-50 to-white",
    border: "border-purple-200",
    iconTone: "bg-purple-100 text-purple-700",
    badgeTone: "bg-purple-100 text-purple-700",
    label: "Урлаг",
    title: "Сургуулийн урлагийн наадам",
    achievements: [
      { name: "11А анги", event: "Гоцлол бүжиг", place: 2 },
      { name: "11А анги", event: "Найрал дуу", place: 1 },
    ],
    images: [
      { src: "/slides/11a/image6.jpeg", caption: "Сургуулийн урлагийн наадам" },
    ],
  },
  {
    id: "sports-day",
    icon: Trophy,
    bg: "from-sky-50 to-white",
    border: "border-sky-200",
    iconTone: "bg-sky-100 text-sky-700",
    badgeTone: "bg-sky-100 text-sky-700",
    label: "Спорт өдөрлөг",
    title: "Сургуулийн спортын наадам",
    achievements: [
      { name: "М. Итгэлт", event: "100 м гүйлт", place: 3 },
      { name: "Г. Түвшинтөр", event: "800 м гүйлт", place: 2 },
      { name: "А. Тунгалаг-Эрдэнэ", event: "800 м гүйлт", place: 2 },
      { name: "Б. Амин-Эрдэнэ", event: "Холын харайлт", place: 2 },
    ],
    images: [
      { src: "/slides/11a/image7.jpeg", caption: "Сургуулийн спортын наадам" },
    ],
  },
  {
    id: "individual-1",
    icon: Medal,
    bg: "from-amber-50 to-white",
    border: "border-amber-200",
    iconTone: "bg-amber-100 text-amber-700",
    badgeTone: "bg-amber-100 text-amber-700",
    label: "Ганцаарчилсан амжилт",
    title: "Даам, шатар, гар зургийн тэмцээн",
    achievements: [
      { name: "Б. Хүслэн-Эрдэнэ", event: "САШТ Даам", place: 1 },
      { name: "Ж. Энхриймаа", event: "САШТ Шатар", place: 1 },
      { name: "Ж. Энхриймаа", event: "Гар зургийн тэмцээн", place: 1 },
    ],
    images: [
      { src: "/slides/11a/image8.jpeg", caption: "Даам, шатар" },
      { src: "/slides/11a/image9.jpeg", caption: "Гар зургийн тэмцээн" },
    ],
  },
  {
    id: "arvijikh",
    icon: Star,
    bg: "from-pink-50 to-white",
    border: "border-pink-200",
    iconTone: "bg-pink-100 text-pink-700",
    badgeTone: "bg-pink-100 text-pink-700",
    label: "Олон улсын урлаг",
    title: "Б. Арвижихнинжимаагийн амжилт",
    achievements: [
      { name: "Б. Арвижихнинжимаа", event: "Торгоны зам хүүхдийн ОУ-н урлагийн наадам, Хөх Хот", place: 1 },
      { name: "Б. Арвижихнинжимаа", event: "Монголын үндэсний cheerleading АШТ, Team Jazz", place: 1 },
      { name: "Б. Арвижихнинжимаа", event: "Монголын үндэсний cheerleading АШТ, Team High Kick", place: 1 },
    ],
    images: [
      { src: "/slides/11a/image10.jpeg", caption: "Б. Арвижихнинжимаа" },
    ],
  },
  {
    id: "fashion-sport",
    icon: Award,
    bg: "from-indigo-50 to-white",
    border: "border-indigo-200",
    iconTone: "bg-indigo-100 text-indigo-700",
    badgeTone: "bg-indigo-100 text-indigo-700",
    label: "Загвар & Спорт",
    title: "Загварын тэмцээн болон спорт өдөрлөг",
    achievements: [
      { name: "О. Гэгээнхишиг", event: "Шилдэг загвар өмсөгч, загварын тэмцээн", place: 1 },
      { name: "Б. Мичид-Эрдэнэ", event: "Загвар зохион бүтээгч, загварын тэмцээн", place: 2 },
      { name: "А. Тунгалаг-Эрдэнэ", event: "Спорт өдөрлөг 800 м гүйлт", place: 2 },
    ],
    images: [
      { src: "/slides/11a/image11.jpeg", caption: "О. Гэгээнхишиг" },
      { src: "/slides/11a/image12.jpeg", caption: "Б. Мичид-Эрдэнэ" },
      { src: "/slides/11a/image13.jpeg", caption: "А. Тунгалаг-Эрдэнэ" },
    ],
  },
  {
    id: "individual-2",
    icon: BookOpen,
    bg: "from-green-50 to-white",
    border: "border-green-200",
    iconTone: "bg-green-100 text-green-700",
    badgeTone: "bg-green-100 text-green-700",
    label: "Ганцаарчилсан амжилт",
    title: "Хөл бөмбөг, илтгэл, IELTS",
    achievements: [
      { name: "Г. Түвшинтөр", event: "Хөл бөмбөг УАШТ", place: 1 },
      { name: "Т. Намулун", event: "Англи хэлний илтгэлийн тэмцээн", place: 1 },
      { name: "Л. Дмитрий", event: "Англи хэлний илтгэлийн тэмцээн", place: 2 },
      { name: "Ү. Цахирмаа", event: "IELTS", place: 0, special: "8.0 оноо" },
    ],
    images: [
      { src: "/slides/11a/image14.jpeg", caption: "Г. Түвшинтөр" },
      { src: "/slides/11a/image15.jpeg", caption: "Т. Намулун" },
      { src: "/slides/11a/image16.jpeg", caption: "Л. Дмитрий" },
      { src: "/slides/11a/image17.jpeg", caption: "Ү. Цахирмаа" },
    ],
  },
  {
    id: "team",
    icon: Users,
    bg: "from-red-50 to-white",
    border: "border-red-200",
    iconTone: "bg-red-100 text-red-700",
    badgeTone: "bg-red-100 text-red-700",
    label: "Багийн амжилт",
    title: "Өсвөрийн парламент, E-sport, 3vs3",
    achievements: [
      { name: "Т. Эрдэнэдорж, Б. Амин-Эрдэнэ, Г. Түвшинтөр, М. Итгэлт, С. Маралмаа, Ж. Энхриймаа, Б. Мичид-Эрдэнэ, А. Хулан, Д. Дөлгөөн, Б. Чинхүслэн", event: "Өсвөрийн Парламент", place: 1 },
      { name: "11А баг", event: "Counter-Strike II e-sport тэмцээн", place: 3 },
      { name: "Д. Дөлгөөн, Ж. Энхриймаа, А. Тунгалаг-Эрдэнэ, О. Гэгээнхишиг", event: "3vs3 сургуулийн спорт өдөрлөг", place: 1 },
    ],
    images: [
      { src: "/slides/11a/image18.jpeg", caption: "Өсвөрийн парламент" },
      { src: "/slides/11a/image19.jpeg", caption: "Counter-Strike II e-sport" },
      { src: "/slides/11a/image20.jpeg", caption: "3vs3 спорт өдөрлөг" },
    ],
  },
  {
    id: "moments",
    icon: Award,
    bg: "from-slate-50 to-white",
    border: "border-slate-200",
    iconTone: "bg-slate-100 text-slate-700",
    badgeTone: "bg-slate-100 text-slate-700",
    label: "Ангийн дурсамж",
    title: "Бидний гэрэлт мөчүүд",
    achievements: [
      { name: "11А анги", event: "Тайлант өдөрлөг 2025–2026", place: 0, special: "Хамт олон" },
    ],
    images: [
      { src: "/slides/11a/image21.jpg", caption: "Дурсамж" },
      { src: "/slides/11a/image22.jpeg", caption: "Дурсамж" },
      { src: "/slides/11a/image3.jpeg", caption: "Спортын дурсамж" },
      { src: "/slides/11a/image4.jpeg", caption: "Багийн дурсамж" },
      { src: "/slides/11a/image5.jpeg", caption: "Тэмцээний дурсамж" },
      { src: "/slides/11a/image6.jpeg", caption: "Урлагийн дурсамж" },
    ],
  },
];

const placeBadge = (place: number, special?: string) => {
  if (special) return { label: special, classes: "bg-purple-100 text-purple-700" };
  if (place === 1) return { label: "🥇 1-р байр", classes: "bg-yellow-100 text-yellow-700" };
  if (place === 2) return { label: "🥈 2-р байр", classes: "bg-slate-100 text-slate-600" };
  if (place === 3) return { label: "🥉 3-р байр", classes: "bg-amber-100 text-amber-700" };
  return { label: "✨ Шилдэг", classes: "bg-brand-mist text-brand-blue" };
};

export default async function ElevenAPage() {
  const schoolClass = await prisma.schoolClass.findUnique({
    where: { slug: "11a" },
  });
  if (!schoolClass || !schoolClass.active) notFound();

  return (
    <PublicShell showBack>
      {/* Hero */}
      <section className="mb-6 overflow-hidden rounded-2xl bg-brand-navy text-white shadow-soft">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-400 via-brand-red to-orange-400" />
          <div className="relative p-6 sm:p-10">
            {schoolClass.mainImageUrl && (
              <div className="absolute inset-0 opacity-10">
                <Image src={schoolClass.mainImageUrl} alt="11A" fill className="object-cover" />
              </div>
            )}
            <div className="relative">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-red-400">
                Ахлах бүлэг
              </p>
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">11А</h1>
              <p className="mt-2 text-lg font-semibold text-slate-300">
                Тайлант өдөрлөг 2025–2026
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-slate-300">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-red-400" />
                  Нийт 24 сурагч
                </span>
                <span>♂ 12 эрэгтэй</span>
                <span>♀ 12 эмэгтэй</span>
                <span>Ангийн багш: Б.Мөнхтуяа</span>
                <span>Ангийн дарга: М.Итгэлт</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <div className="mb-6 overflow-hidden rounded-2xl shadow-soft">
        <Image
          src="/slides/11a/image2.jpeg"
          alt="11А анги — ангийн зураг"
          width={2048}
          height={1365}
          className="w-full h-auto"
          priority
        />
        <div className="bg-brand-navy px-5 py-3 text-center text-sm font-semibold text-slate-300">
          Ангийн багш: <span className="text-white">Б.Мөнхтуяа</span> &nbsp;|&nbsp; Ангийн дарга:{" "}
          <span className="text-white">М.Итгэлт</span>
        </div>
      </div>

      {/* Introduction text */}
      <div className="mb-8 rounded-xl border border-brand-line bg-white p-5 text-center shadow-soft sm:p-7">
        <p className="text-base leading-8 text-slate-700 sm:text-lg">
          11А ангийн сурагчид{" "}
          <span className="font-black text-brand-navy">урлаг, спорт, эрдэм мэдлэгээр</span>{" "}
          манлайлагч, аливаа уралдаан тэмцээнд{" "}
          <span className="font-black text-brand-red">идэвхтэй оролцдог</span> хамт олон.
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
              <div className={`flex items-center gap-3 border-b ${slide.border} bg-white/60 px-5 py-4`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${slide.iconTone}`}>
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
                <div className="mb-5 flex flex-wrap gap-2">
                  {slide.achievements.map((a, i) => {
                    const badge = placeBadge((a as Achievement).place, (a as Achievement).special);
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

                {slide.images.length > 0 && (
                  <div
                    className={`grid gap-3 ${
                      slide.images.length === 1
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
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-red-400">
            2025–2026 оны хичээлийн жил
          </p>
          <h3 className="text-2xl font-black">
            11А анги — Шилдэг хамт олон 💫
          </h3>
        </div>
      </div>
    </PublicShell>
  );
}
