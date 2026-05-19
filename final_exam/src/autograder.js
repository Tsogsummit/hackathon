import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { TMP_GRADING_DIR } from "./config.js";

const UNSAFE_PATTERNS = [
  /\bopen\s*\(/,
  /\beval\s*\(/,
  /\bexec\s*\(/,
  /\bcompile\s*\(/,
  /\b__import__\s*\(/,
  /\bsubprocess\b/,
  /\bsocket\b/,
  /\bpathlib\b/,
  /\bos\b/,
  /\bsys\b/,
  /\bshutil\b/,
  /\brequests\b/,
  /\burllib\b/,
  /\binput\s*=\s*/
];

export function normalizeOutput(text) {
  return String(text ?? "").replace(/\r\n/g, "\n").trimEnd();
}

export function checkUnsafeCode(code) {
  const match = UNSAFE_PATTERNS.find((pattern) => pattern.test(code));
  return match ? `Blocked unsafe code pattern: ${match}` : "";
}

function runPython(code, stdin, timeoutMs = 5000) {
  return new Promise((resolve) => {
    fs.mkdirSync(TMP_GRADING_DIR, { recursive: true });
    const filename = path.join(TMP_GRADING_DIR, `submission-${Date.now()}-${Math.random().toString(16).slice(2)}.py`);
    fs.writeFileSync(filename, code);
    const child = spawn("python3", ["-I", filename], {
      cwd: TMP_GRADING_DIR,
      stdio: ["pipe", "pipe", "pipe"],
      env: { PYTHONIOENCODING: "utf-8" }
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (codeValue) => {
      clearTimeout(timer);
      fs.rmSync(filename, { force: true });
      resolve({ stdout, stderr: timedOut ? "Timed out" : stderr, exit_code: codeValue, timed_out: timedOut });
    });
    child.stdin.end(stdin);
  });
}

export async function gradeCodeQuestion(question, code, maxPoints) {
  const unsafe = checkUnsafeCode(code || "");
  if (unsafe) {
    return {
      question_id: question.id,
      type: "write_code",
      score: 0,
      max_score: maxPoints,
      stdout: "",
      stderr: unsafe,
      tests: question.test_cases.map((testCase) => ({ ...testCase, passed: false, stdout: "", stderr: unsafe }))
    };
  }

  const tests = [];
  for (const testCase of question.test_cases) {
    const result = await runPython(code || "", testCase.input);
    const passed = normalizeOutput(result.stdout) === normalizeOutput(testCase.expected_output) && result.exit_code === 0 && !result.timed_out;
    tests.push({
      input: testCase.input,
      expected_output: testCase.expected_output,
      stdout: result.stdout,
      stderr: result.stderr,
      exit_code: result.exit_code,
      timed_out: result.timed_out,
      passed
    });
  }
  const passedCount = tests.filter((test) => test.passed).length;
  const ratio = tests.length ? passedCount / tests.length : 0;
  let score = 0;
  if (ratio === 1) score = maxPoints;
  else if (maxPoints === 3 && ratio >= 0.66) score = 2;
  else if (ratio > 0) score = 1;

  return {
    question_id: question.id,
    type: "write_code",
    score,
    max_score: maxPoints,
    stdout: tests.map((test) => test.stdout).join("\n---\n"),
    stderr: tests.map((test) => test.stderr).filter(Boolean).join("\n---\n"),
    tests
  };
}

export async function autogradeInstance(db, instance) {
  const questions = instance.selected_question_ids
    .map((id) => db.questions.find((question) => question.id === id))
    .filter(Boolean);
  const details = [];
  let total = 0;
  let maxTotal = 0;

  for (const question of questions) {
    maxTotal += question.points;
    const answer = instance.autosaved_answers[question.id];
    if (question.type === "multiple_choice") {
      const score = answer === question.correct_answer ? question.points : 0;
      total += score;
      details.push({
        question_id: question.id,
        type: "multiple_choice",
        submitted_answer: answer || "",
        correct_answer: question.correct_answer,
        score,
        max_score: question.points,
        passed: score === question.points
      });
    } else if (question.type === "write_code") {
      const result = await gradeCodeQuestion(question, answer || "", question.points);
      total += result.score;
      details.push(result);
    } else {
      details.push({
        question_id: question.id,
        type: question.type,
        submitted_answer: answer || "",
        score: 0,
        max_score: question.points,
        passed: false,
        manual_required: true,
        note: "Энэ хэсгийг багш rubric-ийн дагуу гараар дүгнэнэ."
      });
    }
  }

  const gradedAt = new Date().toISOString();
  const submission = {
    id: `submission-${instance.id}`,
    instance_id: instance.id,
    student_id: instance.student_id,
    exam_id: instance.exam_id,
    answers: instance.autosaved_answers,
    score: total,
    max_score: maxTotal,
    autograded_at: gradedAt
  };
  const existingSubmission = db.submissions.findIndex((row) => row.id === submission.id);
  if (existingSubmission >= 0) db.submissions[existingSubmission] = submission;
  else db.submissions.push(submission);

  const autograderRow = {
    id: `autograder-${instance.id}`,
    submission_id: submission.id,
    instance_id: instance.id,
    results: details,
    score: total,
    max_score: maxTotal,
    created_at: gradedAt
  };
  const existingResult = db.autograder_results.findIndex((row) => row.id === autograderRow.id);
  if (existingResult >= 0) db.autograder_results[existingResult] = autograderRow;
  else db.autograder_results.push(autograderRow);

  instance.final_score = total;
  return { submission, autograder: autograderRow };
}
