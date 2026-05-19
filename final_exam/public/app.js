const app = document.querySelector("#app");

const tabLabels = {
  overview: "Ерөнхий",
  exams: "Шалгалтууд",
  students: "Сурагчид",
  submissions: "Илгээсэн",
  integrity: "Шалгагч",
  banks: "Асуултын сан"
};

const roleLabels = {
  teacher: "Багш",
  student: "Сурагч"
};

const statusLabels = {
  not_started: "Эхлээгүй",
  in_progress: "Хийж байна",
  submitted: "Илгээсэн",
  auto_submitted: "Автоматаар илгээсэн",
  not_available: "Бэлэн биш"
};

const groupLabels = {
  grade_6_scratch: "6-р анги Scratch",
  grades_7_8_9: "7-9-р анги",
  grades_11_12: "11-12-р анги",
  grade_6_pending: "6-р анги (агуулга хүлээгдэж байна)"
};

const questionTypeLabels = {
  multiple_choice: "Сонгох тест",
  write_code: "Код бичих",
  block_reading: "Блок унших",
  scratch_practical: "Scratch засварлах"
};

let state = {
  user: null,
  teacher: null,
  submissions: null,
  integrity: null,
  studentExam: null,
  selectedSubmissionId: "",
  exportClass: "",
  integrityClass: "",
  questionBankGroup: "",
  questionBankType: "",
  tab: "overview",
  answers: {},
  savedAt: "",
  timerId: null
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  const type = response.headers.get("content-type") || "";
  const payload = type.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw new Error(payload.error || payload || "Хүсэлт амжилтгүй боллоо");
  return payload;
}

function html(strings, ...values) {
  return strings.map((part, index) => part + (values[index] ?? "")).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function formatDateTime(value) {
  if (!value) return "Тохируулаагүй";
  return new Date(value).toLocaleString("mn-MN");
}

function exportUrl(path) {
  return state.exportClass ? `${path}?class=${encodeURIComponent(state.exportClass)}` : path;
}

function localInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

async function loadMe() {
  const { user } = await api("/api/me");
  state.user = user;
  if (!user) return renderLogin();
  if (user.role === "teacher") return loadTeacher();
  return loadStudent();
}

function renderShell(inner) {
  app.innerHTML = html`
    <div class="shell">
      <header class="topbar">
        <div>
          <div class="brand">Цэлмэг төгсөлтийн шалгалт</div>
          <div class="muted">${escapeHtml(state.user?.name || "")} · ${escapeHtml(roleLabels[state.user?.role] || "")}</div>
        </div>
        <div class="row">
          ${state.user?.role === "student" ? `<div class="timer" id="timer"></div><div class="muted" id="saved">${state.savedAt ? `Хадгалсан: ${state.savedAt}` : ""}</div>` : ""}
          <button id="logout">Гарах</button>
        </div>
      </header>
      <section class="content">${inner}</section>
    </div>`;
  document.querySelector("#logout").onclick = async () => {
    await api("/api/logout", { method: "POST" });
    location.reload();
  };
}

function renderLogin(error = "") {
  app.innerHTML = html`
    <section class="login">
      <form class="login-panel stack" id="login-form">
        <div>
          <h1>Шалгалтын системд нэвтрэх</h1>
          <p class="muted">Багш болон сурагч өөрийн эрхээр нэвтэрнэ.</p>
        </div>
        ${error ? `<div class="badge bad">${escapeHtml(error)}</div>` : ""}
        <label>Нэвтрэх нэр<input name="username" autocomplete="username" required /></label>
        <label>Нууц үг<input name="password" type="password" autocomplete="current-password" required /></label>
        <button class="primary">Нэвтрэх</button>
        <p class="muted">Багшийн эрх: admin / admin-tselmeg-2026</p>
      </form>
    </section>`;
  document.querySelector("#login-form").onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      state.user = await api("/api/login", { method: "POST", body: Object.fromEntries(form.entries()) });
      if (state.user.role === "teacher") await loadTeacher();
      else await loadStudent();
    } catch (errorValue) {
      renderLogin(errorValue.message);
    }
  };
}

async function loadTeacher() {
  state.teacher = await api("/api/teacher/dashboard");
  state.submissions = await api("/api/teacher/submissions");
  try {
    state.integrity = await api("/api/teacher/integrity");
  } catch (error) {
    state.integrity = { classes: [], reports: [], note: `Шалгагчийн тайлан түр ачаалсангүй: ${error.message}` };
  }
  renderTeacher();
}

