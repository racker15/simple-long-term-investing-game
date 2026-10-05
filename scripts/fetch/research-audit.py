#!/usr/bin/env python3
"""Fetch and audit public URL sources listed in a scenario's provenance file.

Usage: python3 scripts/fetch/research-audit.py 2016-02
       python3 scripts/fetch/research-audit.py 2016-02 --outcome

Only unauthenticated public HTTP(S) requests are made. Successful response
bodies are stored under the ignored data/raw/research tree; the committed audit
contains response metadata and SHA-256 hashes, never article bodies.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import hashlib
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
MODELED_MARKET_IDS = {"asof-broad-proxies", "asof-stock-prices"}
ACCESS_DENIAL_MARKERS = (
    "access denied",
    "403 forbidden",
    "you don't have permission to access",
    "you do not have permission to access",
    "verify you are human",
    "checking your browser before accessing",
    "just a moment...",
    "complete the security check",
    "please enable javascript and cookies",
    "unusual traffic from your network",
    "request unsuccessful. incapsula incident id",
    "subscribe to read",
    "sign up to continue reading",
    "this content is for subscribers",
)
NOT_FOUND_MARKERS = (
    "404 not found",
    "404 page not found",
    "404 error",
    "page not found",
    "we couldn't find that page",
    "we could not find the page you requested",
    "the page you requested was not found",
    "the requested page could not be found",
    "the requested url was not found on this server",
    "sorry, we couldn't find the page",
)


def now_utc() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds").replace(
        "+00:00", "Z"
    )


def fetch_one(url: str) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "SimpleLongTermInvestingGame/1.0 (public provenance audit)",
            "Accept": "application/pdf,text/html,application/xhtml+xml,*/*;q=0.5",
        },
    )
    try:
        for attempt in range(2):
            try:
                with urllib.request.urlopen(request, timeout=45) as response:
                    body = response.read()
                    status = response.status
                    reason = response.reason
                    headers = response.headers
                    response_url = response.geturl()
            except urllib.error.HTTPError as error:
                body = error.read()
                status = error.code
                reason = error.reason
                headers = error.headers
                response_url = error.geturl()
            if status not in {408, 425, 429, 500, 502, 503, 504} or attempt == 1:
                break
    except (urllib.error.URLError, TimeoutError, OSError) as error:
        return {
            "retrieved_at": now_utc(),
            "status_code": None,
            "status_reason": None,
            "response_url": None,
            "content_type": None,
            "byte_count": 0,
            "sha256": None,
            "payload_validation": "not_available",
            "result": "network_failure",
            "failure_reason": str(getattr(error, "reason", error)),
            "body": None,
        }

    content_type = headers.get("Content-Type") if headers else None
    content_type_lower = (content_type or "").lower()
    status_class_ok = 200 <= status < 300
    is_pdf = urllib.parse.urlsplit(url).path.lower().endswith(".pdf") or (
        "application/pdf" in content_type_lower
    )
    body_hash = hashlib.sha256(body).hexdigest()
    payload_validation = "pdf_signature_valid" if is_pdf and body.startswith(b"%PDF-") else (
        "pdf_signature_invalid" if is_pdf else "nonempty_body"
    )
    result = "success"
    failure_reason = None

    if not status_class_ok:
        result = "access_failure" if status in {401, 403, 407, 451} else "http_failure"
        failure_reason = f"HTTP {status} {reason or ''}".strip()
    elif not body:
        result = "content_failure"
        failure_reason = "Successful HTTP status with an empty response body."
    elif is_pdf and not body.startswith(b"%PDF-"):
        result = "content_failure"
        failure_reason = "Expected a PDF, but the response body did not begin with %PDF-."
    elif not is_pdf and (
        "text/html" in content_type_lower
        or body.lstrip().lower().startswith((b"<!doctype html", b"<html"))
    ):
        page_text = body[:131072].decode("utf-8", errors="replace").lower()
        not_found_marker = next((item for item in NOT_FOUND_MARKERS if item in page_text), None)
        access_marker = next((item for item in ACCESS_DENIAL_MARKERS if item in page_text), None)
        if not_found_marker:
            result = "content_failure"
            failure_reason = f"HTTP {status} response appears to be a not-found page ({not_found_marker})."
        elif access_marker:
            result = "access_failure"
            failure_reason = f"HTTP {status} response appears to be an access-denial page ({access_marker})."

    return {
        "retrieved_at": now_utc(),
        "status_code": status,
        "status_reason": str(reason) if reason is not None else None,
        "response_url": response_url,
        "content_type": content_type,
        "byte_count": len(body),
        "sha256": body_hash,
        "payload_validation": payload_validation,
        "result": result,
        "failure_reason": failure_reason,
        "body": body if result == "success" else None,
    }


def source_urls(
    scenario_id: str, outcome: bool = False
) -> tuple[dict[str, Any], list[dict[str, Any]], str]:
    provenance_kind = "outcome" if outcome else "starting"
    provenance_name = f"{provenance_kind}-provenance.json"
    provenance_path = ROOT / "data" / "research" / scenario_id / provenance_name
    if not provenance_path.is_file():
        raise FileNotFoundError(f"Starting provenance not found: {provenance_path}")
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    entries = []
    for source in provenance.get("sources", []):
        source_id = source.get("id", "")
        reference = source.get("source_reference", "")
        if not outcome and source_id in MODELED_MARKET_IDS:
            continue
        if urllib.parse.urlsplit(reference).scheme not in {"http", "https"}:
            continue
        entries.append(source)
    return provenance, entries, provenance_name


def raw_filename(source_id: str, url: str) -> str:
    suffix = Path(urllib.parse.urlsplit(url).path).suffix.lower()
    if suffix not in {".pdf", ".html", ".htm", ".xml", ".json"}:
        suffix = ".body"
    safe_id = re.sub(r"[^A-Za-z0-9._-]", "_", source_id)
    return f"{safe_id}{suffix}"


def audit(scenario_id: str, outcome: bool = False) -> dict[str, Any]:
    provenance, sources, provenance_name = source_urls(scenario_id, outcome=outcome)
    unique_urls = sorted({source["source_reference"] for source in sources})
    fetched: dict[str, dict[str, Any]] = {}

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(fetch_one, url): url for url in unique_urls}
        for future in concurrent.futures.as_completed(futures):
            url = futures[future]
            try:
                fetched[url] = future.result()
            except Exception as error:  # Preserve a result for every provenance entry.
                fetched[url] = {
                    "retrieved_at": now_utc(),
                    "status_code": None,
                    "status_reason": None,
                    "response_url": None,
                    "content_type": None,
                    "byte_count": 0,
                    "sha256": None,
                    "payload_validation": "not_available",
                    "result": "network_failure",
                    "failure_reason": f"Unexpected retrieval error: {type(error).__name__}: {error}",
                    "body": None,
                }

    raw_dir = ROOT / "data" / "raw" / "research" / scenario_id
    if outcome:
        raw_dir = raw_dir / "outcome"
    audited_sources = []
    for source in sources:
        url = source["source_reference"]
        retrieval = fetched[url]
        body = retrieval["body"]
        if body is not None:
            raw_dir.mkdir(parents=True, exist_ok=True)
            (raw_dir / raw_filename(source["id"], url)).write_bytes(body)
        audited_sources.append(
            {
                "id": source.get("id"),
                "source_name": source.get("source_name"),
                "source_url": url,
                "publication_date": source.get("publication_date"),
                "retrieved_at": retrieval["retrieved_at"],
                "retrieval_date": retrieval["retrieved_at"][:10],
                "archive_date": None,
                "archive_date_status": "unknown",
                "status_code": retrieval["status_code"],
                "status_reason": retrieval["status_reason"],
                "response_url": retrieval["response_url"],
                "content_type": retrieval["content_type"],
                "byte_count": retrieval["byte_count"],
                "sha256": retrieval["sha256"],
                "payload_validation": retrieval["payload_validation"],
                "result": retrieval["result"],
                "failure_reason": retrieval["failure_reason"],
            }
        )

    return {
        "scenario_id": scenario_id,
        "provenance_kind": "outcome" if outcome else "starting",
        "retrieval_run_at": now_utc(),
        "retrieval_date": dt.datetime.now(dt.timezone.utc).date().isoformat(),
        "provenance_file": f"data/research/{scenario_id}/{provenance_name}",
        "modeled_market_sources_excluded": [] if outcome else sorted(MODELED_MARKET_IDS),
        "archive_date_note": "Unknown unless independently established; retrieval and original publication dates are recorded separately.",
        "sources": audited_sources,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("scenario_id", help="scenario directory, for example 2016-02")
    parser.add_argument(
        "--outcome",
        action="store_true",
        help="audit outcome-provenance.json and write outcome-specific audit/raw files",
    )
    args = parser.parse_args()
    if not re.fullmatch(r"\d{4}-\d{2}", args.scenario_id):
        parser.error("scenario_id must have YYYY-MM form")

    result = audit(args.scenario_id, outcome=args.outcome)
    audit_name = "outcome-retrieval-audit.json" if args.outcome else "retrieval-audit.json"
    out_path = ROOT / "data" / "research" / args.scenario_id / audit_name
    out_path.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    counts: dict[str, int] = {}
    for source in result["sources"]:
        key = source["result"]
        counts[key] = counts.get(key, 0) + 1
    print(f"Wrote {out_path.relative_to(ROOT)} ({len(result['sources'])} entries): {counts}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
