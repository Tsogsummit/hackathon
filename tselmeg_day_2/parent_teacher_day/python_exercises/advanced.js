/**
 * Skulpt + Turtle — advanced.html
 */
function outf(text) {
  const el = document.getElementById("sk-output");
  if (el) el.textContent += text;
}

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
    throw new Error("File not found: '" + x + "'");
  }
  return Sk.builtinFiles["files"][x];
}

function runSkulpt() {
  const prog = document.getElementById("sk-code").value;
  const out = document.getElementById("sk-output");
  out.textContent = "";

  Sk.configure({
    output: outf,
    read: builtinRead,
    __future__: Sk.python3,
  });

  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "sk-canvas";

  Sk.misceval
    .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, prog, true))
    .then(
      () => {},
      (err) => {
        out.textContent = err.toString();
      }
    );
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sk-run");
  if (btn) btn.addEventListener("click", runSkulpt);
});
