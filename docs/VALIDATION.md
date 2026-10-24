# Validation record

Date: 24 October 2026. Final checks and browser coverage are being recorded during release verification.

## Observed so far

- Node 24 native test runner: 18 tests passed for CSV bounds/UTC/quotes, rule flags, flat-line cadence, deterministic Isolation Forest, unresolved decisions, integrity edits, fabricated audit, duplicate decisions, formula-safe export, canonical encoding, OTS format/bounds and API validation.
- TypeScript no-emit check and Vite production build passed.
- `npm audit`: zero known advisories in the committed dependency graph at the time checked. This does not certify supply-chain safety.
- Real NOAA server adapter returned 241 observations for San Francisco / 2024-10-01. The deployed interface imported them and showed 2 model flags with the stated settings.
- Two real OTS public calendars returned pending promises for a reference receipt. The official `python-opentimestamps` 0.4.5 parser accepted the generated detached proof and matched its SHA-256 digest.
- Browser interactions on the production URL: NOAA fetch, individual keep decisions with reasons, unresolved-seal prevention, seal dialog.

The reference receipt is labelled 'Automated integration check'. It is an integration fixture, not a claimed field review. Bitcoin confirmation, additional browser journeys and final security headers are not claimed until the remaining checks run.
