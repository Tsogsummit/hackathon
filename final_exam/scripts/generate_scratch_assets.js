import fs from "node:fs";
import path from "node:path";
import { ROOT_DIR } from "../src/config.js";
import { buildGrade6QuestionBank } from "../src/grade6.js";

const outDir = path.join(ROOT_DIR, "public", "assets", "scratch-blocks");
fs.mkdirSync(outDir, { recursive: true });

function escapeXml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
}

function colorFor(line) {
  if (line.startsWith("when")) return "#ffd84d";
  if (line.startsWith("define") || ["startup", "movement", "endgame"].includes(line)) return "#f06292";
  if (line.startsWith("if") || line.startsWith("repeat") || line.startsWith("forever")) return "#ffbf35";
  if (line.includes("backdrop") || line.includes("sound") || line.includes("say")) return "#a66cff";
  return "#5c8df6";
}

function wrapText(text, max = 52) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (`${current} ${word}`.trim().length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

function label(text, x, y, size = 18, fill = "#183153", weight = "700") {
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(text)}</text>`;
}

function paragraph(text, x, y, max = 48, size = 16, fill = "#344054") {
  return wrapText(text, max)
    .map((line, index) => `<text x="${x}" y="${y + index * (size + 7)}" font-family="Arial, sans-serif" font-size="${size}" fill="${fill}">${escapeXml(line)}</text>`)
    .join("");
}

function scratchBlock(line, step, x, y, width = 500) {
  const color = colorFor(line);
  const lines = wrapText(line, 42);
  const height = 34 + lines.length * 24;
  const text = lines
    .map((item, index) => `<text x="${x + 54}" y="${y + 31 + index * 24}" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#1d2939">${escapeXml(item)}</text>`)
    .join("");
  return `
    <circle cx="${x + 22}" cy="${y + 24}" r="15" fill="#fff" stroke="#1d2939" stroke-width="2"/>
    <text x="${x + 17}" y="${y + 30}" font-family="Arial" font-size="16" font-weight="700" fill="#1d2939">${step}</text>
    <rect x="${x + 42}" y="${y}" width="${width}" height="${height}" rx="12" fill="${color}" stroke="#d0a12c" stroke-width="2"/>
    ${text}`;
}

function stagePreview(kind, x, y) {
  const base = `
    <rect x="${x}" y="${y}" width="214" height="156" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="${x + 107}" y1="${y + 16}" x2="${x + 107}" y2="${y + 140}" stroke="#d0d5dd" stroke-dasharray="4 4"/>
    <line x1="${x + 18}" y1="${y + 78}" x2="${x + 196}" y2="${y + 78}" stroke="#d0d5dd" stroke-dasharray="4 4"/>
    <text x="${x + 88}" y="${y + 148}" font-family="Arial" font-size="12" fill="#667085">Stage</text>`;
  const frog = `<circle cx="${x + 107}" cy="${y + 126}" r="13" fill="#31b76a"/><text x="${x + 90}" y="${y + 113}" font-family="Arial" font-size="12" font-weight="700" fill="#16845b">Frog</text>`;
  const gift = `<rect x="${x + 82}" y="${y + 18}" width="28" height="28" rx="4" fill="#f7c948"/><line x1="${x + 96}" y1="${y + 18}" x2="${x + 96}" y2="${y + 46}" stroke="#b54708" stroke-width="3"/><text x="${x + 66}" y="${y + 62}" font-family="Arial" font-size="12" font-weight="700" fill="#a15c00">Gift</text>`;
  const snake = `<path d="M${x + 36} ${y + 92} C${x + 58} ${y + 68}, ${x + 80} ${y + 116}, ${x + 104} ${y + 92}" stroke="#5f8f3e" stroke-width="10" fill="none"/><text x="${x + 27}" y="${y + 119}" font-family="Arial" font-size="12" font-weight="700" fill="#5f8f3e">Snake</text>`;
  const maze = `<path d="M${x + 20} ${y + 118} L${x + 72} ${y + 118} L${x + 72} ${y + 70} L${x + 138} ${y + 70} L${x + 138} ${y + 32} L${x + 190} ${y + 32}" stroke="#101828" stroke-width="13" fill="none" stroke-linecap="round"/>`;
  if (kind === "snake") return `${base}${frog}${snake}`;
  if (kind === "gift") return `${base}${frog}${gift}`;
  if (kind === "maze") return `${base}${maze}${frog}${gift}`;
  return `${base}${frog}`;
}

