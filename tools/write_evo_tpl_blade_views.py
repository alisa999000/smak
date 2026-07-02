#!/usr/bin/env python3
"""Generate MODX_BASE_PATH/views/tpl-{id}.blade.php from MySQL-exported HTML (evo_parser nowdoc)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWS = ROOT / "www" / "smachnaya.ru" / "views"
SRC = ROOT / "www" / "smachnaya.ru" / "_extracted"


def main() -> None:
    VIEWS.mkdir(parents=True, exist_ok=True)
    mapping = [(6, "db-t6.html"), (7, "db-t7.html"), (8, "db-t8.html"), (9, "db-t9.html"), (14, "db-t14.html")]
    for tid, fname in mapping:
        body_path = SRC / fname
        body = body_path.read_text(encoding="utf-8")
        if body.startswith("\ufeff"):
            body = body.lstrip("\ufeff")
        marker = f"_EVO_TPL_{tid}_BODY_EOF_{tid}_"
        if marker in body:
            raise SystemExit(f"Marker collision in template {tid}")
        out = VIEWS / f"tpl-{tid}.blade.php"
        out.write_text(
            "<?php\n"
            "/** Blade-обёртка шаблона из БД (site_templates.id="
            f"{tid}"
            "). Рендер через evo_parser — теги Evo ([[*]], [[snippet]], {{chunk}}) как в админке. */\n"
            f"$__body = <<<'{marker}'\n"
            f"{body}"
            f"\n{marker};\n"
            "?>\n"
            "{!! evo_parser($__body) !!}\n",
            encoding="utf-8",
            newline="\n",
        )
        print("wrote", out, "bytes", out.stat().st_size)


if __name__ == "__main__":
    main()
