import fs from "node:fs";
import path from "node:path";
import { STUDENT_DATA_DIR, PLAIN_CREDENTIALS_FILE, TEACHER_USER } from "../src/config.js";
import { readDb, writeDb } from "../src/db.js";
import { generatePassword, hashPassword, sanitizeForCsv, usernameFromStudent } from "../src/security.js";

function gradeFromFilename(file) {
  const match = path.basename(file).match(/grade_(\d+)([a-z]?)/i);
  return match ? { grade: Number(match[1]), section: (match[2] || "").toUpperCase(), class_name: `${match[1]}${(match[2] || "").toUpperCase()}` } : null;
}

const db = readDb();
db.users = db.users.filter((user) => user.role !== "student" && user.id !== TEACHER_USER.id);
db.students = [];
db.classes = [];
db.credentials = [];

db.users.push({ id: TEACHER_USER.id, role: "teacher", username: TEACHER_USER.username, password_hash: hashPassword(TEACHER_USER.password), name: TEACHER_USER.name });
db.teachers = [{ id: TEACHER_USER.id, name: TEACHER_USER.name, username: TEACHER_USER.username }];

const usedUsernames = new Set(db.users.map((user) => user.username));
const credentialRows = [["class", "student_code", "family_name", "given_name", "username", "password"]];
let count = 0;

for (const file of fs.readdirSync(STUDENT_DATA_DIR).filter((name) => /^grade_(6|7|8|9|11|12)[a-z]?\.json$/i.test(name)).sort()) {
  const meta = gradeFromFilename(file);
  const payload = JSON.parse(fs.readFileSync(path.join(STUDENT_DATA_DIR, file), "utf8"));
  const className = payload.class || meta.class_name;
  db.classes.push({ id: `class-${className.toLowerCase()}`, name: className, grade: meta.grade, section: meta.section });
  for (const source of payload.students || []) {
    const student = {
      id: `student-${source.student_code}`,
      student_code: source.student_code,
      family_name: source.family_name || "",
      given_name: source.given_name || "",
      display_name: `${source.family_name || ""} ${source.given_name || ""}`.trim(),
      class_name: className,
      grade: meta.grade,
      section: meta.section,
      list_no: source.list_no,
      source_file: file
    };
    const username = usernameFromStudent(student, usedUsernames);
    const password = generatePassword(count);
    db.students.push(student);
    db.users.push({ id: student.id, role: "student", username, password_hash: hashPassword(password), student_id: student.id, name: student.display_name });
    db.credentials.push({ id: `credential-${student.id}`, student_id: student.id, username, password_exported: false, created_at: new Date().toISOString() });
    credentialRows.push([className, student.student_code, student.family_name, student.given_name, username, password]);
    count += 1;
  }
}

fs.writeFileSync(PLAIN_CREDENTIALS_FILE, credentialRows.map((row) => row.map(sanitizeForCsv).join(",")).join("\n"));
writeDb(db);

console.log(`Generated ${count} student accounts.`);
console.log(`Teacher login: ${TEACHER_USER.username} / ${TEACHER_USER.password}`);
console.log(`Credential export: ${PLAIN_CREDENTIALS_FILE}`);
