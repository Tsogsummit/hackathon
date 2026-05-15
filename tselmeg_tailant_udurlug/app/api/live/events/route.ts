import { subscribe } from "@/lib/live-bus";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  let unsubscribe = () => {};
  let timer: ReturnType<typeof setInterval> | undefined;
  let closed = false;

  function cleanup() {
    closed = true;
    if (timer) clearInterval(timer);
    unsubscribe();
  }

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          cleanup();
        }
      };

      unsubscribe = subscribe({ enqueue: send });
      send(": connected\n\n");
      timer = setInterval(() => send(": ping\n\n"), 25000);
    },
    cancel() {
      cleanup();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
