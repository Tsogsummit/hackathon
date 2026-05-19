import { randomSeed } from "./security.js";
import { sample, shuffle } from "./random.js";
import { gradeGroupForGrade, topicsForGroup } from "./questionBank.js";

export function defaultExamForGrade(db, grade, className = "") {
  const numericGrade = Number(grade);
  return (
    db.exams.find((exam) => Number(exam.grade) === numericGrade && exam.class_name && exam.class_name === className) ||
    db.exams.find((exam) => Number(exam.grade) === numericGrade && !exam.class_name)
  );
}

export function ensureDefaultExams(db) {
  const now = new Date().toISOString();
  for (const grade of [6, 7, 8, 9, 11, 12]) {
    if (!defaultExamForGrade(db, grade)) {
      db.exams.push({
        id: `exam-grade-${grade}`,
        title: grade === 6 ? "6-р ангийн Scratch төгсөлтийн шалгалт" : `${grade}-р ангийн Python төгсөлтийн шалгалт`,
        duration_minutes: grade === 6 ? 45 : 60,
        grade,
        class_name: "",
        availability_start: "",
        availability_end: "",
        status: "published",
        created_at: now,
        updated_at: now
      });
    }
  }
}

export function createInstanceForStudent(db, student, exam) {
  const existing = db.student_exam_instances.find(
    (instance) => instance.student_id === student.id && instance.exam_id === exam.id
  );
  if (existing) return existing;

  const seed = randomSeed();
  const group = gradeGroupForGrade(student.grade);
  const topics = topicsForGroup(group);
  const selected = [];

  if (group === "grade_6_scratch") {
    selected.push(
      ...sample(
        db.questions.filter((q) => q.grade_group === group && q.type === "multiple_choice"),
        10,
        `${seed}-grade6-mc`
      )
    );
    selected.push(
      ...sample(
        db.questions.filter((q) => q.grade_group === group && q.type === "block_reading"),
        5,
        `${seed}-grade6-block`
      )
    );
    selected.push(
      ...sample(
        db.questions.filter((q) => q.grade_group === group && q.type === "scratch_practical"),
        1,
        `${seed}-grade6-practical`
      )
    );
  }

  if (group === "grades_7_8_9") {
    for (const topic of topics) {
      selected.push(
        ...sample(
          db.questions.filter((q) => q.grade_group === group && q.topic === topic && q.type === "multiple_choice"),
          3,
          `${seed}-${topic}-mc`
        )
      );
      selected.push(
        ...sample(
          db.questions.filter((q) => q.grade_group === group && q.topic === topic && q.type === "write_code"),
          1,
          `${seed}-${topic}-code`
        )
      );
    }
  }

  if (group === "grades_11_12") {
    for (const topic of topics) {
      selected.push(
        ...sample(
          db.questions.filter((q) => q.grade_group === group && q.topic === topic && q.type === "multiple_choice"),
          2,
          `${seed}-${topic}-mc`
        )
      );
      selected.push(
        ...sample(
          db.questions.filter((q) => q.grade_group === group && q.topic === topic && q.type === "write_code"),
          2,
          `${seed}-${topic}-code`
        )
      );
    }
  }

  const ordered = shuffle(selected, `${seed}-question-order`);
  const randomized_choice_order = {};
  for (const question of ordered) {
    if (question.type === "multiple_choice") {
      randomized_choice_order[question.id] = shuffle(
        question.choices.map((choice) => choice.id),
        `${seed}-${question.id}-choices`
      );
    }
  }

  const instance = {
    id: `instance-${student.id}-${exam.id}`,
    student_id: student.id,
    exam_id: exam.id,
    selected_question_ids: ordered.map((question) => question.id),
    randomized_choice_order,
    random_seed: seed,
    started_at: "",
    submitted_at: "",
    autosaved_answers: {},
    final_score: null,
    status: selected.length ? "not_started" : "not_available"
  };
  db.student_exam_instances.push(instance);
  return instance;
}

export function assignAll(db) {
  ensureDefaultExams(db);
  for (const student of db.students) {
    const exam = defaultExamForGrade(db, student.grade, student.class_name);
    if (exam) createInstanceForStudent(db, student, exam);
  }
}
