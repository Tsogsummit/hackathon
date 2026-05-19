import { readDb, writeDb } from "../src/db.js";
import { buildQuestionBank } from "../src/questionBank.js";
import { ensureDefaultExams } from "../src/assignments.js";
import "./generate_scratch_assets.js";

const db = readDb();
db.questions = buildQuestionBank();
db.question_banks = [
  {
    id: "bank-grades-7-8-9-python",
    grade_group: "grades_7_8_9",
    title: "7-9-р ангийн Python програмчлал",
    question_count: db.questions.filter((question) => question.grade_group === "grades_7_8_9").length
  },
  {
    id: "bank-grades-11-12-cs50-python",
    grade_group: "grades_11_12",
    title: "11-12-р ангийн CS50 маягийн Python",
    question_count: db.questions.filter((question) => question.grade_group === "grades_11_12").length
  },
  {
    id: "bank-grade-6-scratch",
    grade_group: "grade_6_scratch",
    title: "6-р ангийн Scratch / блокон програмчлал",
    question_count: db.questions.filter((question) => question.grade_group === "grade_6_scratch").length
  }
];
ensureDefaultExams(db);
writeDb(db);

console.log(`Seeded ${db.questions.length} questions and ${db.exams.length} exams.`);
