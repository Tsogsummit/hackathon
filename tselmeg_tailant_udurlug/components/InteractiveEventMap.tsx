"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarClock, ChevronRight, Info, MapPin, Radio, School } from "lucide-react";

type HotspotKind = "stage" | "class" | "info";

type Hotspot = {
  id: string;
  kind: HotspotKind;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  href?: string;
  detail: string;
  tone: string;
};

type StageProgram = {
  time: string;
  title: string;
  className?: string;
};

const stageProgram: StageProgram[] = [
  { time: "10:00-10:15", title: "Нээлтийн үйл ажиллагаа" },
  { time: "10:15-10:20", title: "2-3-р ангиудын нэгдсэн хор", className: "2-3-р анги" },
  { time: "10:20-10:25", title: "“Сэтэрт тал”", className: "3A" },
  { time: "10:25-10:30", title: "“Есөн эрдэнийн орон”", className: "5A" },
  { time: "10:30-10:35", title: "Хуралдай бүжиг", className: "7A" },
  { time: "10:35-10:40", title: "“Оньсого таалцъя”", className: "2A" },
  { time: "10:40-10:45", title: "“Морин хуур” дууны цоморлиг", className: "2C" },
  { time: "10:45-10:50", title: "Товшуур бүжиг", className: "6C" },
  { time: "10:50-10:55", title: "“Хорвоо амгалан байг”", className: "4A" },
  { time: "10:55-11:00", title: "“Тусгаар тогтнол” найраглал", className: "5B" },
  { time: "11:00-11:05", title: "Бага анги бүжгийн дугуйлан" },
  { time: "11:05-11:10", title: "“Монголын нэг өдөр”", className: "8A" },
  { time: "11:10-11:15", title: "“Зуун зууны ерөөл”", className: "7B" },
  { time: "11:15-11:20", title: "Бүжиг", className: "6A" },
  { time: "11:20-11:25", title: "Англи дуу", className: "2B" },
  { time: "11:25-11:30", title: "Мөнхийн хөдөлгөөн", className: "9A" },
  { time: "11:35-11:40", title: "Англи дуу", className: "3B" },
  { time: "11:40-11:45", title: "“Нэгэн зүгт”", className: "4B" },
  { time: "11:45-11:50", title: "Тэмүүжин дуу бүжиг", className: "11C" },
  { time: "11:50-11:55", title: "“Сонгодог” ая", className: "6A, 4B" },
  { time: "11:55-12:00", title: "“Хятад дуу”", className: "7C" },
  { time: "12:00-12:05", title: "Бүжгийн цомирлог", className: "9B" },
  { time: "12:05-12:10", title: "Англи дуу Diamond", className: "6B" },
  { time: "12:10-12:15", title: "Дунд анги бүжгийн дугуйлан" },
  { time: "12:15-12:20", title: "Сүүлчийн уянга", className: "10A" },
  { time: "12:20-12:25", title: "Fantastic Four", className: "11B" },
  { time: "12:25-12:30", title: "“Endless Love”", className: "11A" },
  { time: "12:30-12:35", title: "Венийн вальс", className: "12B" },
  { time: "12:35-12:40", title: "“Янзага” хоор дуу", className: "10C" },
  { time: "12:40-12:45", title: "Ахлах анги бүжгийн дугуйлан" },
  { time: "12:45-12:50", title: "“Хөгжмийн номер”", className: "12A" },
  { time: "12:50-12:55", title: "Тал нутгийн охид", className: "10B" },
  { time: "12:55-13:00", title: "Эх орон хоор дуу", className: "8B" }
];

