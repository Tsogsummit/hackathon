/**
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

const GRADES = {
  7: {
    title: "7-\u0440 \u0430\u043d\u0433\u0438",
    subtitle: "While loop \u2014 \u0434\u0430\u0432\u0442\u0430\u043b\u0442",
    lessons: [
{
      tag: "\u0425\u0438\u0447\u044d\u044d\u043b 3",
      name: "While Loop",
      exercises: [
{
  id: "7-w1",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 1",
  badge: "easy",
  badgeText: "\u0410\u041c\u0410\u0420\u0425\u0410\u041d",
  title: "\u0422\u044d\u0433\u0448 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u044b\u0433 \u043e\u043b\u043e\u0445",
  task: "1-\u044d\u044d\u0441 100 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u0442\u043e\u043e\u043d \u0434\u043e\u0442\u043e\u0440\u0445 \u0431\u04af\u0445 \u0442\u044d\u0433\u0448 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u044b\u0433 while loop \u0430\u0448\u0438\u0433\u043b\u0430\u043d \u0434\u044d\u043b\u0433\u044d\u0446\u044d\u043d\u0434 \u0445\u044d\u0432\u043b\u044d.",
  file: "while_ex1.py",
  defaultCode: "i = 2\n\nwhile i <= 100:\n    print(i)\n    i += 2",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "7-w2",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 2",
  badge: "medium",
  badgeText: "\u0414\u0423\u041d\u0414",
  title: "\u04ae\u0440\u0436\u0438\u0445\u0438\u0439\u043d \u0445\u04af\u0440\u0434",
  task: "\u0425\u044d\u0440\u044d\u0433\u043b\u044d\u0433\u0447\u044d\u044d\u0441 \u043d\u044d\u0433 \u0442\u043e\u043e (input) \u0430\u0432\u0447, \u0443\u0433 \u0442\u043e\u043e\u043d\u044b 1-\u044d\u044d\u0441 10 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u04af\u0440\u0436\u0438\u0445\u0438\u0439\u043d \u0445\u04af\u0440\u0434\u0438\u0439\u0433 while loop \u0430\u0448\u0438\u0433\u043b\u0430\u043d \u0433\u0430\u0440\u0433\u0430\u0436 \u0438\u0440.",
  file: "while_ex2.py",
  defaultCode: "n = int(input(\"\u0422\u043e\u043e \u043e\u0440\u0443\u0443\u043b\u043d\u0430 \u0443\u0443: \"))\n\ni = 1\nwhile i <= 10:\n    print(f\"{n} x {i} = {n * i}\")\n    i += 1",
  stdinHint: "\u0416\u0438\u0448\u044d\u044d \u043e\u0440\u043e\u043b\u0442 (\u0434\u043e\u043e\u0440\u0445 \u0442\u0430\u043b\u0431\u0430\u0440\u0442): 5",
  defaultStdin: "5",
}
      ],
    }
    ],
  },
  8: {
    title: "8-\u0440 \u0430\u043d\u0433\u0438",
    subtitle: "For loop \u2014 range, \u0434\u0430\u0432\u0442\u0430\u043b\u0442",
    lessons: [
{
      tag: "\u0425\u0438\u0447\u044d\u044d\u043b 4",
      name: "For Loop",
      exercises: [
{
  id: "8-f1",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 1",
  badge: "easy",
  badgeText: "\u0410\u041c\u0410\u0420\u0425\u0410\u041d",
  title: "3-\u0442 \u0445\u0443\u0432\u0430\u0430\u0433\u0434\u0430\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434",
  task: "1-1000 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u0430\u0430\u0441 3-\u0442 \u0445\u0443\u0432\u0430\u0430\u0433\u0434\u0430\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u044b\u0433 for loop \u0430\u0448\u0438\u0433\u043b\u0430\u043d \u0445\u044d\u0432\u043b\u044d.",
  file: "for_ex1.py",
  defaultCode: "for i in range(1, 1001):\n    if i % 3 == 0:\n        print(i)",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "8-f2",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 2",
  badge: "easy",
  badgeText: "\u0410\u041c\u0410\u0420\u0425\u0410\u041d",
  title: "\u0421\u043e\u043d\u0434\u0433\u043e\u0439 \u0442\u043e\u043e\u043d\u0443\u0443\u0434",
  task: "500-1500 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u0430\u0430\u0441 \u0441\u043e\u043d\u0434\u0433\u043e\u0439 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u044b\u0433 \u0445\u044d\u0432\u043b\u044d.",
  file: "for_ex2.py",
  defaultCode: "for i in range(501, 1501, 2):\n    print(i)",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "8-f3",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 3",
  badge: "medium",
  badgeText: "\u0414\u0423\u041d\u0414",
  title: "5-\u0434 \u0445\u0443\u0432\u0430\u0430\u0433\u0434\u0430\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u044b\u043d \u043d\u0438\u0439\u043b\u0431\u044d\u0440",
  task: "10-150 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u0430\u0430\u0441 5-\u0434 \u0445\u0443\u0432\u0430\u0430\u0433\u0434\u0430\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u044b\u043d \u043d\u0438\u0439\u043b\u0431\u044d\u0440\u0438\u0439\u0433 \u043e\u043b.",
  file: "for_ex3.py",
  defaultCode: "sum = 0\nfor i in range(10, 151, 5):\n    sum = sum + i\nprint(sum)",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "8-f4",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 4",
  badge: "medium",
  badgeText: "\u0414\u0423\u041d\u0414",
  title: "\u041e\u0434 \u0445\u044d\u0432\u043b\u044d\u0445",
  task: "n \u0445\u0443\u0432\u044c\u0441\u0430\u0433\u0447\u0438\u0439\u0433 \u0433\u0430\u0440\u0430\u0430\u0441 \u0430\u0432\u0447 (input), \u0434\u043e\u043e\u0440\u0445 \u0445\u044d\u043b\u0431\u044d\u0440\u044d\u044d\u0440 \u043e\u0434 \u0445\u044d\u0432\u043b\u044d. (n=3 \u04af\u0435\u0434: * / ** / ***)",
  file: "for_ex4.py",
  defaultCode: "n = int(input(\"n \u043e\u0440\u0443\u0443\u043b\u043d\u0430 \u0443\u0443: \"))\n\nfor i in range(1, n + 1):\n    print(\"*\" * i)",
  stdinHint: "\u0416\u0438\u0448\u044d\u044d \u043e\u0440\u043e\u043b\u0442: 4",
  defaultStdin: "4",
}
      ],
    }
    ],
  },
  9: {
    title: "9-\u0440 \u0430\u043d\u0433\u0438",
    subtitle: "\u0416\u0430\u0433\u0441\u0430\u0430\u043b\u0442 (list) + \u0442\u043e\u0433\u043b\u043e\u043e\u043c",
    lessons: [
{
      tag: "\u0425\u0438\u0447\u044d\u044d\u043b 5",
      name: "List",
      exercises: [
{
  id: "9-l1",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 1",
  badge: "easy",
  badgeText: "\u0410\u041c\u0410\u0420\u0425\u0410\u041d",
  title: "\u0416\u0438\u043c\u0441\u043d\u0438\u0439 \u0436\u0430\u0433\u0441\u0430\u0430\u043b\u0442",
  task: "5 \u0436\u0438\u043c\u0441\u043d\u0438\u0439 \u043d\u044d\u0440\u0438\u0439\u0433 \u0430\u0433\u0443\u0443\u043b\u0441\u0430\u043d jims \u0436\u0430\u0433\u0441\u0430\u0430\u043b\u0442 \u04af\u04af\u0441\u0433\u044d. \u042d\u0445\u043d\u0438\u0439 \u0431\u043e\u043b\u043e\u043d \u0441\u04af\u04af\u043b\u0447\u0438\u0439\u043d \u0436\u0438\u043c\u0441\u0438\u0439\u0433 \u0445\u044d\u0432\u043b\u044d. \u0414\u0430\u0440\u0430\u0430 \u043d\u044c \"\u043b\u0438\u0439\u0440\" \u043d\u044d\u043c\u0436, \u0436\u0430\u0433\u0441\u0430\u0430\u043b\u0442\u044b\u043d \u0443\u0440\u0442 \u0445\u044d\u0432\u043b\u044d.",
  file: "list_ex1.py",
  defaultCode: "jims = [\"\u0430\u043b\u0438\u043c\", \"\u0433\u04af\u0437\u044d\u044d\u043b\u0437\u0433\u044d\u043d\u044d\", \"\u0442\u0430\u0432\u0438\u043b\u0436\", \"\u04af\u0445\u044d\u0440 \u043d\u04af\u0434\", \"\u0431\u0430\u043d\u0430\u043d\"]\n\nprint(jims[0])\nprint(jims[-1])\n\njims.append(\"\u043b\u0438\u0439\u0440\")\nprint(len(jims))",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "9-l2",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 2",
  badge: "easy",
  badgeText: "\u0410\u041c\u0410\u0420\u0425\u0410\u041d",
  title: "\u041e\u043d\u043e\u043e \u0442\u043e\u043e\u0446\u043e\u043e",
  task: "onoonuud = [78, 92, 65, 88, 71, 95, 83] \u0436\u0430\u0433\u0441\u0430\u0430\u043b\u0442\u044b\u0433 \u0430\u0448\u0438\u0433\u043b\u0430\u043d \u0434\u0443\u043d\u0434\u0430\u0436, \u0445\u0430\u043c\u0433\u0438\u0439\u043d \u04e9\u043d\u0434\u04e9\u0440 \u0431\u043e\u043b\u043e\u043d \u0445\u0430\u043c\u0433\u0438\u0439\u043d \u0431\u0430\u0433\u0430 \u043e\u043d\u043e\u043e\u0433 \u043e\u043b\u0436 \u0445\u044d\u0432\u043b\u044d. \u0414\u0430\u0440\u0430\u0430 \u043d\u044c \u0436\u0430\u0433\u0441\u0430\u0430\u043b\u0442\u044b\u0433 \u044d\u0440\u044d\u043c\u0431\u044d\u043b\u0436 \u0445\u044d\u0432\u043b\u044d.",
  file: "list_ex2.py",
  defaultCode: "onoonuud = [78, 92, 65, 88, 71, 95, 83]\n\ndundaj = sum(onoonuud) / len(onoonuud)\nprint(f\"\u0414\u0443\u043d\u0434\u0430\u0436: {dundaj}\")\nprint(f\"\u0425\u0430\u043c\u0433\u0438\u0439\u043d \u04e9\u043d\u0434\u04e9\u0440: {max(onoonuud)}\")\nprint(f\"\u0425\u0430\u043c\u0433\u0438\u0439\u043d \u0431\u0430\u0433\u0430: {min(onoonuud)}\")\n\nonoonuud.sort()\nprint(onoonuud)",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "9-l3",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 3",
  badge: "medium",
  badgeText: "\u0414\u0423\u041d\u0414",
  title: "\u0422\u044d\u0433\u0448 \u0442\u043e\u043e\u043d\u0443\u0443\u0434 (List \u0430\u0448\u0438\u0433\u043b\u0430\u043d)",
  task: "1-20 \u0445\u04af\u0440\u0442\u044d\u043b\u0445 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u0430\u0430\u0441 \u0442\u044d\u0433\u0448 \u0442\u043e\u043e\u043d\u0443\u0443\u0434\u044b\u0433 \u0448\u0438\u043d\u044d \u0436\u0430\u0433\u0441\u0430\u0430\u043b\u0442\u0430\u0434 \u0445\u0438\u0439\u0436 \u0445\u044d\u0432\u043b\u044d.",
  file: "list_ex3.py",
  defaultCode: "tegsh = []\n\nfor i in range(1, 21):\n    if i % 2 == 0:\n        tegsh.append(i)\n\nprint(tegsh)",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "9-l4",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 4",
  badge: "medium",
  badgeText: "\u0414\u0423\u041d\u0414",
  title: "\u0425\u043e\u0451\u0440 \u0434\u0430\u0445\u044c \u0445\u0430\u043c\u0433\u0438\u0439\u043d \u0438\u0445 \u0442\u043e\u043e",
  task: "\u0416\u0430\u0433\u0441\u0430\u0430\u043b\u0442\u0430\u0430\u0441 \u0445\u043e\u0451\u0440 \u0434\u0430\u0445\u044c \u0445\u0430\u043c\u0433\u0438\u0439\u043d \u0438\u0445 \u0442\u043e\u043e\u0433 \u043e\u043b.",
  file: "list_ex4.py",
  defaultCode: "tonuud = [14, 3, 77, 56, 91, 23, 45]\n\ntonuud.sort()\nprint(f\"\u0425\u043e\u0451\u0440 \u0434\u0430\u0445\u044c \u0445\u0430\u043c\u0433\u0438\u0439\u043d \u0438\u0445: {tonuud[-2]}\")",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
},
{
  id: "9-l5",
  num: "\u0414\u0410\u0421\u0413\u0410\u041b 5",
  badge: "hard",
  badgeText: "\u0425\u042d\u0426\u04ae\u04ae",
  title: "\u041c\u0430\u0442\u0440\u0438\u0446\u044b\u043d \u043d\u0438\u0439\u043b\u0431\u044d\u0440",
  task: "2 \u0445\u044d\u043c\u0436\u044d\u044d\u0441\u0442 \u0436\u0430\u0433\u0441\u0430\u0430\u043b\u0442 (\u043c\u0430\u0442\u0440\u0438\u0446) \u04af\u04af\u0441\u0433\u044d\u0436, \u0431\u04af\u0445 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u04af\u04af\u0434\u0438\u0439\u043d \u043d\u0438\u0439\u043b\u0431\u044d\u0440\u0438\u0439\u0433 \u043e\u043b.",
  file: "list_ex5.py",
  defaultCode: "matrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\nniilber = 0\nfor moron in matrix:\n    for too in moron:\n        niilber += too\n\nprint(f\"\u041d\u0438\u0439\u0442 \u043d\u0438\u0439\u043b\u0431\u044d\u0440: {niilber}\")",
  stdinHint: "\u041e\u0440\u043e\u043b\u0442 \u0448\u0430\u0430\u0440\u0434\u043b\u0430\u0433\u0430\u0433\u04af\u0439.",
}
      ],
    },
{
      tag: "\u0422\u043e\u0433\u043b\u043e\u043e\u043c",
      name: "\u0422\u043e\u043e \u0442\u0430\u0430\u0445",
      exercises: [
{
  id: "9-game",
  num: "\u0422\u04e8\u0421\u04e8\u041b",
  badge: "hard",
  badgeText: "\u0425\u042d\u0426\u04ae\u04ae",
  title: "\u0422\u043e\u043e \u0442\u0430\u0430\u0445 \u0442\u043e\u0433\u043b\u043e\u043e\u043c",
  task: "Random \u0441\u0430\u043d \u0430\u0448\u0438\u0433\u043b\u0430\u043d 1-100 \u0445\u043e\u043e\u0440\u043e\u043d\u0434 \u0442\u043e\u043e \u04af\u04af\u0441\u0433\u044d\u0436, \u0445\u044d\u0440\u044d\u0433\u043b\u044d\u0433\u0447 \u0437\u04e9\u0432 \u0442\u0430\u0430\u0436 \u0434\u0443\u0443\u0441\u0442\u0430\u043b \u0442\u043e\u0433\u043b\u043e\u043e\u043c \u044f\u0432\u043d\u0430. \"\u0418\u0445 \u0431\u0430\u0439\u043d\u0430\" / \"\u0411\u0430\u0433\u0430 \u0431\u0430\u0439\u043d\u0430\" \u0437\u04e9\u0432\u043b\u04e9\u0433\u04e9\u04e9 \u04e9\u0433\u043d\u04e9.",
  file: "guess_game.py",
  defaultCode: "import random\n\nnuuts_too = random.randint(1, 100)\norollt = 0\n\nprint(\"\u0422\u043e\u043e \u0442\u0430\u0430\u0445 \u0442\u043e\u0433\u043b\u043e\u043e\u043c \u044d\u0445\u044d\u043b\u043b\u044d\u044d! (1-100)\")\n\nwhile True:\n    taamsag = int(input(\"\u0422\u0430\u0430\u043c\u0430\u0433\u043b\u0430\u043b\u0430\u0430 \u043e\u0440\u0443\u0443\u043b\u043d\u0430 \u0443\u0443: \"))\n    orollt += 1\n\n    if taamsag == nuuts_too:\n        print(f\"\u0417\u04e9\u0432! {orollt} \u043e\u0440\u043e\u043b\u0434\u043b\u043e\u0433\u043e\u043e\u0440 \u0442\u0430\u0430\u043b\u0430\u0430!\")\n        break\n    elif taamsag > nuuts_too:\n        print(\"\u0410\u0440\u0430\u0439 \u0431\u0430\u0433\u0430 \u0442\u043e\u043e \u0445\u044d\u043b\u043d\u044d \u04af\u04af.\")\n    else:\n        print(\"\u0410\u0440\u0430\u0439 \u0438\u0445 \u0442\u043e\u043e \u0445\u044d\u043b\u043d\u044d \u04af\u04af.\")",
  stdinHint: "\u0416\u0438\u0448\u044d\u044d: \u0434\u043e\u043e\u0440 \u043c\u04e9\u0440 \u0431\u04af\u0440\u0442 \u043d\u044d\u0433 \u0442\u0430\u0430\u043c\u0430\u0433 (\u0436\u0438\u0448\u044d\u044d \u043d\u044c nuuts_too=63 \u0433\u044d\u0436 \u04af\u0437\u0432\u044d\u043b)\n50\n75\n63",
  defaultStdin: "50\n75\n63",
}
      ],
    }
    ],
  },
};

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
