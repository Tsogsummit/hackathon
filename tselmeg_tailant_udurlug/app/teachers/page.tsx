import Link from "next/link";
import { ChevronRight, UsersRound, BookOpen, Globe, Atom, Landmark } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";

const departments = [
  {
    id: "bazan",
    shortName: "БАЗАН",
    fullName: "Бага ангийн заах аргын нэгдэл",
    icon: BookOpen,
  },
  {
    id: "buzan",
    shortName: "БУЗАН",
    fullName: "Байгалийн ухааны заах аргын нэгдэл",
    icon: Atom,
  },
  {
    id: "ghzan",
    shortName: "ГХЗАН",
    fullName: "Гадаад хэлний заах аргын нэгдэл",
    icon: Globe,
  },
  {
    id: "hha",
    shortName: "ХХА",
    fullName: "Хүүхэд хөгжлийн алба",
    icon: UsersRound,
  },
  {
    id: "nuzan",
    shortName: "НУЗАН",
    fullName: "Нийгмийн ухааны заах аргын нэгдэл",
    icon: Landmark,
  },
];

export default function TeachersPage() {
  return (
    <PublicShell showBack>
      <div className="mb-5 text-center">
        <p className="brand-kicker mb-2">Academic Teams</p>
        <h1 className="section-title text-2xl sm:text-3xl">Багш нар</h1>
      </div>
      <div className="grid gap-3">
        {departments.map((department) => {
          const Icon = department.icon;
          return (
            <Link
              key={department.id}
              href={`/teachers/${department.id}`}
              className="surface-card group flex items-center justify-between gap-4 p-4 transition hover:-translate-y-0.5 hover:border-brand-blue/40"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-mist text-brand-blue">
                  <Icon size={21} />
                </span>
                <span>
                  <span className="block text-lg font-black text-brand-navy">{department.shortName}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-slate-600">{department.fullName}</span>
                </span>
              </span>
              <ChevronRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-red" size={22} />
            </Link>
          );
        })}
      </div>
    </PublicShell>
  );
}
