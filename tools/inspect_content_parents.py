# -*- coding: utf-8 -*-
import re
from pathlib import Path

d = Path(__file__).resolve().parent.parent.joinpath("u2071240_smachnay.sql").read_text(encoding="utf-8")
# Evo site_content: id, type, contentType, pagetitle, longtitle, description, alias, link_attributes, published, parent, ...
# parse tuples like export script
m = re.search(r"INSERT INTO `dt8b_site_content` VALUES (.+?);\n", d, re.S)
body = m.group(1).strip().rstrip(";")

def split_tuples(s):
    out = []
    i = 0
    n = len(s)
    while i < n:
        while i < n and s[i] in " \t\r\n":
            i += 1
        if i >= n:
            break
        assert s[i] == "("
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

def parse_fields(tup_inner):
    fields = []
    i = 0
    n = len(tup_inner)
    while i < n:
        while i < n and tup_inner[i] in " \t\r\n,":
            i += 1
        if i >= n:
            break
        if tup_inner[i] == "'":
            i += 1
            buf = []
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

for inner in split_tuples(body):
    f = parse_fields(inner)
    if len(f) < 11 or f[1] != "document":
        continue
    try:
        rid = int(f[0])
    except ValueError:
        continue
    if rid not in (13, 14, 15, 16, 17, 29, 30, 31, 32, 33):
        continue
    parent = f[9]
    tmpl = f[10] if len(f) > 10 else "?"
    print(rid, f[3], "alias=", f[6], "parent=", parent, "template=", tmpl)
