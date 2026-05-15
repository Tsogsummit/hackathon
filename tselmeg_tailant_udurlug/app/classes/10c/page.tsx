import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, Users, Star, Award, Medal } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { prisma } from "@/lib/prisma";

// ─── Slide data extracted from 10c.pptx ────────────────────────────
const slides = [
  {
    id: "sports",
    icon: Trophy,
    color: "brand-blue",
    bg: "from-blue-50 to-white",
    border: "border-blue-200",
    label: "Спорт",
    title: "Намрын спортын наадам — Ахлах анги",
    achievements: [
      { name: "Ө.Анар", event: "Байрнаас уртад", place: 1 },
      { name: "М.Анужин", event: "Байрнаас уртад", place: 1 },
      { name: "Т.Индра", event: "100 метрийн гүйлт", place: 3 },
      { name: "М.Сүлдбаяр", event: "100 метрийн гүйлт", place: 4 },
      { name: "Ө.Анар, О.Тэнгис, Х.Сод-Эрдэнэ, М.Сүлдбаяр", event: "Буухиа гүйлт", place: 3 },
    ],
    images: [
      { src: "/slides/10c/image3.png", caption: "Байрнаас уртад" },
      { src: "/slides/10c/image2.png", caption: "100 метрийн гүйлт" },
      { src: "/slides/10c/image4.png", caption: "Буухиа гүйлт" },
    ],
  },
  {
    id: "arts",
    icon: Star,
    color: "purple-600",
    bg: "from-purple-50 to-white",
    border: "border-purple-200",
    label: "Урлаг",
    title: "Урлагийн наадам — Тэргүүн байр 🥇",
    achievements: [
      { name: "10С анги", event: "Нийт дүнгээр", place: 1 },
      { name: "Хамтлаг бүжиг", event: "", place: 1 },
      { name: "Язгуур урлаг", event: "", place: 2 },
      { name: "Найрал дуу", event: "", place: 3 },
      { name: "Гоцлол бүжиг", event: "", place: 2 },
      { name: "Хөгжим", event: "", place: 2 },
      { name: "Гоцлол дуу", event: "", place: 3 },
      { name: "Чөлөөт үзүүлбэр", event: "", place: 3 },
    ],
    images: [
      { src: "/slides/10c/image6.png", caption: "Чөлөөт үзүүлбэр" },
      { src: "/slides/10c/image5.png", caption: "Урлагийн наадам шагнал" },
    ],
  },
  {
    id: "volleyball",
    icon: Trophy,
    color: "brand-red",
    bg: "from-red-50 to-white",
    border: "border-red-200",
    label: "Спорт",
    title: "САШ Волейболын тэмцээн ",
    achievements: [
      { name: "Эмэгтэй баг", event: "Волейбол", place: 1 },
      { name: "Н.Номин-Эрдэнэ", event: "Шилдэг тоглогч", place: 0 },
    ],
    images: [
      { src: "/slides/10c/image8.png", caption: "Волейболын тэмцээн" },
      { src: "/slides/10c/image7.png", caption: "Волейболын тэмцээн" },
    ],
  },
  {
    id: "fashion",
    icon: Star,
    color: "pink-600",
    bg: "from-pink-50 to-white",
    border: "border-pink-200",
    label: "Загвар",
    title: "\"Цэлмэгийн Гоёо 2026\" загварын тэмцээн",
    achievements: [
      { name: "О.Тэнгис", event: "Шилдэг загвар өмсөгч", place: 0 },
      { name: "Н.Анунгоо", event: "Гоёлын хувцасны төрөл", place: 2 },
      { name: "Н.Анунгоо", event: "Авангард загварын төрөл", place: 2 },
    ],
    images: [
      { src: "/slides/10c/image10.png", caption: "Гоёлын хувцас" },
      { src: "/slides/10c/image9.png", caption: "Шилдэг загвар өмсөгч" },
    ],
  },
  {
    id: "calligraphy",
    icon: Award,
    color: "amber-600",
    bg: "from-amber-50 to-white",
    border: "border-amber-200",
    label: "Монгол бичиг",
    title: "Сайхан бичигтэн анги — 10С",
    achievements: [
      { name: "Э.Мөнхжин", event: "Хан-Уул дүүргийн Монгол бичгийн олимпиад", place: 2 },
      { name: "Э.Мөнхжин", event: "Монгол бичгийн улсын олимпиад", place: 4 },
      { name: "Э.Мөнхжин", event: "Нийслэлийн Монгол бичгийн олимпиад", place: 0, special: "Тусгай байр" },
      { name: "Э.Мөнхжин", event: "Монгол хэл, бичгийн шалгалт", place: 0, special: "800 оноо" },
      { name: "Бээжин хотны бүжгийн тэмцээн (олон улс)", event: "Хамтлаг төрөл", place: 1 },
      { name: "Бээжин хотны бүжгийн тэмцээн (олон улс)", event: "Цөөхүүл төрөл", place: 2 },
    ],
    images: [
      { src: "/slides/10c/image12.png", caption: "Сайхан бичигтэн" },
      { src: "/slides/10c/image11.png", caption: "Сайхан бичигтэн" },
      { src: "/slides/10c/image14.png", caption: "Бээжин хотны бүжгийн тэмцээн" },
      { src: "/slides/10c/image13.png", caption: "Хан-Уул дүүргийн Монгол бичгийн олимпиад" },
      { src: "/slides/10c/image15.png", caption: "Монгол бичгийн шалгалт" },
    ],
  },
  {
    id: "academic",
    icon: Medal,
    color: "brand-sky",
    bg: "from-sky-50 to-white",
    border: "border-sky-200",
    label: "Сурлага & Технологи",
    title: "Олимпиад, хакатон, тэмцээн",
    achievements: [
      { name: "Т.Индра", event: "SASMO олимпиад", place: 0, special: "Тусгай байр" },
      { name: "М.Гэгээн-анир, Э.Амин-эрдэнэ, Т.Индра", event: "Мэтгэлцээний тэмцээн", place: 2 },
      { name: "Г.Уянга", event: "OKI Хакатон — UI/UX дизайн (багаараа)", place: 1 },
    ],
    images: [
      { src: "/slides/10c/image17.png", caption: "OKI Хакатон — UI/UX дизайн" },
      { src: "/slides/10c/image16.jpeg", caption: "SASMO олимпиад" },
    ],
  },
  {
    id: "art-rubik",
    icon: Star,
    color: "green-600",
    bg: "from-green-50 to-white",
    border: "border-green-200",
    label: "Гар зураг & Тэмцээн",
    title: "Гар зураг, Рубик шоо",
    achievements: [
      { name: "Э.Амин-Эрдэнэ", event: "Цэргийн баярт зориулсан гар зургийн уралдаан", place: 1 },
      { name: "Э.Амин-Эрдэнэ", event: "Шүдний гар зургийн уралдаан", place: 2 },
      { name: "Ц.Чингүн", event: "Рубик шооны тэмцээн", place: 1 },
    ],
    images: [
      { src: "/slides/10c/image21.png", caption: "Рубик шоо" },
      { src: "/slides/10c/image20.png", caption: "Гар зураг" },
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

export default async function TenCPage() {
  const schoolClass = await prisma.schoolClass.findUnique({
    where: { slug: "10c" },
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
                <Image src={schoolClass.mainImageUrl} alt="10C" fill className="object-cover" />
              </div>
            )}
            <div className="relative">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-brand-sky">
                Ахлах бүлэг
              </p>
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">10С</h1>
              <p className="mt-2 text-lg font-semibold text-slate-300">
                Тайлант өдөрлөг 2025–2026
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-slate-300">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-brand-sky" />
                  Нийт 24 сурагч
                </span>
                <span>♂ 8 эрэгтэй</span>
                <span>♀ 16 эмэгтэй</span>
                <span>Ангийн дарга: М.Анужин</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image — slide 1 main photo */}
      <div className="mb-6 overflow-hidden rounded-2xl shadow-soft">
        <Image
          src="/slides/10c/image1.png"
          alt="10С анги — ангийн зураг"
          width={960}
          height={540}
          className="w-full h-auto"
          priority
        />
        <div className="bg-brand-navy px-5 py-3 text-center text-sm font-semibold text-slate-300">
          Ангийн дарга: <span className="text-white">М.Анужин</span>
        </div>
      </div>

      {/* Introduction text */}
      <div className="mb-8 rounded-xl border border-brand-line bg-white p-5 text-center shadow-soft sm:p-7">
        <p className="text-base leading-8 text-slate-700 sm:text-lg">
          10С ангийн сурагчид{" "}
          <span className="font-black text-brand-navy">хичээл сурлага, урлаг, спорт, хүмүүжил</span>{" "}
          төлөвшил сайтай, аливаа уралдаан тэмцээн, үйл ажиллагаанд{" "}
          <span className="font-black text-brand-red">идэвх санаачилгатай</span> оролцдог хамт олон.
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
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-sky via-white to-brand-red" />
        <div className="p-6 text-center sm:p-8">
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-brand-sky">
            2025–2026 оны хичээлийн жил
          </p>
          <h3 className="text-2xl font-black">
            10С анги — Амжилт, хөгжил, нэгдмэл хамт олон 💙
          </h3>
        </div>
      </div>
    </PublicShell>
  );
}
