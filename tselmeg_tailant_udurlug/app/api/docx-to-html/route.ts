import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import AdmZip from "adm-zip";

// Minimal pptx text extractor: reads slide XML and extracts <a:t> text nodes per slide
function extractPptxAsHtml(buffer: Buffer): string {
  try {
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    // Collect slide files in order
    const slideEntries = entries
      .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
      .sort((a, b) => {
        const na = parseInt(a.entryName.match(/\d+/)![0]);
        const nb = parseInt(b.entryName.match(/\d+/)![0]);
        return na - nb;
      });

    const slideHtmlParts: string[] = [];

    for (let i = 0; i < slideEntries.length; i++) {
      const xml = slideEntries[i].getData().toString("utf8");

      // Extract all text runs <a:t>...</a:t>
      const textMatches = [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)];
      const texts = textMatches
        .map((m) => m[1].trim())
        .filter((t) => t.length > 0);

      if (texts.length === 0) continue;

      // First text on slide → treat as slide heading
      const [heading, ...rest] = texts;
      const slideNumber = i + 1;

      let html = `<h2>${slideNumber}. ${heading}</h2>`;
      if (rest.length > 0) {
        html += `<ul>${rest.map((t) => `<li>${t}</li>`).join("")}</ul>`;
      }
      slideHtmlParts.push(html);
    }

    if (slideHtmlParts.length === 0) {
      return "<p>PPTX-с агуулга олдсонгүй.</p>";
    }

    return slideHtmlParts.join("\n");
  } catch (err) {
    console.error("pptx parse error:", err);
    return "<p>PPTX файлыг уншихад алдаа гарлаа.</p>";
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Файл олдсонгүй" }, { status: 400 });
    }

    const isPptx = file.name.endsWith(".pptx");
    const isDocx = file.name.endsWith(".docx");

    if (!isPptx && !isDocx) {
      return NextResponse.json(
        { error: "Зөвхөн .docx эсвэл .pptx файл дэмжинэ" },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Save original file
    const uploadDir = path.join(process.cwd(), "uploads", "docx");
    await mkdir(uploadDir, { recursive: true });
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    await writeFile(path.join(uploadDir, safeName), bytes);

    let html = "";
    let warnings: string[] = [];

    if (isDocx) {
      const result = await mammoth.convertToHtml(
        { buffer: bytes },
        {
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Heading 4'] => h4:fresh",
            "b => strong",
            "i => em",
          ],
        }
      );
      html = result.value;
      warnings = result.messages.map((m) => m.message);
    } else {
      // pptx
      html = extractPptxAsHtml(bytes);
    }

    return NextResponse.json({ html, warnings, savedAs: safeName, type: isDocx ? "docx" : "pptx" });
  } catch (err) {
    console.error("docx-to-html error:", err);
    return NextResponse.json({ error: "Хөрвүүлэлт амжилтгүй боллоо" }, { status: 500 });
  }
}