function statusBadge(status) {
  const cls = status === "submitted" || status === "auto_submitted" ? "good" : status === "in_progress" ? "warn" : status === "not_available" ? "bad" : "";
  return `<span class="badge ${cls}">${escapeHtml(statusLabels[status] || status)}</span>`;
}

function renderTeacher() {
  const data = state.teacher;
  const submittedRows = data.instances.map((instance) => {
    const student = data.students.find((row) => row.id === instance.student_id);
    const submission = state.submissions.submissions.find((row) => row.instance_id === instance.id);
    return { instance, student, submission };
  });

  renderShell(html`
    <div class="tabs">
      ${Object.entries(tabLabels).map(([tab, label]) => `<button class="${state.tab === tab ? "active" : ""}" data-tab="${tab}">${label}</button>`).join("")}
    </div>
    <div id="teacher-view"></div>`);

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.onclick = () => {
      state.tab = button.dataset.tab;
      renderTeacher();
    };
  });

  const view = document.querySelector("#teacher-view");
  if (state.tab === "overview") renderTeacherOverview(view, data);
  if (state.tab === "exams") renderTeacherExams(view, data);
  if (state.tab === "students") renderTeacherStudents(view, submittedRows);
  if (state.tab === "submissions") renderTeacherSubmissions(view, submittedRows);
  if (state.tab === "integrity") renderTeacherIntegrity(view);
  if (state.tab === "banks") renderTeacherBanks(view, data);
}

function renderTeacherOverview(view, data) {
  const classOptions = [...data.classes]
    .sort((a, b) => a.name.localeCompare(b.name, "mn"))
    .map((item) => `<option value="${escapeHtml(item.name)}" ${state.exportClass === item.name ? "selected" : ""}>${escapeHtml(item.name)}</option>`)
    .join("");
  view.innerHTML = html`
    <div class="grid">
      <div class="card span-3"><div class="muted">Нийт сурагч</div><div class="stat">${data.students.length}</div></div>
      <div class="card span-3"><div class="muted">Илгээсэн</div><div class="stat">${data.submitted_count}</div></div>
      <div class="card span-3"><div class="muted">Илгээгээгүй</div><div class="stat">${data.not_submitted_count}</div></div>
      <div class="card span-3"><div class="muted">Асуултын сан</div><div class="stat">${data.question_banks.length}</div></div>
      <div class="card span-12 row">
        <button class="primary" id="assign">Сурагчдын шалгалтын хувилбарыг үүсгэх/ачаалах</button>
        <label style="max-width:220px">Экспортлох анги
          <select id="export-class"><option value="">Бүх анги</option>${classOptions}</select>
        </label>
        <button id="export-credentials">CSV нэвтрэх мэдээлэл</button>
        <button id="print-slips">Хайчилж өгөх нэвтрэх хуудсууд</button>
        <button onclick="window.location.href='/api/export/results'">Дүн экспортлох</button>
      </div>
    </div>`;
  document.querySelector("#assign").onclick = async () => {
    await api("/api/teacher/seed", { method: "POST" });
    await loadTeacher();
  };
  document.querySelector("#export-class").onchange = (event) => {
    state.exportClass = event.target.value;
  };
  document.querySelector("#export-credentials").onclick = () => {
    window.location.href = exportUrl("/api/export/credentials");
  };
  document.querySelector("#print-slips").onclick = () => {
    window.open(exportUrl("/api/export/credential-slips"), "_blank");
  };
}

