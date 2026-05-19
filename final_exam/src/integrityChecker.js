function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCode(value) {
  return String(value ?? "")
    .replace(/#.*$/gm, "")
    .replace(/["'][^"']*["']/g, "STR")
    .replace(/\b\d+(\.\d+)?\b/g, "NUM")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function ngrams(text, size = 3) {
  const words = normalizeText(text).split(" ").filter(Boolean);
  if (words.length <= size) return new Set(words);
  const values = [];
  for (let index = 0; index <= words.length - size; index += 1) {
    values.push(words.slice(index, index + size).join(" "));
  }
  return new Set(values);
}

function jaccard(left, right) {
  if (!left.size && !right.size) return 0;
  let intersection = 0;
  for (const item of left) {
    if (right.has(item)) intersection += 1;
  }
  const union = left.size + right.size - intersection;
  return union ? intersection / union : 0;
}

function answerSimilarity(question, left, right) {
  if (!left || !right) return 0;
  if (question?.type === "multiple_choice") return left === right ? 1 : 0;
  if (question?.type === "write_code") {
    const leftCode = normalizeCode(left);
    const rightCode = normalizeCode(right);
    if (!leftCode || !rightCode) return 0;
    if (leftCode === rightCode) return 1;
    return jaccard(ngrams(leftCode, 4), ngrams(rightCode, 4));
  }
  const leftText = normalizeText(left);
  const rightText = normalizeText(right);
  if (!leftText || !rightText) return 0;
  if (leftText === rightText) return 1;
  return jaccard(ngrams(leftText, 3), ngrams(rightText, 3));
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function copySignal(row, otherRows, questionsById) {
  const matches = otherRows
    .filter((candidate) => candidate.student.id !== row.student.id)
    .map((candidate) => {
      const sharedIds = Object.keys(row.submission.answers || {}).filter((id) => candidate.submission.answers?.[id]);
      const usableIds = sharedIds.filter((id) => {
        const question = questionsById.get(id);
        return question && String(row.submission.answers[id] ?? "").trim() && String(candidate.submission.answers[id] ?? "").trim();
      });
      const scores = usableIds.map((id) => answerSimilarity(questionsById.get(id), row.submission.answers[id], candidate.submission.answers[id]));
      const similarity = average(scores);
      const coverage = usableIds.length / Math.max(1, Object.keys(row.submission.answers || {}).length);
      const submittedGapMinutes = row.instance.submitted_at && candidate.instance.submitted_at
        ? Math.abs(new Date(row.instance.submitted_at).getTime() - new Date(candidate.instance.submitted_at).getTime()) / 60000
        : null;
      const timingBoost = submittedGapMinutes !== null && submittedGapMinutes <= 5 ? 8 : submittedGapMinutes !== null && submittedGapMinutes <= 15 ? 4 : 0;
      const probability = clampPercent(similarity * 82 + coverage * 10 + timingBoost);
      return {
        student_id: candidate.student.id,
        student_name: candidate.student.display_name,
        student_code: candidate.student.student_code,
        similarity_percent: clampPercent(similarity * 100),
        shared_answers: usableIds.length,
        submitted_gap_minutes: submittedGapMinutes === null ? null : Math.round(submittedGapMinutes),
        probability
      };
    })
    .sort((a, b) => b.probability - a.probability);

  const top = matches[0] || null;
  const notes = [];
  if (top?.shared_answers >= 5 && top.similarity_percent >= 85) notes.push("Нийтлэг асуултуудын хариулт маш төстэй.");
  if (top && top.submitted_gap_minutes !== null && top.submitted_gap_minutes <= 5) notes.push("Илгээсэн цаг ойролцоо байна.");
  if (!top || top.shared_answers < 3) notes.push("Харьцуулах нийтлэг хариулт цөөн байна.");
  return { probability: top?.probability || 0, possible_source: top, notes };
}

function aiSignal(row, questionsById, result) {
  const answers = row.submission.answers || {};
  const questionIds = Object.keys(answers);
  const codeAnswers = questionIds
    .filter((id) => questionsById.get(id)?.type === "write_code")
    .map((id) => String(answers[id] || ""));
  const writtenAnswers = questionIds
    .filter((id) => ["block_reading", "scratch_practical"].includes(questionsById.get(id)?.type))
    .map((id) => String(answers[id] || ""));
  const codeText = codeAnswers.join("\n");
  const writtenText = writtenAnswers.join("\n");
  const notes = [];
  let score = 0;

  const resultRows = result?.results || [];
  const codeResults = resultRows.filter((item) => item.type === "write_code");
  const perfectCode = codeResults.length > 0 && codeResults.every((item) => item.score === item.max_score);
  const advancedTokens = ["try:", "except", "lambda", "sorted(", "dict(", "set(", "join(", "enumerate(", "zip(", "comprehension", "import "]
    .filter((token) => codeText.includes(token)).length;

  if (perfectCode && codeAnswers.length >= 3) {
    score += 24;
    notes.push("Кодын бүх автомат test амжилттай болсон.");
  }
  if (advancedTokens >= 3) {
    score += 24;
    notes.push("Хариултад тухайн түвшинд ахисан байж болох хэв маяг олон байна.");
  } else if (advancedTokens >= 1) {
    score += 10;
  }
  if (codeAnswers.length && average(codeAnswers.map((answer) => answer.length)) > 420) {
    score += 16;
    notes.push("Кодын хариулт ердийнхөөс урт байна.");
  }
  if (writtenAnswers.length && average(writtenAnswers.map((answer) => normalizeText(answer).split(" ").filter(Boolean).length)) > 45) {
    score += 14;
    notes.push("Тайлбарласан хариулт ердийнхөөс дэлгэрэнгүй байна.");
  }
  if (/(as an ai|i cannot|i can help|алхам алхмаар|дүгнэж хэлбэл|ерөнхийдөө)/i.test(`${codeText}\n${writtenText}`)) {
    score += 22;
    notes.push("AI-тэй төстэй хэллэг илэрсэн.");
  }
  if (!notes.length) notes.push("AI ашигласан эсэхийг илтгэх тодорхой хэв маяг бага байна.");

  return { probability: clampPercent(score), notes };
}

export function buildIntegrityReport(db) {
  const questionsById = new Map(db.questions.map((question) => [question.id, question]));
  const resultByInstance = new Map(db.autograder_results.map((result) => [result.instance_id, result]));
  const rows = db.submissions
    .map((submission) => {
      const instance = db.student_exam_instances.find((item) => item.id === submission.instance_id);
      const student = db.students.find((item) => item.id === submission.student_id);
      const exam = db.exams.find((item) => item.id === submission.exam_id);
      if (!instance || !student || !exam) return null;
      return { submission, instance, student, exam };
    })
    .filter(Boolean);

  const classes = [...new Set(db.students.map((student) => student.class_name).filter(Boolean))].sort((a, b) => a.localeCompare(b, "mn"));
  const reports = [];
  for (const className of classes) {
    const classRows = rows.filter((row) => row.student.class_name === className);
    for (const row of classRows) {
      const copy = copySignal(row, classRows, questionsById);
      const ai = aiSignal(row, questionsById, resultByInstance.get(row.instance.id));
      reports.push({
        class_name: className,
        student_id: row.student.id,
        student_code: row.student.student_code,
        student_name: row.student.display_name,
        exam_title: row.exam.title,
        submitted_at: row.instance.submitted_at,
        score: row.submission.score,
        max_score: row.submission.max_score,
        copy_probability: copy.probability,
        possible_source: copy.possible_source,
        ai_probability: ai.probability,
        notes: [...copy.notes, ...ai.notes].slice(0, 3)
      });
    }
  }

  return {
    generated_at: new Date().toISOString(),
    classes,
    reports,
    note: "Энэ шалгагч нь зөвхөн анхаарах дохио гаргана. Дүн, оноонд автоматаар нөлөөлөхгүй."
  };
}
