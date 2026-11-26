# Mohammed Al-Safi Cyber Intelligence — Public Launch Package v0.2

A bilingual (Arabic/English), public-facing cyber threat intelligence dashboard by Mohammed Al-Safi.

## Included in this first release
- Responsive dark dashboard UI.
- Arabic/English language switch.
- Live ingestion of the CISA Known Exploited Vulnerabilities (KEV) public JSON feed.
- Search and vendor filtering.
- Links to authoritative CISA and NVD sources.
- Clear scope notice: this is an intelligence dashboard, not an intrusion-detection sensor.

## Run locally
This is a static site. From this folder, run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish
Upload the contents of this folder to a public GitHub repository. Keep `index.html` at the repository root, then enable GitHub Pages from **Settings → Pages → Deploy from a branch → main → /(root)**.

This is a static first release. It has no server, user accounts, database, email alerts, or AI agent execution.

## Data source
CISA KEV JSON feed:
https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json

CISA KEV catalog:
https://www.cisa.gov/known-exploited-vulnerabilities-catalog

NIST National Vulnerability Database:
https://nvd.nist.gov/

## Important limitations
- The browser fetches the CISA public JSON feed directly. If the publisher changes CORS policy or feed URL, the table may not load.
- Critical severity remains unavailable (`—`) until CVSS enrichment from NVD is implemented.
- News, ransomware monitoring, threat maps, APT profiles, AI-agent tracking, and push alerts are planned, not yet connected.
- Never put API keys or secrets in browser-delivered files.

## License
Starter project for personal and educational use. Review each upstream source's terms before redistributing its data.
