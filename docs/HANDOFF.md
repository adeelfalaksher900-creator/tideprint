# Tideprint release handoff

- **Hackathon:** IEEE ClimateChain Global Hackathon.
- **Track:** Climate Data & Environmental Monitoring.
- **Product:** Coastal observation review with reproducible machine-learning and rule checks, recorded human decisions, portable evidence receipts and optional Bitcoin timestamp proofs.
- **Live application:** https://tideprint.vercel.app
- **Source:** https://github.com/adeelfalaksher900-creator/tideprint
- **Implementation/release PR:** https://github.com/adeelfalaksher900-creator/tideprint/pull/1
- **Devpost draft:** https://devpost.com/software/tideprint
- **Draft editor:** https://devpost.com/submit-to/29114-ieee-climatechain-global-hackathon/manage/submissions/1259213-tideprint/edit

## Verified scope

Public NOAA fetch, archived and labelled practice data, CSV import and validation, deterministic Isolation Forest and rule checks, per-reading and selected bulk decisions, unresolved-review seal prevention, original-data retention, local draft/receipt storage, JSON/CSV exports, tamper detection, and standard OpenTimestamps proof generation/upgrade. An earlier automated NOAA integration receipt was verified against Bitcoin block 972,903. See `VALIDATION.md` and the reproducible `examples/`.

40 automated tests, TypeScript/Vite production build and dependency audit passed. The source ZIP was extracted and built independently. The current source contains recovery, mobile-chart, calendar-failure, numeric CSV export and packaging fixes plus the Coastal Observatory design refresh after the public build; deployment of that release requires the existing Vercel connection to authorize the project's team. The working public URL remains available.

## Submission state and remaining actions

Devpost story, technology tags, team members and live/repository links are saved. The exact selected track is included in the prepared story. The submission is still a draft. The editor requires both a **video URL** and an **additional file upload**; a source package is generated at `public/tideprint-source.zip` by `npm run build`. Its file limit is 35 MB; this package is under 1 MB. Upload success is not claimed until the draft shows the attachment.

The participant requested a separate approval before producing the 3–5 minute demo video and 15-image gallery. Those media have not been produced in this continuation. Final submission is not authorized.

The official deadline is **25 October 2026, 17:00 UTC+03**, equivalent to **19:00 Pakistan Standard Time**. Sources: https://ieee-climatechain-hack.devpost.com/ and https://ieee-climatechain-hack.devpost.com/rules (checked 24 October 2026). The overview's student-only eligibility label differs from the broader categories in the written rules; this discrepancy remains an organizer clarification, not an invented eligibility determination. No team-member contribution roles have been invented.

## Practical limits

Flags are review prompts, not validated error probabilities or flood forecasts. Reviewer labels are self-declared. A seal is not a signature or data-accuracy certificate; compare the sender's digest independently. Bitcoin header/path checks use Blockstream's chain view rather than full-node consensus. Local browser storage has no account authentication, shared cloud workspace or cross-device sync. Public adapters have strict request and response limits but no shared global rate limiter. No field impact, accuracy benchmark or measured emissions reduction is claimed.

## Latest continuation

The main product offers original NOAA data and imported CSVs. The altered fixture is retained for testing and older saved records keep their provenance. The updated UI needs real-browser visual verification after deployment; 11 jsdom component tests cover its functional interactions. The 12ui hosted design service requires sign-in. Devpost's source attachment is not yet present; upload needs a file visible on the connected browser device. Do not claim the refreshed build is live or the submission complete until these gates are resolved.
