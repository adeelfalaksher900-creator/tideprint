# Security and data boundaries

Tideprint is a single-user, device-local review tool. It has no accounts, authentication tokens, shared database or admin actions. A reviewer label is self-declared and must not be treated as a verified signature.

## Trust boundaries

| Boundary | Controls | Remaining limit |
|---|---|---|
| Untrusted CSV | 1 MiB/3,000-row cap, fatal UTF-8 decoding for files, strict UTC/numeric parsing, worker analysis | Browser memory and local storage are not encrypted vaults |
| Untrusted receipt | 5 MiB cap, schema checks, canonical SHA-256 comparison, original-byte hash, reproduced audit and validated decisions | Anyone can issue a new seal; compare the digest with an independently trusted copy |
| Public NOAA response | Fixed NOAA host, three allowlisted station IDs, strict date range, response cap, format/metadata checks, timeout and no redirects | NOAA availability and provisional observations are external dependencies |
| Calendar/proof | Only salted hash sent; 64 KiB proof cap, bounded depth/operation counts, SHA-256/append/prepend/reverse subset, fixed upgrade host allowlist, no redirects | Unknown operations fail closed; free calendars can be unavailable or slow |
| Bitcoin header | Recompute proof hash path, match Merkle root, check header double-SHA-256 and target proof of work | Block height, confirmations and chain selection trust Blockstream; this is not full-node consensus verification |
| API | JSON-only write methods, method checks, request/body caps, timeouts, no credential handling, restrictive outgoing destinations | No shared global rate limiter. Vercel infrastructure limits apply; public adapters could be abused |
| Exports | Framework output escaping, formula-neutralised reviewed CSV, original file retained | Review notes can contain personal information. Export and share deliberately |
| Site | CSP, frame denial, nosniff, referrer/permissions policies; self-hosted font; no analytics | Hosting providers may keep ordinary request logs/IP addresses |

No private CSV file or review note is sent to Tideprint's server adapters. NOAA requests expose selected public station/date. Timestamp requests expose a receipt digest; servers add a random nonce before submitting to calendars. Exporting a bundle deliberately includes the original CSV and reviewer label/notes. Deleting a local copy does not erase already exported files or a timestamp commitment.

No paid services, secret API keys, wallets or blockchain transactions are required. There is no accuracy certification, flood warning or sensor diagnosis. Report vulnerabilities through the repository's private security advisory flow when available; do not publish private datasets or credentials in an issue.
