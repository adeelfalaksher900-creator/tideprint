# Validation record

Date: 24 October 2026. Final checks and browser coverage are being recorded during release verification.

## Observed so far

- Node 24 native test runner: 24 tests passed for CSV bounds/UTC/quotes, rule flags, flat-line cadence, deterministic Isolation Forest, unresolved decisions, integrity edits, fabricated audit, duplicate decisions, formula-safe export, canonical encoding, OTS format/bounds, proof-upgrade failure handling and API validation. Three Bitcoin tests independently exercise a known genesis header, a mismatched Merkle commitment and an altered header.
- TypeScript no-emit check and Vite production build passed.
- `npm audit`: zero known advisories in the committed dependency graph at the time checked. This does not certify supply-chain safety.
- Real NOAA server adapter returned 241 observations for San Francisco / 2024-10-01. The deployed interface imported them and showed 2 model flags with the stated settings.
- Two real OTS public calendars returned pending promises for a reference receipt. The official `python-opentimestamps` 0.4.5 parser accepted the generated detached proof and matched its SHA-256 digest.
- Browser interactions on the production URL: NOAA fetch, individual keep decisions with reasons, unresolved-seal prevention, successful seal, live calendar request showing pending status, and saved receipt surviving a fresh tab.
- Responsive browser check at a requested 390 × 844 viewport: original and practice record, six flagged readings, per-row exclusion with reason, selected bulk decisions and seal-unlock transition worked. DOM width equalled scroll width (no horizontal overflow).
- Public HTTP checks: app 200, NOAA adapter 200, invalid station 400, wrong timestamp method 405, source ZIP 200; CSP present.

The reference receipt is labelled 'Automated integration check'. It is an integration fixture, not a claimed field review. Browser receipt copy/paste roundtrip passed. Altering the injected 4.8 m value to 4.9 m failed with an original-data mismatch. Bitcoin confirmation of newly requested proofs is still pending; no confirmation claim is made for those receipts.

## Continuation verification

- The earlier public NOAA integration receipt (`da0dc1cbf959e73af19063dbda43cf36d2341d71e26ba4b2d62395171ac74cec`) upgraded successfully in the live browser. The interface checked its path against Bitcoin block 972,903 and reported 7 confirmations on 24 October 2026 at approximately 10:26 UTC. Confirmation counts and chain selection depend on Blockstream. The upgraded bundle is included under `examples/`.
- A new labelled practice QA review retained all 241 readings, completed six bulk keep decisions with an explicit test reason, sealed, copied to the clipboard, and passed independent receipt verification in the interface. Changing `4.8` to `4.9` in the original CSV then failed with `Original data does not match. The CSV bytes have changed.` The restored receipt passed again. A real calendar request attached a pending proof. The console showed no captured error or warning entries during this journey.
- The generated source ZIP was checked with an independent ZIP reader: no corrupt or duplicate entries, the HTML entry point and all setup/configuration files present, every packaged byte matching the source tree. A clean extraction installed with `npm ci --ignore-scripts`, passed all 24 tests and built successfully. No installed dependencies or secrets are packaged.
- Production HTTP response headers include CSP, `nosniff`, frame denial, restrictive permissions policy, referrer policy and HSTS.

The continuation recovered later source changes that had not been pushed to the original draft PR. These include smaller chart rendering, focus/scroll recovery, compressed self-hosted font and explicit calendar-failure feedback. The current public deployment still serves the earlier working build until the verified source release is deployed. Vercel team access currently requires account authorization; no new deployment is claimed here.
