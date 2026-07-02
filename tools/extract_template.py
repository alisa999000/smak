# -*- coding: utf-8 -*-
import re
import sys

path = r"D:\smachnay\u2071240_smachnay.sql"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    data = f.read()

m = re.search(r"INSERT INTO `dt8b_site_templates` VALUES (.+?);\n", data, re.S)
if not m:
    print("no templates insert")
    sys.exit(1)

row = m.group(1)
# Find tuple starting with (2,'Главная'
needle = "(2,'Главная'"
pos = row.find(needle)
if pos == -1:
    print("main template not found")
    sys.exit(1)

# From pos, find matching closing paren for this tuple (depth from quotes)
s = row[pos:]
depth = 0
in_str = False
esc = False
end = None
for i, ch in enumerate(s):
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
        if depth == 0:
            end = i + 1
            break

tpl = s[:end]
# field 8 is content in Evo templates (id, name, desc, ... ) — count from start
parts = []
cur = ""
in_str = False
esc = False
depth = 0
for ch in tpl[1:-1]:  # strip outer ()
    parts.append(ch)
# naive split by ',' not in quotes is hard; use regex for content between 7th and 8th unescaped quote group
# Simpler: find marker '<!DOCTYPE html>'
a = tpl.find("<!DOCTYPE html>")
b = tpl.rfind("</html>")
if a != -1 and b != -1:
    html = tpl[a : b + len("</html>")]
    html = html.replace("\\r\\n", "\n").replace("\\'", "'").replace('\\"', '"')
    print("--- HTML length", len(html))
    print("has </body>", "</body>" in html)
    idx = html.lower().rfind("</body>")
    print("tail:\n", html[idx - 200 : idx + 20] if idx != -1 else html[-400:])
    with open(r"D:\smachnay\tools\_glavnaya_tail.txt", "w", encoding="utf-8") as out:
        out.write(html[-2500:])
    i = html.find("// Получить даты")
    if i != -1:
        with open(r"D:\smachnay\tools\_glavnaya_dates_block.txt", "w", encoding="utf-8") as out:
            out.write(html[max(0, i - 3500) : i + 4500])
else:
    print("no html block", tpl[:200])
