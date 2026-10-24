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

40 automated tests, TypeScript/Vite production build and dependency audit passed. The source ZIP was extracted and built independently. The current source contains recovery, mobile-chart, calendar-failure, numeric CSV export and packaging fixes plus the Coastal Observatory design refresh after the public build; that release is now deployed to the public URL after the participant authorized Vercel team access.

## Submission state and remaining actions

Devpost story, technology tags, team members and live/repository links are saved. The exact selected track is included in the prepared story. The submission is still a draft. The editor requires both a **video URL** and an **additional file upload**; a source package is generated at `public/tideprint-source.zip` by `npm run build`. Its file limit is 35 MB; this package is under 1 MB. Upload success is not claimed until the draft shows the attachment.

The participant requested a separate approval before producing the 3–5 minute demo video and 15-image gallery. Those media have not been produced in this continuation. Final submission is not authorized.

The official deadline is **25 October 2026, 17:00 UTC+03**, equivalent to **19:00 Pakistan Standard Time**. Sources: https://ieee-climatechain-hack.devpost.com/ and https://ieee-climatechain-hack.devpost.com/rules (checked 24 October 2026). The overview's student-only eligibility label differs from the broader categories in the written rules; this discrepancy remains an organizer clarification, not an invented eligibility determination. No team-member contribution roles have been invented.

## Practical limits

Flags are review prompts, not validated error probabilities or flood forecasts. Reviewer labels are self-declared. A seal is not a signature or data-accuracy certificate; compare the sender's digest independently. Bitcoin header/path checks use Blockstream's chain view rather than full-node consensus. Local browser storage has no account authentication, shared cloud workspace or cross-device sync. Public adapters have strict request and response limits but no shared global rate limiter. No field impact, accuracy benchmark or measured emissions reduction is claimed.

## Latest continuation

The main product offers original NOAA data and imported CSVs. The altered fixture is retained for testing and older saved records keep their provenance. The updated UI needs real-browser visual verification after deployment; 11 jsdom component tests cover its functional interactions. The 12ui hosted design service requires sign-in. Devpost's source attachment is not yet present; upload needs a file visible on the connected browser device. The refreshed build is live. Do not claim the submission complete until the remaining gates are resolved.

## Production verification · 24 October 2026

Commit e4a014ad539ce2e9adc1280d0ffba5e14d69ffbf is READY in production as dpl_EuwhTyFDYqtShNUQsfKeMb5XvQNN at https://tideprint.vercel.app. Desktop rendering was inspected. The live NOAA API returned 241 readings. A fresh public-browser journey completed archived import, bulk review, sealing, JSON copy and independent verification; appending a newline to the CSV correctly triggered the original-data mismatch warning. All 40 automated tests and the production build passed again. HTTP checks returned 200 for the app/NOAA/source package, 400 for an invalid station and 405 for GET on the timestamp endpoint. Security headers are present. The deployed source ZIP passed CRC checks; its only byte difference from the local package is equivalent minified vercel.json formatting.

Still pending: final mobile visual check and Devpost source attachment/story deployment-status update. The connected browser became unavailable from the current ChatGPT context; do not substitute a separate signed-in session. Video/gallery and final submission remain paused. Runtime error-log inspection was unavailable under the returned retention restriction; no clean server-log claim is made.

## Judging-audit release

Recovery hardening and a reproducible three-station fault-injection evaluation have been implemented. 49 tests, build and dependency audit pass; 21/21 expected injected cases were detected. Official judging remains subjective and no 95% score is claimed. The participant explicitly gated video/gallery production on that threshold; media is held while material evidence gaps remain. The detailed personal review report is delivered separately from the source package.

Audit release verification completed: e2342333a563e704f0b838a6f1e5a51b94e3e076 is READY on the production domain. Live backup restore and trusted-sender digest checks passed. Devpost story now states 49 tests and the limitations of the three-station fault-injection evaluation. The source attachment remains unverified after browser transfer timeouts. No video or gallery was generated because the participant's 95% precondition is not met by the evidence.
