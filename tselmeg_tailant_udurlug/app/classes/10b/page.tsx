import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

const sections: { id: string; icon?: string; color: string; label: string; title: string; items: { who: string; event?: string; badge: string }[]; images: { src: string; caption: string }[] }[] = [
  {
    id: "arts", color: "blue", label: "Урлагийн үзлэг",
    title: "Урлагийн наадмын шилдэгүүд",
    items: [
      { who: "10Б анги", event: "Гоцлол бүжиг", badge: "🥇 1-р байр" },
      { who: "10Б анги", event: "Язгуур урлаг", badge: "🥇 1-р байр" },
      { who: "10Б анги", event: "Найрал дуу", badge: "🥈 2-р байр" },
      { who: "10Б анги", event: "Хамтлаг бүжиг", badge: "🥈 2-р байр" },
    ],
    images: [],
  },
  {
    id: "spartakiad", color: "green", label: "Намрын спартакиад",
    title: "Хөнгөн атлетик болон хүчний төрөл",
    items: [
      { who: "Х. Энэрэлжин", event: "Суниалт", badge: "🥉 3-р байр" },
      { who: "Б. Дөлгөөн", event: "Суниалт", badge: "🥉 3-р байр" },
      { who: "10Б анги", event: "Буухиа гүйлт", badge: "🥉 3-р байр" },
      { who: "10Б анги (Эм)", event: "Байрнаас уртад харайх", badge: "🥉 3-р байр" },
      { who: "10Б анги", event: "800м-ийн гүйлт", badge: "🥉 3-р байр" },
    ],
    images: [],
  },
  {
    id: "team-sports", color: "red", label: "Багийн спортын амжилт",
    title: "САШ Волейбол & Сагсан бөмбөг",
    items: [
      { who: "10Б анги", event: "САШ Волейбол — Шилдэг анги", badge: "🏆 Цомын эзэн" },
      { who: "Эрэгтэй баг", event: "САШ Волейбол", badge: "🥈 2-р байр" },
      { who: "Эмэгтэй баг", event: "САШ Волейбол", badge: "🥈 2-р байр" },
      { who: "Эмэгтэй баг", event: "САШ Сагсан бөмбөг", badge: "🥉 3-р байр" },
    ],
    images: [],
  },
  {
    id: "mind-sports", color: "indigo", label: "Оюуны спорт & Илтгэл",
    title: "Илтгэл, мэтгэлцээн, оюуны спорт",
    items: [
      { who: "Б. Дөлгөөн", event: "Сургуулийн илтгэлийн тэмцээн", badge: "🥇 1-р байр" },
      { who: "Ц. Есүнгэ", event: "Англи хэлний илтгэлийн тэмцээн", badge: "🥈 2-р байр" },
      { who: "Б. Дөлгөөн", event: "Сургуулийн шооны тэмцээн", badge: "🥈 2-р байр" },
      { who: "Б. Дөлгөөн", event: "ХУД-ийн шооны тэмцээн", badge: "🌟 Тусгай байр" },
      { who: "Х. Энэрэлжин", event: "САШ даамны тэмцээн", badge: "🥉 3-р байр" },
      { who: "Б. Дөлгөөн, Б. Онон, Г. Төгөлдөр", event: "Карл Попперын мэтгэлцээний тэмцээн", badge: "🌟 Оролцсон" },
    ],
    images: [],
  },
  {
    id: "design", color: "pink", label: "Уран зураг & Дизайн",
    title: "Гар зураг болон дизайны уралдаан",
    items: [
      { who: "10Б анги", event: "Дизайны загвар зохион зурах", badge: "🥈 2-р байр" },
      { who: "10Б анги", event: "Цэргийн баярын гар зургийн уралдаан", badge: "🥉 3-р байр" },
    ],
    images: [],
  },
  {
    id: "individual", color: "amber", label: "Ганцаарчилсан спорт",
    title: "Таеквондогийн ОУ болон УАШТ",
    items: [
      { who: "Э. Мишээл", event: "ОУ-ын таеквондогийн улаан бүс", badge: "🏅 2-р зэрэг" },
      { who: "Э. Мишээл", event: "ОУ-ын таеквондогийн УАШТ", badge: "🌟 Тусгай байр" },
    ],
    images: [],
  }
];

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  blue: { bg: "from-blue-50 to-white", border: "border-blue-200", icon: "text-blue-600" },
  red: { bg: "from-red-50 to-white", border: "border-red-200", icon: "text-red-600" },
  pink: { bg: "from-pink-50 to-white", border: "border-pink-200", icon: "text-pink-600" },
  green: { bg: "from-green-50 to-white", border: "border-green-200", icon: "text-green-600" },
  indigo: { bg: "from-indigo-50 to-white", border: "border-indigo-200", icon: "text-indigo-600" },
  amber: { bg: "from-amber-50 to-white", border: "border-amber-200", icon: "text-amber-600" },
  purple: { bg: "from-purple-50 to-white", border: "border-purple-200", icon: "text-purple-600" },
  teal: { bg: "from-teal-50 to-white", border: "border-teal-200", icon: "text-teal-600" },
};

function SectionBlock({ sec }: { sec: typeof sections[0] }) {
  const c = colorMap[sec.color] ?? colorMap.blue;
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
                  <Image src={img.src} alt={img.caption} fill
                    className="object-contain transition duration-300 hover:scale-105"
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

export default function TenBPage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="10Б"
      totalStudents={22}
      maleStudents={13}
      femaleStudents={9}
      teacher="Л.Солонго, Э.Мөнхтуул"
      leader="М.Маргад"
      intro={
        <>
          10Б ангийн сурагчид <span className="font-black text-brand-navy">урлаг, спорт, илтгэл мэтгэлцээн</span> зэрэг
          олон чиглэлээр тэргүүлэгч, авьяаслаг хамт олон.
        </>
      }
      sections={sections}
      footer="10Б анги - Шинийг эрэлхийлэгч, бүтээлч хамт олон"
    />
  );
}
