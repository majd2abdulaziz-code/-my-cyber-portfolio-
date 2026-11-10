# Security — Majd Ibrahim Portfolio

This is a static site (HTML, CSS, JavaScript) served by GitHub Pages over HTTPS.
It has no server code, no database, no login and no forms, so most of the attack surface does not exist.
The controls below map the remaining risks to the **OWASP Top 10 (2021)**.

| OWASP risk | How this site handles it |
|---|---|
| **A01 Broken Access Control** | No accounts or private areas. Personal documents (ID, transcripts) were removed from the site and are not linked from it. |
| **A02 Cryptographic Failures** | HTTPS only (GitHub Pages enforced HTTPS). `upgrade-insecure-requests` in the CSP. No secrets or keys in the code. |
| **A03 Injection (XSS)** | Strict Content-Security-Policy: `script-src 'self'` — no inline scripts, no `eval`, no inline event handlers. All JavaScript lives in `assets/app.js`. Dynamic text uses `textContent`, never `innerHTML` with data. The image viewer only opens paths that match `img/…/*.webp`. |
| **A04 Insecure Design** | Least functionality: nothing is sent anywhere (`connect-src 'none'`, `form-action 'none'`). |
| **A05 Security Misconfiguration** | `default-src 'none'` with only what the page needs; `object-src`, `frame-src`, `worker-src`, `base-uri` locked. `.nojekyll` so files are served exactly as committed. |
| **A06 Vulnerable Components** | No third-party libraries, frameworks or CDN scripts. |
| **A07 Identification & Authentication Failures** | Not applicable — no authentication. |
| **A08 Software & Data Integrity Failures** | Every resource is first-party from the same origin, so nothing can be swapped by a CDN. |
| **A09 Logging & Monitoring Failures** | No analytics or trackers. Repository history on GitHub records every change. |
| **A10 SSRF** | Not applicable — no server requests. |

**Extra hardening**
- Clickjacking: GitHub Pages cannot send `frame-ancestors`/`X-Frame-Options`, so `assets/app.js` refuses to run inside a frame.
- Every link that opens a new tab uses `rel="noopener noreferrer"` (no reverse tabnabbing).
- `Referrer-Policy: strict-origin-when-cross-origin`.
- Images are re-encoded to WebP with all metadata (EXIF/GPS) stripped; the national ID number was removed from the workshop certificate image.

## Reporting a vulnerability
Please see [`/.well-known/security.txt`](.well-known/security.txt) or message me on LinkedIn.
