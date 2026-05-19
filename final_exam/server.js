import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDb, writeDb } from "./src/db.js";
import { verifyPassword, makeToken, sanitizeForCsv } from "./src/security.js";
import { assignAll, createInstanceForStudent, defaultExamForGrade } from "./src/assignments.js";
import { autogradeInstance } from "./src/autograder.js";
import { buildIntegrityReport } from "./src/integrityChecker.js";
import { PLAIN_CREDENTIALS_FILE } from "./src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const sessions = new Map();

function send(res, status, payload, headers = {}) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": typeof payload === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    ...headers
  });
  res.end(body);
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key]) => key)
  );
}

function currentUser(req, db) {
  const token = parseCookies(req).session;
  const session = sessions.get(token);
  if (!session) return null;
  return db.users.find((user) => user.id === session.user_id) || null;
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

function publicQuestion(question, instance) {
  if (question.type === "multiple_choice") {
    const order = instance.randomized_choice_order[question.id] || question.choices.map((choice) => choice.id);
    return {
      id: question.id,
      topic: question.topic,
      type: question.type,
      question_text: question.question_text,
      points: question.points,
      choices: order.map((id) => question.choices.find((choice) => choice.id === id)).filter(Boolean)
    };
  }
  return {
    id: question.id,
    topic: question.topic,
    type: question.type,
    question_text: question.question_text,
    points: question.points,
    starter_code: question.starter_code,
    image_url: question.image_url || "",
    block_script: question.block_script || "",
    rubric: question.rubric || []
  };
}

function examAvailability(exam) {
  const now = Date.now();
  const start = exam.availability_start ? new Date(exam.availability_start).getTime() : null;
  const end = exam.availability_end ? new Date(exam.availability_end).getTime() : null;
  if (start && now < start) {
    return { open: false, reason: "Шалгалт эхлэх цаг болоогүй байна.", starts_at: exam.availability_start, ends_at: exam.availability_end };
  }
  if (end && now > end) {
    return { open: false, reason: "Шалгалтын хугацаа дууссан байна.", starts_at: exam.availability_start, ends_at: exam.availability_end };
  }
  return { open: true, reason: "", starts_at: exam.availability_start, ends_at: exam.availability_end };
}

function teacherOnly(req, res, db) {
  const user = currentUser(req, db);
  if (!user || user.role !== "teacher") {
    send(res, 403, { error: "Багшийн эрх шаардлагатай." });
    return null;
  }
  return user;
}

function studentOnly(req, res, db) {
  const user = currentUser(req, db);
  if (!user || user.role !== "student") {
    send(res, 403, { error: "Сурагчийн эрх шаардлагатай." });
    return null;
  }
  return user;
}

function exportCsv(res, filename, rows) {
  send(
    res,
    200,
    rows.map((row) => row.map(sanitizeForCsv).join(",")).join("\n"),
    { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${filename}"` }
  );
}

function parseCredentialCsv() {
  if (!fs.existsSync(PLAIN_CREDENTIALS_FILE)) return [];
  const lines = fs.readFileSync(PLAIN_CREDENTIALS_FILE, "utf8").trim().split(/\r?\n/);
  const parseLine = (line) => {
    const values = [];
    let current = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  };
  const header = parseLine(lines.shift() || "");
  return lines.filter(Boolean).map((line) => Object.fromEntries(parseLine(line).map((value, index) => [header[index], value])));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function exportCredentialSlips(req, res, db, url) {
  if (!teacherOnly(req, res, db)) return;
  const selectedClass = url.searchParams.get("class") || "";
  const credentials = parseCredentialCsv()
    .filter((row) => !selectedClass || row.class === selectedClass)
    .sort((a, b) => `${a.class}-${a.given_name}`.localeCompare(`${b.class}-${b.given_name}`, "mn"));
  const title = selectedClass ? `${selectedClass} ангийн нэвтрэх хуудсууд` : "Бүх сурагчийн нэвтрэх хуудсууд";
  const cards = credentials
    .map(
      (row) => `
        <section class="slip">
          <h2>Шалгалтын нэвтрэх мэдээлэл</h2>
          <table>
            <tr><th>Анги</th><td>${escapeHtml(row.class)}</td></tr>
            <tr><th>Овог</th><td>${escapeHtml(row.family_name)}</td></tr>
            <tr><th>Нэр</th><td>${escapeHtml(row.given_name)}</td></tr>
            <tr><th>Сурагчийн код</th><td>${escapeHtml(row.student_code)}</td></tr>
            <tr><th>Нэвтрэх нэр</th><td class="credential">${escapeHtml(row.username)}</td></tr>
            <tr><th>Нууц үг</th><td class="credential">${escapeHtml(row.password)}</td></tr>
          </table>
        </section>`
    )
    .join("");
  const body = `<!doctype html>
  <html lang="mn">
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(title)}</title>
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 18px; font-family: Arial, sans-serif; color: #111827; }
        .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
        button { min-height: 36px; padding: 0 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }
        .sheet { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .slip { border: 1px dashed #64748b; border-radius: 6px; padding: 10px; break-inside: avoid; min-height: 180px; }
        h1 { margin: 0; font-size: 20px; }
        h2 { margin: 0 0 8px; font-size: 15px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #d7dde8; padding: 5px 7px; text-align: left; }
        th { width: 34%; background: #f8fafc; }
        .credential { font-family: Menlo, Consolas, monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.3px; }
        @media print {
          body { padding: 8mm; }
          .toolbar { display: none; }
          .sheet { grid-template-columns: repeat(2, 1fr); gap: 6mm; }
        }
      </style>
    </head>
    <body>
      <div class="toolbar"><h1>${escapeHtml(title)} (${credentials.length})</h1><button onclick="window.print()">Хэвлэх</button></div>
      <main class="sheet">${cards}</main>
    </body>
  </html>`;
  send(res, 200, body, { "content-type": "text/html; charset=utf-8" });
}

async function api(req, res) {
  const url = new URL(req.url, "http://localhost");
  const db = readDb();

  if (req.method === "POST" && url.pathname === "/api/login") {
    const { username, password } = await readJson(req);
    const user = db.users.find((candidate) => candidate.username === username);
    if (!user || !verifyPassword(password, user.password_hash)) return send(res, 401, { error: "Нэвтрэх нэр эсвэл нууц үг буруу байна." });
    const token = makeToken();
    sessions.set(token, { user_id: user.id, created_at: Date.now() });
    return send(
      res,
      200,
      { id: user.id, role: user.role, name: user.name, username: user.username },
      { "set-cookie": `session=${token}; HttpOnly; SameSite=Lax; Path=/` }
    );
  }

  if (req.method === "POST" && url.pathname === "/api/logout") {
    sessions.delete(parseCookies(req).session);
    return send(res, 200, { ok: true }, { "set-cookie": "session=; Max-Age=0; Path=/" });
  }

  if (req.method === "GET" && url.pathname === "/api/me") {
    const user = currentUser(req, db);
    return send(res, 200, { user: user ? { id: user.id, role: user.role, name: user.name, username: user.username } : null });
  }

  if (req.method === "GET" && url.pathname === "/api/teacher/dashboard") {
    if (!teacherOnly(req, res, db)) return;
    const submittedIds = new Set(db.student_exam_instances.filter((instance) => ["submitted", "auto_submitted"].includes(instance.status)).map((instance) => instance.student_id));
    return send(res, 200, {
      classes: db.classes,
      students: db.students,
      exams: db.exams,
      question_banks: db.question_banks,
      submitted_count: submittedIds.size,
      not_submitted_count: db.students.filter((student) => !submittedIds.has(student.id)).length,
      instances: db.student_exam_instances
    });
  }

  if (req.method === "POST" && url.pathname === "/api/teacher/seed") {
    if (!teacherOnly(req, res, db)) return;
    assignAll(db);
    writeDb(db);
    return send(res, 200, { ok: true, instances: db.student_exam_instances.length });
  }

  if (req.method === "POST" && url.pathname === "/api/teacher/exams") {
    if (!teacherOnly(req, res, db)) return;
    const payload = await readJson(req);
    const now = new Date().toISOString();
    const exam = {
      id: payload.id || `exam-${Date.now()}`,
      title: payload.title || "Нэргүй шалгалт",
      duration_minutes: Number(payload.duration_minutes || 60),
      grade: Number(payload.grade),
      class_name: payload.class_name || "",
      availability_start: payload.availability_start || "",
      availability_end: payload.availability_end || "",
      status: payload.status || "published",
      created_at: payload.created_at || now,
      updated_at: now
    };
    const index = db.exams.findIndex((row) => row.id === exam.id);
    if (index >= 0) db.exams[index] = exam;
    else db.exams.push(exam);
    writeDb(db);
    return send(res, 200, exam);
  }

  if (req.method === "GET" && url.pathname === "/api/teacher/submissions") {
    if (!teacherOnly(req, res, db)) return;
    return send(res, 200, {
      submissions: db.submissions,
      autograder_results: db.autograder_results,
      manual_score_edits: db.manual_score_edits,
      students: db.students,
      exams: db.exams,
      questions: db.questions,
      instances: db.student_exam_instances
    });
  }

  if (req.method === "GET" && url.pathname === "/api/teacher/integrity") {
    if (!teacherOnly(req, res, db)) return;
    return send(res, 200, buildIntegrityReport(db));
  }

  if (req.method === "POST" && url.pathname.match(/^\/api\/teacher\/submissions\/[^/]+\/score$/)) {
    const teacher = teacherOnly(req, res, db);
    if (!teacher) return;
    const submissionId = url.pathname.split("/")[4];
    const { score, comment } = await readJson(req);
    const submission = db.submissions.find((row) => row.id === submissionId);
    if (!submission) return send(res, 404, { error: "Илгээсэн шалгалт олдсонгүй." });
    const previous_score = submission.score;
    submission.score = Number(score);
    const instance = db.student_exam_instances.find((row) => row.id === submission.instance_id);
    if (instance) instance.final_score = submission.score;
    db.manual_score_edits.push({
      id: `edit-${Date.now()}`,
      submission_id: submission.id,
      teacher_id: teacher.id,
      previous_score,
      new_score: submission.score,
      comment: comment || "",
      edited_at: new Date().toISOString()
    });
    writeDb(db);
    return send(res, 200, submission);
  }

  if (req.method === "POST" && url.pathname.match(/^\/api\/teacher\/instances\/[^/]+\/reset$/)) {
    if (!teacherOnly(req, res, db)) return;
    const instanceId = url.pathname.split("/")[4];
    const instance = db.student_exam_instances.find((row) => row.id === instanceId);
    if (!instance) return send(res, 404, { error: "Сурагчийн шалгалтын хувилбар олдсонгүй." });
    instance.status = "not_started";
    instance.started_at = "";
    instance.submitted_at = "";
    instance.final_score = null;
    db.submissions = db.submissions.filter((row) => row.instance_id !== instanceId);
    db.autograder_results = db.autograder_results.filter((row) => row.instance_id !== instanceId);
    writeDb(db);
    return send(res, 200, instance);
  }

  if (req.method === "GET" && url.pathname === "/api/export/credentials") {
    if (!teacherOnly(req, res, db)) return;
    const selectedClass = url.searchParams.get("class") || "";
    const rows = [["анги", "сурагчийн код", "овог", "нэр", "нэвтрэх нэр", "нууц үг"]];
    for (const credential of parseCredentialCsv()) {
      if (selectedClass && credential.class !== selectedClass) continue;
      rows.push([credential.class, credential.student_code, credential.family_name, credential.given_name, credential.username, credential.password]);
    }
    return exportCsv(res, selectedClass ? `credentials_${selectedClass}.csv` : "credentials_all.csv", rows);
  }

  if (req.method === "GET" && url.pathname === "/api/export/credential-slips") {
    return exportCredentialSlips(req, res, db, url);
  }

  if (req.method === "GET" && url.pathname === "/api/export/results") {
    if (!teacherOnly(req, res, db)) return;
    const rows = [["class", "student_code", "name", "status", "score", "max_score", "submitted_at", "seed"]];
    for (const instance of db.student_exam_instances) {
      const student = db.students.find((row) => row.id === instance.student_id);
      const submission = db.submissions.find((row) => row.instance_id === instance.id);
      rows.push([student?.class_name, student?.student_code, student?.display_name, instance.status, instance.final_score ?? "", submission?.max_score ?? "", instance.submitted_at, instance.random_seed]);
    }
    return exportCsv(res, "exam_results.csv", rows);
  }

  if (req.method === "GET" && url.pathname === "/api/student/exam") {
    const user = studentOnly(req, res, db);
    if (!user) return;
    const student = db.students.find((row) => row.id === user.student_id);
    const exam = defaultExamForGrade(db, student.grade, student.class_name);
    if (!exam) return send(res, 404, { error: "Оноосон шалгалт олдсонгүй." });
    const instance = createInstanceForStudent(db, student, exam);
    writeDb(db);
    const availability = examAvailability(exam);
    const questions = instance.selected_question_ids.map((id) => db.questions.find((question) => question.id === id)).filter(Boolean);
    return send(res, 200, {
      student,
      exam,
      availability,
      instance,
      questions: availability.open || ["submitted", "auto_submitted"].includes(instance.status) ? questions.map((question) => publicQuestion(question, instance)) : []
    });
  }

  if (req.method === "POST" && url.pathname === "/api/student/start") {
    const user = studentOnly(req, res, db);
    if (!user) return;
    const { instance_id } = await readJson(req);
    const instance = db.student_exam_instances.find((row) => row.id === instance_id && row.student_id === user.student_id);
    if (!instance) return send(res, 404, { error: "Шалгалтын хувилбар олдсонгүй." });
    const exam = db.exams.find((row) => row.id === instance.exam_id);
    const availability = examAvailability(exam);
    if (!availability.open) return send(res, 403, { error: availability.reason });
    if (instance.status === "not_started") {
      instance.status = "in_progress";
      instance.started_at = new Date().toISOString();
    }
    writeDb(db);
    return send(res, 200, instance);
  }

  if (req.method === "POST" && url.pathname === "/api/student/autosave") {
    const user = studentOnly(req, res, db);
    if (!user) return;
    const { instance_id, answers } = await readJson(req);
    const instance = db.student_exam_instances.find((row) => row.id === instance_id && row.student_id === user.student_id);
    if (!instance) return send(res, 404, { error: "Шалгалтын хувилбар олдсонгүй." });
    if (["submitted", "auto_submitted"].includes(instance.status)) return send(res, 409, { error: "Шалгалтаа аль хэдийн илгээсэн байна." });
    const exam = db.exams.find((row) => row.id === instance.exam_id);
    const availability = examAvailability(exam);
    if (!availability.open) return send(res, 403, { error: availability.reason });
    instance.autosaved_answers = { ...instance.autosaved_answers, ...answers };
    if (instance.status === "not_started") {
      instance.status = "in_progress";
      instance.started_at = new Date().toISOString();
    }
    writeDb(db);
    return send(res, 200, { ok: true, saved_at: new Date().toISOString() });
  }

  if (req.method === "POST" && url.pathname === "/api/student/submit") {
    const user = studentOnly(req, res, db);
    if (!user) return;
    const { instance_id, answers, auto } = await readJson(req);
    const instance = db.student_exam_instances.find((row) => row.id === instance_id && row.student_id === user.student_id);
    if (!instance) return send(res, 404, { error: "Шалгалтын хувилбар олдсонгүй." });
    if (["submitted", "auto_submitted"].includes(instance.status)) return send(res, 409, { error: "Шалгалтаа аль хэдийн илгээсэн байна." });
    const exam = db.exams.find((row) => row.id === instance.exam_id);
    const availability = examAvailability(exam);
    if (!availability.open && !auto) return send(res, 403, { error: availability.reason });
    instance.autosaved_answers = { ...instance.autosaved_answers, ...answers };
    instance.status = auto ? "auto_submitted" : "submitted";
    instance.submitted_at = new Date().toISOString();
    const result = await autogradeInstance(db, instance);
    writeDb(db);
    return send(res, 200, { instance, submission: result.submission });
  }

  return send(res, 404, { error: "API зам олдсонгүй." });
}

function staticFile(req, res) {
  const url = new URL(req.url, "http://localhost");
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = path.normalize(path.join(publicDir, requested));
  if (!file.startsWith(publicDir) || !fs.existsSync(file)) {
    const fallback = path.join(publicDir, "index.html");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return fs.createReadStream(fallback).pipe(res);
  }
  const ext = path.extname(file);
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml"
  };
  res.writeHead(200, { "content-type": `${types[ext] || "application/octet-stream"}; charset=utf-8` });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    api(req, res).catch((error) => {
      console.error(error);
      send(res, 500, { error: error.message });
    });
  } else {
    staticFile(req, res);
  }
});

const port = Number(process.env.PORT || 3001);
server.listen(port, "127.0.0.1", () => {
  console.log(`Шалгалтын систем http://localhost:${port} дээр ажиллаж байна`);
});
