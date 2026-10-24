# Research and selection record — 24 October 2026

## Official hackathon

- Overview: https://ieee-climatechain-hack.devpost.com/
- Rules: https://ieee-climatechain-hack.devpost.com/rules
- Schedule: https://ieee-climatechain-hack.devpost.com/details/dates
- Updates: https://ieee-climatechain-hack.devpost.com/updates
- Existing empty Devpost draft was observed; no prior project content will be overwritten.
- Published closing time: 25 October 2026, 14:00 UTC / 19:00 Pakistan. Submission window began 5 October. Judging is 26 October–8 November; winners scheduled 20 November.
- Required: stated track, problem/solution/users/adoption/scaling description, public source/documentation, working demonstration, 3–5 minute video and submission before the deadline. The additional-info form must be checked for its required attachment.
- Four tracks: carbon markets, renewable energy, sustainable supply chains, climate/environmental data. No named commercial platform, chain or sponsor API is mandated in the rules read.
- Judging: climate impact, originality, working technical execution, practical usefulness/scaling, clear presentation. Awards currently listed as $1,500 / $1,000 / $500 plus certificates and conditional recognition.
- Eligibility discrepancy: overview says students only; detailed rules also include academics, independent developers/startups and environmental professionals. Teams 2–5 or individuals; one team per person. Organizer/judge relatives excluded. No personal eligibility attestation has been made.
- Old participant questions quote an inconsistent opening-time sentence that is absent from the current rules read; schedule and current updates agree on the published close. The inspected discussion has no organizer answer about mandatory blockchain; the chosen implementation includes genuine OpenTimestamps/Bitcoin integration regardless.

## Compared directions

| Candidate | Useful difference | Existing competition/evidence | Main delivery risk | Decision |
| --- | --- | --- | --- | --- |
| Hourly renewable certificate matching | Prevent annual claims hiding hourly mismatch | Energy Web Origin; Matched Energy; a current HourMatch Devpost project | Registry legitimacy, metering and certificate authority | Reject: crowded and operational dependencies |
| Refrigerant recovery custody and mass balance | Detect duplicated or impossible recovery records | RefNEXT research; A-Gas RefHub platform | Real chain-of-custody and field evidence not accessible | Reject: cannot validate claims responsibly in the available time |
| Reused-building-material passport | Tie reused quantities to embodied-carbon evidence | ETH decentralized product-passport research; ISO DPP guidance | Material identity and carbon baselines | Reject: high risk of a thin passport CRUD app |
| Forest restoration overlap checker | Spot overlapping claimed areas and evidence dates | Established remote-sensing/carbon MRV platforms | Satellite access and attribution/impact validation | Reject: a convincing field validation is too large |
| Coastal observation review + portable Bitcoin evidence receipt | Bind raw bytes, transparent QA/ML, configuration and review decisions in a reproducible export | QARTOD already provides QA; OpenTimestamps provides generic timestamps; CarbonProof registers generic evidence on Sepolia | Anomalies are not sensor diagnoses; calendar confirmation is asynchronous | Select: narrow, testable complete journey with real open data and no wallet setup |

This combination is a product/workflow contribution, not a claim to invent quality control, Isolation Forest, hashes or blockchain timestamps. Search did not establish trademark clearance for Tideprint. The name has unrelated artistic uses; no absolute uniqueness claim is made.

## Primary technical sources

- NOAA CO-OPS data API: https://api.tidesandcurrents.noaa.gov/api/prod/ — station ID, metre units, explicit GMT and datum; water_level contains preliminary or verified six-minute observations depending on availability.
- IOOS QARTOD water-level guide v2.1: https://cdn.ioos.noaa.gov/media/2021/04/QARTOD_WaterLevelManual_Update_V2.1_Final.pdf — syntax, gaps, ranges, spike/rate/flat-line guidance. Tideprint is inspired by this guidance, not a certified full QARTOD implementation. Thresholds require local review.
- Liu, Ting and Zhou, Isolation Forest, IEEE ICDM 2008: https://doi.org/10.1109/ICDM.2008.17 and author PDF https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf — an ensemble isolates unusual points using short mean path lengths. No benchmark claims are transferred to this app.
- OpenTimestamps: https://opentimestamps.org/ and https://github.com/opentimestamps/python-opentimestamps — free calendars, salted hash commitments, portable .ots proofs; timestamps prove existence rather than truth. Parser/format behavior is checked against the reference implementation.
- Current OTS Python client: https://github.com/opentimestamps/opentimestamps-client — current default pool calendars and asynchronous Bitcoin confirmation behavior.

## Competitive presentation lessons

- Carbon Data Visualizer, Climate Collective bounty winner: https://devpost.com/software/carbon-data-visualizer — shows underlying MRV data and connects the interface to real NASA/geospatial/storage inputs. Lesson: expose underlying evidence, not just a score.
- CarbonProof, a current ClimateChain submission: https://devpost.com/software/carbonproof-verifiable-climate-evidence — fingerprints, deterministic audit, Sepolia registration and lookup already exist. Tideprint therefore focuses on water-level QA, actual unsupervised analysis, reproducible review manifests and wallet-free portable Bitcoin proofs rather than generic evidence registration.
- Search also found TrustyBite and other sensor/blockchain hackathon projects; combining IoT and hashes alone is not a credible novelty claim.

## Data and impact discipline

The NOAA snapshot was fetched successfully during technical preflight (San Francisco station 9414290; 1 October 2024; 241 returned observations for the requested 24-hour range). Preserve returned data/provenance. Deliberate training mutations must be disclosed individually. No measured emission reductions, field deployment, user-study outcomes or sensor-diagnosis accuracy will be invented.
