import Image from "next/image";
import { Award, BookOpenCheck, Languages, Medal, Trophy, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";

type StudentProfile = {
  name: string;
  achievements: string[];
};

const gallery = [
  { src: "/uploads/9a/final/image2.jpeg", caption: "9A ангийн сурагчид" },
  { src: "/uploads/9a/final/image3.jpeg", caption: "Анги хамт олон" },
  { src: "/uploads/9a/final/image4.jpeg", caption: "Сурагчдын оролцоо" },
  { src: "/uploads/9a/final/image5.jpeg", caption: "Тайлант өдөрлөгийн бэлтгэл" },
  { src: "/uploads/9a/final/image6.jpeg", caption: "9A ангийн амжилтын мөчүүд" },
  { src: "/uploads/9a/final/image7.jpeg", caption: "Хамтын ажиллагаа" },
  { src: "/uploads/9a/final/image8.jpeg", caption: "Сурагчдын идэвх" },
  { src: "/uploads/9a/final/image9.jpeg", caption: "Анги хамт олон" },
  { src: "/uploads/9a/final/image10.jpeg", caption: "9A ангийн дурсамж" }
];

const students: StudentProfile[] = [
  {
    name: "Лхагвасүрэн овогтой Ананд",
    achievements: [
      "Англи хэлний C1 түвшинтэй.",
      "NEO олон улсын шинжлэх ухааны олимпиадын мөнгөн медаль.",
      "Англи хэлний олон улсын олимпиадад амжилттай оролцсон."
    ]
  },
  {
    name: "Ариунбаатар овогтой Болд",
    achievements: [
      "Сургуулийн СӨУЗ-ийн гишүүн.",
      "Хятад хэлний HSK1, англи хэлний C1 түвшинтэй.",
      "Англи хэлний төрөлжсөн олимпиадад дүүрэгт амжилттай оролцсон.",
      "Кенгуру математикийн олимпиадын I зэрэг."
    ]
  },
  {
    name: "Наранмандах овогтой Болортогос",
    achievements: [
      "Волейболын тэмцээнд Баянгол дүүрэгт багаар мөнгөн медаль.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Намрын спартакиадын 100 м гүйлтэд мөнгөн медаль.",
      "Урлагийн наадмын гоцлол бүжгийн төрлөөр хүрэл медаль.",
      "Сургуулийн “Уран жиргээ” тэмцээнд алтан медаль."
    ]
  },
  {
    name: "Нямбаатар овогтой Золбоо",
    achievements: [
      "AMO олон улсын математикийн олимпиадын мөнгөн медаль.",
      "SASMO олон улсын математикийн олимпиадын тусгай байр.",
      "Кенгуру олон улсын математикийн олимпиадын III зэрэг.",
      "Мэдээлэл технологийн төрөлжсөн олимпиадад амжилттай оролцсон.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль."
    ]
  },
  {
    name: "Энхамгалан овогтой Зөөлөнэгшигт",
    achievements: [
      "Теннисний III зэрэгтэй сурагч.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Сургуулийн теннисний тэмцээнд алтан медаль."
    ]
  },
  {
    name: "Энхболд овогтой Ирмүүн",
    achievements: [
      "Хятад хэлний HSK2 зэрэгтэй.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Кенгуру математикийн олимпиадын II зэрэг."
    ]
  },
  {
    name: "Нямдагва овогтой Мөнхбадрах",
    achievements: [
      "Хятад хэлний HSK2 зэрэгтэй сурагч.",
      "Таеквондогийн тэмцээний хүрэл медальтай.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль."
    ]
  },
  {
    name: "Адъяадорж овогтой Мөнхжаргал",
    achievements: [
      "Холимог тулааны 1-р зэрэгтэй, ширээний теннисний II зэрэгтэй сурагч.",
      "Урлагийн наадамд төгөлдөр хуур хөгжмийн төрлөөр мөнгөн медаль.",
      "Сургуулийн теннисний тэмцээнд мөнгөн медаль.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Хөл бөмбөгийн UBAC15 тэмцээнд алтан медаль."
    ]
  },
  {
    name: "Үүрцайх овогтой Нандинболор",
    achievements: [
      "Англи хэлний C1 түвшинтэй сурагч.",
      "Германы олон улсын математикийн олимпиадад мөнгөн медаль.",
      "Хими, биологийн хичээлийн төрөлжсөн олимпиадад амжилттай оролцсон.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Кенгуру олон улсын математикийн олимпиадын III зэрэг."
    ]
  },
  {
    name: "Төгсбат овогтой Өсөх-Эрдэнэ",
    achievements: [
      "Хятад хэлний HSK1 зэрэгтэй.",
      "БНХАУ-ын Хөх хотод зохион байгуулагдсан хятад хэлний олон улсын арга хэмжээнд идэвхтэй оролцсон."
    ]
  },
  {
    name: "Мөнхтулга овогтой Тамир",
    achievements: [
      "Солонгос хэлний TOPIK 1 зэрэгтэй сурагч.",
      "Германы олон улсын математикийн олимпиадад мөнгөн медаль.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Кенгуру олон улсын математикийн олимпиадын II зэрэг."
    ]
  },
  {
    name: "Алтанхуяг овогтой Түвшин-Эрдэнэ",
    achievements: [
      "Англи хэлний C1 түвшинтэй сурагч.",
      "Хятад хэлний HSK1 зэрэгтэй."
    ]
  },
  {
    name: "Баттамир овогтой Түшиг",
    achievements: ["Англи хэлний C1 түвшинтэй сурагч."]
  },
  {
    name: "Хангай овогтой Тэмүжин",
    achievements: [
      "Хятад хэлний HSK3 зэрэг, англи хэлний C1 түвшинтэй сурагч.",
      "Сургуулийн рубик шооны тэмцээнд амжилттай оролцож, дүүрэгт оролцох эрхээ авсан."
    ]
  },
  {
    name: "Батбаяр овогтой Ундрам",
    achievements: [
      "Солонгос хэлний TOPIK 2 зэрэг, хятад хэлний HSK2 зэрэгтэй сурагч.",
      "Германы олон улсын математикийн олимпиадад мөнгөн медаль.",
      "Кенгуру математикийн олимпиадын II зэрэг.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Урлагийн наадамд төгөлдөр хуур хөгжмийн төрлөөр мөнгөн медаль."
    ]
  },
  {
    name: "Мөнх-Эрдэнэ овогтой Ууганбаяр",
    achievements: [
      "Таеквондогийн спортын мастер зэрэгтэй, хар бүс 1 дантай.",
      "Усанд сэлэлтийн 1-р зэрэг, хөнгөн атлетикийн 1-р зэрэгтэй сурагч.",
      "ULAANBAATAR OPEN-2025 таеквондогийн тэмцээнд тэргүүн байр, алтан медаль.",
      "Элчингийн цом 2025 тэмцээнд дэд байр, мөнгөн медаль.",
      "Таеквондогийн пүмсэ тэмцээнд хүрэл медаль.",
      "Алдар спорт хорооны тэмцээнд тэргүүн байр, алтан медаль.",
      "Таеквондо пүмсэ 2025 улсын аварга шалгаруулах тэмцээнд дэд байр, мөнгөн медаль.",
      "DREAM CUP-2025 алтан медаль."
    ]
  },
  {
    name: "Баасансүрэн овогтой Хонгорзул",
    achievements: [
      "Lets Sparkle UB арга хэмжээнд оролцсон, англи хэлний C1 түвшинтэй.",
      "Энэтхэг улсад олон улсын урлагийн наадамд амжилттай оролцсон.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль."
    ]
  },
  {
    name: "Ганбат овогтой Хулан",
    achievements: [
      "Солонгос хэлний TOPIK 1 зэрэг, хятад хэлний HSK2 зэрэгтэй сурагч.",
      "Германы олон улсын математикийн олимпиадад мөнгөн медаль.",
      "Сагсан бөмбөгийн тэмцээнд мөнгөн медаль.",
      "Кенгуру математикийн олимпиадын II зэрэг."
    ]
  },
  {
    name: "Баттулга овогтой Чингүүн",
    achievements: [
      "Сагсны III зэрэгтэй сурагч.",
      "Англи хэлний C1 түвшинтэй.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль."
    ]
  },
  {
    name: "Тэнгис овогтой Чинтүшиг",
    achievements: [
      "Moto sport hard enduro тэмцээнд тусгай байр.",
      "Сургуулийн сагсан бөмбөгийн тэмцээнд мөнгөн медаль."
    ]
  },
  {
    name: "Санжид овогтой Энгүүн",
    achievements: [
      "Хятад хэлний HSK2 зэрэгтэй сурагч.",
      "Түүхийн хичээлийн төрөлжсөн олимпиадад амжилттай оролцсон.",
      "Сагсан бөмбөгийн тэмцээнд мөнгөн медаль."
    ]
  }
];

const highlights = [
  { label: "21", text: "нийт сурагч", icon: Users },
  { label: "14", text: "эрэгтэй", icon: Users },
  { label: "7", text: "эмэгтэй", icon: Users },
  { label: "C1 / HSK / TOPIK", text: "олон улсын хэлний түвшин", icon: Languages },
  { label: "Олимпиад", text: "математик, шинжлэх ухаан", icon: BookOpenCheck },
  { label: "Спорт, урлаг", text: "медальт амжилтууд", icon: Trophy }
];

export default function NineAPage() {
  return (
    <PublicShell showBack>
      <section className="mb-5 overflow-hidden rounded-lg bg-brand-navy text-white shadow-[0_12px_28px_rgba(16,40,58,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-5 sm:p-8">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-brand-sky">Ахлах бүлэг</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">9A анги</h1>
            <p className="mt-2 text-base font-semibold text-slate-300 sm:text-lg">Б.Цэрэнчулуун багштай 9A ангийн танилцуулга</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <Stat label="Нийт" value="21" />
              <Stat label="Эрэгтэй" value="14" />
              <Stat label="Эмэгтэй" value="7" />
            </div>
            <div className="mt-5 rounded-lg border border-white/15 bg-white/8 p-4 text-sm leading-7 text-slate-200">
              <p>Ангийн дарга: <span className="font-black text-white">А.Болд</span></p>
              <p className="mt-2">
                Ангийн нийт сурагчид хичээл сурлага төдийгүй урлаг, спортын өндөр авьяастай,
                хүмүүжил төлөвшил сайтай. Анги болон сургуулиас зохион байгуулсан аливаа уралдаан,
                тэмцээн, үйл ажиллагаанд идэвхтэй сайн оролцдог.
              </p>
            </div>
          </div>
          <div className="relative min-h-72 bg-slate-950 lg:min-h-full">
            <Image
              src="/uploads/9a/final/image1.png"
              alt="9A ангийн танилцуулга"
              fill
              priority
              className="object-contain p-3"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.text} className="surface-card p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand-blue">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-base font-black leading-tight text-brand-navy">{item.label}</p>
                  <p className="text-xs font-bold text-slate-500">{item.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mb-7">
        <div className="mb-3 flex items-center gap-2">
          <Medal className="text-brand-blue" size={22} />
          <h2 className="section-title text-2xl">Ангийн зураг, үйл ажиллагаа</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((image) => (
            <figure key={image.src} className="overflow-hidden rounded-lg border border-brand-line bg-white shadow-[0_8px_22px_rgba(16,40,58,0.07)]">
              <div className="relative aspect-[4/3] bg-slate-950">
                <Image
                  src={image.src}
                  alt={image.caption}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <figcaption className="px-3 py-2 text-center text-xs font-bold text-slate-500">{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Award className="text-brand-red" size={22} />
          <h2 className="section-title text-2xl">Сурагчдын амжилт</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {students.map((student, index) => (
            <article key={student.name} className="surface-card p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-sm font-black text-white">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black leading-snug text-brand-navy">{student.name}</h3>
                  <ul className="mt-3 space-y-2">
                    {student.achievements.map((achievement) => (
                      <li key={achievement} className="flex gap-2 text-sm leading-6 text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg bg-brand-navy p-5 text-center text-white shadow-[0_12px_28px_rgba(16,40,58,0.18)] sm:p-6">
        <p className="mb-1 text-xs font-black uppercase tracking-widest text-brand-sky">2025-2026 оны хичээлийн жил</p>
        <h3 className="text-xl font-black sm:text-2xl">9A анги - Сурлага, спорт, урлагийн идэвхтэй хамт олон</h3>
      </section>
    </PublicShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-3">
      <p className="text-xs font-black uppercase tracking-widest text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
