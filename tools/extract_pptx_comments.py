"""Extract comments and slide text from PowerPoint Flat OPC XML export."""
import re
import sys
from pathlib import Path

path = Path(sys.argv[1] if len(sys.argv) > 1 else r"c:\Users\grinv\Downloads\Telegram Desktop\Доработка сайта.xml")
text = path.read_text(encoding="utf-8", errors="ignore")

comments = re.findall(r"<p:text>(.*?)</p:text>", text, re.S)
out = Path(__file__).with_name("dorabotka-comments.md")
lines = ["# Доработка сайта — комментарии из PowerPoint\n"]
for i, c in enumerate(comments, 1):
    c = re.sub(r"\s+", " ", c).strip()
    lines.append(f"{i}. {c}\n")

out.write_text("".join(lines), encoding="utf-8")
print(out)
