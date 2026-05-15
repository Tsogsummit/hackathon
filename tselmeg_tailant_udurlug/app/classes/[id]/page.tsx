import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, PlayCircle } from "lucide-react";
import type { ClassSection } from "@prisma/client";
import { Card } from "@/components/Card";
import { PublicShell } from "@/components/PublicShell";
import { prisma } from "@/lib/prisma";

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const schoolClass = await prisma.schoolClass.findUnique({
    where: { slug: params.id },
    include: { sections: { where: { active: true }, orderBy: { displayOrder: "asc" } } }
  });
  if (!schoolClass || !schoolClass.active) notFound();

  const hasContent = schoolClass.introduction || schoolClass.mainImageUrl || schoolClass.sections.length > 0;

  return (
    <PublicShell showBack>
      <div className="mb-5 text-center">
        <p className="brand-kicker mb-2">Class Profile</p>
        <h1 className="section-title text-4xl">{schoolClass.name}</h1>
      </div>
      <Card className="mb-4">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p><b>Ангийн багш:</b> {schoolClass.homeroomTeacher || "Мэдээлэл ороогүй"}</p>
          <p><b>Нийт сурагч:</b> {schoolClass.totalStudents}</p>
          <p><b>Эрэгтэй:</b> {schoolClass.maleStudents}</p>
          <p><b>Эмэгтэй:</b> {schoolClass.femaleStudents}</p>
        </div>
      </Card>
      {!hasContent ? <Card className="text-center text-slate-600">Энэ ангийн мэдээлэл удахгүй нэмэгдэнэ.</Card> : null}
      {schoolClass.mainImageUrl ? (
        <div className="surface-card mb-4 overflow-hidden p-0">
          <Image src={schoolClass.mainImageUrl} alt={schoolClass.name} width={960} height={540} className="h-auto w-full" />
        </div>
      ) : null}
      {schoolClass.introduction ? (
        <Card className="mb-4">
          <div
            className="prose prose-sm max-w-none prose-headings:text-brand-navy prose-headings:font-black prose-a:text-brand-blue prose-strong:text-brand-navy prose-li:text-slate-700 prose-p:text-slate-700 prose-p:leading-7"
            dangerouslySetInnerHTML={{ __html: schoolClass.introduction }}
          />
        </Card>
      ) : null}
      <div className="space-y-4">
        {schoolClass.sections.map((section) => (
          <ClassContentBlock key={section.id} section={section} />
        ))}
      </div>
    </PublicShell>
  );
}

type ClassBlock = ClassSection;

function ClassContentBlock({ section }: { section: ClassBlock }) {
  const eyebrow = section.eyebrow;
  const body = section.body;
  const layout = section.layout || "TEXT";

  if (layout === "HERO") {
    return (
      <section className="overflow-hidden rounded-lg bg-brand-navy text-white shadow-soft">
        {section.imageUrl ? <Image src={section.imageUrl} alt={section.title} width={960} height={540} className="h-auto w-full" /> : null}
        <div className="p-5 sm:p-7">
          {eyebrow ? <p className="brand-kicker mb-2 text-brand-sky">{eyebrow}</p> : null}
          <h2 className="text-3xl font-black">{section.title}</h2>
          {body ? <p className="mt-3 whitespace-pre-line leading-7 text-slate-200">{body}</p> : null}
          <BlockLinks section={section} light />
        </div>
      </section>
    );
  }

  if (layout === "IMAGE_TEXT") {
    return (
      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-2">
          {section.imageUrl ? (
            <Image src={section.imageUrl} alt={section.title} width={720} height={540} className="h-full min-h-56 w-full object-cover" />
          ) : (
            <div className="min-h-56 bg-brand-mist" />
          )}
          <div className="p-5">
            {eyebrow ? <p className="brand-kicker mb-2">{eyebrow}</p> : null}
            <h2 className="text-2xl font-black text-brand-navy">{section.title}</h2>
            {body ? <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{body}</p> : null}
            <BlockLinks section={section} />
          </div>
        </div>
      </Card>
    );
  }

  if (layout === "HIGHLIGHT") {
    return (
      <section className="rounded-lg border border-brand-red/20 bg-red-50 p-5 shadow-soft">
        {eyebrow ? <p className="brand-kicker mb-2 text-brand-red">{eyebrow}</p> : null}
        <h2 className="text-2xl font-black text-brand-navy">{section.title}</h2>
        {body ? <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{body}</p> : null}
        <BlockLinks section={section} />
      </section>
    );
  }

  if (layout === "QUOTE") {
    return (
      <section className="rounded-lg border-l-4 border-brand-blue bg-white p-5 shadow-soft">
        {eyebrow ? <p className="brand-kicker mb-2">{eyebrow}</p> : null}
        <blockquote className="text-2xl font-black leading-snug text-brand-navy">{section.title}</blockquote>
        {body ? <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{body}</p> : null}
      </section>
    );
  }

  if (layout === "VIDEO") {
    return (
      <Card>
        {eyebrow ? <p className="brand-kicker mb-2">{eyebrow}</p> : null}
        <h2 className="text-2xl font-black text-brand-navy">{section.title}</h2>
        {body ? <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{body}</p> : null}
        {section.videoUrl ? (
          <a href={section.videoUrl} className="brand-button mt-4 inline-flex items-center gap-2 px-4 py-3 font-black transition">
            <PlayCircle size={18} />
            Видео үзэх
          </a>
        ) : null}
      </Card>
    );
  }

  if (layout === "CTA") {
    return (
      <section className="rounded-lg bg-brand-navy p-5 text-white shadow-soft">
        {eyebrow ? <p className="mb-2 text-xs font-black uppercase tracking-wide text-brand-sky">{eyebrow}</p> : null}
        <h2 className="text-2xl font-black">{section.title}</h2>
        {body ? <p className="mt-3 whitespace-pre-line leading-7 text-slate-200">{body}</p> : null}
        <BlockLinks section={section} light />
      </section>
    );
  }

  return (
    <Card>
      {eyebrow ? <p className="brand-kicker mb-2">{eyebrow}</p> : null}
      <h2 className="mb-3 text-xl font-black text-brand-navy">{section.title}</h2>
      {section.imageUrl ? (
        <Image src={section.imageUrl} alt={section.title} width={960} height={540} className="mb-3 rounded-lg" />
      ) : null}
      {body ? <p className="whitespace-pre-line leading-7 text-slate-700">{body}</p> : null}
      <BlockLinks section={section} />
    </Card>
  );
}

function BlockLinks({ section, light = false }: { section: ClassBlock; light?: boolean }) {
  const buttonUrl = section.buttonUrl || section.videoUrl;
  const buttonLabel = section.buttonLabel || (section.videoUrl ? "Видео үзэх" : "");
  if (!buttonUrl || !buttonLabel) return null;

  return (
    <a
      href={buttonUrl}
      className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-3 font-black transition ${
        light ? "bg-white text-brand-navy hover:bg-brand-mist" : "brand-button"
      }`}
    >
      {buttonLabel}
      <ExternalLink size={17} />
    </a>
  );
}
