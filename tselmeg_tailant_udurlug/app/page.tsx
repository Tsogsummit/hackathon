import Link from "next/link";
import { BookOpenCheck, CalendarDays, ChevronRight, GraduationCap, MapPinned, School, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { eventTitle, schoolName } from "@/lib/content";

const buttons = [
  { href: "/map", label: "Талбайн зураглал", helper: "Анги, тайз, саравч", icon: MapPinned },
  { href: "/groups/high", label: "Ахлах бүлэг", helper: "9-12 анги", icon: GraduationCap },
  { href: "/groups/middle", label: "Дунд бүлэг", helper: "6-8 анги", icon: School },
  { href: "/groups/primary", label: "Бага бүлэг", helper: "Бага анги", icon: BookOpenCheck },
  { href: "/surgalt", label: "Сургалтын хөтөлбөр", helper: "Цогц хөтөлбөр", icon: BookOpenCheck },
  { href: "/teachers", label: "Багш нар", helper: "Заах аргын нэгдэл", icon: UsersRound },
  { href: "/schedule", label: "Цагийн хуваарь", helper: "Өдөрлөгийн flow", icon: CalendarDays }
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="overflow-hidden rounded-lg bg-brand-navy text-white shadow-soft">
        <div className="relative p-5 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-sky via-white to-brand-red" />
          <p className="mb-3 text-xs font-black uppercase tracking-wide text-brand-sky">{schoolName}</p>
          <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-normal sm:text-5xl">
            {eventTitle}
          </h1>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-3">
        {buttons.map(({ href, label, helper, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="surface-card group touch-button flex items-center justify-between gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand-blue/40 sm:gap-4"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-mist text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white sm:h-11 sm:w-11">
                  <Icon size={21} />
                </span>
                <span className="text-left">
                  <span className="block text-base font-black text-brand-navy sm:text-lg">{label}</span>
                  <span className="block text-xs font-semibold text-slate-500 sm:text-sm">{helper}</span>
                </span>
              </span>
              <ChevronRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-red" size={20} />
            </Link>
        ))}
      </section>
    </PublicShell>
  );
}
