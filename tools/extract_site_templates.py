#!/usr/bin/env python3
"""Extract rows from Evo dump INSERT INTO `dt8b_site_templates` VALUES (...)."""
from __future__ import annotations

import re
import sys
from pathlib import Path


def split_sql_tuples(values: str) -> list[str]:
    """Split top-level comma-separated tuples inside VALUES (...)."""
    parts: list[str] = []
    depth = 0
    in_str = False
    esc = False
    start = 0
    for i, ch in enumerate(values):
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == "'":
                in_str = False
            continue
        if ch == "'":
            in_str = True
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        elif ch == "," and depth == 0:
            parts.append(values[start:i].strip())
            start = i + 1
    tail = values[start:].strip()
    if tail:
        parts.append(tail)
    return parts


def parse_tuple(s: str) -> str | None:
    s = s.strip()
    if not s.startswith("(") or not s.endswith(")"):
        return None
    return s[1:-1]


def split_fields(tuple_inner: str) -> list[str]:
    fields: list[str] = []
    cur: list[str] = []
    in_str = False
    esc = False
    depth_paren = 0
    for ch in tuple_inner:
        if in_str:
            cur.append(ch)
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == "'":
                in_str = False
            continue
        if ch == "'":
            in_str = True
            cur.append(ch)
            continue
        if ch == "(":
            depth_paren += 1
            cur.append(ch)
            continue
        if ch == ")":
            depth_paren -= 1
            cur.append(ch)
            continue
        if ch == "," and depth_paren == 0:
            fields.append("".join(cur))
            cur = []
            continue
        cur.append(ch)
    if cur:
        fields.append("".join(cur))
    return fields


def unquote_sql_string(s: str) -> str:
    s = s.strip()
    if len(s) >= 2 and s[0] == "'" and s[-1] == "'":
        inner = s[1:-1]
        return (
            inner.replace("\\\\", "\\")
            .replace("\\'", "'")
            .replace('\\"', '"')
            .replace("\\r\\n", "\n")
            .replace("\\n", "\n")
            .replace("\\r", "\r")
        )
    return s


def main() -> None:
    sql_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "u2071240_smachnay.sql"
    text = sql_path.read_text(encoding="utf-8", errors="replace")
    m = re.search(
        r"INSERT INTO `dt8b_site_templates` VALUES\s*(.+);",
        text,
        flags=re.DOTALL,
    )
    if not m:
        print("INSERT site_templates not found", file=sys.stderr)
        sys.exit(1)
    blob = m.group(1).strip()
    if blob.endswith(";"):
        blob = blob[:-1].strip()
    tuples_raw = split_sql_tuples(blob)
    want = {int(x) for x in sys.argv[2:]} if len(sys.argv) > 2 else {6, 7, 8, 9, 14}
    for tr in tuples_raw:
        inner = parse_tuple(tr)
        if inner is None:
            continue
        fields = split_fields(inner)
        if not fields:
            continue
        tid = int(fields[0].strip())
        if tid not in want:
            continue
        name = unquote_sql_string(fields[1])
        alias = unquote_sql_string(fields[2])
        desc = unquote_sql_string(fields[3])
        content = unquote_sql_string(fields[8]) if len(fields) > 8 else ""
        print("===", tid, name, "|", alias, "===")
        print("desc:", desc[:120].replace("\n", " "))
        print("content_len:", len(content))
        out = Path(__file__).resolve().parents[1] / "www" / "smachnaya.ru" / "_extracted" / f"template-{tid}-{alias or 'noalias'}.txt"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(content, encoding="utf-8")
        print("wrote", out)


if __name__ == "__main__":
    main()
