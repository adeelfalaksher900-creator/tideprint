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

## Design and interaction continuation · 24 October 2026

- **40 automated tests passed:** the prior 24 plus 11 React component integration tests, four bounded-network/NOAA/API tests and one negative-level export regression. Component tests run with Testing Library and jsdom; the worker boundary and network are mocked while the actual parser, analysis and receipt functions run.
- UI coverage: original-only home copy, archive import and persistence, Escape/focus return, invalid CSV recovery, NOAA failure recovery, unresolved seal blocking, bulk decisions through sealing, search/pagination, invalid settings rejection, independent receipt verification and tampering, corrupt-storage preservation, and reduced-motion Anatomy controls.
- The export regression found and fixed a real defect: a numeric value such as -0.25 was previously prefixed with a spreadsheet apostrophe. Numeric readings now stay numeric while textual formulas are still neutralized.
- TypeScript check and production build pass. Dependency audit: zero known vulnerabilities at this check.
- Visual design source: ocean navigation, clearer panels, larger mobile text/controls and a reusable interactive Anatomy press on the workspace. No event/demo/prototype wording appears in the normal workspace; provenance of pre-existing modified receipts is retained.
- **Not yet verified:** rendering of this new build in a real desktop/mobile browser and deployment to the existing public domain. The local server starts on 127.0.0.1, but the connected browser reports connection refused because it is on a separate device. Vercel API access returns 403 for the existing project team. Earlier live-build browser results above are not proof of the new visual build.
- Devpost remains a draft. Video/gallery production and final submission remain paused by the participant's instruction.

## Strict judging audit and recovery hardening

49 tests pass after adding complete draft-backup recovery, defensive validation of saved decisions, exact BOM/CRLF preservation, optional sender-digest checks and stricter NOAA response date/window validation. The source chooser uses ordinary grouped toggles rather than incomplete ARIA tabs.

`npm run evaluate` reproduced 21 of 21 expected injected fault cases across three archived NOAA station-days. Results include source hashes, exact configuration and per-case expected/observed flags in `examples/evaluation/results.json`. These selected artificial faults do not establish ML precision/recall, sensor diagnosis accuracy or field impact.

At 390px, the deployed home, review, bulk decision, seal and method states were exercised with no horizontal document overflow. A full independent verification journey and tamper rejection had already passed. Recovery hardening is deployed as e2342333a563e704f0b838a6f1e5a51b94e3e076. Live checks passed for complete backup restoration and rejection/acceptance of incorrect/correct trusted sender digests. No real-user usability study or organization-scale deployment claim follows from these checks.

## Operational hardening and reference comparison

The current source passes 65 tests, including new coverage for atomic workspace restore, corrupted receipts, cross-tab changes, Web Locks coordination, comparison disagreements and endpoint cache behavior. Save feedback now distinguishes an in-progress save from completed persistence. TypeScript and production build pass; dependency audit reports zero known vulnerabilities in this lockfile at the recorded check.

`npm run reference-checks` uses the independently maintained IOOS Python package `ioos_qc==2.2.1`. Across three original station-days plus stated synthetic boundary cases, 2,226 range/missing/rate comparisons match with zero differences. This covers three check semantics only, not the model, all QARTOD checks, data truth or independent human analyst testing. Reproducible inputs and limits are in `examples/evaluation/reference-results.json` and the scripts.

`npm run benchmark` records 20 measured operations per profile after three warmups. On the stated Node host, a synthetic 3,000-row file measured analysis p95 49.51 ms, seal p95 47.07 ms and verification p95 59.32 ms. All 40 measured receipts verified. Five concurrent local workers produced identical audits; a 30-item backup containing 3,000 rows per draft restored completely in 1,132.9 ms. This is local bounded capacity evidence, not browser latency, analyst time saved, enterprise scale or climate impact. Exact host and results are in `examples/operations/capacity.json`.

A study protocol and UI tools for independent review comparison and observed task measurements are prepared. No completed human-study records have been created or claimed. The deployment adds a runtime-only health endpoint, success-only NOAA CDN cache policy and rate-limit feedback. The separately configured Vercel API rule is active and valid; post-deployment request behavior is checked separately before reporting it as observed.
