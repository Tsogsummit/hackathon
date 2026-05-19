import Image from "next/image";
import { PublicShell } from "@/components/PublicShell";

const pages = Array.from({ length: 15 }, (_, index) => {
  const page = String(index + 1).padStart(2, "0");
  return {
    src: `/slides/3a/page-${page}.png`,
    label: `${index + 1}-р хуудас`,
  };
});

export default function ThreeAPage() {
  return (
    <PublicShell showBack>
      <section className="mb-6 overflow-hidden rounded-2xl bg-brand-navy text-white shadow-soft">
        <div className="relative p-6 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-sky via-white to-brand-red" />
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-brand-sky">Бага бүлэг</p>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">3А</h1>
          <p className="mt-2 text-lg font-semibold text-slate-300">Тайлант өдөрлөг 2025-2026</p>
        </div>
      </section>

      <div className="space-y-6">
        {pages.map((page) => (
          <figure key={page.src} className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
            <div className="border-b border-brand-line bg-slate-50 px-4 py-3 text-sm font-black text-brand-navy">
              {page.label}
            </div>
            <div className="bg-slate-100 p-2 sm:p-4">
              <Image
                src={page.src}
                alt={`3А ангийн тайлан ${page.label}`}
                width={1600}
                height={900}
                className="mx-auto h-auto w-full max-w-5xl rounded-lg bg-white shadow-sm"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority={page.src.endsWith("01.png")}
              />
            </div>
          </figure>
        ))}
      </div>
    </PublicShell>
  );
}
