# Bounded capacity and production checks

`npm run benchmark` recreates `capacity.json`: three warmups followed by 20 timed analysis, seal and verification operations for an archived NOAA day and a synthetic 3,000-row file. It also checks five concurrent local analysis workers and a 30-draft workspace restore. Timings depend on the recorded Node host; these are not browser or analyst task times.

The committed run measured maximum-row analysis p95 49.51 ms, seal p95 47.07 ms and verification p95 59.32 ms. All 40 measured receipts verified, all five worker results matched and all 30 drafts restored. These establish bounded computational behavior on that host, not enterprise adoption, field benefit or a service-level guarantee.

The live Vercel firewall is configured separately from source: one active rule, `/api/` prefix, 30 requests per IP per 60-second fixed window. Counters are regional. Static pages are outside this rule. Check that configuration again when redeploying to a different project; source code alone does not install the firewall rule.

`GET /api/health` checks function execution only and exposes a public release identifier. It does not probe NOAA, timestamp calendars or Bitcoin data providers. Successful NOAA responses have a 5-minute CDN freshness policy with a 10-minute stale-revalidation window. Errors and private proof responses remain `no-store`.

Production probe observations are recorded separately after deployment. A short request burst cannot establish uptime or organizational scale. Do not apply the probe to third-party NOAA/calendar services.

## Observed production probe

The recorded probe on 24 October 2026 UTC (25 October Pakistan time) received 30 HTTP 200 and 5 HTTP 429 responses across 35 health requests with at most four in flight. The static page returned 200 during the test; the first recovery check returned 200. Invalid station, wrong method and missing JSON requests returned 400, 405 and 400 respectively. Two sequential NOAA queries returned 241 observations; cache status changed from MISS to HIT.

The probing client observed successful-request p95 **7,452 ms**, including its network path and connection setup. This is not function CPU time or a low-latency service guarantee; no cause is established by this probe. Keep that observed latency separate from local Node computation. Regional counters and unrelated earlier requests mean the observed counts do not establish a globally exact quota.
