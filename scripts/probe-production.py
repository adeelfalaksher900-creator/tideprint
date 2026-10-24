"""Bounded probe of the project's own endpoints. Never probes upstream services in a burst."""
import concurrent.futures
import json
import time
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

BASE = 'https://tideprint.vercel.app'

def request(path, method='GET'):
    start = time.perf_counter()
    req = urllib.request.Request(BASE+path, method=method, headers={'User-Agent': 'Tideprint-bounded-operations-check/1.0'})
    try:
        response = urllib.request.urlopen(req, timeout=15)
    except urllib.error.HTTPError as error:
        response = error
    body = response.read(20000).decode('utf-8', errors='replace')
    try:
        payload = json.loads(body)
    except ValueError:
        payload = None
    return {'status': response.status, 'milliseconds': round((time.perf_counter()-start)*1000,2), 'cache': response.headers.get('x-vercel-cache'), 'cacheControl': response.headers.get('cache-control'), 'vercelRoute': response.headers.get('x-vercel-id'), 'payload': payload}

first = request('/api/health')
if first['status'] != 200 or first['payload'].get('schema') != 'tideprint/health/1':
    raise RuntimeError('New health endpoint not ready; no burst was sent.')

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    burst = list(pool.map(lambda _: request('/api/health'), range(35)))

static = request('/')
recovery = []
for _ in range(3):
    time.sleep(20)
    recovered = request('/api/health')
    recovery.append(recovered)
    if recovered['status'] == 200:
        break

errors = {'invalidStation': request('/api/noaa?station=invalid&date=2024-10-01'), 'wrongMethod': request('/api/stamp'), 'missingJson': request('/api/stamp', method='POST')}
# Two sequential public-data calls, never concurrent, inspect CDN behavior.
noaa = [request('/api/noaa?station=9414290&date=2024-10-01') for _ in range(2)]
for observation in noaa:
    if observation['payload']:
        observation['rows'] = len(observation['payload'].get('rawCSV','').strip().splitlines())-1
    observation.pop('payload', None)
latencies = sorted(x['milliseconds'] for x in burst if x['status'] == 200)
record = {'schema':'tideprint/production-probe/1', 'recordedAt': datetime.now(timezone.utc).isoformat(), 'target': BASE, 'healthBefore': first, 'boundedBurst': {'requests':35,'maxConcurrency':4,'statuses':dict(Counter(x['status'] for x in burst)), 'successfulP95Milliseconds':latencies[max(0,(95*len(latencies)+99)//100-1)] if latencies else None, 'observations':[{k:v for k,v in x.items() if k!='payload'} for x in burst]}, 'staticPageDuringLimit': {k:v for k,v in static.items() if k!='payload'}, 'recovery': recovery, 'validationErrors': errors, 'noaaCache': noaa, 'limits':['Single-client bounded request probe on the project itself; not a load, uptime or organizational-scale study.','Regional IP counters may have traffic from earlier requests; no global quota or exact request-count threshold is inferred.','Only two public NOAA lookups were sent, outside the burst.']}
Path('examples/operations').mkdir(parents=True,exist_ok=True)
Path('examples/operations/production.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({k:v for k,v in record.items() if k!='boundedBurst'},indent=2))
print('Burst status counts:',record['boundedBurst']['statuses'])
if not any(x['status']==429 for x in burst) or static['status']!=200 or recovery[-1]['status']!=200:
    raise RuntimeError('Expected rate limiting/static availability/recovery was not observed; inspect the saved record.')
