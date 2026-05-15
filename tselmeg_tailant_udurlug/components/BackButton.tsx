"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="secondary-button mb-5 inline-flex items-center gap-2 px-4 py-3 text-sm font-bold"
    >
      <ArrowLeft size={17} />
      Буцах
    </button>
  );
}
