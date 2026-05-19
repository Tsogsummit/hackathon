import crypto from "node:crypto";

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), candidate);
}

export function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function randomSeed() {
  return crypto.randomBytes(8).toString("hex");
}

export function generatePassword(index) {
  return String(23456789 + ((index * 7919) % 70000000)).padStart(8, "2");
}

export function usernameFromStudent(student, used) {
  const code = String(student.student_code || student.id || "").replace(/[^a-zA-Z0-9]/g, "");
  const grade = String(student.class_name || "").toLowerCase().replace(/[^0-9a-z]/g, "");
  let base = `${grade}${code.slice(-4)}`.toLowerCase() || `student${used.size + 1}`;
  if (/^[0-9]/.test(base)) base = `s${base}`;
  let username = base;
  let suffix = 2;
  while (used.has(username)) {
    username = `${base}${suffix}`;
    suffix += 1;
  }
  used.add(username);
  return username;
}

export function sanitizeForCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}