function renderTeacherExams(view, data) {
  const current = data.exams.find((exam) => exam.id === document.querySelector("#exam-id")?.value) || data.exams[0] || {};
  view.innerHTML = html`
    <div class="grid">
      <form class="card span-4 stack" id="exam-form">
        <h2>Шалгалтын тохиргоо</h2>
        <input type="hidden" id="exam-id" name="id" value="${escapeHtml(current.id || "")}" />
        <label>Шалгалтын нэр<input name="title" required value="${escapeHtml(current.title || "Python төгсөлтийн шалгалт")}" /></label>
        <label>Анги<select name="grade">${[6, 7, 8, 9, 11, 12].map((grade) => `<option ${Number(current.grade) === grade ? "selected" : ""}>${grade}</option>`).join("")}</select></label>
        <label>Үргэлжлэх хугацаа /минут/<input name="duration_minutes" type="number" min="5" value="${escapeHtml(current.duration_minutes || 60)}" /></label>
        <label>Эхлэх өдөр, цаг<input name="availability_start" type="datetime-local" value="${localInputValue(current.availability_start)}" /></label>
        <label>Дуусах өдөр, цаг<input name="availability_end" type="datetime-local" value="${localInputValue(current.availability_end)}" /></label>
        <label>Төлөв<select name="status"><option value="published" ${current.status !== "draft" ? "selected" : ""}>Нээлттэй</option><option value="draft" ${current.status === "draft" ? "selected" : ""}>Ноорог</option></select></label>
        <button class="primary">Хадгалах</button>
      </form>
      <div class="card span-8">
        <h2>Бүх шалгалт</h2>
        <table><thead><tr><th>Нэр</th><th>Анги</th><th>Хугацаа</th><th>Эхлэх</th><th>Дуусах</th><th></th></tr></thead><tbody>
        ${data.exams.map((exam) => `<tr>
          <td>${escapeHtml(exam.title)}</td>
          <td>${exam.grade}</td>
          <td>${exam.duration_minutes} мин</td>
          <td>${formatDateTime(exam.availability_start)}</td>
          <td>${formatDateTime(exam.availability_end)}</td>
          <td><button data-edit-exam="${exam.id}">Засах</button></td>
        </tr>`).join("")}
        </tbody></table>
      </div>
    </div>`;
  document.querySelectorAll("[data-edit-exam]").forEach((button) => {
    button.onclick = () => {
      const exam = data.exams.find((row) => row.id === button.dataset.editExam);
      document.querySelector("#exam-id").value = exam.id;
      document.querySelector("[name='title']").value = exam.title;
      document.querySelector("[name='grade']").value = exam.grade;
      document.querySelector("[name='duration_minutes']").value = exam.duration_minutes;
      document.querySelector("[name='availability_start']").value = localInputValue(exam.availability_start);
      document.querySelector("[name='availability_end']").value = localInputValue(exam.availability_end);
      document.querySelector("[name='status']").value = exam.status;
    };
  });
  document.querySelector("#exam-form").onsubmit = async (event) => {
    event.preventDefault();
    await api("/api/teacher/exams", { method: "POST", body: Object.fromEntries(new FormData(event.currentTarget).entries()) });
    await loadTeacher();
  };
}

function renderTeacherStudents(view, submittedRows) {
  view.innerHTML = html`
    <div class="card">
      <h2>Сурагчид</h2>
      <table><thead><tr><th>Анги</th><th>Код</th><th>Нэр</th><th>Төлөв</th><th>Санамсаргүй seed</th></tr></thead><tbody>
      ${submittedRows.map(({ instance, student }) => `<tr><td>${student?.class_name}</td><td>${student?.student_code}</td><td>${escapeHtml(student?.display_name)}</td><td>${statusBadge(instance.status)}</td><td>${escapeHtml(instance.random_seed)}</td></tr>`).join("")}
      </tbody></table>
    </div>`;
}

function renderTeacherSubmissions(view, submittedRows) {
  const selected = state.submissions.submissions.find((row) => row.id === state.selectedSubmissionId) || state.submissions.submissions[0];
  const detail = selected && state.submissions.autograder_results.find((row) => row.submission_id === selected.id);
  if (selected) state.selectedSubmissionId = selected.id;
  view.innerHTML = html`
    <div class="grid">
      <div class="card span-5 detail-panel">
        <h2>Дүнгийн жагсаалт</h2>
        <table><thead><tr><th>Сурагч</th><th>Төлөв</th><th>Оноо</th><th></th></tr></thead><tbody>
        ${submittedRows.map(({ instance, student, submission }) => `<tr>
          <td>${escapeHtml(student?.display_name)}<br><span class="muted">${student?.class_name}</span></td>
          <td>${statusBadge(instance.status)}</td>
          <td>${submission ? `${submission.score}/${submission.max_score}` : ""}</td>
          <td>${submission ? `<button data-sub="${submission.id}">Нээх</button>` : `<button data-reset="${instance.id}">Дахин нээх</button>`}</td>
        </tr>`).join("")}
        </tbody></table>
      </div>
      <div class="card span-7 detail-panel">
        ${selected ? submissionDetail(selected, detail) : "<h2>Одоогоор илгээсэн шалгалт алга</h2>"}
      </div>
    </div>`;
  document.querySelectorAll("[data-sub]").forEach((button) => {
    button.onclick = () => {
      state.selectedSubmissionId = button.dataset.sub;
      renderTeacher();
    };
  });
  document.querySelectorAll("[data-reset]").forEach((button) => {
    button.onclick = async () => {
      if (confirm("Энэ сурагчийн илгээсэн шалгалтыг дахин нээх үү?")) {
        await api(`/api/teacher/instances/${button.dataset.reset}/reset`, { method: "POST" });
        await loadTeacher();
      }
    };
  });
  const scoreForm = document.querySelector("#score-form");
  if (scoreForm) {
    scoreForm.onsubmit = async (event) => {
      event.preventDefault();
      await api(`/api/teacher/submissions/${selected.id}/score`, { method: "POST", body: Object.fromEntries(new FormData(event.currentTarget).entries()) });
      await loadTeacher();
    };
  }
}