const hotspots: Hotspot[] = [
  { id: "stage", kind: "stage", label: "Төв тайз", shortLabel: "LIVE", x: 50, y: 23, detail: "Үзүүлбэрийн одоогийн болон дараагийн мэдээлэл", tone: "bg-brand-red text-white border-white/80" },
  { id: "2a", kind: "class", label: "2A ангийн саравч", shortLabel: "2A", x: 20, y: 56, href: "/classes/2a", detail: "Бага бүлгийн ангийн тайлан", tone: "bg-sky-600 text-white border-white/80" },
  { id: "2b", kind: "class", label: "2B ангийн саравч", shortLabel: "2B", x: 28, y: 47, href: "/classes/2b", detail: "Бага бүлгийн ангийн тайлан", tone: "bg-sky-600 text-white border-white/80" },
  { id: "2c", kind: "class", label: "2C ангийн саравч", shortLabel: "2C", x: 30, y: 63, href: "/classes/2c", detail: "Бага бүлгийн ангийн тайлан", tone: "bg-sky-600 text-white border-white/80" },
  { id: "3b", kind: "class", label: "3B ангийн саравч", shortLabel: "3B", x: 38, y: 58, href: "/classes/3b", detail: "Бага бүлгийн ангийн тайлан", tone: "bg-sky-600 text-white border-white/80" },
  { id: "4b", kind: "class", label: "4B ангийн саравч", shortLabel: "4B", x: 47, y: 51, href: "/classes/4b", detail: "Бага бүлгийн ангийн тайлан", tone: "bg-sky-600 text-white border-white/80" },
  { id: "6a", kind: "class", label: "6A ангийн саравч", shortLabel: "6A", x: 64, y: 47, href: "/classes/6a", detail: "Дунд бүлгийн ангийн тайлан", tone: "bg-emerald-600 text-white border-white/80" },
  { id: "6b", kind: "class", label: "6B ангийн саравч", shortLabel: "6B", x: 69, y: 57, href: "/classes/6b", detail: "Дунд бүлгийн ангийн тайлан", tone: "bg-emerald-600 text-white border-white/80" },
  { id: "6c", kind: "class", label: "6C ангийн саравч", shortLabel: "6C", x: 58, y: 60, href: "/classes/6c", detail: "Дунд бүлгийн ангийн тайлан", tone: "bg-emerald-600 text-white border-white/80" },
  { id: "7b", kind: "class", label: "7B ангийн саравч", shortLabel: "7B", x: 74, y: 45, href: "/classes/7b", detail: "Дунд бүлгийн ангийн тайлан", tone: "bg-emerald-600 text-white border-white/80" },
  { id: "7c", kind: "class", label: "7C ангийн саравч", shortLabel: "7C", x: 74, y: 64, href: "/classes/7c", detail: "Дунд бүлгийн ангийн тайлан", tone: "bg-emerald-600 text-white border-white/80" },
  { id: "8a", kind: "class", label: "8A ангийн саравч", shortLabel: "8A", x: 81, y: 55, href: "/classes/8a", detail: "Дунд бүлгийн ангийн тайлан", tone: "bg-emerald-600 text-white border-white/80" },
  { id: "8b", kind: "class", label: "8B ангийн саравч", shortLabel: "8B", x: 84, y: 40, href: "/classes/8b", detail: "Дунд бүлгийн ангийн тайлан", tone: "bg-emerald-600 text-white border-white/80" },
  { id: "9a", kind: "class", label: "9A ангийн саравч", shortLabel: "9A", x: 15, y: 44, href: "/classes/9a", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "10a", kind: "class", label: "10A ангийн саравч", shortLabel: "10A", x: 17, y: 70, href: "/classes/10a", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "10b", kind: "class", label: "10B ангийн саравч", shortLabel: "10B", x: 50, y: 83, href: "/classes/10b", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "10c", kind: "class", label: "10C ангийн саравч", shortLabel: "10C", x: 92, y: 33, href: "/classes/10c", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "11a", kind: "class", label: "11A ангийн саравч", shortLabel: "11A", x: 94, y: 48, href: "/classes/11a", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "11b", kind: "class", label: "11B ангийн саравч", shortLabel: "11B", x: 89, y: 61, href: "/classes/11b", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "11c", kind: "class", label: "11C ангийн саравч", shortLabel: "11C", x: 10, y: 33, href: "/classes/11c", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "12a", kind: "class", label: "12A ангийн саравч", shortLabel: "12A", x: 6, y: 73, href: "/classes/12a", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "12b", kind: "class", label: "12B ангийн саравч", shortLabel: "12B", x: 96, y: 70, href: "/classes/12b", detail: "Ахлах бүлгийн ангийн тайлан", tone: "bg-indigo-600 text-white border-white/80" },
  { id: "info", kind: "info", label: "Мэдээллийн хэсэг", shortLabel: "i", x: 34, y: 28, detail: "Зочид мэдээлэл, чиглэл авах цэг", tone: "bg-white text-brand-navy border-brand-blue" }
];

function minutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function getStageState(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const parsed = stageProgram.map((item) => {
    const [start, end] = item.time.split("-");
    return { ...item, startMinutes: minutes(start), endMinutes: minutes(end) };
  });
  const current = parsed.find((item) => currentMinutes >= item.startMinutes && currentMinutes < item.endMinutes);
  const next = parsed.find((item) => item.startMinutes > currentMinutes) ?? parsed[0];
  return { current, next };
}

