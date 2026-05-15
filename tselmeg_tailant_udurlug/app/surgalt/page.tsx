import { PublicShell } from "@/components/PublicShell";
import { Card } from "@/components/Card";
import { BookOpen, GraduationCap, Laptop, Atom, ShieldCheck, Languages, BrainCircuit, Users, Compass, Code, Briefcase } from "lucide-react";

export default function CurriculumPage() {
  return (
    <PublicShell showBack>
      <div className="mb-8 text-center">
        <p className="brand-kicker mb-2">Curriculum</p>
        <h1 className="section-title text-3xl sm:text-4xl">Сургалтын хөтөлбөр</h1>
        <p className="mt-3 text-slate-600">
          Цэлмэг сургуулийн боловсролын цогц хөтөлбөр
        </p>
      </div>

      <div className="space-y-6">
        {/* Ахлах анги */}
        <Card className="border-l-4 border-l-brand-red">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
              <GraduationCap size={24} />
            </span>
            <h2 className="text-2xl font-black text-brand-navy">Ахлах ангийн сургалтын хөтөлбөр</h2>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <GlobeIcon className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Cambridge Олон Улсын Хөтөлбөр:</strong> Prospect School хөтөлбөр</span>
            </li>
            <li className="flex gap-3">
              <Briefcase className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Бизнес Энтрепренерийн хичээл:</strong> Австрали Улсын Боловсролын Яамны албан ёсны сертификат болон дипломны түвшний сургалтын хөтөлбөр</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Олон улсын шалгалтын бэлтгэл:</strong> IELTS, SAT, HSK, AP, PSAT</span>
            </li>
            <li className="flex gap-3">
              <Compass className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>School Counselor:</strong> Их дээд сургуулийн зөвлөх үйлчилгээ</span>
            </li>
            <li className="flex gap-3">
              <BrainCircuit className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Хиймэл оюун ухааны хөтөлбөр</strong></span>
            </li>
          </ul>
        </Card>

        {/* Дунд анги */}
        <Card className="border-l-4 border-l-brand-blue">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
              <Users size={24} />
            </span>
            <h2 className="text-2xl font-black text-brand-navy">Дунд ангийн сургалтын хөтөлбөр</h2>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <GlobeIcon className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Cambridge Олон Улсын Хөтөлбөр (Prospect School):</strong> Байгалийн ухааны судлагдахуун хичээлүүд, англи хэл, математик</span>
            </li>
            <li className="flex gap-3">
              <Code className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Програмчлал, мэдээллийн аюулгүй байдал:</strong> Улсын олимпиадын бэлтгэл</span>
            </li>
            <li className="flex gap-3">
              <Atom className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Шинжлэх ухаан:</strong> Онол, туршилт хосолсон хичээлүүд</span>
            </li>
            <li className="flex gap-3">
              <BookOpen className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Үндэсний цөм хөтөлбөр</strong></span>
            </li>
            <li className="flex gap-3">
              <BrainCircuit className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Хиймэл оюун ухааны хөтөлбөр</strong></span>
            </li>
            <li className="flex gap-3">
              <Languages className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Хятад хэл:</strong> Үндсэн хөтөлбөр</span>
            </li>
          </ul>
        </Card>

        {/* Бага анги */}
        <Card className="border-l-4 border-l-green-500">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
              <BookOpen size={24} />
            </span>
            <h2 className="text-2xl font-black text-brand-navy">Бага ангийн сургалтын хөтөлбөр</h2>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <Laptop className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Цахим технологи:</strong> Oxford Сomputing хөтөлбөр</span>
            </li>
            <li className="flex gap-3">
              <GlobeIcon className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Cambridge Олон Улсын Хөтөлбөр (Prospect School):</strong> Байгалийн ухааны судлагдахуун хичээлүүд, англи хэл, математик</span>
            </li>
            <li className="flex gap-3">
              <BookOpen className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Үндэсний цөм хөтөлбөр</strong></span>
            </li>
            <li className="flex gap-3">
              <Atom className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>STEAM хөтөлбөр:</strong> Бага ангийнханд зориулсан</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Хичээлийн дараах хөгжүүлэх хөтөлбөрүүд</strong></span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-brand-blue" size={18} />
              <span><strong>Унтлагын цаг болон хөнгөн цүнхний бодлого:</strong> Даалгаврын ачаалал бага</span>
            </li>
          </ul>
        </Card>
      </div>
    </PublicShell>
  );
}

// Temporary custom globe icon since it might be named differently
function GlobeIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
