#!/usr/bin/env python3
"""Извлечение текста слайдов из XML-экспорта PowerPoint (Flat OPC)."""

from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

A_NS = "{http://schemas.openxmlformats.org/drawingml/2006/main}"


def slide_text(xml: str) -> str:
    root = ET.fromstring(f"<root>{xml}</root>")
    chunks: list[str] = []
    for node in root.iter(f"{A_NS}t"):
        if node.text:
            chunks.append(node.text)
        if node.tail:
            chunks.append(node.tail)
    return re.sub(r"\s+", " ", "".join(chunks)).strip()


def extract(path: Path) -> list[tuple[int, str]]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    pattern = r'pkg:name="(/ppt/slides/slide\d+\.xml)".*?<pkg:xmlData>(.*?)</pkg:xmlData>'
    parts = re.findall(pattern, text, re.S)
    slides: list[tuple[int, str]] = []
    for name, xml in parts:
        num = int(re.search(r"slide(\d+)", name).group(1))
        slides.append((num, slide_text(xml)))
    slides.sort(key=lambda x: x[0])
    return slides


def main() -> int:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else r"c:\Users\grinv\Downloads\Telegram Desktop\Доработка сайта.xml")
    slides = extract(path)
    for num, txt in slides:
        print("=" * 20, f"SLIDE {num}", "=" * 20)
        print(txt)
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
