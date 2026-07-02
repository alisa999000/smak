import re
with open(r'd:\smachnay\u2071240_smachnay.sql', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()
for m in re.finditer(r"INSERT INTO `dt8b_site_htmlsnippets` VALUES \((\d+),'([^']+)'", content):
    print(m.group(1), m.group(2))
