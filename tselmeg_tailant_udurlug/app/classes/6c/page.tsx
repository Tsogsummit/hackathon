import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, Star, Award, Medal, BookOpen, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

const sections: { id: string; icon?: string; color: string; label: string; title: string; items: { who: string; event?: string; badge: string }[]; images: { src: string; caption: string }[] }[] = [
  {
    id: "arts", icon: "Star", color: "purple", label: "Урлаг",
    title: "\"Цэлмэгийн авьяастан\" урлагийн наадам",
    items: [{ who: "6С анги", event: "Хамтлаг бүжиг", badge: "🥉 3-р байр" }],
    images: [{ src: "/slides/6c/image2.png", caption: "Урлагийн наадам" }],
  },
  {
    id: "health", icon: "Award", color: "green", label: "Ханын сонин",
    title: "Эрүүл шүд, эрүүл бие — Ханын сонины уралдаан",
    items: [
      { who: "6С анги", event: "Ханын сонин", badge: "🥇 1-р байр" },
      { who: "Хүчү, П.Чингүүн", event: "Best in Costume", badge: "✨ Өргөмжлөл" },
    ],
    images: [
      { src: "/slides/6c/image3.png", caption: "Ханын сонин" },
      { src: "/slides/6c/image4.png", caption: "Best in Costume" },
      { src: "/slides/6c/image5.png", caption: "Best in Costume" },
    ],
  },
  {
    id: "spelling", icon: "BookOpen", color: "blue", label: "Англи хэл",
    title: "\"Spelling Bee\" англи хэлний тэмцээн",
    items: [
      { who: "Гүнжин", event: "Spelling Bee", badge: "🥉 3-р байр" },
      { who: "Сод-Ном", event: "Spelling Bee", badge: "🥉 3-р байр" },
    ],
    images: [
      { src: "/slides/6c/image6.png", caption: "Spelling Bee" },
      { src: "/slides/6c/image7.png", caption: "Spelling Bee" },
    ],
  },
  {
    id: "buyantuyaa", icon: "Trophy", color: "yellow", label: "Олон талын амжилт",
    title: "Буянтуяагийн олон талын амжилт",
    items: [
      { who: "Буянтуяа", event: "МХМБУ-н Шинэ өнөөдөр сургуулийн олимпиад", badge: "🥇 1-р байр" },
      { who: "Буянтуяа", event: "\"Үеэр урлая\" Монгол бичиг", badge: "🥉 3-р байр" },
      { who: "Буянтуяа", event: "\"Beautiful Women\" захидлын уралдаан", badge: "🥇 1-р байр" },
      { who: "Буянтуяа", event: "\"Уран жиргээ\" шүлгийн уралдаан", badge: "🥉 3-р байр" },
      { who: "Буянтуяа", event: "\"Хурдан уншлага\" Монгол бичиг", badge: "✨ Тэргүүний уншигч" },
      { who: "Буянтуяа", event: "\"Kangaroo\" олимпиад", badge: "🎖 III зэрэг" },
    ],
    images: [
      { src: "/slides/6c/image8.png", caption: "Олимпиад" },
      { src: "/slides/6c/image9.png", caption: "Захидлын уралдаан" },
      { src: "/slides/6c/image10.png", caption: "Шүлгийн уралдаан" },
      { src: "/slides/6c/image11.png", caption: "Хурдан уншлага" },
      { src: "/slides/6c/image12.png", caption: "Kangaroo" },
    ],
  },
  {
    id: "sports", icon: "Trophy", color: "red", label: "Спорт",
    title: "Намрын спортын их наадам",
    items: [{ who: "М.Санчирмаа", event: "800м гүйлт", badge: "🥈 2-р байр" }],
    images: [{ src: "/slides/6c/image13.png", caption: "Санчирмаа — 800м гүйлт" }],
  },
  {
    id: "drawing", icon: "Star", color: "orange", label: "Гар зураг",
    title: "\"Үгнээс дүрсэнд\" гар зургийн уралдаан",
    items: [{ who: "Сондор", event: "Гар зургийн уралдаан", badge: "🥈 2-р байр" }],
    images: [{ src: "/slides/6c/image14.png", caption: "Сондор — гар зураг" }],
  },
  {
    id: "calligraphy", icon: "BookOpen", color: "teal", label: "Монгол бичиг",
    title: "\"Цэвэр бичигтэн\" Монгол бичиг",
    items: [{ who: "Гэгээнээ", event: "Цэвэр бичигтэн", badge: "✨ Тэргүүний цэвэр бичигтэн" }],
    images: [{ src: "/slides/6c/image15.png", caption: "Цэвэр бичигтэн" }],
  },
  {
    id: "sasmo", icon: "Medal", color: "indigo", label: "Олон улсын олимпиад",
    title: "SASMO 2026 & Kangaroo олимпиад",
    items: [
      { who: "Төвшинтөгс", event: "SASMO 2026", badge: "🥈 2-р байр" },
      { who: "Төвшинтөгс", event: "Kangaroo олимпиад", badge: "🥈 II зэрэг" },
      { who: "Санчирмаа", event: "Kangaroo олимпиад", badge: "🥈 II зэрэг" },
      { who: "Урин", event: "Kangaroo олимпиад", badge: "🎖 III зэрэг" },
    ],
    images: [{ src: "/slides/6c/image16.png", caption: "SASMO олимпиад" }],
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  purple: { bg: "from-purple-50 to-white", border: "border-purple-200", icon: "text-purple-600" },
  green: { bg: "from-green-50 to-white", border: "border-green-200", icon: "text-green-600" },
  blue: { bg: "from-blue-50 to-white", border: "border-blue-200", icon: "text-blue-600" },
  yellow: { bg: "from-yellow-50 to-white", border: "border-yellow-200", icon: "text-yellow-600" },
  red: { bg: "from-red-50 to-white", border: "border-red-200", icon: "text-red-600" },
  orange: { bg: "from-orange-50 to-white", border: "border-orange-200", icon: "text-orange-500" },
  teal: { bg: "from-teal-50 to-white", border: "border-teal-200", icon: "text-teal-600" },
  indigo: { bg: "from-indigo-50 to-white", border: "border-indigo-200", icon: "text-indigo-600" },
};

function SectionBlock({ sec }: { sec: typeof sections[0] }) {
  const c = colorMap[sec.color];
  const cols = sec.images.length === 1 ? "grid-cols-1" :
    sec.images.length === 2 ? "grid-cols-1 sm:grid-cols-2" :
      sec.images.length >= 4 ? "grid-cols-2 sm:grid-cols-3" :
        "grid-cols-1 sm:grid-cols-3";
  return (
    <section className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${c.bg} ${c.border} shadow-soft`}>
      <div className={`flex items-center gap-3 border-b ${c.border} bg-white/60 px-5 py-4`}>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${c.icon}`}>
          <Star size={18} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">{sec.label}</p>
          <h2 className="text-lg font-black leading-tight text-brand-navy">{sec.title}</h2>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {sec.items.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-brand-line bg-white px-3 py-2 shadow-sm">
              <span className="rounded-md bg-brand-mist px-2 py-0.5 text-xs font-black text-brand-blue">{item.badge}</span>
              <span className="text-sm font-bold text-brand-navy">{item.who}</span>
              {item.event && <span className="text-xs text-slate-500">— {item.event}</span>}
            </div>
          ))}
        </div>
        {sec.images.length > 0 && (
          <div className={`grid gap-3 ${cols}`}>
            {sec.images.map((img, i) => (
              <figure key={i} className="overflow-hidden rounded-xl shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <Image src={img.src} alt={img.caption} fill className="object-contain transition duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
                <figcaption className="bg-white px-3 py-2 text-center text-xs font-semibold text-slate-500">{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function SixCPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="6С"
      totalStudents={21}
      maleStudents={13}
      femaleStudents={8}
      teacher="А.Цэндбаатар"
      leader="Төвшинтөгс, Буянтуяа"
      coverImage={{ src: "/slides/6c/image1.jpeg", alt: "6С анги", caption: "Ангийн багш: А.Цэндбаатар | Ангийн дарга: Төвшинтөгс, Буянтуяа" }}
      intro={
        <>
          6С анги нь <span className="font-black text-brand-navy">21 сурагчтай</span>, урлаг, спорт, монгол бичиг,
          олимпиад болон бүтээлч уралдаануудад идэвхтэй оролцдог хамт олон.
        </>
      }
      sections={sections}
      footer="6С анги - Идэвх, авьяас, хамт олон"
    />
  );
}
