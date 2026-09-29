import re, os, urllib.request
from urllib.parse import urljoin, urlparse

BASE = "https://www.andev.ir/"
seen, queue = set(), ["", "product-aravin.html"]

def save(path, data):
    if path == "" or path.endswith("/"):
        path += "index.html"
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    open(path, "wb").write(data)

while queue:
    p = queue.pop(0)
    if p in seen:
        continue
    seen.add(p)
    try:
        req = urllib.request.Request(urljoin(BASE, p), headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req).read()
    except Exception as e:
        print("FAIL", p, e)
        continue
    save(p, data)
    print("OK", p)
    if p == "" or p.endswith((".html", ".css", ".js")):
        text = data.decode("utf-8", "ignore")
        refs = re.findall(r'(?:href|src)=["\']([^"\']+)', text) + re.findall(r'url\(["\']?([^)"\']+)', text)
        for r in refs:
            full = urljoin(urljoin(BASE, p), r.split("#")[0].split("?")[0])
            if full.startswith(BASE) and full != BASE:
                queue.append(full[len(BASE):])