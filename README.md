# Mohammed Al-Safi Cyber Intelligence

**A free, public, open-source cyber threat intelligence dashboard.**  
**منصة استخبارات سيبرانية مجانية ومفتوحة المصدر ومتاحة للجميع.**

Live site: https://moh07tt.github.io/a/  
Repository: https://github.com/Moh07tt/a

## Project goals | أهداف المشروع

- Publish accessible public cyber threat intelligence for visitors worldwide.
- Provide an Arabic and English interface.
- Surface authoritative vulnerability and security-advisory information with clear source attribution.
- Highlight Iraqi public cybersecurity resources without presenting unverified claims as confirmed incidents.
- Keep the project static-hosting friendly and free to access.

## Current capabilities | الميزات الحالية

- Responsive dashboard with Arabic/English language switching.
- CISA Known Exploited Vulnerabilities (KEV) catalog ingestion.
- Search, vendor filtering, ransomware-use indicator filtering, and CVE detail panel.
- NVD CVE detail lookup when the public NVD service is available.
- Public source directory, Iraq Cyber Watch links, and methodology/scope notes.
- GitHub Pages deployment from the `main` branch root.

## Automated public data mirror | تحديث البيانات تلقائياً

A GitHub Actions workflow updates `data/kev.json` from the public CISA KEV feed every six hours and can also be run manually from the Actions tab. The browser prefers this same-origin local snapshot and falls back to public upstream feeds if the snapshot is not available.

The workflow uses only GitHub-hosted workflow execution and public data. GitHub Actions usage is subject to the account's current plan limits and GitHub policies.

## Run locally | التشغيل المحلي

This is a static website. From the repository directory:

```bash
python3 -m http.server 8080
```

Open http://localhost:8080.

## Deployment | النشر

The public site is hosted with GitHub Pages from `main` and `/(root)`. Keep `index.html` at the repository root. Changes committed to the published branch are deployed by GitHub Pages.

## Data sources | مصادر البيانات

- CISA Known Exploited Vulnerabilities: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- NIST National Vulnerability Database: https://nvd.nist.gov/
- MITRE ATT&CK: https://attack.mitre.org/
- Iraqi National Cybersecurity Center: https://ncc.gov.iq/

Each source retains ownership of its own data and content. Review source-specific terms before reusing or redistributing upstream material.

## Scope and responsible use | النطاق والاستخدام المسؤول

This project presents public, defensive cyber intelligence. It is not an intrusion-detection system, does not confirm that a specific organization has been compromised, and does not scan or exploit third-party systems. A public advisory or threat indicator must not be treated as proof of a local incident without independent verification.

Never place API keys, passwords, tokens, or other secrets in browser-delivered files or this public repository.

## Contributing | المساهمة

Issues, corrections, documentation improvements, and pull requests are welcome. Please include the original source and publication date when proposing intelligence content. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License | الرخصة

The original source code in this repository is released under the MIT License. See [LICENSE](LICENSE). Third-party data, trademarks, images, and other upstream materials remain subject to their respective owners' terms.
