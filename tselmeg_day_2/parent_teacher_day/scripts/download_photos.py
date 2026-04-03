#!/usr/bin/env python3
"""Download student photos from a grade_*.json into photos/."""

import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "photos"


def photo_filename(list_no: int, student_code: str, url: str) -> str:
    ext = Path(url.split("?", 1)[0]).suffix or ".png"
    return f"{list_no:02d}_{student_code}{ext}"


def main() -> None:
    rel = sys.argv[1] if len(sys.argv) > 1 else "data/grade_6b.json"
    DATA = Path(rel) if rel.startswith("/") else ROOT / rel
    if not DATA.is_file():
        DATA = ROOT / "data" / Path(rel).name
    if not DATA.is_file():
        print("Файл олдсонгүй:", rel, file=sys.stderr)
        sys.exit(1)

    with open(DATA, encoding="utf-8") as f:
        payload = json.load(f)

    OUT.mkdir(parents=True, exist_ok=True)
    for s in payload["students"]:
        url = s["photo_url"]
        if url.startswith("/"):
            url = "https://lxp.eschool.mn" + url
            s["photo_url"] = url
        fn = photo_filename(s["list_no"], s["student_code"], url)
        dest = OUT / fn
        if dest.exists():
            print("skip", dest.name)
            continue
        print("get", url, "->", dest.name)
        req = urllib.request.Request(url, headers={"User-Agent": "ParentTeacherDay/1.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            dest.write_bytes(resp.read())
        s["photo_local"] = f"photos/{fn}"

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("Updated", DATA, "with photo_local paths.")


if __name__ == "__main__":
    main()
