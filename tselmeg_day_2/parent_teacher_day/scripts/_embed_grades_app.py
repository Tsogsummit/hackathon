#!/usr/bin/env python3
"""python_exercises/app.js доторх GRADES өгөгдлийг үүсгэх — нэг удаагийн сэргээлт."""
import json
from pathlib import Path

# JavaScript string escape for template literals content
def js_str(s: str) -> str:
    return json.dumps(s)


HEADER = r'''/**
 * 7–9-р ангийн Python дасгал — Pyodide (хөтөч дээр ажиллана).
 * Сервер: parent_teacher_day хавтаснаас python -m http.server
 */

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/";

let pyodideReady = null;

function loadPyodideOnce() {
  if (pyodideReady) return pyodideReady;
  pyodideReady = (async () => {
    if (typeof loadPyodide !== "function") {
      throw new Error("Pyodide ачаалагдаагүй байна.");
    }
    return loadPyodide({ indexURL: PYODIDE_URL });
  })();
  return pyodideReady;
}

function wrapStdin(code, stdinText) {
  const t = (stdinText || "").trimEnd();
  if (!t) return code;
  const lines = t.split("\n");
  const lit =
    "[" + lines.map((l) => JSON.stringify(l)).join(", ") + "]";
  return `
import builtins
__stdin_lines = ${lit}
__stdin_i = 0
def __stdin_input(prompt=""):
    global __stdin_i
    if __stdin_i >= len(__stdin_lines):
        raise EOFError("stdin дууссан — оролтын мөр нэмнэ үү")
    r = __stdin_lines[__stdin_i]
    __stdin_i += 1
    return r
builtins.input = __stdin_input
` + code;
}

async function runPython(code, outEl, btn) {
  outEl.textContent = "Ачаалж байна…";
  outEl.classList.remove("err");
  btn.disabled = true;
  try {
    const pyodide = await loadPyodideOnce();
    pyodide.globals.set("__user_code__", code);
    pyodide.runPython(`
import sys
from io import StringIO
_buf = StringIO()
_old = sys.stdout
sys.stdout = _buf
_err = None
try:
    exec(__user_code__, {"__name__": "__main__"})
except Exception:
    import traceback
    _err = traceback.format_exc()
finally:
    sys.stdout = _old
_out = _buf.getvalue()
if _err:
    _out = _out + "\\n" + _err
`);
    const text = pyodide.globals.get("_out");
    const s = text != null ? String(text) : "";
    outEl.textContent = s.trim() ? s : "(гаралт хоосон)";
    if (s.includes("Traceback") || s.includes("Error:")) {
      outEl.classList.add("err");
    }
  } catch (e) {
    outEl.classList.add("err");
    outEl.textContent = String(e);
  } finally {
    btn.disabled = false;
  }
}

'''

