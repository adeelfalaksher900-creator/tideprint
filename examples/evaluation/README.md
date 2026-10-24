# Fault-injection evaluation

Run `npm run evaluate` from the repository root. Three attributed NOAA CO-OPS station-days (San Francisco, The Battery and Seattle, 1 October 2024) are cached as exact adapter responses. The command reuses the cached files and writes `results.json`.

Each day contains 241 observations. Seven deliberate mutations per day exercise missing value, spike, flat stretch, duplicate timestamp, removed readings, reversed rows and fast change checks. `results.json` records the expected row/flag and actual flags for every case, the configuration, source request and source-data SHA-256.

All 21 expected fault cases were detected under the stated settings. This is a deterministic mechanics check on hand-chosen synthetic faults. It is **not** a held-out or independently labelled accuracy benchmark. Flags on the unmodified data are reported as flags, not false positives. No model precision, recall, field impact or generalization result is claimed.

NOAA observations are public source data. Every cached response retains its NOAA request URL, station, datum, units and retrieval time. Deliberately modified series are constructed only in memory by the evaluation script; the cached originals remain unchanged.
