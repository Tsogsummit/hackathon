import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, Star, Medal, BookOpen, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

const sections: { id: string; icon?: string; color: string; label: string; title: string; items: { who: string; event?: string; badge: string }[]; images: { src: string; caption: string }[] }[] = [
  {
    id: "spartakiad", color: "blue", label: "Спортын аврага",
    title: "Намрын спартакиад — Шилжэн явах цомын эзэн 🏆",
    items: [
      { who: "11С анги", event: "Нийт дүнгээр — аварга анги", badge: "🥇 Цомын эзэн" },
      { who: "11С анги", event: "3×3 сагсан бөмбөг", badge: "🥇 Алтан медаль" },
      { who: "11С анги", event: "Буухиа гүйлт", badge: "🥇 Алтан медаль" },
      { who: "Э.Мөнхдэлгэрэх", event: "Гар дарж суниах", badge: "🥇 Алтан медаль" },
      { who: "А.Цэлмүүн", event: "Эмэгтэй 800м гүйлт", badge: "🥇 Алтан медаль" },
    ],
    images: [
      { src: "/slides/11c/image2.png", caption: "3×3 сагсан бөмбөг" },
      { src: "/slides/11c/image3.png", caption: "Буухиа гүйлт" },
      { src: "/slides/11c/image4.png", caption: "Гар дарж суниах" },
      { src: "/slides/11c/image5.png", caption: "Цомын эзэн" },
    ],
  },
  {
    id: "team-sports", color: "red", label: "Багийн тэмцээн",
    title: "Сагсан бөмбөг, Волейбол, E-sport",
    items: [
      { who: "Охид", event: "Сургуулийн сагсан бөмбөгийн АШТ", badge: "🥈 Мөнгөн медаль" },
      { who: "Охид", event: "Сургуулийн волейболын АШТ", badge: "🥉 Хүрэл медаль" },
      { who: "Хөвгүүд", event: "Counter Strike 2 — сургуулийн АШТ", badge: "🥇 Алтан медаль" },
    ],
    images: [
      { src: "/slides/11c/image6.jpeg", caption: "Сагсан бөмбөг" },
      { src: "/slides/11c/image7.png", caption: "Волейбол" },
      { src: "/slides/11c/image8.png", caption: "Counter Strike 2" },
    ],
  },
  {
    id: "fashion", color: "indigo", label: "\"Цэлмэгийн Гоёо\" наадам",
    title: "Загварын тэмцээн",
    items: [
      { who: "Н.Учрал", event: "\"Гоёол\" төрөл", badge: "🥉 Хүрэл медаль" },
      { who: "Э.Анужин, Г.Ариунхүслэн", event: "Шилдэг авангард загвар", badge: "✨ Тодорсон" },
    ],
    images: [
      { src: "/slides/11c/image9.jpeg", caption: "Гоёол төрөл" },
      { src: "/slides/11c/image10.jpeg", caption: "Авангард загвар" },
    ],
  },
  {
    id: "ariunkhuslun", color: "green", label: "Дугуйн спорт",
    title: "Г.Ариунхүслэн амжилтууд",
    items: [
      { who: "Г.Ариунхүслэн", event: "Виртуал дугуйн Нийслэлийн аварга 2026", badge: "🥈 2-р байр" },
      { who: "Г.Ариунхүслэн", event: "Уулын дугуйн улирлын нээлтийн тэмцээн", badge: "🥈 2-р байр" },
      { who: "Г.Ариунхүслэн", event: "Засмал замын дугуйн улирлын нээлтийн тэмцээн", badge: "🥈 2-р байр" },
      { who: "Г.Ариунхүслэн", event: "\"Бахрейн 2025\" Азийн Залуучуудын III наадам", badge: "🌏 Оролцсон" },
      { who: "Г.Ариунхүслэн", event: "\"Asian Championship 2026\" Сауди Арабт", badge: "🌏 Оролцсон" },
      { who: "Г.Ариунхүслэн", event: "Сургуулийн сагсан бөмбөгийн АШТ", badge: "🥈 Мөнгөн медаль" },
      { who: "Г.Ариунхүслэн", event: "Алдар спортын 80 жилийн ойн виртуал дугуй", badge: "🥈 2-р байр" },
    ],
    images: [{ src: "/slides/11c/image11.png", caption: "Г.Ариунхүслэн — дугуйн тэмцээн" }],
  },
  {
    id: "tselmun", color: "pink", label: "А.Цэлмүүн — Олон талын аврага",
    title: "А.Цэлмүүн — Спорт, хэл, сурлагын амжилт",
    items: [
      { who: "А.Цэлмүүн", event: "2025 оны тэргүүний сурагч", badge: "✨ Тэргүүний сурагч" },
      { who: "А.Цэлмүүн", event: "IELTS", badge: "📜 7.0 оноо" },
      { who: "А.Цэлмүүн", event: "SASMO олон улсын олимпиад", badge: "🥉 Хүрэл медаль" },
      { who: "А.Цэлмүүн", event: "Кенгуру олимпиад", badge: "🥇 1-р зэрэг" },
      { who: "А.Цэлмүүн", event: "Намрын спартакиад 800м гүйлт", badge: "🥇 Алтан медаль" },
      { who: "А.Цэлмүүн", event: "Сургуулийн сагсан бөмбөгийн АШТ", badge: "🥈 Мөнгөн медаль" },
      { who: "А.Цэлмүүн", event: "Сургуулийн волейболын АШТ", badge: "🥉 Хүрэл медаль" },
    ],
    images: [{ src: "/slides/11c/tselmuun.png", caption: "А.Цэлмүүн" }],
  },
  {
    id: "anujin", color: "teal", label: "Э.Анужин — Урлаг & Спорт",
    title: "Э.Анужин — Уран зураг, загвар, спорт",
    items: [
      { who: "Э.Анужин", event: "Сургуулийн уран зургийн тэмцээн", badge: "🥈 2-р байр" },
      { who: "Э.Анужин", event: "Загварын тэмцээн — шилдэг авангард загвар", badge: "✨ Тодорсон" },
      { who: "Э.Анужин", event: "Боловсролын яамны олимпиад", badge: "✨ Шүүгчийн нэрэмжит" },
      { who: "Э.Анужин", event: "Сургуулийн сагсан бөмбөгийн АШТ", badge: "🥈 Мөнгөн медаль" },
      { who: "Э.Анужин", event: "Сургуулийн волейболын АШТ", badge: "🥉 Хүрэл медаль" },
    ],
    images: [{ src: "/slides/11c/image13.png", caption: "Э.Анужин" }],
  },
  {
    id: "suvd", color: "purple", label: "Д.Сувд — Cheerleading аврага",
    title: "Д.Сувд — Cheerleading & Бүжгийн олон улсын амжилт",
    items: [
      { who: "Д.Сувд", event: "Performance Cheer — Спортын дэд мастер цол", badge: "🏅 Дэд мастер" },
      { who: "Д.Сувд", event: "УАШТ Jazz бүжгийн төрөл", badge: "🥈 Мөнгөн медаль" },
      { who: "Д.Сувд", event: "УАШТ хамтлагаараа", badge: "🥇 Алтан цомны эзэн" },
      { who: "Д.Сувд", event: "Сургуулийн урлагийн үзлэг — гоцлол бүжиг", badge: "🥉 3-р байр" },
      { who: "Д.Сувд", event: "Уранхэлхээ монгол бүжгийн төрөл", badge: "🥉 Хүрэл медаль" },
      { who: "Д.Сувд", event: "Агуу Их Цайны Зам — монгол бүжиг", badge: "🥈 Мөнгөн медаль" },
      { who: "Д.Сувд", event: "Агуу Их Цайны Зам — хип хоп", badge: "🥇 Алтан медаль" },
      { who: "Д.Сувд", event: "Сургуулийн сагсан бөмбөг АШТ", badge: "🥈 Мөнгөн медаль" },
      { who: "Д.Сувд", event: "Сургуулийн волейбол АШТ", badge: "🥉 Хүрэл медаль" },
    ],
    images: [{ src: "/slides/11c/image14.png", caption: "Д.Сувд" }],
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  blue: { bg: "from-blue-50 to-white", border: "border-blue-200", icon: "text-blue-600" },
  red: { bg: "from-red-50 to-white", border: "border-red-200", icon: "text-red-600" },
  pink: { bg: "from-pink-50 to-white", border: "border-pink-200", icon: "text-pink-600" },
  green: { bg: "from-green-50 to-white", border: "border-green-200", icon: "text-green-600" },
  indigo: { bg: "from-indigo-50 to-white", border: "border-indigo-200", icon: "text-indigo-600" },
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

export default function ElevenCPage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="11С"
      totalStudents={21}
      maleStudents={12}
      femaleStudents={9}
      teacher="Б.Түмэннасан"
      coverImage={{ src: "/slides/11c/image1.png", alt: "11С анги", caption: "Ангийн багш: Б.Түмэннасан" }}
      intro={
        <>
          11С ангийн сурагчид <span className="font-black text-brand-navy">сурлага, спорт, авьяасаар</span> дүүрэн,
          аливаа уралдаан тэмцээнд идэвхтэй оролцдог, сургуулийн шилжэн явах цомын эзэн ангиар олон удаа тодорч байсан хамт олон.
        </>
      }
      sections={sections}
      footer="11С анги - Тэргүүн, аварга, нэгдмэл хамт олон"
    />
  );
}
