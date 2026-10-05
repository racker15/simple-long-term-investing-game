"""Author a reviewed scenario's stock snapshot, with no outcome request before lock.

Yahoo chart has no revision parameter. Cache raw bytes (ignored) and commit their
hashes plus normalized monthly endpoints. Repeat normalization is offline;
changing snapshots is an explicit source refresh, never a silent overwrite.
"""
import argparse
import datetime
import hashlib
import json
import subprocess
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

parser = argparse.ArgumentParser()
parser.add_argument('scenario')
parser.add_argument('--outcome', action='store_true')
args = parser.parse_args()
scenario = args.scenario
try:
    cutoff = datetime.date.fromisoformat(scenario + '-01')
except ValueError as error:
    raise ValueError('Expected YYYY-MM scenario ID') from error
if scenario == '1999-09':
    raise ValueError('Do not modify the existing pilot stock snapshot')
research = Path('data/research') / scenario
inputs = json.loads((research / 'starting-inputs.json').read_text())
if inputs['metadata']['scenario_id'] != scenario:
    raise ValueError('Mismatched starting inputs')
if args.outcome:
    lock_path = research / 'starting-lock.json'
    committed = subprocess.run(['git', 'show', f'HEAD:{lock_path}'], capture_output=True, check=True).stdout
    if committed != lock_path.read_bytes():
        raise ValueError('Commit the unchanged starting lock before fetching outcomes')
    lock = json.loads(committed)
    for path, checksum in lock['files'].items():
        if hashlib.sha256(Path(path).read_bytes()).hexdigest() != checksum:
            raise ValueError(f'Starting lock changed: {path}')

def shifted(month, offset):
    index = month.year * 12 + month.month - 1 + offset
    return datetime.datetime(index // 12, index % 12 + 1, 1, tzinfo=datetime.timezone.utc)

start = shifted(cutoff, -12)
end = shifted(cutoff, 61 if args.outcome else 1)
stage = 'outcome' if args.outcome else 'starting'
folder = Path('data/normalized/stocks') / scenario
manifest_path = folder / ('outcome-sources.json' if args.outcome else 'sources.json')
if manifest_path.exists():
    raise ValueError('Snapshot already exists; normalize cached data instead of overwriting it')
manifest = {'schema_version': 1, 'sources': []}
for stock in inputs['hot_stocks']:
    symbol = stock['ticker']
    query = urlencode({'period1': int(start.timestamp()), 'period2': int(end.timestamp()), 'interval': '1d', 'events': 'div,splits', 'includeAdjustedClose': 'true'})
    url = f'https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?{query}'
    with urlopen(Request(url, headers={'User-Agent': 'historical-investing-research/1.0'}), timeout=45) as response:
        payload = response.read()
    result = json.loads(payload)['chart']
    if result.get('error') or len(result.get('result', [])) != 1:
        raise ValueError(f'Invalid Yahoo response for {symbol}')
    raw_path = Path('data/raw/stocks') / scenario / f'{stage}-{symbol}.json'
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    raw_path.write_bytes(payload)
    manifest['sources'].append({
        'id': f'yahoo-{symbol.lower()}',
        'source_name': 'Yahoo Finance daily adjusted close, current chart snapshot',
        'canonical_url': f'https://finance.yahoo.com/quote/{symbol}/history/',
        'download_url': url,
        'series_id': symbol,
        'raw_path': str(raw_path),
        'sha256': hashlib.sha256(payload).hexdigest(),
        'retrieved_at': '2026-10-05',
        'transformation': 'Daily USD adjusted close; last trading observation in each calendar month; adjacent price ratio minus one. Yahoo adjustments incorporate splits and cash dividends; do not add dividends again. Current reconstructed history, not a contemporary database vintage. Daily observations, nulls, currency, symbol, endpoints, and monthly gaps are strictly checked. No revision-pinned endpoint is available; the raw byte hash identifies this retrieval, not an immutable downloadable revision. Normalized monthly endpoints are committed for deterministic offline rebuilding. Corporate-action assessment belongs in the scenario research record.'
    })
    print(f'{scenario} {stage} {symbol}: {len(payload)} bytes; sha256 {manifest["sources"][-1]["sha256"]}', flush=True)
folder.mkdir(parents=True, exist_ok=True)
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
