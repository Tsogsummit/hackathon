#!/usr/bin/env python3
"""
advanced_answers.html-ийг advanced_snippets/ дахь .py файлуудаас дахин үүсгэх (идэвхжүүлэхэд өргөтгөнө).

Одоогоор: advanced_answers.html аль хэдийн бэлэн; шинэ .py нэмсэн бол HTML-ийг гараар эсвэл энэ скриптийг өргөтгөж шинэчилнэ.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SNIP = ROOT / "advanced_snippets"


def main() -> None:
    pys = sorted(SNIP.glob("*.py")) if SNIP.is_dir() else []
    print(f"advanced_snippets: {len(pys)} файл — {', '.join(p.name for p in pys) or '(хоосон)'}")


if __name__ == "__main__":
    main()
