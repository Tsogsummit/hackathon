import { Card } from "@/components/Card";
import { PublicShell } from "@/components/PublicShell";
import { prisma } from "@/lib/prisma";

export default async function SchedulePage() {
  const items = await prisma.scheduleItem.findMany({
    where: { active: true },
    orderBy: [{ displayOrder: "asc" }, { startTime: "asc" }]
  });

  return (
    <PublicShell showBack>
      <div className="mb-5 text-center">
        <p className="brand-kicker mb-2">Event Flow</p>
        <h1 className="section-title text-3xl sm:text-4xl">Үйл ажиллагааны цагийн хуваарь</h1>
      </div>
      {items.length === 0 ? (
        <Card className="text-center text-slate-600">Цагийн хуваарь удахгүй нэмэгдэнэ.</Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="inline-flex rounded-lg bg-brand-red px-3 py-1 text-sm font-black text-white">
                {item.startTime}{item.endTime ? ` - ${item.endTime}` : ""}
              </div>
              <h2 className="mt-3 text-xl font-black text-brand-navy">{item.title}</h2>
              {item.location ? <p className="mt-1 font-bold text-brand-blue">{item.location}</p> : null}
              {item.description ? <p className="mt-2 whitespace-pre-line text-slate-700">{item.description}</p> : null}
            </Card>
          ))}
        </div>
      )}
    </PublicShell>
  );
}