FOOTER = r'''
function badgeClass(b) {
  if (b === "easy") return "b-e";
  if (b === "medium") return "b-m";
  return "b-h";
}

const GRADE_ORDER = ["7", "8", "9"];

function renderAllExercises() {
  const root = document.getElementById("content");
  if (!root) return;

  root.innerHTML = "";

  const intro = document.createElement("p");
  intro.className = "subtitle";
  intro.textContent =
    "7–9-р ангиар ижил төстэй хичээлүүдийг үзсэн; доор бүх ангийн дасгалууд нэг дороос харагдана.";
  root.appendChild(intro);

  for (const key of GRADE_ORDER) {
    const g = GRADES[key];
    if (!g) continue;

    g.lessons.forEach((lesson) => {
      const block = document.createElement("div");
      block.className = "lesson-block";

      const head = document.createElement("div");
      head.className = "lesson-head";
      head.innerHTML = `<span class="tag tag-grade">${escapeHtml(g.title)}</span><span class="tag">${escapeHtml(lesson.tag)}</span><h2>${escapeHtml(lesson.name)}</h2>`;
      block.appendChild(head);

      lesson.exercises.forEach((ex) => {
        block.appendChild(renderExerciseCard(ex));
      });

      root.appendChild(block);
    });
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function renderExerciseCard(ex) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = ex.id;

  const h = document.createElement("div");
  h.className = "card-h";
  h.innerHTML = `
    <span class="num">${escapeHtml(ex.num)}</span>
    <span class="badge ${badgeClass(ex.badge)}">${escapeHtml(ex.badgeText)}</span>
    <div class="title">${escapeHtml(ex.title)}</div>
  `;

  const b = document.createElement("div");
  b.className = "card-b";
  const task = document.createElement("div");
  task.className = "task";
  task.innerHTML = escapeHtml(ex.task).replace(/\n/g, "<br>");

  const editor = document.createElement("div");
  editor.className = "editor-wrap";
  editor.innerHTML = `
    <div class="editor-head"><span class="dot dr"></span><span class="dot dy"></span><span class="dot dg"></span> ${escapeHtml(ex.file)}</div>
    <textarea class="code" spellcheck="false">${escapeHtml(ex.defaultCode)}</textarea>
  `;

  const stdinWrap = document.createElement("div");
  stdinWrap.className = "stdin-wrap";
  stdinWrap.innerHTML = `
    <label>Оролт (мөр бүр <code>input()</code>-д дараалан очно) — ${escapeHtml(ex.stdinHint || "")}</label>
    <textarea class="stdin" spellcheck="false" placeholder="Жишээ: 5 эсвэл олон мөр...">${escapeHtml(ex.defaultStdin || "")}</textarea>
  `;

  const actions = document.createElement("div");
  actions.className = "actions";
  const runBtn = document.createElement("button");
  runBtn.type = "button";
  runBtn.className = "btn btn-run";
  runBtn.textContent = "▶ Ажиллуулах (Python)";
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "btn btn-reset";
  resetBtn.textContent = "Анхны код";
  actions.append(runBtn, resetBtn);

  const outLab = document.createElement("div");
  outLab.className = "out-label";
  outLab.textContent = "Гаралт:";
  const outBox = document.createElement("div");
  outBox.className = "out";
  outBox.setAttribute("aria-live", "polite");
  outBox.textContent = "Энд гаралт гарна.";

  b.append(task, editor, stdinWrap, actions, outLab, outBox);

  const ta = editor.querySelector("textarea.code");
  const stdinTa = stdinWrap.querySelector("textarea.stdin");

  runBtn.addEventListener("click", async () => {
    const raw = ta.value;
    const wrapped = wrapStdin(raw, stdinTa.value);
    await runPython(wrapped, outBox, runBtn);
  });

  resetBtn.addEventListener("click", () => {
    ta.value = ex.defaultCode;
    stdinTa.value = ex.defaultStdin || "";
    outBox.textContent = "Энд гаралт гарна.";
    outBox.classList.remove("err");
  });

  card.append(h, b);
  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  renderAllExercises();

  loadPyodideOnce().catch((e) => {
    console.error(e);
  });
});
'''