function probabilityBadge(value) {
  const cls = value >= 75 ? "bad" : value >= 45 ? "warn" : "good";
  return `<span class="badge ${cls}">${value}%</span>`;
}

function renderTeacherIntegrity(view) {
  const data = state.integrity || { classes: [], reports: [], note: "" };
  const classes = data.classes || [];
  if (!state.integrityClass && classes.length) state.integrityClass = classes[0];
  const reports = (data.reports || [])
    .filter((row) => !state.integrityClass || row.class_name === state.integrityClass)
    .sort((a, b) => Math.max(b.copy_probability, b.ai_probability) - Math.max(a.copy_probability, a.ai_probability));
  const highCount = reports.filter((row) => row.copy_probability >= 75 || row.ai_probability >= 75).length;
  const classOptions = classes
    .map((className) => `<option value="${escapeHtml(className)}" ${state.integrityClass === className ? "selected" : ""}>${escapeHtml(className)}</option>`)
    .join("");

  view.innerHTML = html`
    <div class="grid">
      <div class="card span-12">
        <div class="row between">
          <div>
            <h2>Хуулалт ба AI ашиглалт шалгагч</h2>
            <p class="muted">${escapeHtml(data.note || "Энэ хэсэг нь зөвхөн магадлал харуулна. Дүнд автоматаар нөлөөлөхгүй.")}</p>
          </div>
          <span class="badge ${highCount ? "warn" : "good"}">${highCount} өндөр анхаарах дохио</span>
        </div>
        <div class="row">
          <label style="max-width:240px">Анги
            <select id="integrity-class">${classOptions}</select>
          </label>
          <span class="muted">Илгээсэн шалгалттай ${reports.length} сурагчийг харуулж байна.</span>
        </div>
      </div>
      <div class="card span-12">
        <table>
          <thead><tr><th>Сурагч</th><th>Шалгалт</th><th>Хуулсан байж магадгүй</th><th>Хэнээс байж болох</th><th>AI ашигласан байж магадгүй</th><th>Товч тайлбар</th></tr></thead>
          <tbody>
          ${reports.length ? reports.map((row) => `<tr>
            <td>${escapeHtml(row.student_name)}<br><span class="muted">${escapeHtml(row.student_code)} · ${escapeHtml(row.class_name)}</span></td>
            <td>${escapeHtml(row.exam_title)}<br><span class="muted">${row.score}/${row.max_score} · ${formatDateTime(row.submitted_at)}</span></td>
            <td>${probabilityBadge(row.copy_probability)}</td>
            <td>${row.possible_source ? `${escapeHtml(row.possible_source.student_name)}<br><span class="muted">${escapeHtml(row.possible_source.student_code)} · төстэй ${row.possible_source.similarity_percent}% · нийтлэг ${row.possible_source.shared_answers}</span>` : `<span class="muted">Одоогоор илрээгүй</span>`}</td>
            <td>${probabilityBadge(row.ai_probability)}</td>
            <td>${(row.notes || []).map((note) => `<div class="integrity-note">${escapeHtml(note)}</div>`).join("")}</td>
          </tr>`).join("") : `<tr><td colspan="6" class="muted">Энэ ангид илгээсэн шалгалт алга.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

  document.querySelector("#integrity-class").onchange = (event) => {
    state.integrityClass = event.target.value;
    renderTeacher();
  };
}

