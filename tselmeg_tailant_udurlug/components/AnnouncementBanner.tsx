"use client";

import { Megaphone } from "lucide-react";
import { useEffect, useState } from "react";

type Announcement = { title?: string | null; body: string; enabled: boolean } | null;

export function AnnouncementBanner({ initial }: { initial: Announcement }) {
  const [announcement, setAnnouncement] = useState(initial);

  useEffect(() => {
    const events = new EventSource("/api/live/events");
    events.onmessage = (message) => {
      const payload = JSON.parse(message.data);
      if (payload.type === "announcement") setAnnouncement(payload.data);
    };
    return () => events.close();
  }, []);

  if (!announcement?.enabled) return null;
  return (
    <div className="surface-card mb-5 flex items-start gap-3 border-brand-red/20 px-4 py-3 text-sm font-semibold text-brand-navy">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-red text-white">
        <Megaphone size={17} />
      </span>
      <p>
        {announcement.title ? <span className="mr-2 font-black text-brand-red">{announcement.title}</span> : null}
        {announcement.body}
      </p>
    </div>
  );
}
