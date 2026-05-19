import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

const sections: { id: string; icon?: string; color: string; label: string; title: string; items: { who: string; event?: string; badge: string }[]; images: { src: string; caption: string }[] }[] = [
  {
    id: "science", color: "blue", label: "Математик & ШУ",
    title: "Олон улсын болон улсын олимпиадууд",
    items: [
      { who: "Н. Золбоо", event: "АМО олон улсын математикийн олимпиад", badge: "🥈 Мөнгөн медаль" },
      { who: "Н. Золбоо", event: "SASMO олон улсын математик", badge: "🌟 Тусгай байр" },
      { who: "Н. Золбоо", event: "Кенгуру математикийн олимпиад", badge: "🥉 III зэрэг" },
      { who: "Ү. Нандинболор", event: "Германы олон улсын математикийн олимпиад", badge: "🥈 Мөнгөн медаль" },
      { who: "Ү. Нандинболор", event: "Хими биологийн төрөлжсөн олимпиад", badge: "🌟 Оролцсон" },
      { who: "М. Тамир", event: "Германы олон улсын математикийн олимпиад", badge: "🥈 Мөнгөн медаль" },
      { who: "Б. Ундрам", event: "Германы олон улсын математикийн олимпиад", badge: "🥈 Мөнгөн медаль" },
      { who: "Б. Ундрам", event: "Кенгуру математикийн олимпиад", badge: "🥈 II зэрэг" },
      { who: "Г. Хулан", event: "Германы олон улсын математикийн олимпиад", badge: "🥈 Мөнгөн медаль" },
      { who: "Э. Ирмүүн", event: "Кенгуру математикийн олимпиад", badge: "🥈 II зэрэг" },
      { who: "Н. Золбоо", event: "Мэдээлэл технологийн төрөлжсөн олимпиад", badge: "🌟 Оролцсон" },
    ],
    images: [],
  },
  {
    id: "languages", color: "pink", label: "Гадаад хэл",
    title: "Олон улсын хэлний түвшин тогтоох шалгалтууд",
    items: [
      { who: "Ү. Нандинболор", event: "Англи хэлний түвшин", badge: "📜 C1 зэрэг" },
      { who: "А. Түвшин-Эрдэнэ", event: "Англи хэлний түвшин", badge: "📜 C1 зэрэг" },
      { who: "Б. Түшиг", event: "Англи хэлний түвшин", badge: "📜 C1 зэрэг" },
      { who: "Х. Тэмүүжин", event: "Англи хэлний түвшин", badge: "📜 C1 зэрэг" },
      { who: "Б. Хонгорзул", event: "Англи хэлний түвшин", badge: "📜 C1 зэрэг" },
      { who: "Б. Чингүүн", event: "Англи хэлний түвшин", badge: "📜 C1 зэрэг" },
      { who: "Х. Тэмүүжин", event: "Хятад хэл", badge: "📜 HSK3" },
      { who: "Э. Ирмүүн", event: "Хятад хэл", badge: "📜 HSK2" },
      { who: "Н. Мөнхбадрах", event: "Хятад хэл", badge: "📜 HSK2" },
      { who: "Б. Ундрам", event: "Хятад хэл", badge: "📜 HSK2" },
      { who: "Г. Хулан", event: "Хятад хэл", badge: "📜 HSK2" },
      { who: "С. Энгүүн", event: "Хятад хэл", badge: "📜 HSK2" },
      { who: "Т. Өсөх-Эрдэнэ", event: "Хятад хэл", badge: "📜 HSK1" },
      { who: "А. Түвшин-Эрдэнэ", event: "Хятад хэл", badge: "📜 HSK1" },
      { who: "Б. Ундрам", event: "Солонгос хэл", badge: "📜 TOPIK 2" },
      { who: "М. Тамир", event: "Солонгос хэл", badge: "📜 TOPIK 1" },
      { who: "Г. Хулан", event: "Солонгос хэл", badge: "📜 TOPIK 1" },
    ],
    images: [],
  },
  {
    id: "sports", color: "green", label: "Спорт",
    title: "Багийн болон ганцаарчилсан спорт",
    items: [
      { who: "М. Ууганбаяр", event: "Таеквондо спортын мастер", badge: "🥋 1 дан" },
      { who: "М. Ууганбаяр", event: "ULAANBAATAR OPEN-2025 таеквондо", badge: "🥇 Алтан медаль" },
      { who: "М. Ууганбаяр", event: "Элчингийн цом 2025 таеквондо", badge: "🥈 Мөнгөн медаль" },
      { who: "М. Ууганбаяр", event: "Алдар спорт хорооны тэмцээн", badge: "🥇 Алтан медаль" },
      { who: "Э. Зөөлөнэгшигт", event: "Сургуулийн теннисний тэмцээн", badge: "🥇 Алтан медаль" },
      { who: "А. Мөнхжаргал", event: "Хөл бөмбөгийн ubac15 тэмцээн", badge: "🥇 Алтан медаль" },
      { who: "Н. Мөнхбадрах", event: "Таеквондогийн тэмцээн", badge: "🥉 Хүрэл медаль" },
      { who: "Т. Чинтүшиг", event: "Moto sport hard enduro", badge: "🌟 Тусгай байр" },
      { who: "9А анги", event: "Сургуулийн сагсан бөмбөгийн тэмцээн", badge: "🥈 Мөнгөн медаль" },
    ],
    images: [
      { src: "/uploads/9a/image2.jpeg", caption: "9A анги" }
    ],
  },
  {
    id: "arts", color: "purple", label: "Урлаг & Бусад",
    title: "Урлагийн наадам ба төрөлжсөн тэмцээн",
    items: [
      { who: "А. Мөнхжаргал", event: "Урлагийн наадам (Төгөлдөр хуур)", badge: "🥈 Мөнгөн медаль" },
      { who: "Б. Ундрам", event: "Урлагийн наадам (Төгөлдөр хуур)", badge: "🥈 Мөнгөн медаль" },
      { who: "Б. Хонгорзул", event: "Энэтхэг улсад ОУ-ын урлагийн наадам", badge: "🌟 Оролцсон" },
      { who: "Б. Хонгорзул", event: "Lets sparkle UB", badge: "🌟 Оролцсон" },
      { who: "Т. Өсөх-Эрдэнэ", event: "Хөх хотод хятад хэлний ОУ-ын арга хэмжээ", badge: "🌟 Оролцсон" },
      { who: "Х. Тэмүүжин", event: "Сургуулийн рубик шооны тэмцээн", badge: "🌟 Дүүрэгт оролцох эрх" },
    ],
    images: [],
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

export default function NineAPage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="9А"
      totalStudents={21}
      maleStudents={14}
      femaleStudents={7}
      teacher="Б.Цэрэнчулуун"
      leader="А.Болд"
      coverImage={{ src: "/uploads/9a/image1.png", alt: "9А анги", caption: "Ангийн багш: Б.Цэрэнчулуун | Ангийн дарга: А.Болд" }}
      intro={
        <>
          9А ангийн сурагчид <span className="font-black text-brand-navy">олон улсын хэл, олимпиад, спорт, урлагаар</span>
          төрөлжин хөгжиж буй авьяаслаг, идэвхтэй хамт олон.
        </>
      }
      sections={sections}
      footer="9А анги - Ирээдүйн шилдэгүүд"
    />
  );
}
