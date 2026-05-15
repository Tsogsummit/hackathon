import { InteractiveEventMap } from "@/components/InteractiveEventMap";
import { PublicShell } from "@/components/PublicShell";

export default function MapPage() {
  return (
    <PublicShell showBack>
      <section className="mb-5 rounded-lg border border-brand-line bg-white px-4 py-5 shadow-[0_8px_22px_rgba(16,40,58,0.06)] sm:px-6">
        <p className="brand-kicker mb-2">Тайлант өдөрлөг 2026</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="section-title text-3xl sm:text-4xl">Талбайн интерактив зураглал</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Саравч дээр дарж тухайн ангийн хуудас руу орно. Тайзан дээр дарвал одоо болон дараагийн үзүүлбэрийн мэдээлэл харагдана.
            </p>
          </div>
          <div className="rounded-lg border border-brand-line bg-slate-50 px-3 py-2 text-sm font-black text-brand-navy">
            5/16 · 10:00-13:00
          </div>
        </div>
      </section>

      <InteractiveEventMap />
    </PublicShell>
  );
}
