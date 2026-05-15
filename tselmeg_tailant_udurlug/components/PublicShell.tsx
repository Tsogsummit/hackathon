import { BackButton } from "@/components/BackButton";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Logo } from "@/components/Logo";
import { prisma } from "@/lib/prisma";

export async function PublicShell({
  children,
  showBack = false
}: {
  children: React.ReactNode;
  showBack?: boolean;
}) {
  const announcement = await prisma.announcement.findUnique({ where: { id: "main-announcement" } });

  return (
    <main className="page-shell min-h-screen">
      <header className="border-b border-brand-line bg-white shadow-[0_8px_24px_rgba(16,40,58,0.06)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-1.5 sm:justify-start sm:py-2">
          <Logo />
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:py-5">
        <AnnouncementBanner initial={announcement} />
        {showBack ? <BackButton /> : null}
        {children}
      </div>
    </main>
  );
}
