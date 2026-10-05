#!/usr/bin/env python3
"""Rebuild outcome-only stock action/endpoint audit from hash-checked Yahoo daily snapshots."""
import argparse
import calendar
import datetime as dt
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def finite_positive(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value) and value > 0


def date(timestamp):
    if not isinstance(timestamp, int) or isinstance(timestamp, bool):
        raise ValueError('Invalid event/trading timestamp')
    return dt.datetime.fromtimestamp(timestamp, dt.timezone.utc).date().isoformat()


def build(scenario_id):
    research = ROOT / 'data/research' / scenario_id
    stocks = ROOT / 'data/normalized/stocks' / scenario_id
    review = json.loads((research / 'corporate-action-review.json').read_text())
    manifest = json.loads((stocks / 'outcome-sources.json').read_text())
    full = json.loads((stocks / 'monthly-returns.json').read_text())
    starting = json.loads((stocks / 'starting.json').read_text())
    series = {}
    for source in manifest['sources']:
        ticker = source['series_id']
        raw = (ROOT / source['raw_path']).read_bytes()
        if hashlib.sha256(raw).hexdigest() != source['sha256']:
            raise ValueError(f'Raw checksum mismatch: {ticker}')
        chart = json.loads(raw)['chart']
        if chart.get('error') or len(chart['result']) != 1:
            raise ValueError('Invalid chart response')
        result = chart['result'][0]
        meta = result['meta']
        if meta['symbol'] != ticker or meta['currency'] != 'USD' or meta['dataGranularity'] != '1d':
            raise ValueError('Expected matching USD daily data')
        timestamps = result['timestamp']
        adjusted = result['indicators']['adjclose'][0]['adjclose']
        closes = result['indicators']['quote'][0]['close']
        if len(timestamps) != len(adjusted) or len(timestamps) != len(closes):
            raise ValueError('Misaligned daily columns')
        endpoints = {}
        seen = set()
        for timestamp, value, close in sorted(zip(timestamps, adjusted, closes)):
            trading_date = date(timestamp)
            if trading_date in seen or not finite_positive(value) or not finite_positive(close):
                raise ValueError(f'Malformed daily observation: {ticker} {trading_date}')
            seen.add(trading_date)
            month = trading_date[:7]
            endpoints[month] = dict(month=month, trading_date=trading_date, adjusted_close=value, split_adjusted_close=close)
        expected = full['series'][ticker]['prices']
        if list(endpoints) != [row['month'] for row in expected]:
            raise ValueError('Unexpected monthly coverage')
        for row in expected:
            endpoint = endpoints[row['month']]
            year, month = map(int, row['month'].split('-'))
            month_end = dt.date(year, month, calendar.monthrange(year, month)[1])
            if (month_end - dt.date.fromisoformat(endpoint['trading_date'])).days > 4:
                raise ValueError('Stale monthly endpoint')
            if row['value'] != endpoint['adjusted_close']:
                raise ValueError('Normalized endpoint mismatch')
        future_start = scenario_id
        future_end = expected[-1]['month']
        events = result.get('events', {})
        if set(events) - {'dividends', 'splits'}:
            raise ValueError('Unsupported corporate action; research explicitly before normalization')
        actions = {'dividends': [], 'splits': []}
        for kind, records in events.items():
            for event in records.values():
                event_date = date(event['date'])
                if kind == 'dividends':
                    amount = event['amount']
                    if not finite_positive(amount):
                        raise ValueError('Invalid dividend amount')
                    row = dict(ex_date=event_date, vendor_adjusted_amount=amount)
                else:
                    numerator, denominator = event['numerator'], event['denominator']
                    if not finite_positive(numerator) or not finite_positive(denominator):
                        raise ValueError('Invalid split ratio')
                    row = dict(trading_date=event_date, numerator=numerator, denominator=denominator, ratio=event['splitRatio'])
                if future_start < event_date[:7] <= future_end:
                    actions[kind].append(row)
            key = 'ex_date' if kind == 'dividends' else 'trading_date'
            actions[kind].sort(key=lambda row: row[key])
            if len({row[key] for row in actions[kind]}) != len(actions[kind]):
                raise ValueError('Duplicate corporate action date')
        starts = starting['series'][ticker]['prices']
        rebased_errors = [abs((endpoints[row['month']]['adjusted_close'] / endpoints[starts[0]['month']]['adjusted_close']) / (row['value'] / starts[0]['value']) - 1) for row in starts]
        if max(rebased_errors) > 5e-6:
            raise ValueError('Material starting/outcome snapshot discrepancy')
        series[ticker] = dict(raw_sha256=source['sha256'], monthly_endpoints=list(endpoints.values()), future_dividends=actions['dividends'], future_splits=actions['splits'], maximum_rebased_overlap_relative_difference=max(rebased_errors), review=review['stocks'][ticker])
    return dict(schema_version=1, scenario_id=scenario_id, retrieved_at=manifest['sources'][0]['retrieved_at'], convention='UTC dates from daily timestamps. Last actual trading close per calendar month; endpoints include 12 trailing months and cutoff plus60 holding months. Dividends use vendor ex-dates and backward-adjusted amounts, which need not equal original cash payments. Splits use vendor first trading dates; issuer record/payable dates are distinct. Adjusted close ratios already include vendor adjustments; no additional dividend, split, spin-off or terminal return is added. These are retrospective gross USD proxies, not exact broker dividend reinvestments. No shareholder successor mapping was applied in these windows; limitations and issuer references are in each review.', overlap_tolerance=5e-6, series=series)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('scenario_id')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if args.scenario_id == '1999-09' or not __import__('re').fullmatch(r'\d{4}-\d{2}', args.scenario_id):
        parser.error('Specify a new historical YYYY-MM scenario')
    value = build(args.scenario_id)
    path = ROOT / 'data/research' / args.scenario_id / 'corporate-actions.json'
    if args.check:
        if json.loads(path.read_text()) != value:
            raise ValueError(f'{path} is stale')
    else:
        path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
    print(f'{args.scenario_id}: verified3stock snapshots, endpoints, dividends and splits')


if __name__ == '__main__':
    main()
