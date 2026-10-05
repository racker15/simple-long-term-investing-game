"""Fetch locked public payloads using Python's proxy-aware standard library.

Run from the repository root. No credentials, retries around access controls,
or runtime app networking. Initial acquisition/intentional upstream updates use
--refresh; otherwise every byte must match the committed source lock.
"""
import argparse
import hashlib
import json
from pathlib import Path
from datetime import datetime, timezone
from urllib.request import Request, urlopen


def fetch_sources(manifest_path, refresh=False):
    manifest_path = Path(manifest_path)
    manifest = json.loads(manifest_path.read_text())
    pending = []
    for source in manifest["sources"]:
        request = Request(source["download_url"], headers={"User-Agent": "historical-investing-game/0.1 public research"})
        with urlopen(request, timeout=45) as response:
            payload = response.read()
        if not payload:
            raise ValueError(f"Empty response: {source['id']}")
        digest = hashlib.sha256(payload).hexdigest()
        if not refresh and digest != source.get("sha256"):
            raise ValueError(f"{source['id']}: upstream changed; expected {source.get('sha256')}, got {digest}. Review before --refresh.")
        pending.append((source, payload, digest))
    # Do not partially replace the source set when any request/check failed.
    for source, payload, digest in pending:
        path = Path(source["raw_path"])
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
        if refresh:
            source["sha256"] = digest
            source["retrieved_at"] = datetime.now(timezone.utc).date().isoformat()
        print(f"{source['id']}: {len(payload)} bytes; sha256 {digest}")
    if refresh:
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest")
    parser.add_argument("--refresh", action="store_true")
    arguments = parser.parse_args()
    fetch_sources(arguments.manifest, arguments.refresh)
