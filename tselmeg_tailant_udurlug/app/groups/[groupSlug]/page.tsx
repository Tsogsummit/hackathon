import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/Card";
import { PublicShell } from "@/components/PublicShell";
import { groupLabels, groupSlugToEnum } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export default async function GroupPage({ params }: { params: { groupSlug: string } }) {
  const group = groupSlugToEnum[params.groupSlug];
  if (!group) notFound();

  const classes = await prisma.schoolClass.findMany({
    where: { group, active: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
  });

  return (
    <PublicShell showBack>
      <div className="mb-5 text-center">
        <p className="brand-kicker mb-2">Class Group</p>
        <h1 className="section-title text-3xl sm:text-4xl">{groupLabels[group]}</h1>
      </div>
      {classes.length === 0 ? (
        <Card className="text-center text-slate-600">Мэдээлэл удахгүй нэмэгдэнэ.</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {classes.map((schoolClass) => (
            <Link
              key={schoolClass.id}
              href={`/classes/${schoolClass.slug}`}
              className="surface-card group touch-button flex items-center justify-between p-5 text-2xl font-black text-brand-navy transition hover:-translate-y-0.5 hover:border-brand-blue/40"
            >
              <span>{schoolClass.name}</span>
              <ChevronRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-red" size={22} />
            </Link>
          ))}
        </div>
      )}
    </PublicShell>
  );
}
