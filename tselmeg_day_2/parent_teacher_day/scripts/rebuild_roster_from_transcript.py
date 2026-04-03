#!/usr/bin/env python3
"""
Cursor agent transcript (.jsonl)-аас LXP хүснэгтийн HTML-ийг олж data/grade_*.json roster үүсгэнэ.
Ирц/дүн нэмсэн өгөгдлийг хамгаалах: аль хэдийн байгаа файлд grade_coursework_mt байвал дарахгүй.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_TRANSCRIPT = Path.home() / (
    ".cursor/projects/Users-tsogboldbaatar-Desktop-tselmeg-day-2/"
    "agent-transcripts/1f2a1a17-73ee-4957-988e-956d8bfebe2b/"
    "1f2a1a17-73ee-4957-988e-956d8bfebe2b.jsonl"
)


def msg_text(obj: dict) -> str:
    c = obj.get("message", {}).get("content", [])
    if isinstance(c, list):
        parts: list[str] = []
        for x in c:
            if isinstance(x, dict) and x.get("type") == "text":
                parts.append(x.get("text", ""))
        return "\n".join(parts)
    return ""


def parse_lxp_rows(html: str) -> list[dict]:
    students: list[dict] = []
    for m in re.finditer(r'<tr class="dt-row-(\d+)', html):
        start = m.start()
        end = html.find("</tr>", start)
        if end == -1:
            continue
        tr = html[start : end + 5]
        row_id = int(m.group(1))
        img = re.search(r'src="([^"]+)"', tr)
        if not img:
            continue
        photo_url = img.group(1).strip()
        if photo_url.startswith("/"):
            photo_url = "https://lxp.eschool.mn" + photo_url
        elif not photo_url.startswith("http"):
            continue
        tds = re.findall(r"<td[^>]*>(.*?)</td>", tr, re.DOTALL)
        texts: list[str] = []
        for td in tds:
            t = re.sub(r"<[^>]+>", " ", td)
            t = re.sub(r"\s+", " ", t).strip()
            texts.append(t)
        if len(texts) < 5:
            continue
        try:
            list_no = int(texts[0])
        except ValueError:
            continue
        students.append(
            {
                "lxp_row_id": row_id,
                "list_no": list_no,
                "student_code": texts[2].strip(),
                "family_name": texts[3].strip(),
                "given_name": texts[4].strip(),
                "photo_url": photo_url,
            }
        )
    return students


def class_label(filename: str) -> str:
    m = re.match(r"grade_(\d+)([a-z])\.json$", filename, re.I)
    if m:
        return f"{m.group(1)}{m.group(2).upper()}"
    return filename.replace("grade_", "").replace(".json", "").upper()


def map_filename_to_html(lines: list[str]) -> dict[str, str]:
    """User зурвас → дараагийн assistant-ын grade_*.json нэр → сүүлийн HTML."""
    by_file: dict[str, str] = {}
    for i, line in enumerate(lines):
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if obj.get("role") != "user":
            continue
        t = msg_text(obj)
        if "dt-row-" not in t or "lxp-cdn" not in t:
            continue
        fname = None
        for j in range(i + 1, min(i + 25, len(lines))):
            o2 = json.loads(lines[j])
            if o2.get("role") != "assistant":
                continue
            tt = msg_text(o2)
            m = re.search(r"[`']?(?:data/)?grade_([a-z0-9]+)\.json[`']?", tt, re.I)
            if m:
                fname = f"grade_{m.group(1)}.json"
                break
        if fname:
            by_file[fname] = t
    return by_file


def has_rich_student_data(path: Path) -> bool:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        sts = data.get("students") or []
        if not sts:
            return False
        return "grade_coursework_mt" in sts[0] or "attendance_total_sessions" in sts[0]
    except (OSError, json.JSONDecodeError, KeyError, IndexError):
        return False


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--transcript",
        type=Path,
        default=DEFAULT_TRANSCRIPT,
        help="agent transcript .jsonl",
    )
    ap.add_argument(
        "--out-dir",
        type=Path,
        default=ROOT / "data",
        help="data directory",
    )
    ap.add_argument(
        "--force",
        action="store_true",
        help="бүрэн дүнтэй файлуудыг ч дахин бичих (анхаар!)",
    )
    args = ap.parse_args()

    lines = args.transcript.read_text(encoding="utf-8").splitlines()
    by_file = map_filename_to_html(lines)
    out_dir = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    written = 0
    skipped = 0
    for fname in sorted(by_file.keys()):
        dest = out_dir / fname
        if dest.exists() and has_rich_student_data(dest) and not args.force:
            print("skip (бүрэн дүнтэй)", dest.name)
            skipped += 1
            continue
        students = parse_lxp_rows(by_file[fname])
        if not students:
            print("warning: no rows", fname)
            continue
        payload = {
            "class": class_label(fname),
            "source": "lxp.eschool.mn (roster HTML export) — transcript recovery",
            "exported_at": "2026-04-03",
            "students": students,
        }
        dest.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print("wrote", dest.name, len(students), "students")
        written += 1

    print("done: written", written, "skipped", skipped)


if __name__ == "__main__":
    main()
