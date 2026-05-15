import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { StaticClassReport } from "@/components/StaticClassReport";
import { prisma } from "@/lib/prisma";

const sections: { id: string; icon?: string; color: string; label: string; title: string; items: { who: string; event?: string; badge: string }[]; images: { src: string; caption: string }[] }[] = [
  {
    id: "calligraphy", color: "amber", label: "Үндэсний бичиг",
    title: "Үндэсний бичгийн цагаан толгойн баяр",
    items: [
      { who: "6А анги", event: "Үндэсний бичгийн цагаан толгойн баяр", badge: "🌟 Өндөр амжилттай" },
    ],
    images: [
      { src: "/uploads/6a/image2.jpeg", caption: "Цагаан толгойн баяр" },
      { src: "/uploads/6a/image3.jfif", caption: "Цагаан толгойн баяр" },
    ],
  },
  {
    id: "arts", color: "pink", label: "Бүжгийн тэмцээн",
    title: "Бүжгийн тэмцээн",
    items: [
      { who: "Хөх дөл хамтлаг", event: "Олон улсын бүжгийн тэмцээн", badge: "🥈 Мөнгөн медаль" },
    ],
    images: [
      { src: "/uploads/6a/image4.jpg", caption: "Бүжгийн тэмцээн" },
    ],
  },
  {
    id: "uranjirgee", color: "sky", label: "Уран жиргээ",
    title: "Уран жиргээ тэмцээн",
    items: [
      { who: "Янжинлхам", event: "Уран жиргээ тэмцээн", badge: "🥇 Тэргүүн байр" },
      { who: "Амирлан", event: "Уран жиргээ тэмцээн", badge: "🥈 Дэд байр" },
    ],
    images: [
      { src: "/uploads/6a/image7.jpeg", caption: "Уран жиргээ" },
      { src: "/uploads/6a/image8.jpeg", caption: "Уран жиргээ" },
    ],
  },
  {
    id: "khaliun", color: "purple", label: "Сурагч Халиун",
    title: "Гар зургийн уралдаанууд",
    items: [
      { who: "Халиун", event: "Цэргийн баярын зургийн уралдаан", badge: "🥇 Тэргүүн байр" },
      { who: "Халиун", event: "Шүдний долоо хоног гар зураг", badge: "🥇 Тэргүүн байр" },
    ],
    images: [
      { src: "/uploads/6a/image5.jfif", caption: "Гар зураг" },
      { src: "/uploads/6a/image6.jpeg", caption: "Гар зураг" },
    ],
  },
  {
    id: "tuvshinbayar", color: "green", label: "Сурагч Түвшинбаяр",
    title: "Түргэн уншигч & Оюуны спорт",
    items: [
      { who: "Түвшинбаяр", event: "6-р ангийн түргэн уншигч", badge: "🌟 Шалгарсан" },
    ],
    images: [
      { src: "/uploads/6a/image9.jpg", caption: "Түргэн уншигч" },
    ],
  },
  {
    id: "nomundulai", color: "teal", label: "Сурагч Номундалай",
    title: "100 буудалт даам",
    items: [
      { who: "Номундалай", event: "100 буудалт даамны тэмцээн", badge: "🥈 Мөнгөн медаль" },
    ],
    images: [
      { src: "/uploads/6a/image10.jpg", caption: "100 буудалт даам" },
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

export default function SixAPage() {
  return (
    <StaticClassReport
      groupLabel="Дунд бүлэг"
      className="6А"
      totalStudents={23}
      maleStudents={7}
      femaleStudents={16}
      leader="Маралжин"
      coverImage={{ src: "/uploads/6a/image1.jpg", alt: "6А анги", caption: "Ангийн дарга: Маралжин | Ариун цэврийн дарга: Оюунтүлхүүр" }}
      intro={
        <>
          6А ангийн сурагчид <span className="font-black text-brand-navy">хичээл сурлага, урлаг, спорт, хүмүүжил төлөвшил сайтай</span>,
          аливаа уралдаан тэмцээн, үйл ажиллагаанд идэвх санаачилгатай оролцдог хамт олон.
        </>
      }
      sections={sections}
      footer="6А анги - Идэвх санаачилгатай хамт олон"
    />
  );
}