# GRADES as Python structure → emit JS
GRADES_PY = {
    7: {
        "title": "7-р анги",
        "subtitle": "While loop — давталт",
        "lessons": [
            {
                "tag": "Хичээл 3",
                "name": "While Loop",
                "exercises": [
                    {
                        "id": "7-w1",
                        "num": "ДАСГАЛ 1",
                        "badge": "easy",
                        "badgeText": "АМАРХАН",
                        "title": "Тэгш тоонуудыг олох",
                        "task": "1-ээс 100 хүртэлх тоон доторх бүх тэгш тоонуудыг while loop ашиглан дэлгэцэнд хэвлэ.",
                        "file": "while_ex1.py",
                        "defaultCode": """i = 2

while i <= 100:
    print(i)
    i += 2""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "7-w2",
                        "num": "ДАСГАЛ 2",
                        "badge": "medium",
                        "badgeText": "ДУНД",
                        "title": "Үржихийн хүрд",
                        "task": 'Хэрэглэгчээс нэг тоо (input) авч, уг тооны 1-ээс 10 хүртэлх үржихийн хүрдийг while loop ашиглан гаргаж ир.',
                        "file": "while_ex2.py",
                        "defaultCode": """n = int(input("Тоо оруулна уу: "))

i = 1
while i <= 10:
    print(f"{n} x {i} = {n * i}")
    i += 1""",
                        "stdinHint": "Жишээ оролт (доорх талбарт): 5",
                        "defaultStdin": "5",
                    },
                ],
            }
        ],
    },
    8: {
        "title": "8-р анги",
        "subtitle": "For loop — range, давталт",
        "lessons": [
            {
                "tag": "Хичээл 4",
                "name": "For Loop",
                "exercises": [
                    {
                        "id": "8-f1",
                        "num": "ДАСГАЛ 1",
                        "badge": "easy",
                        "badgeText": "АМАРХАН",
                        "title": "3-т хуваагдах тоонууд",
                        "task": "1-1000 хүртэлх тоонуудаас 3-т хуваагдах тоонуудыг for loop ашиглан хэвлэ.",
                        "file": "for_ex1.py",
                        "defaultCode": """for i in range(1, 1001):
    if i % 3 == 0:
        print(i)""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "8-f2",
                        "num": "ДАСГАЛ 2",
                        "badge": "easy",
                        "badgeText": "АМАРХАН",
                        "title": "Сондгой тоонууд",
                        "task": "500-1500 хүртэлх тоонуудаас сондгой тоонуудыг хэвлэ.",
                        "file": "for_ex2.py",
                        "defaultCode": """for i in range(501, 1501, 2):
    print(i)""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "8-f3",
                        "num": "ДАСГАЛ 3",
                        "badge": "medium",
                        "badgeText": "ДУНД",
                        "title": "5-д хуваагдах тоонуудын нийлбэр",
                        "task": "10-150 хүртэлх тоонуудаас 5-д хуваагдах тоонуудын нийлбэрийг ол.",
                        "file": "for_ex3.py",
                        "defaultCode": """sum = 0
for i in range(10, 151, 5):
    sum = sum + i
print(sum)""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "8-f4",
                        "num": "ДАСГАЛ 4",
                        "badge": "medium",
                        "badgeText": "ДУНД",
                        "title": "Од хэвлэх",
                        "task": 'n хувьсагчийг гараас авч (input), доорх хэлбэрээр од хэвлэ. (n=3 үед: * / ** / ***)',
                        "file": "for_ex4.py",
                        "defaultCode": """n = int(input("n оруулна уу: "))

for i in range(1, n + 1):
    print("*" * i)""",
                        "stdinHint": "Жишээ оролт: 4",
                        "defaultStdin": "4",
                    },
                ],
            }
        ],
    },
    9: {
        "title": "9-р анги",
        "subtitle": "Жагсаалт (list) + тоглоом",
        "lessons": [
            {
                "tag": "Хичээл 5",
                "name": "List",
                "exercises": [
                    {
                        "id": "9-l1",
                        "num": "ДАСГАЛ 1",
                        "badge": "easy",
                        "badgeText": "АМАРХАН",
                        "title": "Жимсний жагсаалт",
                        "task": '5 жимсний нэрийг агуулсан jims жагсаалт үүсгэ. Эхний болон сүүлчийн жимсийг хэвлэ. Дараа нь "лийр" нэмж, жагсаалтын урт хэвлэ.',
                        "file": "list_ex1.py",
                        "defaultCode": """jims = ["алим", "гүзээлзгэнэ", "тавилж", "үхэр нүд", "банан"]

print(jims[0])
print(jims[-1])

jims.append("лийр")
print(len(jims))""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "9-l2",
                        "num": "ДАСГАЛ 2",
                        "badge": "easy",
                        "badgeText": "АМАРХАН",
                        "title": "Оноо тооцоо",
                        "task": "onoonuud = [78, 92, 65, 88, 71, 95, 83] жагсаалтыг ашиглан дундаж, хамгийн өндөр болон хамгийн бага оноог олж хэвлэ. Дараа нь жагсаалтыг эрэмбэлж хэвлэ.",
                        "file": "list_ex2.py",
                        "defaultCode": """onoonuud = [78, 92, 65, 88, 71, 95, 83]

dundaj = sum(onoonuud) / len(onoonuud)
print(f"Дундаж: {dundaj}")
print(f"Хамгийн өндөр: {max(onoonuud)}")
print(f"Хамгийн бага: {min(onoonuud)}")

onoonuud.sort()
print(onoonuud)""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "9-l3",
                        "num": "ДАСГАЛ 3",
                        "badge": "medium",
                        "badgeText": "ДУНД",
                        "title": "Тэгш тоонууд (List ашиглан)",
                        "task": "1-20 хүртэлх тоонуудаас тэгш тоонуудыг шинэ жагсаалтад хийж хэвлэ.",
                        "file": "list_ex3.py",
                        "defaultCode": """tegsh = []

for i in range(1, 21):
    if i % 2 == 0:
        tegsh.append(i)

print(tegsh)""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "9-l4",
                        "num": "ДАСГАЛ 4",
                        "badge": "medium",
                        "badgeText": "ДУНД",
                        "title": "Хоёр дахь хамгийн их тоо",
                        "task": "Жагсаалтаас хоёр дахь хамгийн их тоог ол.",
                        "file": "list_ex4.py",
                        "defaultCode": """tonuud = [14, 3, 77, 56, 91, 23, 45]

tonuud.sort()
print(f"Хоёр дахь хамгийн их: {tonuud[-2]}")""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                    {
                        "id": "9-l5",
                        "num": "ДАСГАЛ 5",
                        "badge": "hard",
                        "badgeText": "ХЭЦҮҮ",
                        "title": "Матрицын нийлбэр",
                        "task": "2 хэмжээст жагсаалт (матриц) үүсгэж, бүх элементүүдийн нийлбэрийг ол.",
                        "file": "list_ex5.py",
                        "defaultCode": """matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

niilber = 0
for moron in matrix:
    for too in moron:
        niilber += too

print(f"Нийт нийлбэр: {niilber}")""",
                        "stdinHint": "Оролт шаардлагагүй.",
                    },
                ],
            },
            {
                "tag": "Тоглоом",
                "name": "Тоо таах",
                "exercises": [
                    {
                        "id": "9-game",
                        "num": "ТӨСӨЛ",
                        "badge": "hard",
                        "badgeText": "ХЭЦҮҮ",
                        "title": "Тоо таах тоглоом",
                        "task": 'Random сан ашиглан 1-100 хооронд тоо үүсгэж, хэрэглэгч зөв тааж дуустал тоглоом явна. "Их байна" / "Бага байна" зөвлөгөө өгнө.',
                        "file": "guess_game.py",
                        "defaultCode": """import random

nuuts_too = random.randint(1, 100)
orollt = 0

print("Тоо таах тоглоом эхэллээ! (1-100)")

while True:
    taamsag = int(input("Таамаглалаа оруулна уу: "))
    orollt += 1

    if taamsag == nuuts_too:
        print(f"Зөв! {orollt} оролдлогоор таалаа!")
        break
    elif taamsag > nuuts_too:
        print("Арай бага тоо хэлнэ үү.")
    else:
        print("Арай их тоо хэлнэ үү.")""",
                        "stdinHint": "Жишээ: доор мөр бүрт нэг таамаг (жишээ нь nuuts_too=63 гэж үзвэл)\n50\n75\n63",
                        "defaultStdin": "50\n75\n63",
                    },
                ],
            },
        ],
    },
}


def exercise_to_js(ex: dict) -> str:
    parts = ["{"]
    parts.append(f'  id: {json.dumps(ex["id"])},')
    parts.append(f'  num: {json.dumps(ex["num"])},')
    parts.append(f'  badge: {json.dumps(ex["badge"])},')
    parts.append(f'  badgeText: {json.dumps(ex["badgeText"])},')
    parts.append(f'  title: {json.dumps(ex["title"])},')
    parts.append(f'  task: {json.dumps(ex["task"])},')
    parts.append(f'  file: {json.dumps(ex["file"])},')
    parts.append(f'  defaultCode: {json.dumps(ex["defaultCode"])},')
    parts.append(f'  stdinHint: {json.dumps(ex.get("stdinHint", ""))},')
    if ex.get("defaultStdin") is not None:
        parts.append(f'  defaultStdin: {json.dumps(ex["defaultStdin"])},')
    parts.append("}")
    return "\n".join(parts)


def lesson_to_js(lesson: dict) -> str:
    ex_js = ",\n".join(exercise_to_js(e) for e in lesson["exercises"])
    return f"""{{
      tag: {json.dumps(lesson["tag"])},
      name: {json.dumps(lesson["name"])},
      exercises: [
{ex_js}
      ],
    }}"""


def grade_to_js(k: str, v: dict) -> str:
    lessons_js = ",\n".join(lesson_to_js(L) for L in v["lessons"])
    return f"""  {k}: {{
    title: {json.dumps(v["title"])},
    subtitle: {json.dumps(v["subtitle"])},
    lessons: [
{lessons_js}
    ],
  }},"""


def main() -> None:
    out = Path(__file__).resolve().parent.parent / "python_exercises" / "app.js"
    grades_body = "\n".join(grade_to_js(str(k), GRADES_PY[k]) for k in (7, 8, 9))
    body = f"const GRADES = {{\n{grades_body}\n}};\n"
    out.write_text(HEADER + body + FOOTER, encoding="utf-8")
    print("Wrote", out, "bytes", out.stat().st_size)


if __name__ == "__main__":
    main()
