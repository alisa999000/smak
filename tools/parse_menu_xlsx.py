#!/usr/bin/env python3
"""Парсинг Excel «МЕНЮ 1 и 2 СМЕНА» → JSON для сайта и menu-crm."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import pandas as pd

WEEKDAYS_RU = [
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
    "воскресенье",
]

SHIFT_SHEETS = {
    "M1": [f"М1-{i}" for i in range(1, 8)],
    "M2": [f"М2-{i}" for i in range(1, 8)],
}


def _cell(value) -> str:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ""
    if isinstance(value, pd.Timestamp):
        return value.strftime("%Y-%m-%d")
    return str(value).strip()


def _num(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _int_price(value) -> int | None:
    n = _num(value)
    if n is None:
        return None
    return int(round(n))


def parse_day_sheet(df: pd.DataFrame) -> list[dict]:
    items: list[dict] = []
    for i in range(1, len(df)):
        row = df.iloc[i]
        name = _cell(row.iloc[1])
        if not name:
            continue
        category = _cell(row.iloc[0])
        composition = _cell(row.iloc[2])
        weight = _cell(row.iloc[3])
        kcal = _num(row.iloc[4])
        protein = _num(row.iloc[5])
        fat = _num(row.iloc[6])
        carbs = _num(row.iloc[7])
        price = _int_price(row.iloc[8]) if len(row) > 8 else None

        nutrition = {}
        if kcal is not None:
            nutrition["kcal100"] = kcal
        if protein is not None:
            nutrition["protein"] = protein
        if fat is not None:
            nutrition["fat"] = fat
        if carbs is not None:
            nutrition["carbs"] = carbs

        items.append(
            {
                "category": category,
                "name": name,
                "composition": composition,
                "weight": weight,
                "nutrition": nutrition,
                "priceRub": price,
            }
        )
    return items


def parse_anchor_week_start(xl: pd.ExcelFile) -> str:
    for sheet in ("М1-неделя", "М1-1"):
        if sheet not in xl.sheet_names:
            continue
        df = pd.read_excel(xl, sheet_name=sheet, header=None)
        for i in range(min(5, len(df))):
            for j in range(df.shape[1]):
                val = df.iloc[i, j]
                if isinstance(val, pd.Timestamp):
                    d = val
                    # понедельник
                    while d.weekday() != 0:
                        d = d - pd.Timedelta(days=1)
                    return d.strftime("%Y-%m-%d")
                s = _cell(val)
                m = re.match(r"(\d{4}-\d{2}-\d{2})", s)
                if m:
                    return m.group(1)
    return "2026-09-21"


def build_menu(path: Path) -> dict:
    xl = pd.ExcelFile(path)
    anchor = parse_anchor_week_start(xl)
    shifts = []

    for shift_id, sheets in SHIFT_SHEETS.items():
        days = []
        for day_index, sheet in enumerate(sheets):
            if sheet not in xl.sheet_names:
                raise KeyError(f"Лист не найден: {sheet}")
            df = pd.read_excel(path, sheet_name=sheet, header=None)
            days.append(
                {
                    "dayIndex": day_index,
                    "weekdayRu": WEEKDAYS_RU[day_index],
                    "sheet": sheet,
                    "items": parse_day_sheet(df),
                }
            )
        shifts.append(
            {
                "id": shift_id,
                "label": "1 смена" if shift_id == "M1" else "2 смена",
                "days": days,
            }
        )

    return {
        "version": 1,
        "source": path.name,
        "anchorWeekStart": anchor,
        "shifts": shifts,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "xlsx",
        nargs="?",
        default=r"c:\Users\grinv\Downloads\Telegram Desktop\МЕНЮ 1 и 2 СМЕНА.xlsx",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=str(Path(__file__).resolve().parents[1] / "www" / "smachnaya.ru" / "assets" / "data" / "weekly-menu.json"),
    )
    args = parser.parse_args()

    src = Path(args.xlsx)
    if not src.is_file():
        print(f"Файл не найден: {src}", file=sys.stderr)
        return 1

    data = build_menu(src)
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    total_items = sum(len(d["items"]) for s in data["shifts"] for d in s["days"])
    print(f"OK: {out}")
    print(f"  anchorWeekStart={data['anchorWeekStart']}")
    print(f"  shifts={len(data['shifts'])}, days={sum(len(s['days']) for s in data['shifts'])}, items={total_items}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
