"""Optional evaluator dependency: pip install ioos_qc==2.2.1.
The application itself has no Python dependency.
"""
import json
import sys
from importlib.metadata import version
import numpy as np
from ioos_qc import qartod

results = []
for case in json.load(sys.stdin):
    values = np.array([np.nan if x is None else x for x in case['values']])
    config = case['config']
    gross = qartod.gross_range_test(values, fail_span=[config['min'], config['max']])
    rate = qartod.rate_of_change_test(values, case['seconds'], threshold=config['rate']/3600)
    checks = {'range': gross == 4, 'missing': gross == 9, 'rate': rate == 3}
    mismatches = []
    for name, expected in checks.items():
        for i, flagged in enumerate(expected):
            actual = name in case['flags'][i]
            if actual != bool(flagged):
                mismatches.append({'row': i+1, 'check': name, 'tideprint': actual, 'reference': bool(flagged)})
    results.append({'case': case['name'], 'rows': len(values), 'comparisons': len(values)*3, 'mismatches': mismatches})

print(json.dumps({
    'schema': 'tideprint/reference-check/1',
    'reference': {'package': 'ioos_qc', 'version': version('ioos_qc'), 'source': 'https://github.com/ioos/ioos_qc', 'documentation': 'https://ioos.github.io/ioos_qc/api/ioos_qc.html'},
    'checks': ['gross-range fail flags', 'missing-value flags', 'rate-of-change suspect flags with metres/hour converted to metres/second'],
    'comparisons': sum(x['comparisons'] for x in results),
    'mismatches': sum(len(x['mismatches']) for x in results),
    'results': results,
    'limits': [
        'An independently maintained implementation was used; this is not an independent human analyst study.',
        'Only three check semantics are compared on ordered six-minute series and stated boundaries.',
        'Spike, flat-line, timestamp checks and Isolation Forest are not validated by this comparison.',
        'Agreement with a reference implementation does not establish data truth, QARTOD certification or field benefit.'
    ]
}, indent=2))
