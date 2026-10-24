# Implementation plan

## Acceptance criteria

1. Fetch a selected NOAA station/day, preserve provenance, and show upstream errors without replacing data silently.
2. Import a strict, bounded CSV with timestamp/value columns, quoted-field support, explicit timezone validation, missing values and useful row errors.
3. Run range, timestamp/order/duplicate, gap, spike, rate-of-change and flat-line checks. Fit a deterministic unsupervised Isolation Forest to usable rows; show model settings and scores, with no unsupported accuracy claims.
4. Explain each flagged reading. Allow keep/exclude decisions with a reason. Retain every original reading. Prevent sealing unresolved flags.
5. Save drafts and sealed receipts locally. Rename, reopen, and delete with an explicit recoverable confirmation where appropriate. Export JSON, CSV, and a printable report; provide pasted JSON as an alternate import path.
6. Verify an exported bundle by reparsing raw data and reproducing the audit, hashes and decisions. Deliberately modified data, configuration, results or decision records must be detected.
7. Submit a salted digest to free OpenTimestamps calendars. Export a standard .ots proof, distinguish pending from Bitcoin confirmation, upgrade a proof, and validate its hash path against a real Bitcoin header through a named explorer. Unsupported proof operations fail closed.
8. Deployed desktop and phone end-to-end journeys work without credentials; keyboard focus, visible form labels, reduced motion and chart/table equivalence are checked.

## Architecture

React + Vite frontend; small pure JavaScript core modules shared with Node tests; a module Web Worker for analysis. Node serverless endpoints on Vercel adapt NOAA and OpenTimestamps. No database/auth: individual review work and exports do not need server accounts or a shared registry. Local versioned storage holds drafts and receipts. A reviewer label is self-declared, not an authenticated signature.

Domain objects: Source (provider/station/date/datum/unit/retrieval URL/time), Batch (raw CSV and ordered parsed readings), ReviewConfig, Audit (flags and model metadata per row), Decision (row, keep/exclude, reason), ReceiptManifest (versioned canonical data), EvidenceBundle (manifest, original raw bytes, digest, optional .ots proof). A sealed manifest is immutable; updates fork a new draft.

API: GET /api/noaa?station=<allowlisted ID>&date=YYYY-MM-DD; POST /api/stamp {digest}; POST /api/proof {digest,proof,upgrade}. Request/response caps, timeouts, strict method and schema validation, fixed outgoing hosts, bounded proof parser and no arbitrary fetch URL. No credential or sensitive-file logging. CSP permits only self and the needed font/static resources; external requests go through same-origin endpoints.

## Security and verification

Node test runner verifies hand-built CSV/QA cases, deterministic model behavior, integrity attacks, malformed bundles, formula-safe CSV, proof serialization and input boundaries. Official OpenTimestamps reference implementation cross-checks generated receipts. Integration checks use actual NOAA/calendar/explorer requests. Browser interactions verify the critical journey, recovery, local storage, deployed APIs and responsive states. Run type/build checks and dependency audit. Report observed results, not certification or universal performance.

## Deployment and repository

Keep dependency versions pinned, commit lockfile and setup docs, exclude generated output/env/secrets/local reports. Public GitHub with focused PRs and meaningful commits. Use native Vercel tooling; check free-account access and final project/target before publication. Verify the public production URL separately from local checks. Add branch protection if owner permissions allow; never weaken existing protection or bypass an access gate.

## Phase 1 handoff

Provide name/advantage, official-rule summary and discrepancies, live URL, repository, tested features and limits, Devpost draft status and missing access/media. The required 3–5 minute video belongs to phase 2.