export function InteractiveEventMap() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("stage");
  const [stage, setStage] = useState(() => getStageState());
  const selected = hotspots.find((hotspot) => hotspot.id === selectedId) ?? hotspots[0];

  useEffect(() => {
    const timer = window.setInterval(() => setStage(getStageState()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line bg-white px-4 py-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-brand-blue">Interactive Map</p>
            <h2 className="text-lg font-black text-brand-navy">Талбайн зураглал</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-black">
            <Legend color="bg-brand-red" label="Тайз" />
            <Legend color="bg-sky-600" label="Бага" />
            <Legend color="bg-emerald-600" label="Дунд" />
            <Legend color="bg-indigo-600" label="Ахлах" />
          </div>
        </div>
        <div className="relative overflow-auto bg-slate-950 p-2 sm:p-3">
          <div className="relative mx-auto aspect-[16/9] min-w-[760px] overflow-hidden rounded-lg bg-slate-900 shadow-inner">
            <Image
              src="/maps/event-map.png"
              alt="Тайлант өдөрлөгийн талбайн интерактив зураглал"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => {
                  if (hotspot.kind === "class" && hotspot.href) {
                    router.push(hotspot.href);
                    return;
                  }
                  setSelectedId(hotspot.id);
                }}
                className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border-2 px-2.5 py-1 text-xs font-black shadow-[0_8px_22px_rgba(0,0,0,0.28)] transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/70 ${hotspot.tone} ${selectedId === hotspot.id ? "scale-110 ring-4 ring-white/70" : ""}`}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                aria-label={hotspot.label}
              >
                {hotspot.kind === "stage" ? <Radio size={14} className="animate-pulse" /> : null}
                {hotspot.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </section>

      <aside className="surface-card overflow-hidden">
        <div className="border-b border-brand-line bg-brand-navy px-4 py-4 text-white">
          <div className="flex items-center gap-2">
            {selected.kind === "stage" ? <Radio className="text-brand-red" size={20} /> : selected.kind === "class" ? <School className="text-brand-sky" size={20} /> : <Info className="text-brand-sky" size={20} />}
            <h2 className="text-xl font-black">{selected.label}</h2>
          </div>
          <p className="mt-1 text-sm text-slate-300">{selected.detail}</p>
        </div>

        <div className="p-4">
          {selected.kind === "stage" ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand-red px-2 py-1 text-xs font-black text-white">
                  <Radio size={13} className="animate-pulse" />
                  LIVE
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-red-500">Одоо</p>
                <h3 className="mt-1 text-lg font-black text-brand-navy">{stage.current?.title ?? "Үйл ажиллагаа эхлээгүй байна"}</h3>
                <p className="mt-1 text-sm font-bold text-slate-600">{stage.current?.time ?? "10:00-13:00"}</p>
                {stage.current?.className ? <p className="mt-1 text-sm text-slate-600">Анги: {stage.current.className}</p> : null}
              </div>
              <div className="rounded-lg border border-brand-line bg-slate-50 p-3">
                <p className="text-xs font-black uppercase tracking-widest text-brand-blue">Дараа</p>
                <h3 className="mt-1 font-black text-brand-navy">{stage.next.title}</h3>
                <p className="mt-1 text-sm font-bold text-slate-600">{stage.next.time}</p>
                {stage.next.className ? <p className="mt-1 text-sm text-slate-600">Анги: {stage.next.className}</p> : null}
              </div>
              <Link href="/schedule" className="brand-button flex items-center justify-center gap-2 px-4 py-3 text-sm font-black">
                <CalendarClock size={18} />
                Бүтэн хөтөлбөр харах
              </Link>
            </div>
          ) : selected.href ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-brand-line bg-slate-50 p-3">
                <p className="text-xs font-black uppercase tracking-widest text-brand-blue">Саравч</p>
                <h3 className="mt-1 text-lg font-black text-brand-navy">{selected.shortLabel}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">Энэ саравч дээр тухайн ангийн тайлан, зураг, амжилтын мэдээлэлтэй холбогдоно.</p>
              </div>
              <Link href={selected.href} className="brand-button flex items-center justify-center gap-2 px-4 py-3 text-sm font-black">
                Ангийн хуудас руу орох
                <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="rounded-lg border border-brand-line bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              <MapPin className="mb-2 text-brand-blue" size={22} />
              Зочид мэдээлэл авах, чиглэл асуух боломжтой хэсэг.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white px-2 py-1 text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}
