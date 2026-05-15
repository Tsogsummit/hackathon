import Image from "next/image";
import { notFound } from "next/navigation";
import { Trophy, Star, BookOpen, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

const sections: { id: string; icon?: string; color: string; label: string; title: string; items: { who: string; event?: string; badge: string }[]; images: { src: string; caption: string }[] }[] = [
  {
    id: "sports", color: "blue", label: "Спорт",
    title: "Сургуулийн спортын наадам — Ангиараа тэргүүн 🏆",
    items: [
      { who: "8А анги", event: "Нийт дүнгээр", badge: "🥇 Тэргүүн — \"Цомын эзэд\"" },
      { who: "Тэмүжин", event: "100м гүйлт эрэгтэй", badge: "🥇 1-р байр" },
      { who: "Есүй", event: "100м гүйлт эмэгтэй", badge: "🥈 2-р байр" },
      { who: "Есүй", event: "Байрнаас уртад эмэгтэй", badge: "🥇 1-р байр" },
      { who: "Азбаяр", event: "Гар дээр сунайлт эрэгтэй", badge: "🥉 3-р байр" },
      { who: "8А баг", event: "Буухиа гүйлт", badge: "🥇 Тэргүүн байр" },
      { who: "8А баг", event: "4×100 гүйлт", badge: "🥇 Тэргүүн байр" },
    ],
    images: [
      { src: "/slides/8a/image2.jpeg", caption: "Спортын наадам" },
      { src: "/slides/8a/image3.jpeg", caption: "Байрнаас уртад" },
    ],
  },
  {
    id: "arts", color: "purple", label: "Урлаг",
    title: "Урлагийн наадам — Ангиараа тэргүүн 🎭",
    items: [
      { who: "8А анги", event: "Нийт дүнгээр", badge: "🥇 Тэргүүн — \"Цомын эзэд\"" },
      { who: "8А баг", event: "Хамтлаг бүжиг", badge: "🥇 1-р байр" },
      { who: "8А баг", event: "Язгуур урлаг", badge: "🥇 1-р байр" },
      { who: "8А баг", event: "Гоцлол бүжиг", badge: "🥇 1-р байр" },
      { who: "8А баг", event: "Чөлөөт үзүүлбэр", badge: "🥇 1-р байр" },
      { who: "8А баг", event: "Найрал дуу", badge: "🥈 2-р байр" },
      { who: "8А баг", event: "Гоцлол дуу", badge: "🥉 3-р байр" },
    ],
    images: [
      { src: "/slides/8a/image4.jpg", caption: "Урлагийн наадам" },
      { src: "/slides/8a/image5.jpeg", caption: "Язгуур урлаг" },
    ],
  },
  {
    id: "basketball", color: "orange", label: "Сагсан бөмбөг",
    title: "Сургуулийн 3×3 сагсан бөмбөгийн тэмцээн",
    items: [
      { who: "8А хөвгүүд", event: "3×3 сагсан бөмбөг", badge: "🥇 1-р байр" },
      { who: "8А охид", event: "3×3 сагсан бөмбөг", badge: "🥈 2-р байр" },
    ],
    images: [
      { src: "/slides/8a/image6.jpg", caption: "Охидын баг" },
      { src: "/slides/8a/image7.jpeg", caption: "Хөвгүүдийн баг" },
    ],
  },
  {
    id: "parents", color: "green", label: "Эцэг эхийн спорт",
    title: "Эцэг эхийн спортын наадам — Тэргүүн",
    items: [
      { who: "8А эцэг эхчүүд", event: "Нийт дүнгээр", badge: "🥇 Тэргүүн — \"Цомын эзэд\"" },
      { who: "Эцэг эхчүүд", event: "Шатар", badge: "🥇 1-р байр" },
      { who: "Эцэг эхчүүд", event: "Теннис", badge: "🥇 1-р байр" },
      { who: "Эцэг эхчүүд", event: "Гар бөмбөг", badge: "🥈 2-р байр" },
      { who: "Эцэг эхчүүд", event: "Сагс", badge: "🥉 3-р байр" },
    ],
    images: [
      { src: "/slides/8a/image8.jpg", caption: "Эцэг эхийн спортын наадам" },
      { src: "/slides/8a/image9.jpeg", caption: "Эцэг эхийн спортын наадам" },
    ],
  },
  {
    id: "olympiad", color: "indigo", label: "Олон улсын олимпиад",
    title: "Олимпиад — Кенгеру & Германы математикийн олимпиад",
    items: [
      { who: "Л.Энхдалай", event: "Германы математикийн олон улсын олимпиад", badge: "🥇 Тэргүүн байр" },
      { who: "Ангийн 60%", event: "\"Кенгеру\" математикийн улсын олимпиад", badge: "🎖 1-3-р зэрэг" },
    ],
    images: [
      { src: "/slides/8a/image10.jpg", caption: "Германы олимпиад" },
      { src: "/slides/8a/image11.jpg", caption: "Кенгеру олимпиад" },
    ],
  },
  {
    id: "rubik", color: "red", label: "Рубик шоо",
    title: "Рубик шооны тэмцээн",
    items: [
      { who: "Сэр-Од", event: "Рубик шоо", badge: "🥈 2-р байр" },
      { who: "Гарьд", event: "Рубик шоо", badge: "🥉 3-р байр" },
    ],
    images: [{ src: "/slides/8a/image12.jpg", caption: "Рубик шооны тэмцээн" }],
  },
  {
    id: "spelling", color: "sky", label: "Spelling англи хэл",
    title: "Spelling англи хэлний тэмцээн",
    items: [
      { who: "Мишээл, Цэлмүүн, Энэрэл", event: "Spelling тэмцээн", badge: "🥇 1-р байр" },
      { who: "Ариунболор, Намуун, Мандхай", event: "Spelling тэмцээн", badge: "🥈 2-р байр" },
    ],
    images: [
      { src: "/slides/8a/image14.jpeg", caption: "Spelling — 1-р байр" },
      { src: "/slides/8a/image13.jpeg", caption: "Spelling — 2-р байр" },
    ],
  },
  {
    id: "esport", color: "teal", label: "E-Sport & Даам",
    title: "E-Sport тэмцээн & 100 буудалт даам",
    items: [
      { who: "8А баг", event: "E-Sport тэмцээн", badge: "🥇 Алтан медаль" },
      { who: "Билэгжаргал", event: "100 буудалт даам", badge: "🥈 Мөнгөн медаль" },
    ],
    images: [
      { src: "/slides/8a/image15.jpg", caption: "E-Sport тэмцээн" },
      { src: "/slides/8a/image16.jpg", caption: "100 буудалт даам" },
    ],
  },
  {
    id: "art-design", color: "pink", label: "Зураг & Дизайн",
    title: "Зургийн уралдаан & Шилдэг сурагчид",
    items: [
      { who: "Ариунболор", event: "Загвар зохион бүтээх зургийн уралдаан", badge: "🥈 2-р байр" },
      { who: "Тэмүжин, Одгэрэл", event: "Дэвтрийн үйл ажиллагааны шилдэг сурагч", badge: "✨ Шилдэг" },
    ],
    images: [
      { src: "/slides/8a/image17.jpg", caption: "Загвар зохион бүтээх зургийн уралдаан" },
      { src: "/slides/8a/image18.jpg", caption: "Дэвтрийн үйл ажиллагаа" },
    ],
  },
  {
    id: "art-exhibition", color: "pink", label: "Зургийн үзэсгэлэн",
    title: "Бие даасан “Зургийн үзэсгэлэн”",
    items: [
      { who: "Мандхай, Намуун", event: "Бие даасан зургийн үзэсгэлэн", badge: "🎨 Үзэсгэлэн" },
    ],
    images: [
      { src: "/uploads/8a/additional/image1.jpg", caption: "Сурагч Мандхай, Намуун" },
    ],
  },
  {
    id: "chess", color: "amber", label: "Шатар & Монгол бичиг",
    title: "Шатрын аврага & Үндэсний бичгийн аврага",
    items: [
      { who: "Есүй", event: "Сургуулийн шатрын аврага", badge: "🥈 Мөнгөн медаль" },
      { who: "Энхдалай, Билэгжаргал, Мөнх-Оргил", event: "Үндэсний бичгийн аврага", badge: "✨ Шилдэг" },
    ],
    images: [
      { src: "/slides/8a/image19.jpg", caption: "Шатрын аврага шалгаруулах тэмцээн" },
      { src: "/slides/8a/image20.jpg", caption: "Үндэсний бичгийн аврага" },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  purple: { bg: "from-purple-50 to-white", border: "border-purple-200", icon: "text-purple-600" },
  green: { bg: "from-green-50 to-white", border: "border-green-200", icon: "text-green-600" },
  blue: { bg: "from-blue-50 to-white", border: "border-blue-200", icon: "text-blue-600" },
  sky: { bg: "from-sky-50 to-white", border: "border-sky-200", icon: "text-sky-600" },
  indigo: { bg: "from-indigo-50 to-white", border: "border-indigo-200", icon: "text-indigo-600" },
  red: { bg: "from-red-50 to-white", border: "border-red-200", icon: "text-red-600" },
  orange: { bg: "from-orange-50 to-white", border: "border-orange-200", icon: "text-orange-500" },
  teal: { bg: "from-teal-50 to-white", border: "border-teal-200", icon: "text-teal-600" },
  pink: { bg: "from-pink-50 to-white", border: "border-pink-200", icon: "text-pink-600" },
  amber: { bg: "from-amber-50 to-white", border: "border-amber-200", icon: "text-amber-600" },
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

export default function EightAPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="8А"
      totalStudents={27}
      maleStudents={18}
      femaleStudents={9}
      teacher="Б.Мөнхжаргал"
      leader="Б.Мишээл"
      coverImage={{ src: "/slides/8a/image1.png", alt: "8А анги", caption: "Ангийн багш: Б.Мөнхжаргал | Ангийн дарга: Б.Мишээл" }}
      intro={
        <>
          8А ангийн сурагчид <span className="font-black text-brand-navy">хичээл, сурлага, урлаг, спорт, хүмүүжлийн</span> олон
          талын авьяатай. Сүүлийн 3 жилд сургуулийн урлаг спортын тэргүүний ангиар шалгарсан хамт олон.
        </>
      }
      sections={sections}
      footer="8А анги - Тэргүүн, авьяас, нэгдмэл хамт олон"
    />
  );
}
