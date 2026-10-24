# Tideprint

Tagline: Review water-level data. Keep the originals. Share a record anyone can check.

Track: Climate Data & Environmental Monitoring

Live: https://tideprint.vercel.app
Code: https://github.com/adeelfalaksher900-creator/tideprint

## Inspiration

A water-level spike can be a sensor fault—or an important coastal event. When a spreadsheet is cleaned and passed on, the original reading, check settings and reason for a decision can disappear. A file hash alone does not explain that review.

We chose a narrow problem: help a coastal-data analyst inspect unusual readings and give the next person a clear, reproducible record. This supports traceable evidence for coastal research and adaptation work. We do not claim field impact or predict floods.

## Track alignment

**Climate Data & Environmental Monitoring.** Tideprint addresses the difficulty of verifying shared environmental data by preserving source observations, reproducing machine-learning and rule checks, recording human decisions, and optionally timestamping the resulting evidence commitment through OpenTimestamps and Bitcoin.

## What it does

Tideprint is a working coastal-data review website. Open a real day of NOAA observations or import a CSV. Transparent quality rules and a deterministic Isolation Forest model identify readings that need a closer look. Keep or exclude flagged readings with a reason. Every original row stays in the record.

When the review is complete, seal the original CSV hash, source, settings, model results and decisions into one portable receipt. Export the receipt or reviewed CSV. A recipient can reopen the receipt, reparse the original data and rerun the checks. A changed value, setting or note fails against the original seal.

An optional OpenTimestamps proof can anchor a salted receipt commitment to Bitcoin without a wallet or transaction fee. A calendar response is labelled pending. The app can later upgrade the proof and check its hash path, Bitcoin Merkle root, block-header hash and proof of work. Chain selection and confirmation counts rely on Blockstream; this is not full-node consensus verification.

## How we built it

The interface uses React and TypeScript with a separate Web Worker for parsing and analysis. It has a responsive review queue, a time-series chart, a reading inspector, local draft storage, per-row and selected bulk decisions, immutable sealed exports and an independent verification flow.

The rule checks cover missing values, repeated and out-of-order times, gaps, range limits, isolated spikes, fast changes and flat stretches. They are inspired by IOOS QARTOD guidance; Tideprint does not claim QARTOD certification. A real Isolation Forest fits 64 seeded random partition trees to four stated features in the imported batch. Its score is relative unusualness, not an error probability.

The core is pure TypeScript shared with Node tests. Canonical sorted-key JSON and SHA-256 bind the review record. Vercel Node functions adapt the public NOAA and OpenTimestamps services using fixed outgoing hosts, strict inputs, timeouts and bounded responses. No API key, paid AI model or database is required. Private CSVs and review notes stay in the browser unless exported.

The method page includes an interactive physical paper press to explain why sealing keeps the whole record. It is explicitly an illustration, not evidence of a blockchain transaction.

## Challenges

The important boundary was between an unusual observation and a wrong one. Tideprint leaves that decision with the reviewer and keeps the original values. A second challenge was avoiding a false blockchain-success label: pending calendar promises, failed verification and a verified Bitcoin header are different states.

Portable verification also needs more than a matching hash. The verifier reproduces the audit and validates the decisions. A fabricated audit with a newly calculated digest is rejected when it cannot be reproduced. A different, honestly regenerated receipt is a new record, so recipients should compare its digest through a trusted channel.

## Accomplishments

The deployed app can fetch actual NOAA data, review flagged readings with reasons, seal the result and export a portable evidence bundle. Automated tests cover parsing, QA, model determinism, receipt tampering, formula-safe CSV export, request validation and proof encoding. Real calendar proofs were accepted by the official Python OpenTimestamps parser. Browser checks exercised desktop and phone-size review workflows.

The archived reference uses 241 real NOAA observations. A separate test fixture lists its deliberately injected spike, flat stretch and missing value. It is retained for regression testing and is not presented as observed measurements.

The source passes 65 automated tests, including React interaction tests for import errors, review decisions, sealing, complete draft recovery, multi-tab storage conflicts, workspace restore, comparison disagreements and tamper detection. Regression checks protect original UTF-8 file bytes and negative water-level values in CSV exports. Verification can compare the sender’s independently shared digest.

A reproducible fault-injection evaluation detected all 21 expected cases across three real NOAA station-days. Separate cross-implementation checks against IOOS ioos_qc 2.2.1 found zero differences across 2,226 range, missing-value and rate comparisons. These are mechanics and reference-implementation checks, not independently labelled sensor-error accuracy or an independent human study.

A bounded Node-host capacity run measured analysis p95 49.51 ms and receipt verification p95 59.32 ms for a synthetic 3,000-row file, with 20 measured samples after warmup. Five concurrent local workers produced matching audits, and a 30-draft maximum-row workspace restored completely. This is computational evidence on the recorded host, not browser-device guarantees, organization-scale adoption or measured climate benefit.

Compare reviews verifies two separately prepared receipts for matching data, source and settings, then exports agreement and disagreements. An optional observed-task measurement note records real timings, including slower or failed outcomes. A protocol is included for independent analysts; no completed human study is claimed. Complete workspace backups validate before restoring, while stale-tab protection stops autosave and exposes recovery exports. Public APIs now have a deployed regional IP rate-limit rule and successful NOAA responses use a short CDN cache.

## What we learned

A timestamp can support prior existence of bytes. It cannot establish that a sensor was correct or authenticate a reviewer. Clear provenance, reproducible checks and recorded human judgement make the seal useful. A tightly scoped, understandable review workflow is more valuable here than an opaque score or a generic climate chatbot.

## What's next

Evaluate the flags with independent labelled datasets and coastal analysts; add station-specific profiles and authenticated multi-person review; support more units, datums and sensors; provide full-node-backed proof verification and globally coordinated API quotas. These are future work, not current capabilities.

## Sources

- NOAA CO-OPS API and the exact observation request retained in every NOAA receipt: https://api.tidesandcurrents.noaa.gov/api/prod/
- IOOS QARTOD water-level guidance: https://cdn.ioos.noaa.gov/media/2021/04/QARTOD_WaterLevelManual_Update_V2.1_Final.pdf
- Liu, Ting and Zhou, Isolation Forest (2008): https://doi.org/10.1109/ICDM.2008.17
- OpenTimestamps: https://opentimestamps.org/

AI assistance was used for research, implementation and testing.
