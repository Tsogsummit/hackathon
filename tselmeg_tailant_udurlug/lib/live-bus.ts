type LivePayload = {
  type: "stage" | "announcement";
  data: unknown;
};

type LiveSubscriber = {
  enqueue: (chunk: string) => void;
};

const subscribers = new Set<LiveSubscriber>();

export function subscribe(subscriber: LiveSubscriber) {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
}

export function publishLive(payload: LivePayload) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const subscriber of subscribers) {
    try {
      subscriber.enqueue(message);
    } catch {
      subscribers.delete(subscriber);
    }
  }
}
