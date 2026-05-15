import Image from "next/image";
import type { ReactNode } from "react";
import { Award, BookOpen, Medal, Star, Trophy, Users } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";

type Tone = "blue" | "red" | "pink" | "green" | "indigo" | "purple" | "teal" | "amber" | "sky";
type IconName = "award" | "book" | "medal" | "star" | "trophy";

export type ClassReportSection = {
  id: string;
  tone: Tone;
  icon?: IconName;
  label: string;
  title: string;
  achievements: { badge: string; name: string; event?: string }[];
  images: { src: string; caption: string }[];
};

type StaticClassReportProps = {
  groupLabel: string;
  className: string;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  teacher?: string;
  leader?: string;
  coverImage?: { src: string; alt: string; caption?: string };
  intro: ReactNode;
  sections: (ClassReportSection | {
    id: string;
    color?: string;
    label: string;
    title: string;
    items: { who: string; event?: string; badge: string }[];
    images: { src: string; caption: string }[];
  } | {
    id: string;
    color?: string;
    label: string;
    title: string;
    achievements: { badge?: string; name: string; event?: string; place?: number; special?: string }[];
    images: { src: string; caption: string }[];
  })[];
  footer: string;
};

const toneMap: Record<Tone, { bg: string; border: string; icon: string; soft: string }> = {
  amber: { bg: "from-amber-50 to-white", border: "border-amber-200", icon: "text-amber-600", soft: "bg-amber-100 text-amber-700" },
  blue: { bg: "from-blue-50 to-white", border: "border-blue-200", icon: "text-blue-600", soft: "bg-blue-100 text-blue-700" },
  green: { bg: "from-green-50 to-white", border: "border-green-200", icon: "text-green-600", soft: "bg-green-100 text-green-700" },
  indigo: { bg: "from-indigo-50 to-white", border: "border-indigo-200", icon: "text-indigo-600", soft: "bg-indigo-100 text-indigo-700" },
  pink: { bg: "from-pink-50 to-white", border: "border-pink-200", icon: "text-pink-600", soft: "bg-pink-100 text-pink-700" },
  purple: { bg: "from-purple-50 to-white", border: "border-purple-200", icon: "text-purple-600", soft: "bg-purple-100 text-purple-700" },
  red: { bg: "from-red-50 to-white", border: "border-red-200", icon: "text-red-600", soft: "bg-red-100 text-red-700" },
  sky: { bg: "from-sky-50 to-white", border: "border-sky-200", icon: "text-sky-600", soft: "bg-sky-100 text-sky-700" },
  teal: { bg: "from-teal-50 to-white", border: "border-teal-200", icon: "text-teal-600", soft: "bg-teal-100 text-teal-700" },
};

const iconMap = {
  award: Award,
  book: BookOpen,
  medal: Medal,
  star: Star,
  trophy: Trophy,
};

function imageGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count >= 5) return "grid-cols-2 sm:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-3";
}

function badgeFromPlace(place?: number, special?: string) {
  if (special) return special;
  if (place === 1) return "1-р байр";
  if (place === 2) return "2-р байр";
  if (place === 3) return "3-р байр";
  if (place === 4) return "4-р байр";
  return "Шилдэг";
}

function SectionBlock({ section }: { section: StaticClassReportProps["sections"][number] }) {
  const normalized = {
    ...section,
    tone: "tone" in section ? section.tone : section.color ?? "blue",
    icon: "icon" in section ? section.icon : "star",
    achievements:
      "achievements" in section
        ? section.achievements.map((item) => {
          const place = "place" in item ? item.place : undefined;
          const special = "special" in item ? item.special : undefined;
          return {
            badge: item.badge ?? badgeFromPlace(place, special),
            name: item.name,
            event: item.event,
          };
        })
        : section.items.map((item) => ({ badge: item.badge, name: item.who, event: item.event })),
  };
  const tone = toneMap[normalized.tone as Tone] ?? toneMap.blue;
  const iconKey = String(normalized.icon ?? "star").toLowerCase() as IconName;
  const Icon = iconMap[iconKey] ?? Star;

  return (
    <section className={`overflow-hidden rounded-xl border bg-gradient-to-br ${tone.bg} ${tone.border} shadow-soft`}>
      <div className={`flex items-center gap-3 border-b ${tone.border} bg-white/60 px-4 py-3 sm:px-5`}>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${tone.icon}`}>
          <Icon size={18} />
        </span>
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-widest text-slate-400">{normalized.label}</p>
          <h2 className="text-base font-black leading-tight text-brand-navy sm:text-lg">{normalized.title}</h2>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {normalized.achievements.map((achievement, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2 rounded-lg border border-brand-line bg-white px-2.5 py-1.5 shadow-sm">
              <span className={`rounded-md px-2 py-0.5 text-xs font-black ${tone.soft}`}>{achievement.badge}</span>
              <span className="text-sm font-bold text-brand-navy">{achievement.name}</span>
              {achievement.event && <span className="text-xs text-slate-500">- {achievement.event}</span>}
            </div>
          ))}
        </div>
        {normalized.images.length > 0 && (
          <div className={`grid gap-3 ${imageGridClass(normalized.images.length)}`}>
            {normalized.images.map((image, index) => (
              <figure key={`${image.src}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={image.src}
                    alt={image.caption}
                    fill
                    className="object-contain transition duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <figcaption className="bg-white px-3 py-2 text-center text-xs font-semibold text-slate-500">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function StaticClassReport({
  groupLabel,
  className,
  totalStudents,
  maleStudents,
  femaleStudents,
  teacher,
  leader,
  coverImage,
  intro,
  sections,
  footer,
}: StaticClassReportProps) {
  return (
    <PublicShell showBack>
      <section className="mb-5 overflow-hidden rounded-xl bg-brand-navy text-white shadow-soft">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-sky via-white to-brand-red" />
          <div className="relative p-5 sm:p-8">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-brand-sky">{groupLabel}</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{className}</h1>
            <p className="mt-2 text-base font-semibold text-slate-300 sm:text-lg">Тайлант өдөрлөг 2025-2026</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-slate-300">
              {totalStudents > 0 && (
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-brand-sky" />
                  Нийт {totalStudents} сурагч
                </span>
              )}
              {maleStudents > 0 && <span>Эрэгтэй {maleStudents}</span>}
              {femaleStudents > 0 && <span>Эмэгтэй {femaleStudents}</span>}
              {teacher && <span>Ангийн багш: {teacher}</span>}
              {leader && <span>Ангийн дарга: {leader}</span>}
            </div>
          </div>
        </div>
      </section>

      {coverImage && (
        <div className="mb-5 overflow-hidden rounded-xl border border-brand-line bg-white shadow-soft">
          <Image src={coverImage.src} alt={coverImage.alt} width={1200} height={800} className="w-full h-auto" priority />
          {coverImage.caption && (
            <div className="bg-brand-navy px-5 py-3 text-center text-sm font-semibold text-slate-300">
              {coverImage.caption}
            </div>
          )}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-brand-line bg-white p-4 text-center shadow-soft sm:p-5">
        <p className="text-sm leading-7 text-slate-700 sm:text-base">{intro}</p>
      </div>

      <div className="space-y-5">
        {sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-brand-navy text-white shadow-soft">
        <div className="p-5 text-center sm:p-6">
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-brand-sky">2025-2026 оны хичээлийн жил</p>
          <h3 className="text-xl font-black sm:text-2xl">{footer}</h3>
        </div>
      </div>
    </PublicShell>
  );
}
