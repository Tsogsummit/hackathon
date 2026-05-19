import test from "node:test";
import assert from "node:assert/strict";
import { shuffle, sample } from "../src/random.js";
import { buildQuestionBank } from "../src/questionBank.js";
import { emptyDb } from "../src/db.js";
import { assignAll, ensureDefaultExams } from "../src/assignments.js";

test("question bank has required counts", () => {
  const questions = buildQuestionBank();
  assert.equal(questions.filter((q) => q.grade_group === "grades_7_8_9").length, 100);
  assert.equal(questions.filter((q) => q.grade_group === "grades_11_12").length, 100);
  assert.equal(questions.filter((q) => q.grade_group === "grade_6_scratch").length, 50);
  assert.equal(questions.filter((q) => q.grade_group === "grade_6_scratch" && q.type === "multiple_choice").length, 30);
  assert.equal(questions.filter((q) => q.grade_group === "grade_6_scratch" && q.type === "block_reading").length, 15);
  assert.equal(questions.filter((q) => q.grade_group === "grade_6_scratch" && q.type === "scratch_practical").length, 5);
  assert.equal(questions.filter((q) => q.grade_group === "grades_7_8_9" && q.type === "multiple_choice").length, 80);
  assert.equal(questions.filter((q) => q.grade_group === "grades_11_12" && q.type === "write_code").length, 50);
});

test("seeded shuffle and sample are deterministic", () => {
  assert.deepEqual(shuffle([1, 2, 3, 4], "same"), shuffle([1, 2, 3, 4], "same"));
  assert.deepEqual(sample(["a", "b", "c"], 2, "student"), sample(["a", "b", "c"], 2, "student"));
});

test("assignment creates fixed question instances for supported grades", () => {
  const db = emptyDb();
  db.questions = buildQuestionBank();
  db.students = [
    { id: "s7", grade: 7 },
    { id: "s11", grade: 11 },
    { id: "s6", grade: 6 }
  ];
  ensureDefaultExams(db);
  assignAll(db);
  const grade7 = db.student_exam_instances.find((row) => row.student_id === "s7");
  const grade11 = db.student_exam_instances.find((row) => row.student_id === "s11");
  const grade6 = db.student_exam_instances.find((row) => row.student_id === "s6");
  assert.equal(grade7.selected_question_ids.length, 20);
  assert.equal(grade11.selected_question_ids.length, 20);
  assert.equal(grade6.selected_question_ids.length, 16);
  assert.equal(grade6.status, "not_started");
});
