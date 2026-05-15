import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

const links = [
  ["/admin", "Самбар"],
  ["/admin/classes", "Анги"],
  ["/admin/teacher-departments", "Багш нар"],
  ["/admin/map", "Мап"],
  ["/admin/live", "Live"],
  ["/admin/schedule", "Хуваарь"]
];

export function AdminNav() {
  requireAdmin();
  return (
    <aside className="border-b border-white/10 bg-brand-navy text-white shadow-soft">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link href="/" className="mr-3 flex items-center gap-2 rounded-lg px-2 py-1 font-black">
          <Image src="/logo.svg" alt="Tselmeg" width={34} height={34} className="h-8 w-8 rounded-full" />
          <span className="hidden items-center gap-1 sm:flex">
            <LayoutDashboard size={17} />
            Admin
          </span>
        </Link>
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-white">
            {label}
          </Link>
        ))}
        <form action="/api/auth/logout" method="post" className="ml-auto">
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-3 py-2 text-sm font-black transition hover:bg-red-700">
            <LogOut size={16} />
            Гарах
          </button>
        </form>
      </div>
    </aside>
  );
}
