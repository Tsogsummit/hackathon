import fs from "node:fs";
import { readDb, writeDb } from "../src/db.js";
import { createInstanceForStudent } from "../src/assignments.js";
import { hashPassword, sanitizeForCsv } from "../src/security.js";
import { PLAIN_CREDENTIALS_FILE } from "../src/config.js";

const TEST_USERS = [
  {
    grade: 6,
    className: "TEST6",
    studentId: "student-TEST0006",
    studentCode: "TEST0006",
    examId: "exam-test-grade-6",
    username: "test6",
    password: "66666666",
    familyName: "Тест",
    givenName: "Зургаа",
    examTitle: "Тест 6-р ангийн Scratch шалгалт",
    duration: 45
  },
  {
    grade: 7,
    className: "TEST7",
    studentId: "student-TEST0001",
    studentCode: "TEST0001",
    examId: "exam-test-grade-7",
    username: "test7",
    password: "77777777",
    familyName: "Тест",
    givenName: "Сурагч",
    examTitle: "Тест 7-р ангийн Python шалгалт",
    duration: 45
  },
  {
    grade: 11,
    className: "TEST11",
    studentId: "student-TEST0011",
    studentCode: "TEST0011",
    examId: "exam-test-grade-11",
    username: "test11",
    password: "11111111",
    familyName: "Тест",
    givenName: "Арваннэг",
    examTitle: "Тест 11-р ангийн Python шалгалт",
    duration: 60
  }
];

const db = readDb();
const now = new Date().toISOString();

function upsert(rows, row) {
  const index = rows.findIndex((candidate) => candidate.id === row.id);
  if (index >= 0) rows[index] = { ...rows[index], ...row };
  else rows.push(row);
}

for (const testUser of TEST_USERS) {
  upsert(db.classes, {
    id: `class-${testUser.className.toLowerCase()}`,
    name: testUser.className,
    grade: testUser.grade,
    section: "TEST"
  });

  const student = {
    id: testUser.studentId,
    student_code: testUser.studentCode,
    family_name: testUser.familyName,
    given_name: testUser.givenName,
    display_name: `${testUser.familyName} ${testUser.givenName}`,
    class_name: testUser.className,
    grade: testUser.grade,
    section: "TEST",
    list_no: 1,
    source_file: "generated-test-user"
  };
  upsert(db.students, student);

  upsert(db.users, {
    id: testUser.studentId,
    role: "student",
    username: testUser.username,
    password_hash: hashPassword(testUser.password),
    student_id: testUser.studentId,
    name: student.display_name
  });

  upsert(db.credentials, {
    id: `credential-${testUser.studentId}`,
    student_id: testUser.studentId,
    username: testUser.username,
    password_exported: false,
    created_at: now
  });

  upsert(db.exams, {
    id: testUser.examId,
    title: testUser.examTitle,
    duration_minutes: testUser.duration,
    grade: testUser.grade,
    class_name: testUser.className,
    availability_start: "",
    availability_end: "",
    status: "published",
    created_at: db.exams.find((exam) => exam.id === testUser.examId)?.created_at || now,
    updated_at: now
  });

  const exam = db.exams.find((row) => row.id === testUser.examId);
  db.student_exam_instances = db.student_exam_instances.filter(
    (instance) => !(instance.student_id === testUser.studentId && instance.exam_id !== testUser.examId)
  );
  createInstanceForStudent(db, student, exam);
}
writeDb(db);

if (fs.existsSync(PLAIN_CREDENTIALS_FILE)) {
  const csv = fs.readFileSync(PLAIN_CREDENTIALS_FILE, "utf8");
  const withoutOldTest = csv
    .split(/\r?\n/)
    .filter((line) => line && !TEST_USERS.some((testUser) => line.includes(`"${testUser.className}","${testUser.studentCode}"`)));
  for (const testUser of TEST_USERS) {
    withoutOldTest.push([testUser.className, testUser.studentCode, testUser.familyName, testUser.givenName, testUser.username, testUser.password].map(sanitizeForCsv).join(","));
  }
  fs.writeFileSync(PLAIN_CREDENTIALS_FILE, `${withoutOldTest.join("\n")}\n`);
}

for (const testUser of TEST_USERS) {
  console.log(`Created test class ${testUser.className}`);
  console.log(`Created test student: ${testUser.username} / ${testUser.password}`);
  console.log(`Created test exam: ${testUser.examTitle}`);
}
