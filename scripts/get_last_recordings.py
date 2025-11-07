#!/usr/bin/env python3
"""
Lightweight helper to pull the most recent call recordings from 8x8 Cloud Storage.

Usage example:
    EIGHT_BY_EIGHT_CLIENT_ID=... \\
    EIGHT_BY_EIGHT_CLIENT_SECRET=... \\
    python scripts/get_last_recordings.py --region us-east --limit 10
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List
import time
import zipfile

import requests

TOKEN_URL = "https://api.8x8.com/oauth/v2/token"
OBJECTS_URL = "https://api.8x8.com/storage/{region}/v3/objects"
REGIONS_URL = "https://api.8x8.com/storage/{region}/v3/regions"
DOWNLOAD_START_URL = "https://api.8x8.com/storage/{region}/v3/bulk/download/start"
DOWNLOAD_STATUS_URL = "https://api.8x8.com/storage/{region}/v3/bulk/download/status/{zip_name}"
DOWNLOAD_URL = "https://api.8x8.com/storage/{region}/v3/bulk/download/{zip_name}"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Fetch the latest call recordings available in 8x8 Cloud Storage Service."
    )
    parser.add_argument(
        "--client-id",
        help="8x8 API key / client id. Defaults to EIGHT_BY_EIGHT_CLIENT_ID env var.",
    )
    parser.add_argument(
        "--client-secret",
        help="8x8 API secret / client secret. Defaults to EIGHT_BY_EIGHT_CLIENT_SECRET env var.",
    )
    parser.add_argument(
        "--region",
        help="Target storage region. If omitted the script discovers the first available region.",
    )
    parser.add_argument(
        "--discovery-region",
        default="us-east",
        help="Region to hit when enumerating available regions (default: us-east).",
    )
    parser.add_argument(
        "--object-type",
        default="callrecording",
        help="Object type filter (callrecording, callcenterrecording, etc).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=10,
        help="How many recordings to fetch (default: 10).",
    )
    parser.add_argument(
        "--save-json",
        type=Path,
        help="Optional path to dump the full API response as JSON.",
    )
    parser.add_argument(
        "--download-zip",
        type=Path,
        help="If provided, downloads the fetched recordings into this zip file.",
    )
    parser.add_argument(
        "--extract-to",
        type=Path,
        help="Directory to extract the downloaded zip into (requires --download-zip).",
    )
    parser.add_argument(
        "--poll-interval",
        type=int,
        default=5,
        help="Seconds between bulk download status checks (default: 5).",
    )
    parser.add_argument(
        "--poll-timeout",
        type=int,
        default=180,
        help="Total seconds to wait for the bulk zip to finish (default: 180).",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print extra diagnostic information.",
    )
    return parser


def get_access_token(client_id: str, client_secret: str) -> str:
    response = requests.post(
        TOKEN_URL,
        data={"grant_type": "client_credentials"},
        auth=(client_id, client_secret),
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return data["access_token"]


def discover_region(token: str, discovery_region: str, verbose: bool = False) -> str:
    url = REGIONS_URL.format(region=discovery_region)
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    regions = response.json()
    if verbose:
        print(f"# Regions reported by {discovery_region}: {regions}")
    if not regions:
        raise RuntimeError("Region discovery returned no regions. Provide --region manually.")
    return regions[0]


def fetch_recordings(
    token: str,
    region: str,
    object_type: str,
    limit: int,
    verbose: bool = False,
) -> Dict[str, Any]:
    params = {
        "limit": limit,
        "sortField": "createdTime",
        "sortDirection": "DESC",
        "filter": f"type=={object_type}",
    }
    url = OBJECTS_URL.format(region=region)
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    if verbose:
        print(f"# Querying {url} with params {params}")
    response = requests.get(url, headers=headers, params=params, timeout=30)
    response.raise_for_status()
    return response.json()


def print_summary(content: List[Dict[str, Any]]) -> None:
    if not content:
        print("No recordings were returned.")
        return

    print(f"Fetched {len(content)} recording(s):")
    for idx, obj in enumerate(content, start=1):
        created = obj.get("createdTime")
        name = obj.get("objectName")
        recording_id = obj.get("id")
        duration = next((t.get("value") for t in obj.get("tags", []) if t.get("key") == "duration"), "?")
        print(f"{idx:>2}. {created} | duration(s): {duration} | id: {recording_id} | file: {name}")


def start_bulk_download(token: str, region: str, object_ids: List[str], verbose: bool = False) -> str:
    if verbose:
        print(f"# Starting bulk download for {len(object_ids)} object(s)")
    url = DOWNLOAD_START_URL.format(region=region)
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    response = requests.post(url, headers=headers, json=object_ids, timeout=30)
    response.raise_for_status()
    data = response.json()
    zip_name = data.get("zipName")
    if not zip_name:
        raise RuntimeError(f"Missing zipName in response: {data}")
    return zip_name


def wait_for_bulk_zip(
    token: str,
    region: str,
    zip_name: str,
    poll_interval: int,
    poll_timeout: int,
    verbose: bool = False,
) -> None:
    url = DOWNLOAD_STATUS_URL.format(region=region, zip_name=zip_name)
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    deadline = time.time() + poll_timeout
    while time.time() < deadline:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        status = response.json().get("status")
        if verbose:
            print(f"# Download status for {zip_name}: {status}")
        if status == "DONE":
            return
        if status and status not in {"NOT_STARTED", "IN_PROGRESS"}:
            raise RuntimeError(f"Bulk download failed with status: {status}")
        time.sleep(max(1, poll_interval))
    raise TimeoutError(f"Timed out waiting for bulk download {zip_name} to complete.")


def download_zip(token: str, region: str, zip_name: str, destination: Path, verbose: bool = False) -> Path:
    url = DOWNLOAD_URL.format(region=region, zip_name=zip_name)
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    if verbose:
        print(f"# Downloading zip {zip_name} to {destination}")
    response = requests.get(url, headers=headers, timeout=60)
    response.raise_for_status()
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(response.content)
    return destination


def extract_zip(zip_path: Path, extract_dir: Path, verbose: bool = False) -> None:
    if verbose:
        print(f"# Extracting {zip_path} to {extract_dir}")
    extract_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(extract_dir)


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    client_id = args.client_id or os.getenv("EIGHT_BY_EIGHT_CLIENT_ID")
    client_secret = args.client_secret or os.getenv("EIGHT_BY_EIGHT_CLIENT_SECRET")
    if not client_id or not client_secret:
        parser.error("Provide 8x8 credentials via --client-id/--client-secret or env vars.")

    try:
        token = get_access_token(client_id, client_secret)
    except requests.HTTPError as exc:
        print(f"Failed to retrieve access token: {exc.response.text}", file=sys.stderr)
        return 1

    region = args.region
    if not region:
        try:
            region = discover_region(token, args.discovery_region, verbose=args.verbose)
        except requests.HTTPError as exc:
            print(f"Region discovery failed: {exc.response.text}", file=sys.stderr)
            return 1
        except RuntimeError as exc:
            print(exc, file=sys.stderr)
            return 1

    try:
        payload = fetch_recordings(
            token=token,
            region=region,
            object_type=args.object_type,
            limit=args.limit,
            verbose=args.verbose,
        )
    except requests.HTTPError as exc:
        print(f"Fetching recordings failed: {exc.response.text}", file=sys.stderr)
        return 1

    if args.save_json:
        args.save_json.write_text(json.dumps(payload, indent=2))
        if args.verbose:
            print(f"# Full response saved to {args.save_json}")

    content = payload.get("content", [])
    print_summary(content)

    should_download = bool(args.download_zip)
    if should_download and not content:
        print("Skipping download: no recordings returned.", file=sys.stderr)
        return 0

    if should_download:
        object_ids = [obj.get("id") for obj in content if obj.get("id")]
        if not object_ids:
            print("Skipping download: objects missing IDs.", file=sys.stderr)
            return 1

        try:
            zip_name = start_bulk_download(token, region, object_ids, verbose=args.verbose)
            wait_for_bulk_zip(
                token=token,
                region=region,
                zip_name=zip_name,
                poll_interval=args.poll_interval,
                poll_timeout=args.poll_timeout,
                verbose=args.verbose,
            )
            zip_path = download_zip(token, region, zip_name, args.download_zip, verbose=args.verbose)
        except (requests.HTTPError, TimeoutError, RuntimeError) as exc:
            print(f"Bulk download failed: {exc}", file=sys.stderr)
            return 1

        print(f"Saved zip file to {zip_path}")

        if args.extract_to:
            try:
                extract_zip(zip_path, args.extract_to, verbose=args.verbose)
            except (zipfile.BadZipFile, OSError) as exc:
                print(f"Failed to extract zip: {exc}", file=sys.stderr)
                return 1
            print(f"Extracted files to {args.extract_to}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
