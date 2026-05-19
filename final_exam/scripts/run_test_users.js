import { readDb, writeDb } from "../src/db.js";
import { autogradeInstance } from "../src/autograder.js";

const TEST_STUDENTS = ["student-TEST0006", "student-TEST0011"];

function answerFor(question) {
  if (question.type === "multiple_choice") return question.correct_answer;
  if (question.type === "block_reading") return question.expected_answer || "Энэ Scratch script-ийн үйлдлийг зөв тайлбарласан.";
  if (question.type === "scratch_practical") {
    return JSON.stringify({
      link: "https://scratch.mit.edu/projects/test-frog-maze",
      fileName: "test-frog-maze.sb3"
    });
  }
  if (question.type === "write_code") {
    const cases = Object.fromEntries((question.test_cases || []).map((testCase) => [testCase.input, testCase.expected_output]));
    return [
      "lines = []",
      "while True:",
      "    try:",
      "        lines.append(input())",
      "    except EOFError:",
      "        break",
      "data = '\\n'.join(lines) + ('\\n' if lines else '')",
      `answers = ${JSON.stringify(cases, null, 2)}`,
      "print(answers.get(data, ''), end='')"
    ].join("\n");
  }
  return "";
}

const db = readDb();

for (const studentId of TEST_STUDENTS) {
  const student = db.students.find((row) => row.id === studentId);
  if (!student) throw new Error(`Test student not found: ${studentId}`);
  const instance = db.student_exam_instances.find((row) => row.student_id === studentId);
  if (!instance) throw new Error(`Test exam instance not found: ${studentId}`);
  const questions = instance.selected_question_ids.map((id) => db.questions.find((question) => question.id === id)).filter(Boolean);

  instance.autosaved_answers = Object.fromEntries(questions.map((question) => [question.id, answerFor(question)]));
  instance.status = "submitted";
  instance.started_at = instance.started_at || new Date().toISOString();
  instance.submitted_at = new Date().toISOString();

  const { submission, autograder } = await autogradeInstance(db, instance);
  const manualCount = autograder.results.filter((result) => result.manual_required).length;
  const passedCount = autograder.results.filter((result) => result.passed).length;
  console.log(`${student.class_name} ${student.display_name}: ${submission.score}/${submission.max_score}, passed=${passedCount}, manual=${manualCount}`);
}

writeDb(db);
