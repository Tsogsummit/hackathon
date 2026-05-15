import { AdminNav } from "@/components/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-shell min-h-screen">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}
