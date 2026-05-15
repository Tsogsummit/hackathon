"use client";

import Image from "next/image";
import { useState } from "react";

export function MarkerPositionPicker({
  backgroundUrl,
  defaultX = 50,
  defaultY = 50
}: {
  backgroundUrl?: string | null;
  defaultX?: number;
  defaultY?: number;
}) {
  const [x, setX] = useState(defaultX);
  const [y, setY] = useState(defaultY);

  return (
    <div className="space-y-2">
      <input type="hidden" name="xPercent" value={x} />
      <input type="hidden" name="yPercent" value={y} />
      <div
        className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setX(Math.round(((event.clientX - rect.left) / rect.width) * 1000) / 10);
          setY(Math.round(((event.clientY - rect.top) / rect.height) * 1000) / 10);
        }}
      >
        {backgroundUrl ? (
          <Image src={backgroundUrl} alt="Мап preview" width={1200} height={900} className="h-auto w-full" />
        ) : (
          <div className="aspect-[4/3]" />
        )}
        <span className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-red" style={{ left: `${x}%`, top: `${y}%` }} />
      </div>
      <p className="text-sm text-slate-500">Байрлал: X {x}% / Y {y}%</p>
    </div>
  );
}