function renderTeacherBanks(view, data) {
  const questions = state.submissions?.questions || [];
  const filteredQuestions = questions
    .filter((question) => !state.questionBankGroup || question.grade_group === state.questionBankGroup)
    .filter((question) => !state.questionBankType || question.type === state.questionBankType)
    .sort((a, b) => `${a.grade_group}-${a.topic}-${a.type}-${a.id}`.localeCompare(`${b.grade_group}-${b.topic}-${b.type}-${b.id}`, "mn"));
  const groupOptions = [...new Set(questions.map((question) => question.grade_group))]
    .sort()
    .map((group) => `<option value="${escapeHtml(group)}" ${state.questionBankGroup === group ? "selected" : ""}>${escapeHtml(groupLabels[group] || group)}</option>`)
    .join("");
  const typeOptions = [...new Set(questions.map((question) => question.type))]
    .sort()
    .map((type) => `<option value="${escapeHtml(type)}" ${state.questionBankType === type ? "selected" : ""}>${escapeHtml(questionTypeLabels[type] || type)}</option>`)
    .join("");
  view.innerHTML = html`
    <div class="grid">
      <div class="card span-12">
        <div class="row between">
          <div>
            <h2>Асуултын сан</h2>
            <p class="muted">Админ бүх асуулт, зөв хариулт, rubric болон test case-ийн мэдээллийг эндээс харна.</p>
          </div>
          <span class="badge">${filteredQuestions.length}/${questions.length} асуулт</span>
        </div>
        <table><thead><tr><th>Сан</th><th>Ангийн бүлэг</th><th>Асуултын тоо</th></tr></thead><tbody>
        ${data.question_banks.map((bank) => `<tr><td>${escapeHtml(bank.title)}</td><td>${escapeHtml(groupLabels[bank.grade_group] || bank.grade_group)}</td><td>${bank.question_count}</td></tr>`).join("")}
        </tbody></table>
      </div>
      <div class="card span-12">
        <div class="row">
          <label style="max-width:260px">Ангийн бүлэг
            <select id="question-bank-group"><option value="">Бүх бүлэг</option>${groupOptions}</select>
          </label>
          <label style="max-width:220px">Асуултын төрөл
            <select id="question-bank-type"><option value="">Бүх төрөл</option>${typeOptions}</select>
          </label>
          <button id="question-bank-clear">Шүүлт цэвэрлэх</button>
        </div>
      </div>
      <div class="span-12 question-bank-list">
        ${filteredQuestions.map((question, index) => renderQuestionBankItem(question, index + 1)).join("")}
      </div>
    </div>`;

  document.querySelector("#question-bank-group").onchange = (event) => {
    state.questionBankGroup = event.target.value;
    renderTeacher();
  };
  document.querySelector("#question-bank-type").onchange = (event) => {
    state.questionBankType = event.target.value;
    renderTeacher();
  };
  document.querySelector("#question-bank-clear").onclick = () => {
    state.questionBankGroup = "";
    state.questionBankType = "";
    renderTeacher();
  };
}

function renderQuestionBankItem(question, number) {
  const typeLabel = questionTypeLabels[question.type] || question.type;
  return html`
    <details class="card question-bank-item">
      <summary>
        <span><strong>${number}. ${escapeHtml(question.topic)}</strong><br><span class="muted">${escapeHtml(groupLabels[question.grade_group] || question.grade_group)} · ${escapeHtml(typeLabel)} · ${question.points} оноо</span></span>
        <span class="badge">${escapeHtml(question.id)}</span>
      </summary>
      <div class="question-bank-body">
        <p>${escapeHtml(question.question_text)}</p>
        ${question.image_url ? `<img class="scratch-image" src="${escapeHtml(question.image_url)}" alt="Асуултын зураг" />` : ""}
        ${renderQuestionBankAnswer(question)}
      </div>
    </details>`;
}

