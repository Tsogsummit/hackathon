"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { markerTypeLabels } from "@/lib/content";
import type { MapMarker, MapMarkerType } from "@prisma/client";

type Marker = Pick<MapMarker, "id" | "name" | "type" | "xPercent" | "yPercent" | "description" | "status">;

export function MapViewer({
  backgroundUrl,
  markers,
  initialStage
}: {
  backgroundUrl?: string | null;
  markers: Marker[];
  initialStage?: string | null;
}) {
  const [selected, setSelected] = useState<Marker | null>(null);
  const [stage, setStage] = useState(initialStage || "Мэдээлэл удахгүй нэмэгдэнэ.");

  useEffect(() => {
    const events = new EventSource("/api/live/events");
    events.onmessage = (message) => {
      const payload = JSON.parse(message.data);
      if (payload.type === "stage") setStage(payload.data.currentStage || "Мэдээлэл удахгүй нэмэгдэнэ.");
    };
    return () => events.close();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-navy p-4 text-white shadow-soft">
        <p className="mb-1 inline-flex items-center gap-2 text-sm font-black text-brand-sky">
          <Radio size={16} />
          Одоо тайзан дээр
        </p>
        <p className="text-xl font-black">{stage}</p>
      </div>
      <div className="surface-card relative overflow-hidden p-0">
        {backgroundUrl ? (
          <Image src={backgroundUrl} alt="Үйл ажиллагааны мап" width={1200} height={900} className="h-auto w-full" />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-brand-mist p-8 text-center font-bold text-slate-500">
            Мап зураг удахгүй нэмэгдэнэ.
          </div>
        )}
        {markers.map((marker) => (
          <button
            key={marker.id}
            onClick={() => setSelected(marker)}
            className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-red text-xs font-black text-white shadow-soft transition hover:scale-110"
            style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
            aria-label={marker.name}
          >
            •
          </button>
        ))}
      </div>
      {selected ? (
        <div className="surface-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-brand-navy">{selected.name}</h2>
              <p className="text-sm font-black text-brand-red">{markerTypeLabels[selected.type as MapMarkerType]}</p>
            </div>
            <button onClick={() => setSelected(null)} className="secondary-button px-3 py-1 text-sm font-bold">Хаах</button>
          </div>
          {selected.description ? <p className="mt-3 whitespace-pre-line text-slate-700">{selected.description}</p> : null}
          {selected.status ? <p className="mt-2 font-semibold text-brand-blue">{selected.status}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
