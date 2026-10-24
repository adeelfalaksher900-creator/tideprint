<!-- impeccable:product-schema 1 -->

Platform: web. Stack: React, TypeScript, Vite and Node serverless adapters. The user delegated product, architecture and creative decisions.

# Tideprint

Tideprint helps a coastal-data analyst review a water-level time series before sharing it. The analyst imports CSV or retrieves NOAA observations, runs transparent quality checks and an Isolation Forest model, records decisions about flagged readings, then exports a portable evidence receipt. A receipt binds the original bytes, parsing metadata, check settings, algorithm version, results and reviewer decisions. Optional OpenTimestamps anchoring submits only a salted cryptographic commitment to public Bitcoin calendars.

## Product truth

- Track: Climate Data & Environmental Monitoring, IEEE ClimateChain Global Hackathon 2026.
- Primary user: an analyst or community monitoring coordinator who can judge a reading in context. Secondary user: a recipient checking that a shared dataset and review record match.
- Success: import → inspect → review every flag → seal → export → verify an unchanged bundle; a one-value modification must fail integrity verification.
- Climate relevance: traceable coastal water-level evidence supports research and adaptation decisions. This app does not forecast floods, diagnose a sensor, issue carbon credits, or measure avoided emissions.
- An unusual reading is a prompt for review, not proof of an error. Do not silently remove extremes.
- A Bitcoin timestamp proves prior existence of the committed bytes, not the accuracy, authorship or climate impact of their contents. Pending calendar promises must never be called confirmed Bitcoin proofs.
- No sign-in is needed. Work is saved on this device. Imported files and reviewer notes stay in the browser unless the person exports them. Hosting API adapters handle public NOAA requests and hashes/proofs, not private CSV files.
- All source and test fixtures are original or explicitly attributed public NOAA data. Practice copies must clearly describe deliberate changes.

## Experience

Operate mode: a clean, precise scientific workbench with a large time-series plot, a useful flag queue, a focused inspector and a visible progression from data to a sealed record. Plain English, familiar controls, meaningful loading/error/success states. Read mode for method and provenance. A restrained Anatomy Figure explains the seal as a physical stamping mechanism; it is an explanatory illustration, never evidence of a working blockchain transaction.

## Constraints

- One working product, no disconnected placeholder routes.
- Free, keyless integrations; Vercel preferred, Netlify alternative. No paid services or runtime LLM.
- CSV up to 1 MiB and 3,000 readings; receipts/proofs bounded. Six-minute water-level profile, metres, explicit UTC and datum.
- Software runs in a Web Worker where practical. Mobile layout supports all review actions and a table alternative to the chart.
- Immutable sealed exports; editing creates a new draft. Local persistence errors are surfaced; valid work survives a failed external request.
- Phase 1 stops after tested production deployment, public GitHub, and Devpost draft. No final submission, final video, or 15-image gallery before explicit approval.
