import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Tselmeg Digital International School"
        width={58}
        height={58}
        priority
        className="h-12 w-12 rounded-full shadow-[0_10px_22px_rgba(16,40,58,0.14)] sm:h-14 sm:w-14"
      />
      <div className="hidden text-left sm:block">
        <p className="text-xs font-black uppercase leading-tight tracking-wide text-brand-navy">Tselmeg Digital</p>
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-blue">International School</p>
      </div>
    </div>
  );
}
