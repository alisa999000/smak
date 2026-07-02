#!/usr/bin/env python3
"""Extract all rows from dt8b_site_htmlsnippets."""
from __future__ import annotations
import re, sys
from pathlib import Path

# Reuse from extract_site_templates
sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_site_templates import split_sql_tuples, parse_tuple, split_fields, unquote_sql_string

def main():
    sql_path = Path(__file__).resolve().parents[1] / "u2071240_smachnay.sql"
    text = sql_path.read_text(encoding="utf-8", errors="replace")
    m = re.search(r"INSERT INTO `dt8b_site_htmlsnippets` VALUES\s*(.+);", text, flags=re.DOTALL)
    if not m:
        print("not found"); return
    blob = m.group(1).strip()
    out_dir = Path(__file__).resolve().parents[1] / "www" / "smachnaya.ru" / "_extracted" / "chunks"
    out_dir.mkdir(parents=True, exist_ok=True)
    for tr in split_sql_tuples(blob):
        inner = parse_tuple(tr)
        if inner is None: continue
        fields = split_fields(inner)
        if len(fields) < 8: continue
        cid = int(fields[0].strip())
        name = unquote_sql_string(fields[1])
        content = unquote_sql_string(fields[7]) if len(fields) > 7 else ""
        print(cid, name, len(content))
        (out_dir / f"{cid}-{name}.html").write_text(content, encoding="utf-8")

if __name__ == "__main__":
    main()
