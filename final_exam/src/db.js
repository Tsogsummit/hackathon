import fs from "node:fs";
import { DATA_DIR, DB_FILE, EXPORT_DIR, TMP_GRADING_DIR } from "./config.js";

export function ensureDirs() {
  for (const dir of [DATA_DIR, EXPORT_DIR, TMP_GRADING_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function emptyDb() {
  return {
    users: [],
    students: [],
    teachers: [],
    classes: [],
    exams: [],
    question_banks: [],
    questions: [],
    student_exam_instances: [],
    answers: [],
    submissions: [],
    autograder_results: [],
    manual_score_edits: [],
    credentials: []
  };
}

export function readDb() {
  ensureDirs();
  if (!fs.existsSync(DB_FILE)) {
    const db = emptyDb();
    writeDb(db);
    return db;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

export function writeDb(db) {
  ensureDirs();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function upsertById(rows, row) {
  const index = rows.findIndex((candidate) => candidate.id === row.id);
  if (index >= 0) rows[index] = { ...rows[index], ...row };
  else rows.push(row);
}
