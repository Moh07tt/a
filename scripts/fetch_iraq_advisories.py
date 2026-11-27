#!/usr/bin/env python3
"""Fetch public advisory titles and linked PDFs from the official NCC Iraq page."""
import json, re, urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin

SOURCE = "https://ncc.gov.iq/advisories.html"
OUT = Path("data/iraq-watch.json")

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.heading = 0; self.heading_text = []; self.last_title = ""
        self.anchor = 0; self.href = ""; self.anchor_text = []
        self.date_tag = 0; self.date_text = []; self.last_date = ""
        self.items = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("h2", "h3", "h4"):
            self.heading += 1; self.heading_text = []
        if tag == "time" or (tag in ("span","div","p") and re.search(r"date|time", attrs.get("class",""), re.I)):
            self.date_tag += 1; self.date_text = []
        if tag == "a":
            self.anchor += 1; self.href = attrs.get("href",""); self.anchor_text = []
    def handle_data(self, data):
        if self.heading: self.heading_text.append(data)
        if self.date_tag: self.date_text.append(data)
        if self.anchor: self.anchor_text.append(data)
    def handle_endtag(self, tag):
        if tag in ("h2","h3","h4") and self.heading:
            title = " ".join(" ".join(self.heading_text).split())
            if len(title) > 15 and re.search(r"ثغرة|أمني|أمنية|استغلال|تحذير|تحديث|vulnerab|security|advisory", title, re.I):
                self.last_title = title
            self.heading -= 1
        if tag == "time" and self.date_tag:
            value = " ".join(" ".join(self.date_text).split())
            if value: self.last_date = value[:80]
            self.date_tag -= 1
        if tag == "a" and self.anchor:
            label = " ".join(" ".join(self.anchor_text).split())
            url = urljoin(SOURCE, self.href)
            if self.last_title and url.startswith("https://") and (".pdf" in url.lower() or "pdf" in label.lower()):
                if not any(x["url"] == url for x in self.items):
                    self.items.append({"title": self.last_title, "date": self.last_date, "url": url, "source": "National Cybersecurity Center of Iraq"})
            self.anchor -= 1

def main():
    req = urllib.request.Request(SOURCE, headers={"User-Agent":"Mozilla/5.0 (compatible; MohammedAlSafiCyberIntel/1.0)"})
    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            html = response.read().decode("utf-8", errors="replace")
        parser = Parser(); parser.feed(html)
        extracted = parser.items[:60]
        if not extracted and OUT.exists():
            payload = json.loads(OUT.read_text(encoding="utf-8"))
            payload["lastAttemptAt"] = datetime.now(timezone.utc).isoformat()
            payload["parserNote"] = "The official page was reachable, but no matching PDF-linked advisory cards were detected."
        else:
            payload = {"source":SOURCE,"sourceName":"National Cybersecurity Center of Iraq","generatedAt":datetime.now(timezone.utc).isoformat(),"items":extracted,"note":"Published official advisories; not proof of a confirmed incident in Iraq."}
    except Exception as exc:
        print(f"NCC fetch failed: {exc}")
        payload = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {"source":SOURCE,"sourceName":"National Cybersecurity Center of Iraq","items":[]}
        payload["refreshError"] = str(exc)[:300]
        payload["lastAttemptAt"] = datetime.now(timezone.utc).isoformat()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Published", len(payload.get("items", [])), "NCC advisory records")

if __name__ == "__main__": main()