function renderQuestionBankAnswer(question) {
  if (question.type === "multiple_choice") {
    return html`
      <table>
        <tr><th>Зөв хариулт</th><td>${escapeHtml(choiceText(question, question.correct_answer))}</td></tr>
      </table>
      <div class="stack" style="margin-top:10px">
        ${(question.choices || []).map((choice) => `<div class="choice-review ${choice.id === question.correct_answer ? "correct" : ""}">${escapeHtml(choice.text)} ${choice.id === question.correct_answer ? "<strong>зөв</strong>" : ""}</div>`).join("")}
      </div>`;
  }
  if (question.type === "block_reading") {
    return html`
      ${question.block_script ? `<h4>Block script</h4><pre class="code">${escapeHtml(question.block_script)}</pre>` : ""}
      <table>
        <tr><th>Хүлээгдэж буй хариулт</th><td>${escapeHtml(question.expected_answer || question.explanation || "")}</td></tr>
      </table>`;
  }
  if (question.type === "scratch_practical") {
    return html`
      <h4>Үнэлгээний rubric</h4>
      <ul>${(question.rubric || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }
  return html`
    ${question.starter_code ? `<h4>Starter code</h4><pre class="code">${escapeHtml(question.starter_code)}</pre>` : ""}
    <h4>Автомат шалгалтын test case</h4>
    ${(question.test_cases || []).map((test, index) => `<table style="margin-bottom:10px">
      <tr><th>#</th><td>${index + 1}</td></tr>
      <tr><th>Оролт</th><td><pre>${escapeHtml(test.input)}</pre></td></tr>
      <tr><th>Хүлээгдсэн гаралт</th><td><pre>${escapeHtml(test.expected_output)}</pre></td></tr>
    </table>`).join("")}`;
}

function submissionDetail(submission, detail) {
  const student = state.submissions.students.find((row) => row.id === submission.student_id);
  const instance = state.submissions.instances.find((row) => row.id === submission.instance_id);
  const exam = state.submissions.exams.find((row) => row.id === submission.exam_id);
  const edits = state.submissions.manual_score_edits.filter((row) => row.submission_id === submission.id);
  const questions = (instance?.selected_question_ids || [])
    .map((id) => state.submissions.questions.find((question) => question.id === id))
    .filter(Boolean);
  const resultByQuestion = Object.fromEntries((detail?.results || []).map((result) => [result.question_id, result]));
  return html`
    <h2>${escapeHtml(student?.display_name)}</h2>
    <p class="muted">${escapeHtml(student?.class_name)} · ${escapeHtml(exam?.title || "")} · Автомат шалгалтын оноо ${submission.score}/${submission.max_score}</p>
    <form class="row" id="score-form">
      <input name="score" type="number" min="0" max="${submission.max_score}" step="0.5" value="${submission.score}" style="max-width:120px" />
      <input name="comment" placeholder="Багшийн тайлбар" />
      <button class="primary">Оноо хадгалах</button>
    </form>
    <h3>Сурагчийн хариулт ба оноо</h3>
    ${questions.map((question, index) => questionReview(question, index + 1, submission.answers?.[question.id], resultByQuestion[question.id], instance)).join("")}
    <h3>Оноо засварласан түүх</h3>
    ${edits.length ? edits.map((edit) => `<p>${edit.previous_score} → ${edit.new_score} · ${escapeHtml(edit.comment)} · <span class="muted">${edit.edited_at}</span></p>`).join("") : `<p class="muted">Гараар зассан түүх алга.</p>`}`;
}

function choiceText(question, choiceId) {
  return question.choices?.find((choice) => choice.id === choiceId)?.text || choiceId || "Хариулаагүй";
}

function questionReview(question, number, answer, result, instance) {
  const earned = result?.score ?? 0;
  const max = result?.max_score ?? question.points;
  const badge = earned === max ? "good" : earned > 0 ? "warn" : "bad";
  if (question.type === "multiple_choice") {
    const order = instance?.randomized_choice_order?.[question.id] || question.choices.map((choice) => choice.id);
    return html`
      <div class="question">
        <div class="row between">
          <strong>${number}. ${escapeHtml(question.topic)}</strong>
          <span class="badge ${badge}">${earned}/${max} оноо · ${result?.passed ? "Зөв" : "Буруу"}</span>
        </div>
        <p>${escapeHtml(question.question_text)}</p>
        <table>
          <tr><th>Сурагчийн хариулт</th><td>${escapeHtml(choiceText(question, answer))}</td></tr>
          <tr><th>Зөв хариулт</th><td>${escapeHtml(choiceText(question, question.correct_answer))}</td></tr>
        </table>
        <div class="stack" style="margin-top:10px">
          ${order.map((choiceId) => {
            const choice = question.choices.find((item) => item.id === choiceId);
            const marker = choiceId === question.correct_answer ? "✓ зөв" : choiceId === answer ? "сурагч сонгосон" : "";
            return `<div class="choice-review ${choiceId === question.correct_answer ? "correct" : choiceId === answer ? "selected" : ""}">${escapeHtml(choice?.text || choiceId)} ${marker ? `<strong>${marker}</strong>` : ""}</div>`;
          }).join("")}
        </div>
      </div>`;
  }
  if (question.type === "block_reading") {
    return html`
      <div class="question">
        <div class="row between">
          <strong>${number}. ${escapeHtml(question.topic)}</strong>
          <span class="badge warn">${earned}/${max} оноо · багш дүгнэнэ</span>
        </div>
        <p>${escapeHtml(question.question_text)}</p>
        ${question.image_url ? `<img class="scratch-image" src="${escapeHtml(question.image_url)}" alt="Scratch block унших зураг" />` : ""}
        <table>
          <tr><th>Сурагчийн тайлбар</th><td>${escapeHtml(answer || "Хариулаагүй")}</td></tr>
          <tr><th>Хүлээгдэж буй санаа</th><td>${escapeHtml(question.expected_answer || question.explanation || "")}</td></tr>
        </table>
      </div>`;
  }
  if (question.type === "scratch_practical") {
    const parsed = parsePracticalAnswer(answer);
    return html`
      <div class="question">
        <div class="row between">
          <strong>${number}. Scratch project засварлах</strong>
          <span class="badge warn">${earned}/${max} оноо · багш rubric-ээр дүгнэнэ</span>
        </div>
        <p>${escapeHtml(question.question_text)}</p>
        ${question.image_url ? `<img class="scratch-image" src="${escapeHtml(question.image_url)}" alt="Scratch project-д хэрэгтэй block зураг" />` : ""}
        <table>
          <tr><th>Scratch link</th><td>${parsed.link ? `<a href="${escapeHtml(parsed.link)}" target="_blank">${escapeHtml(parsed.link)}</a>` : "Оруулаагүй"}</td></tr>
          <tr><th>.sb3 файлын нэр</th><td>${escapeHtml(parsed.fileName || "Оруулаагүй")}</td></tr>
        </table>
        <h4>Rubric</h4>
        <ul>${(question.rubric || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>`;
  }
  return html`
    <div class="question">
      <div class="row between">
        <strong>${number}. ${escapeHtml(question.topic)}</strong>
        <span class="badge ${badge}">${earned}/${max} оноо</span>
      </div>
      <p>${escapeHtml(question.question_text)}</p>
      <h4>Сурагчийн бичсэн код</h4>
      <pre class="code">${escapeHtml(answer || "Хариулаагүй")}</pre>
      <h4>Автомат шалгалтын test case</h4>
      ${(result?.tests || []).map((test) => `<table style="margin-bottom:10px">
        <tr><th>Төлөв</th><td>${test.passed ? "Зөв" : "Буруу"}</td></tr>
        <tr><th>Оролт</th><td><pre>${escapeHtml(test.input)}</pre></td></tr>
        <tr><th>Хүлээгдсэн гаралт</th><td><pre>${escapeHtml(test.expected_output)}</pre></td></tr>
        <tr><th>Сурагчийн гаралт</th><td><pre>${escapeHtml(test.stdout)}</pre></td></tr>
        ${test.stderr ? `<tr><th>Алдаа</th><td><pre>${escapeHtml(test.stderr)}</pre></td></tr>` : ""}
      </table>`).join("")}
    </div>`;
}

async function loadStudent() {
  state.studentExam = await api("/api/student/exam");
  state.answers = { ...(state.studentExam.instance.autosaved_answers || {}) };
  renderStudent();
}

function renderStudent() {
  const { student, exam, instance, questions, availability } = state.studentExam;
  const locked = ["submitted", "auto_submitted"].includes(instance.status);
  const waiting = availability && !availability.open && !locked;
  renderShell(html`
    <div class="grid">
      <div class="card span-12 row between">
        <div>
          <h1>${escapeHtml(exam.title)}</h1>
          <p class="muted">${escapeHtml(student.display_name)} · ${escapeHtml(student.class_name)} · ${statusBadge(instance.status)}</p>
          <p class="muted">Эхлэх: ${formatDateTime(exam.availability_start)} · Дуусах: ${formatDateTime(exam.availability_end)} · Хугацаа: ${exam.duration_minutes} мин</p>
        </div>
        <div class="row">
          ${locked ? `<span class="badge good">Оноо: ${instance.final_score ?? ""}</span>` : waiting ? `<span class="badge warn">${escapeHtml(availability.reason)}</span>` : `<button class="primary" id="start">${instance.status === "not_started" ? "Шалгалт эхлэх" : "Үргэлжлүүлэх"}</button><button class="danger" id="submit">Илгээх</button>`}
        </div>
      </div>
      <form class="card span-12" id="exam-form">
        ${waiting ? `<h2>Шалгалтын асуулт эхлэх цаг хүртэл харагдахгүй.</h2><p class="muted">Багшийн тохируулсан эхлэх цаг: ${formatDateTime(exam.availability_start)}</p>` : questions.map((question, index) => renderQuestion(question, index + 1, locked)).join("")}
      </form>
    </div>`);

  if (!locked && !waiting) {
    document.querySelector("#start").onclick = async () => {
      await api("/api/student/start", { method: "POST", body: { instance_id: instance.id } });
      await loadStudent();
    };
    document.querySelector("#submit").onclick = () => submitStudent(false);
    document.querySelector("#exam-form").oninput = (event) => {
      const target = event.target;
      if (target.dataset.practical) {
        const questionId = target.dataset.practical;
        const current = parsePracticalAnswer(state.answers[questionId]);
        current[target.dataset.field] = target.value;
        state.answers[questionId] = JSON.stringify(current);
        const hidden = document.querySelector(`input[type="hidden"][name="${questionId}"]`);
        if (hidden) hidden.value = state.answers[questionId];
        scheduleAutosave();
        return;
      }
      if (!target.name) return;
      state.answers[target.name] = target.value;
      scheduleAutosave();
    };
    startTimer();
  }
}

function renderQuestion(question, number, locked) {
  const answer = state.answers[question.id] || "";
  if (question.type === "multiple_choice") {
    return html`
      <div class="question">
        <div class="row between"><strong>${number}. ${escapeHtml(question.topic)}</strong><span class="badge">${question.points} оноо</span></div>
        <p>${escapeHtml(question.question_text)}</p>
        ${question.choices.map((choice) => `<label class="choice"><input ${locked ? "disabled" : ""} type="radio" name="${question.id}" value="${choice.id}" ${answer === choice.id ? "checked" : ""}/><span>${escapeHtml(choice.text)}</span></label>`).join("")}
      </div>`;
  }
  if (question.type === "block_reading") {
    return html`
      <div class="question">
        <div class="row between"><strong>${number}. ${escapeHtml(question.topic)}</strong><span class="badge">${question.points} оноо · багш дүгнэнэ</span></div>
        <p>${escapeHtml(question.question_text)}</p>
        ${question.image_url ? `<img class="scratch-image" src="${escapeHtml(question.image_url)}" alt="Scratch block унших зураг" />` : ""}
        <label>Тайлбар<textarea ${locked ? "disabled" : ""} name="${question.id}" spellcheck="true" placeholder="Энэ script юу хийхийг өөрийн үгээр тайлбарлана уу.">${escapeHtml(answer)}</textarea></label>
      </div>`;
  }
  if (question.type === "scratch_practical") {
    const parsed = parsePracticalAnswer(answer);
    return html`
      <div class="question">
        <div class="row between"><strong>${number}. Scratch project засварлах</strong><span class="badge">${question.points} оноо · багш дүгнэнэ</span></div>
        <p>${escapeHtml(question.question_text)}</p>
        ${question.image_url ? `<img class="scratch-image" src="${escapeHtml(question.image_url)}" alt="Scratch project-д хэрэгтэй block зураг" />` : ""}
        <h4>Үнэлгээний rubric</h4>
        <ul>${(question.rubric || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <div class="grid">
          <label class="span-6">Scratch share link<input ${locked ? "disabled" : ""} data-practical="${question.id}" data-field="link" value="${escapeHtml(parsed.link)}" placeholder="https://scratch.mit.edu/projects/..." /></label>
          <label class="span-6">.sb3 файлын нэр<input ${locked ? "disabled" : ""} data-practical="${question.id}" data-field="fileName" value="${escapeHtml(parsed.fileName)}" placeholder="my-frog-maze.sb3" /></label>
        </div>
        <input type="hidden" name="${question.id}" value="${escapeHtml(answer)}" />
      </div>`;
  }
  return html`
    <div class="question">
      <div class="row between"><strong>${number}. ${escapeHtml(question.topic)}</strong><span class="badge">${question.points} оноо</span></div>
      <p>${escapeHtml(question.question_text)}</p>
      <textarea ${locked ? "disabled" : ""} name="${question.id}" spellcheck="false">${escapeHtml(answer || question.starter_code || "")}</textarea>
    </div>`;
}

function parsePracticalAnswer(answer) {
  try {
    return { link: "", fileName: "", ...JSON.parse(answer || "{}") };
  } catch {
    return { link: "", fileName: answer || "" };
  }
}

let autosaveTimer = null;
function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(async () => {
    await api("/api/student/autosave", { method: "POST", body: { instance_id: state.studentExam.instance.id, answers: state.answers } });
    state.savedAt = new Date().toLocaleTimeString("mn-MN");
    const saved = document.querySelector("#saved");
    if (saved) saved.textContent = `Хадгалсан: ${state.savedAt}`;
  }, 500);
}

function startTimer() {
  clearInterval(state.timerId);
  const { exam, instance } = state.studentExam;
  if (!instance.started_at) return;
  const end = new Date(instance.started_at).getTime() + Number(exam.duration_minutes) * 60 * 1000;
  state.timerId = setInterval(() => {
    const remaining = end - Date.now();
    const timer = document.querySelector("#timer");
    if (!timer) return;
    if (remaining <= 0) {
      timer.textContent = "00:00";
      clearInterval(state.timerId);
      submitStudent(true);
      return;
    }
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 500);
}

async function submitStudent(auto) {
  if (!auto && !confirm("Шалгалтаа одоо илгээх үү? Илгээсний дараа засах боломжгүй.")) return;
  document.querySelectorAll("input, textarea").forEach((field) => {
    if (field.name && (field.type !== "radio" || field.checked)) state.answers[field.name] = field.value;
  });
  await api("/api/student/submit", { method: "POST", body: { instance_id: state.studentExam.instance.id, answers: state.answers, auto } });
  await loadStudent();
}

loadMe().catch((error) => renderLogin(error.message));
