import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

const root = process.cwd();

const jobs = [
  { slug: "3b", name: "3Б", groupLabel: "Бага бүлэг", file: "uploads/docx/3b_new.docx", type: "docx", total: 20, male: 15, female: 5, teacher: "Э.Оюунбилэг" },
  { slug: "11a", name: "11А", groupLabel: "Ахлах бүлэг", file: "uploads/docx/11a_last.pptx", type: "pptx", total: 21, male: 11, female: 10, teacher: "Б.Ууганбаяр" },
  { slug: "7a", name: "7А", groupLabel: "Дунд бүлэг", file: "uploads/docx/7a.docx", type: "docx", total: 26, male: 15, female: 11, teacher: "Ж.Янжинлхам" },
  { slug: "5b", name: "5Б", groupLabel: "Бага бүлэг", file: "uploads/docx/5b.pptx", type: "pptx", total: 0, male: 0, female: 0 },
  { slug: "4a", name: "4А", groupLabel: "Бага бүлэг", file: "uploads/docx/4a.docx", type: "docx", total: 26, male: 17, female: 9, teacher: "С.Болортуяа" },
];

const tones = ["blue", "pink", "green", "amber", "purple", "red", "sky", "teal", "indigo"];
const icons = ["trophy", "star", "award", "medal", "book"];

function cleanText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function textFromXml(xml) {
  return [...xml.matchAll(/<(?:a:t|w:t)[^>]*>([\s\S]*?)<\/(?:a:t|w:t)>/g)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);
}

function entryNumber(entryName) {
  const match = entryName.match(/(?:slide|image)(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function imageExt(entryName) {
  const ext = path.extname(entryName).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) return ext === ".jpeg" ? ".jpeg" : ext;
  return ".png";
}

function extractImages(zip, job) {
  const mediaPrefix = job.type === "pptx" ? "ppt/media/" : "word/media/";
  const outDir = path.join(root, "public", "slides", job.slug);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const entries = zip.getEntries()
    .filter((entry) => !entry.isDirectory && entry.entryName.startsWith(mediaPrefix))
    .sort((a, b) => entryNumber(a.entryName) - entryNumber(b.entryName) || a.entryName.localeCompare(b.entryName));

  return entries.map((entry, index) => {
    const ext = imageExt(entry.entryName);
    const filename = `image${index + 1}${ext}`;
    fs.writeFileSync(path.join(outDir, filename), entry.getData());
    return `/slides/${job.slug}/${filename}`;
  });
}

function extractPptxSections(zip) {
  return zip.getEntries()
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName))
    .sort((a, b) => entryNumber(a.entryName) - entryNumber(b.entryName))
    .map((entry, index) => {
      const lines = textFromXml(entry.getData().toString("utf8"));
      return {
        title: lines[0] || `${index + 1}-р хэсэг`,
        achievements: lines.slice(1).filter((line) => line.length > 1),
      };
    })
    .filter((section) => section.title || section.achievements.length);
}

function extractDocxSections(zip) {
  const doc = zip.getEntry("word/document.xml");
  if (!doc) return [];
  const paragraphs = doc.getData().toString("utf8")
    .split(/<\/w:p>/)
    .map(textFromXml)
    .map((parts) => cleanText(parts.join(" ")))
    .filter((line) => line.length > 1);

  const sections = [];
  let current = null;

  for (const line of paragraphs) {
    const isHeading = line.length <= 70 && !/[.!?]$/.test(line) && (sections.length === 0 || /[А-ЯA-ZӨҮЁ]/.test(line[0]));
    if (!current || (isHeading && current.achievements.length > 0)) {
      current = { title: line, achievements: [] };
      sections.push(current);
    } else {
      current.achievements.push(line);
    }
  }

  return sections;
}

function attachImages(sections, images) {
  if (sections.length === 0) {
    return [{
      title: "Ангийн амжилтууд",
      achievements: ["Тайлант өдөрлөгийн материал"],
      images,
    }];
  }

  const buckets = sections.map((section) => ({ ...section, images: [] }));
  images.forEach((src, index) => {
    const target = buckets[Math.min(Math.floor(index * buckets.length / Math.max(images.length, 1)), buckets.length - 1)];
    target.images.push(src);
  });
  return buckets;
}

function quote(value) {
  return JSON.stringify(value);
}

function pageSource(job, sections) {
  const sectionObjects = sections.map((section, index) => {
    const achievements = section.achievements.length ? section.achievements : ["Тайлант өдөрлөгийн материал"];
    const images = section.images.map((src, imageIndex) => ({
      src,
      caption: `${section.title} ${imageIndex + 1}`,
    }));

    return `  {
    id: ${quote(`section-${index + 1}`)},
    tone: ${quote(tones[index % tones.length])},
    icon: ${quote(icons[index % icons.length])},
    label: ${quote(index === 0 ? "Танилцуулга" : "Амжилт")},
    title: ${quote(section.title)},
    achievements: [
${achievements.map((item) => `      { badge: ${quote("Онцлох")}, name: ${quote(item)} },`).join("\n")}
    ],
    images: [
${images.map((image) => `      { src: ${quote(image.src)}, caption: ${quote(image.caption)} },`).join("\n")}
    ],
  }`;
  }).join(",\n");

  const intro = sections[0]?.achievements?.[0] || `${job.name} ангийн тайлант өдөрлөгийн материал, амжилт бүтээлийг нэгтгэн харууллаа.`;
  const coverImage = sections.flatMap((section) => section.images)[0];
  const coverLine = coverImage ? `      coverImage={{ src: ${quote(coverImage)}, alt: ${quote(`${job.name} анги`)}, caption: ${quote(`${job.name} ангийн тайлант өдөрлөг`)} }}\n` : "";

  return `import { StaticClassReport, type ClassReportSection } from "@/components/StaticClassReport";

const sections: ClassReportSection[] = [
${sectionObjects}
];

export default function ${job.slug.replace(/(^|[a-z])([0-9]+)([a-z])/g, (_, a, n, b) => `${a}${n}${b.toUpperCase()}`).replace(/^[0-9]/, "Class$&")}Page() {
  return (
    <StaticClassReport
      groupLabel=${quote(job.groupLabel)}
      className=${quote(job.name)}
      totalStudents={${job.total}}
      maleStudents={${job.male}}
      femaleStudents={${job.female}}
${job.teacher ? `      teacher=${quote(job.teacher)}\n` : ""}${coverLine}      intro={
        <>
          ${intro}
        </>
      }
      sections={sections}
      footer=${quote(`${job.name} анги - Тайлант өдөрлөг 2025-2026`)}
    />
  );
}
`;
}

for (const job of jobs) {
  const zip = new AdmZip(path.join(root, job.file));
  const images = extractImages(zip, job);
  const rawSections = job.type === "pptx" ? extractPptxSections(zip) : extractDocxSections(zip);
  const sections = attachImages(rawSections, images);
  const outDir = path.join(root, "app", "classes", job.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "page.tsx"), pageSource(job, sections));
  console.log(`${job.slug}: ${sections.length} sections, ${images.length} images`);
}
