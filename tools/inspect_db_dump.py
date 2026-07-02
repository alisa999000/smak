# -*- coding: utf-8 -*-
"""List documents and templates from Evo SQL dump (u2071240_smachnay.sql)."""
import re
from pathlib import Path

p = Path(__file__).resolve().parent.parent / "u2071240_smachnay.sql"
d = p.read_text(encoding="utf-8", errors="replace")

block_start = d.find("INSERT INTO `dt8b_site_content` VALUES ")
block_end = d.find("INSERT INTO `dt8b_site_htmlsnippets`", block_start)
block = d[block_start:block_end]

# Match document rows: id, 'document','text/html', pagetitle, ..., alias (6th quoted string after contentType)
pat = re.compile(
    r"\((\d+),'document','text/html','((?:[^'\\]|\\.|'')*?)','((?:[^'\\]|\\.|'')*?)','((?:[^'\\]|\\.|'')*?)','((?:[^'\\]|\\.|'')*?)'"
)
rows = pat.findall(block)
out = Path(__file__).resolve().parent / "_db_site_content_docs.txt"
lines = [f"Found {len(rows)} documents in dt8b_site_content:\n"]
for rid, title, _lt, _desc, alias in rows:
    t = title.replace("''", "'")
    a = alias.replace("''", "'")
    lines.append(f"  id={rid}\tpagetitle={t!r}\talias={a!r}\n")
out.write_text("".join(lines), encoding="utf-8")

tpl_block_start = d.find("INSERT INTO `dt8b_site_templates` VALUES ")
tpl_block_end = d.find("INSERT INTO `dt8b_site_tmplvar_contentvalues`", tpl_block_start)
tpl_block = d[tpl_block_start:tpl_block_end]
tpl = re.findall(r"\((\d+),'((?:[^'\\]|\\.|'')*?)'", tpl_block)
out2 = Path(__file__).resolve().parent / "_db_site_templates.txt"
tlines = [f"Found {len(tpl)} templates in dt8b_site_templates:\n"]
for tid, name in tpl:
    nm = name.replace("''", "'")
    tlines.append(f"  id={tid}\t{nm!r}\n")
out2.write_text("".join(tlines), encoding="utf-8")

# Cabinet-related keywords in full dump
keys = (
    "кабинет",
    "личн",
    "регистрац",
    "авторизац",
    "vhod",
    "kabinet",
    "lk",
    "evocms-user",
    "data-evocms-user",
    "commerce_orders",
)
rep = Path(__file__).resolve().parent / "_db_keyword_hits.txt"
hl = []
for kw in keys:
    if kw.lower() in d.lower():
        hl.append(f"substring {kw!r} appears somewhere in dump\n")
rep.write_text("".join(hl), encoding="utf-8")
print("Wrote", out, out2, rep)
