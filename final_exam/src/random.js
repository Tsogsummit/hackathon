import crypto from "node:crypto";

export function seedToNumber(seed) {
  const hash = crypto.createHash("sha256").update(String(seed)).digest();
  return hash.readUInt32BE(0);
}

export function seededRandom(seed) {
  let state = seedToNumber(seed) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function shuffle(items, seed) {
  const next = seededRandom(seed);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function sample(items, count, seed) {
  return shuffle(items, seed).slice(0, count);
}