function svg(title, subtitle, content, height = 760) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${height}" viewBox="0 0 900 ${height}">
  <rect width="900" height="${height}" fill="#f7fbff"/>
  <rect x="24" y="22" width="852" height="${height - 44}" rx="18" fill="#ffffff" stroke="#d9dee8"/>
  ${label(title, 54, 64, 28)}
  ${paragraph(subtitle, 54, 96, 82, 17)}
  ${content}
</svg>`;
}

function kindFor(question) {
  const text = `${question.topic} ${question.question_text}`;
  if (text.includes("Snake")) return "snake";
  if (text.includes("Gift") || text.includes("Birthday")) return "gift";
  if (text.includes("Maze") || text.includes("хар хан")) return "maze";
  return "frog";
}

const grade6 = buildGrade6QuestionBank();
const blockReadings = grade6.filter((question) => question.type === "block_reading");
blockReadings.forEach((question, index) => {
  const lines = question.block_script.split("\n");
  const blocks = lines.map((line, lineIndex) => scratchBlock(line.trim(), lineIndex + 1, 74, 176 + lineIndex * 70, 540)).join("");
  const preview = stagePreview(kindFor(question), 638, 178);
  const hint = `
    <rect x="638" y="360" width="196" height="138" rx="12" fill="#eef6ff" stroke="#b8d9ff"/>
    ${label("Сануулах зүйл", 654, 390, 18, "#175cd3")}
    ${paragraph("Алхам бүрийг дээрээс доош уншина. Loop дотор байгаа block нь давтагдана.", 654, 418, 24, 14, "#344054")}`;
  fs.writeFileSync(
    path.join(outDir, `block-reading-${index + 1}.svg`),
    svg(`Блок унших ${index + 1}: ${question.topic}`, "Дугаартай block-уудыг 1-ээс эхлэн дарааллаар нь уншаарай.", `${blocks}${preview}${hint}`, Math.max(650, 236 + lines.length * 70))
  );
});

const practicals = grade6.filter((question) => question.type === "scratch_practical");
practicals.forEach((question, index) => {
  const textLines = question.question_text.split("\n");
  const title = textLines[0] || `Scratch засвар ${index + 1}`;
  const stepLines = textLines.filter((line) => /^\d+\./.test(line.trim())).slice(0, 4);
  const stepCards = stepLines
    .map((line, stepIndex) => {
      const y = 178 + stepIndex * 88;
      return `
        <rect x="62" y="${y}" width="404" height="68" rx="12" fill="#f8fafc" stroke="#d9dee8"/>
        <circle cx="92" cy="${y + 34}" r="18" fill="#1f6feb"/>
        <text x="86" y="${y + 41}" font-family="Arial" font-size="18" font-weight="700" fill="#fff">${stepIndex + 1}</text>
        ${paragraph(line.replace(/^\d+\.\s*/, ""), 124, y + 28, 38, 15, "#1d2939")}`;
    })
    .join("");
  const blockHelp = [
    scratchBlock("when green flag clicked", 1, 506, 178, 300),
    scratchBlock("startup", 2, 536, 244, 220),
    scratchBlock("repeat until touching Gift?", 3, 536, 310, 300),
    scratchBlock("movement", 4, 566, 376, 220),
    scratchBlock("if touching color black?", 5, 566, 442, 300),
    scratchBlock("go to x: 0 y: -150", 6, 596, 508, 260)
  ].join("");
  const preview = stagePreview("maze", 86, 548);
  const note = `
    <rect x="506" y="610" width="308" height="70" rx="12" fill="#fff8e8" stroke="#f0c36d"/>
    ${paragraph("Энэ бол хийх block-уудын жишээ. Project дээрээ тохирох sprite-ийн script хэсэгт байрлуулна.", 524, 636, 38, 14, "#7a4d00")}`;
  fs.writeFileSync(
    path.join(outDir, `practical-${index + 1}.svg`),
    svg(`Scratch засвар ${index + 1}: ${title}`, "Project-ийг шинээр хийхгүй. Доорх алхмуудаар алдаатай хэсгийг засна.", `${stepCards}${blockHelp}${preview}${note}`, 730)
  );
});

console.log(`Generated ${blockReadings.length + practicals.length} Scratch SVG assets in ${outDir}`);
