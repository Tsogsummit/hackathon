import { Logo } from "@/components/Logo";

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-4">
      <form action="/api/auth/login" method="post" className="surface-card w-full max-w-md p-6">
        <Logo className="mb-6" />
        <h1 className="section-title mb-2 text-center text-2xl">Админ нэвтрэх</h1>
        <p className="mb-5 text-center text-sm font-semibold text-slate-500">Report day content management</p>
        {searchParams.error ? <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-brand-red">И-мэйл эсвэл нууц үг буруу байна.</p> : null}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-black text-brand-navy">И-мэйл</span>
          <input name="email" type="email" required className="w-full rounded-lg border border-brand-line px-3 py-3 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10" />
        </label>
        <label className="mb-5 block">
          <span className="mb-1 block text-sm font-black text-brand-navy">Нууц үг</span>
          <input name="password" type="password" required className="w-full rounded-lg border border-brand-line px-3 py-3 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10" />
        </label>
        <button className="brand-button w-full px-5 py-3 font-black transition">Нэвтрэх</button>
      </form>
    </main>
  );
}
