import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

const sections: { id: string; icon?: string; color: string; label: string; title: string; items: { who: string; event?: string; badge: string }[]; images: { src: string; caption: string }[] }[] = [
  {
    id: "sports", color: "blue", label: "Спортын амжилт",
    title: "Сургуулийн спортын наадам",
    items: [
      { who: "М. Мишээл", event: "Байрнаас уртад харайх", badge: "🥈 2-р байр" },
      { who: "Н. Урангоо", event: "Гар дээр суниалт", badge: "🥇 1-р байр" },
      { who: "Б.Анужин, М.Мишээл, Н.Урангоо, Э.Мишээл", event: "Буухиа гүйлт", badge: "🥇 1-р байр" },
      { who: "Н. Урангоо", event: "Азийн АШТ уран гимнастик, ОУХМ", badge: "🇲🇳 Шигшээ баг" },
    ],
    images: [
      { src: "/uploads/12a/image2.png", caption: "Спортын наадам" },
      { src: "/uploads/12a/image3.png", caption: "Спортын наадам" },
    ],
  },
  {
    id: "arts", color: "pink", label: "Урлаг & Загвар",
    title: "Урлагийн наадам & Цэлмэгийн Гоёо",
    items: [
      { who: "Г. Уянгадарь", event: "Гоцлол дуу", badge: "🥇 1-р байр" },
      { who: "Н. Урангоо", event: "Чөлөөт үзүүлбэр", badge: "🥇 1-р байр" },
      { who: "12А анги", event: "Хамтлаг хөгжим", badge: "🥇 1-р байр" },
      { who: "12А анги", event: "Язгуур урлаг", badge: "🥈 2-р байр" },
      { who: "Охид", event: "Хамтлаг бүжиг", badge: "🥈 2-р байр" },
      { who: "Д. Тэмүүлэн", event: "Цэлмэгийн гоёо - Шилдэг зураач", badge: "🥉 3-р байр" },
    ],
    images: [
      { src: "/uploads/12a/image4.png", caption: "Урлагийн наадам" },
      { src: "/uploads/12a/image5.png", caption: "Урлагийн наадам" },
      { src: "/uploads/12a/image6.png", caption: "Н.Урангоо чөлөөт үзүүлбэр" },
      { src: "/uploads/12a/image10.png", caption: "Цэлмэгийн гоёо - Шилдэг зураач" },

    ],
  },
  {
    id: "academic", color: "green", label: "Мэдлэг, Олимпиадууд",
    title: "Оюуны спорт болон хичээлийн уралдаанууд",
    items: [
      { who: "Билгүүн", event: "Англи хэлний QUIZ BEE", badge: "🥇 1-р байр" },
      { who: "Энхрий", event: "Англи хэлний QUIZ BEE", badge: "🥈 2-р байр" },
      { who: "Түвшинбаатар", event: "Англи хэлний QUIZ BEE", badge: "🥉 3-р байр" },
      { who: "Э. Мишээл", event: "Сургуулийн шооны тэмцээн", badge: "🥇 1-р байр" },
      { who: "Э. Мишээл", event: "Дүүргийн шооны тэмцээн", badge: "🌟 Тусгай байр" },
      { who: "Э. Мишээл", event: "Кенгуру олимпиад (12 жил дараалж амжилт)", badge: "🥈 II зэрэг" },
    ],
    images: [
      { src: "/uploads/12a/image8.png", caption: "Сургуулийн шооны тэмцээн" },
      { src: "/uploads/12a/image9.png", caption: "Кенгуру олимпиад" },
      { src: "/uploads/12a/image7.png", caption: "QUIZ BEE" },
    ],
  },
  {
    id: "volunteering", color: "indigo", label: "Сайн дурын ажил",
    title: "Бусдад туслах үйлс",
    items: [
      { who: "12А анги", event: "Эцэг эхийн уулзалтад гадаад багш нарт туслалцаа үзүүлсэн", badge: "🤝 Сайн дурын ажил" },
    ],
    images: [
      { src: "/uploads/12a/image11.png", caption: "Сайн дурын ажил" },
      { src: "/uploads/12a/image12.png", caption: "Сайн дурын ажил" },
      { src: "/uploads/12a/image13.png", caption: "Сайн дурын ажил" },
    ],
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

export default function TwelveAPage() {
  return (
    <StaticClassReport
      groupLabel="Ахлах бүлэг"
      className="12А"
      totalStudents={12}
      maleStudents={3}
      femaleStudents={9}
      teacher="Б.Дэмбэрэл"
      leader="Б.Анужин"
      coverImage={{ src: "/uploads/12a/image1.png", alt: "12А анги", caption: "Ангийн багш: Б.Дэмбэрэл | Ангийн дарга: Б.Анужин" }}
      intro={
        <>
          12А ангийн сурагчид <span className="font-black text-brand-navy">урлаг, спорт, эрдэм мэдлэгээр</span> манлайлагч
          төгсөх ангийн шилдэг хамт олон.
        </>
      }
      sections={sections}
      footer="12А анги - Ирээдүйн их үйлсийн эзэд"
    />
  );
}
