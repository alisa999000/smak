# -*- coding: utf-8 -*-
"""Экспорт поля content шаблонов Evo из SQL-дампа в .blade.php."""
from __future__ import annotations

import re
from pathlib import Path


def split_sql_value_tuples(values_body: str) -> list[str]:
    """values_body = текст после VALUES до ';' включая ведущую '(' у первого кортежа."""
    s = values_body.strip().rstrip(";").strip()
    out: list[str] = []
    i = 0
    n = len(s)
    while i < n:
        while i < n and s[i] in " \t\r\n":
            i += 1
        if i >= n:
            break
        if s[i] != "(":
            raise ValueError(f"expected '(' at {i}, got {s[i:i+20]!r}")
        depth = 0
        in_str = False
        esc = False
        start = i
        while i < n:
            ch = s[i]
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == "'":
                    in_str = False
                i += 1
                continue
            if ch == "'":
                in_str = True
                i += 1
                continue
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
            i += 1
            if depth == 0:
                out.append(s[start + 1 : i - 1])
                break
        while i < n and s[i] in " \t\r\n,":
            i += 1
    return out


def parse_fields(tup_inner: str) -> list[str]:
    fields: list[str] = []
    i = 0
    n = len(tup_inner)
    while i < n:
        while i < n and tup_inner[i] in " \t\r\n,":
            i += 1
        if i >= n:
            break
        if tup_inner[i] == "'":
            i += 1
            buf: list[str] = []
            esc = False
            while i < n:
                c = tup_inner[i]
                if esc:
                    esc_map = {"n": "\n", "r": "\r", "t": "\t", "\\": "\\", "'": "'", '"': '"'}
                    buf.append(esc_map.get(c, c))
                    esc = False
                    i += 1
                    continue
                if c == "\\":
                    esc = True
                    i += 1
                    continue
                if c == "'":
                    if i + 1 < n and tup_inner[i + 1] == "'":
                        buf.append("'")
                        i += 2
                        continue
                    i += 1
                    break
                buf.append(c)
                i += 1
            fields.append("".join(buf))
            continue
        j = i
        while j < n and tup_inner[j] not in ",":
            j += 1
        fields.append(tup_inner[i:j].strip())
        i = j
    return fields


def main() -> None:
    sql_path = Path(__file__).resolve().parent.parent / "u2071240_smachnay.sql"
    out_dir = (
        Path(__file__).resolve().parent.parent
        / "www"
        / "smachnaya.ru"
        / "core"
        / "custom"
        / "resources"
        / "views"
        / "evo-db"
    )
    out_dir.mkdir(parents=True, exist_ok=True)

    d = sql_path.read_text(encoding="utf-8", errors="replace")
    m = re.search(
        r"INSERT INTO `dt8b_site_templates` VALUES (.+?);\s*\n/\*!40000 ALTER TABLE `dt8b_site_templates`",
        d,
        re.S,
    )
    if not m:
        raise SystemExit("INSERT site_templates not found")

    tuples = split_sql_value_tuples(m.group(1))
    wanted = {6, 7, 8, 9, 14}
    index_md: list[str] = ["# Шаблоны из дампа `u2071240_smachnay.sql` → Blade\n\n"]
    found = 0

    for inner in tuples:
        fields = parse_fields(inner)
        if len(fields) < 9:
            continue
        try:
            tid = int(fields[0])
        except ValueError:
            continue
        if tid not in wanted:
            continue
        name = fields[1].replace("/", "-")
        alias = fields[2] or "no-alias"
        content = fields[8].replace("\r\n", "\n")

        safe = f"template-{tid}-{alias}.blade.php"
        header = (
            "{{--\n"
            f"  Evo: dt8b_site_templates.id={tid}, name={name!r}, alias={alias!r}\n"
            "  Экспорт: tools/export_evo_templates_to_blade.py\n"
            "  Дальше: подключать через @include из Laravel или копировать в чанки Evo.\n"
            "--}}\n\n"
        )
        (out_dir / safe).write_text(header + content + "\n", encoding="utf-8")
        index_md.append(f"- **{tid}** `{name}` (`{alias}`) → `{safe}`\n")
        found += 1

    (out_dir / "README.md").write_text("".join(index_md), encoding="utf-8")
    print("exported", found, "templates ->", out_dir)


if __name__ == "__main__":
    main()
