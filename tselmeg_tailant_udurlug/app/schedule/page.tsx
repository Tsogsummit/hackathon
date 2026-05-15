import { CalendarDays, Clock3, Shirt, Sparkles, UserRound, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";

type ProgramItem = {
  no: string;
  title: string;
  className?: string;
  time?: string;
  owner?: string;
  outfit?: string;
  kind?: "section" | "opening" | "performance" | "closing";
};

const programItems: ProgramItem[] = [
  { no: "", title: "Нээлтийн үйл ажиллагаа", owner: "Төмөртогоо захирал", kind: "section" },
  { no: "1", title: "МУ-ын төрийн дуулал эгшиглэнэ", owner: "АУБагш нар, Сувданцэцэг", outfit: "Дүрэмт", kind: "opening" },
  { no: "2", title: "Захирлын мэндчилгээ", owner: "Цагаадай захирал", kind: "opening" },
  { no: "3", title: "Сургуулийн бүжиг", owner: "АУБагш нар, Өсөхбаяр", outfit: "Дүрэмт", kind: "opening" },
  { no: "4", title: "2-3-р ангиудын сурагчдын нэгдсэн хор “Цэлмэг сургууль”", className: "2-3-р анги", time: "10:15-10:20", owner: "Сувданцэцэг", kind: "performance" },
  { no: "5", title: "“Сэтэрт тал” монголын тал нутгаа магтъя", className: "3a", time: "10:20-10:25", owner: "Загджав", kind: "performance" },
  { no: "6", title: "“Есөн эрдэнийн орон” магтаал", className: "5a", time: "10:25-10:30", owner: "Эрдэнэцэцэг", kind: "performance" },
  { no: "7", title: "Хуралдай бүжиг", className: "7a", time: "10:30-10:35", owner: "Янжинлхам", kind: "performance" },
  { no: "8", title: "“Оньсого таалцъя” ардын харилцаа дууны тоглолт", className: "2a", time: "10:35-10:40", owner: "Н.Золзаяа, Намсүрэн", outfit: "Монгол хувцас", kind: "performance" },
  { no: "9", title: "“Морин хуур” дууны цоморлиг", className: "2c", time: "10:40-10:45", owner: "Оюун-Эрдэнэ, Намсүрэн", kind: "performance" },
  { no: "10", title: "Товшуур бүжиг", className: "6c", time: "10:45-10:50", owner: "Цэндбаатар", outfit: "Дүрэмт хувцас", kind: "performance" },
  { no: "11", title: "“Хорвоо амгалан байг” цэрэг армийн сэдэвт дуу", className: "4а", time: "10:50-10:55", owner: "Болортуяа", outfit: "Дүрэмт хувцас", kind: "performance" },
  { no: "12", title: "“Тусгаар тогтнол” Д. Пүрэвдоржийн найраглал шүлэг", className: "5b", time: "10:55-11:00", owner: "Туяа", outfit: "Дүрэмт хувцас", kind: "performance" },
  { no: "13", title: "Бага анги бүжгийн дугуйлан", time: "11:00-11:05", owner: "Өсөхбаяр", kind: "performance" },
  { no: "14", title: "“Монголын нэг өдөр” язгуур урлагийн үзүүлбэр", className: "8a", time: "11:05-11:10", owner: "Мөнхжаргал", kind: "performance" },
  { no: "15", title: "“Зуун зууны ерөөл” дуу", className: "7b", time: "11:10-11:15", owner: "Уранчимэг", kind: "performance" },
  { no: "16", title: "Бүжиг", className: "6a", time: "11:15-11:20", owner: "Буяннасан", kind: "performance" },
  { no: "17", title: "Англи дуу", className: "2b", time: "11:20-11:25", owner: "Буянхишиг, Оюунгэрэл", kind: "performance" },
  { no: "18", title: "Мөнхийн хөдөлгөөн", className: "9a", time: "11:25-11:30", owner: "Цэрэнчулуун", outfit: "Дүрэмт хувцас", kind: "performance" },
  { no: "19", title: "Англи дуу", className: "3b", time: "11:35-11:40", owner: "Оюунбэлэг", kind: "performance" },
  { no: "20", title: "“Нэгэн зүгт” поп бүжигтэй дуу", className: "4b", time: "11:40-11:45", owner: "Анужин", kind: "performance" },
  { no: "21", title: "Тэмүүжин дуу бүжиг", className: "11c", time: "11:45-11:50", owner: "Түмэннасан", outfit: "Бүжгийн хувцас", kind: "performance" },
  { no: "22", title: "Питховоны “Сонгодог” ая", className: "6a, 4b", time: "11:50-11:55", owner: "Сувданцэцэг", outfit: "Дүрэмт хувцас", kind: "performance" },
  { no: "23", title: "“Хятад дуу”", className: "7c", time: "11:55-12:00", owner: "Лигцог", outfit: "Дүрэмт хувцас", kind: "performance" },
  { no: "24", title: "Бүжгийн цомирлог", className: "9b", time: "12:00-12:05", owner: "Өсөхбаяр", outfit: "Чөлөөт хувцас", kind: "performance" },
  { no: "25", title: "Англи дуу Diamond", className: "6b", time: "12:05-12:10", owner: "Юмжирдулам", outfit: "Чөлөөт хувцас", kind: "performance" },
  { no: "26", title: "Дунд анги бүжгийн дугуйлан", time: "12:10-12:15", owner: "Мөнхцэцэг", outfit: "Дүрэмт", kind: "performance" },
  { no: "27", title: "Сүүлчийн уянга дуу", className: "10а", time: "12:15-12:20", owner: "Мөнхцэцэг", outfit: "Бүжгийн хувцас", kind: "performance" },
  { no: "28", title: "Fantastic Four", className: "11b", time: "12:20-12:25", owner: "Эгиймаа", outfit: "Дүрэмт хувцас", kind: "performance" },
  { no: "29", title: "“Endless Love” хятад дуу", className: "11a", time: "12:25-12:30", owner: "Мөнхтуяа", outfit: "Хар өмд, цагаан цамц", kind: "performance" },
  { no: "30", title: "Венийн вальс", className: "12b", time: "12:30-12:35", owner: "Алтанзул", kind: "performance" },
  { no: "31", title: "“Янзага” хоор дуу", className: "10c", time: "12:35-12:40", owner: "Түмэннаст", outfit: "Чөлөөт", kind: "performance" },
  { no: "32", title: "Ахлах анги бүжгийн дугуйлан", time: "12:40-12:45", kind: "performance" },
  { no: "33", title: "“Хөгжмийн номер”", className: "12a", time: "12:45-12:50", owner: "Дэмбэрэл", kind: "performance" },
  { no: "34", title: "Тал нутгийн охид бүжиг", className: "10b", time: "12:50-12:55", owner: "Мөнхтуул", kind: "performance" },
  { no: "35", title: "Эх орон хоор дуу", className: "8b", time: "12:55-13:00", owner: "Далайсүрэн", kind: "performance" },
  { no: "36", title: "Шагнал гардуулах үйл ажиллагаа", kind: "closing" },
  { no: "37", title: "Сургуулийн сүлд дуу", kind: "closing" }
];

export default function SchedulePage() {
  return (
    <PublicShell showBack>
      <section className="mb-5 rounded-lg border border-brand-line bg-white px-4 py-5 shadow-[0_8px_22px_rgba(16,40,58,0.06)] sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="brand-kicker mb-2">Тайлант өдөрлөг 2026</p>
            <h1 className="section-title text-3xl sm:text-4xl">Ерөнхий хөтөлбөр</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:min-w-64">
            <div className="rounded-lg border border-brand-line bg-slate-50 p-3">
              <div className="flex items-center gap-2 font-black text-brand-navy"><CalendarDays size={18} /> 5/16</div>
              <p className="mt-1 text-xs text-slate-500">шалгуулах хуваарь</p>
            </div>
            <div className="rounded-lg border border-brand-line bg-slate-50 p-3">
              <div className="flex items-center gap-2 font-black text-brand-navy"><Clock3 size={18} /> 10:00-13:00</div>
              <p className="mt-1 text-xs text-slate-500">тайзны үндсэн цаг</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        {programItems.map((item) =>
          item.kind === "section" ? (
            <div key={item.title} className="mt-5 flex items-center gap-3 rounded-lg bg-brand-navy px-4 py-3 text-white">
              <Sparkles size={20} />
              <div>
                <h2 className="text-lg font-black">{item.title}</h2>
                {item.owner ? <p className="text-sm text-white/75">Хариуцагч: {item.owner}</p> : null}
              </div>
            </div>
          ) : (
            <article key={item.no} className="surface-card overflow-hidden">
              <div className="grid gap-0 sm:grid-cols-[132px_1fr]">
                <div className={`flex items-center justify-between gap-3 px-4 py-3 sm:block sm:border-r sm:border-brand-line ${item.kind === "closing" ? "bg-red-50 text-brand-red" : "bg-slate-50 text-brand-blue"}`}>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">#{item.no}</div>
                  <div className="mt-0 flex items-center gap-2 text-base font-black sm:mt-2">
                    <Clock3 size={17} />
                    {item.time ?? (item.kind === "closing" ? "Төгсгөл" : "Эхлэл")}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-black leading-snug text-brand-navy">{item.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {item.className ? <InfoPill icon={<UsersRound size={15} />} label={item.className} /> : null}
                    {item.owner ? <InfoPill icon={<UserRound size={15} />} label={item.owner} /> : null}
                    {item.outfit ? <InfoPill icon={<Shirt size={15} />} label={item.outfit} /> : null}
                  </div>
                </div>
              </div>
            </article>
          )
        )}
      </section>

    </PublicShell>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-brand-line bg-white px-2.5 py-1 font-bold text-slate-700">
      <span className="shrink-0 text-brand-blue">{icon}</span>
      <span className="min-w-0 break-words">{label}</span>
    </span>
  );
}
