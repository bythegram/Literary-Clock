#!/usr/bin/env python3
"""Add public_domain field to all entries in docs/litclock.json.

The script determines whether each book is in the public domain using
the Open Library API.  A book is considered public domain when either:

* Its first-publication year satisfies ``first_publish_year + 95 < current_year``
  (US copyright rule: 95 years from publication date), or
* The author's death year satisfies ``death_year + 70 < current_year``
  (life-plus-70 rule used in the EU/UK), applied as a fallback when
  the publication year is not available from Open Library.

In ``--offline`` mode every entry receives ``public_domain: false``
(no API calls are made).

Usage
-----
  # Online run – query Open Library for all books (requires internet)
  python3 scripts/add_public_domain.py

  # Offline run – skip API calls, mark everything not-PD
  python3 scripts/add_public_domain.py --offline

  # Limit – process only the first N unique (book, author) pairs
  python3 scripts/add_public_domain.py --limit 10

  # Force – re-process entries that already have a public_domain field
  python3 scripts/add_public_domain.py --force
"""

import argparse
import datetime
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

LITCLOCK_JSON = Path(__file__).parent.parent / "docs" / "litclock.json"
OPEN_LIBRARY_SEARCH_API = "https://openlibrary.org/search.json"
OPEN_LIBRARY_AUTHOR_API = "https://openlibrary.org/authors/{key}.json"
RATE_LIMIT_DELAY = 0.5  # seconds between successive API requests


# ---------------------------------------------------------------------------
# Public-domain determination helpers
# ---------------------------------------------------------------------------

def _current_year() -> int:
    return datetime.date.today().year


def is_public_domain_by_year(first_publish_year: int) -> bool:
    """Return True if 95 years have fully elapsed since publication (US rule)."""
    return first_publish_year + 95 < _current_year()


def is_public_domain_by_death(death_year: int) -> bool:
    """Return True if 70 years have fully elapsed since the author's death."""
    return death_year + 70 < _current_year()


def parse_year(value: str) -> "int | None":
    """Extract the first four-digit year from a string such as '13 January 1941'."""
    m = re.search(r"\b(\d{4})\b", str(value))
    return int(m.group(1)) if m else None


# ---------------------------------------------------------------------------
# Open Library API helpers
# ---------------------------------------------------------------------------

def search_open_library(title: str, author: str) -> "tuple[int | None, str | None]":
    """Return ``(first_publish_year, author_key)`` for *title* / *author*.

    Returns ``(None, None)`` on any error.
    """
    params = {
        "title": title.strip(),
        "author": author.strip(),
        "limit": 1,
        "fields": "first_publish_year,author_key",
    }
    url = f"{OPEN_LIBRARY_SEARCH_API}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read())
        docs = data.get("docs", [])
        if docs:
            doc = docs[0]
            year = doc.get("first_publish_year")
            author_keys = doc.get("author_key", [])
            author_key = author_keys[0] if author_keys else None
            return year, author_key
    except Exception as exc:
        print(f"  Warning: search API error for '{title}' by '{author}': {exc}")
    return None, None


def get_author_death_year(author_key: str) -> "int | None":
    """Return the death year for the author identified by *author_key*, or None."""
    url = OPEN_LIBRARY_AUTHOR_API.format(key=author_key)
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read())
        death_date = data.get("death_date")
        if death_date:
            return parse_year(str(death_date))
    except Exception as exc:
        print(f"  Warning: author API error for '{author_key}': {exc}")
    return None


def search_author_death_year(author_name: str) -> "int | None":
    """Return the death year for *author_name* via the Open Library author search.

    Used as a last-resort fallback when the book search returns no author_key.
    """
    params = {"q": author_name.strip(), "limit": 1}
    url = f"https://openlibrary.org/search/authors.json?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read())
        docs = data.get("docs", [])
        if docs:
            death_date = docs[0].get("death_date")
            if death_date:
                return parse_year(str(death_date))
    except Exception as exc:
        print(f"  Warning: author search error for '{author_name}': {exc}")
    return None


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Add public_domain field to docs/litclock.json"
    )
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Skip Open Library API calls; mark all entries as public_domain=false",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        metavar="N",
        help="Process at most N unique (book, author) pairs (0 = no limit)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-process entries that already have a public_domain field",
    )
    args = parser.parse_args()

    with open(LITCLOCK_JSON, encoding="utf-8") as fh:
        entries = json.load(fh)

    current_year = _current_year()

    # ------------------------------------------------------------------
    # Collect unique (book, author) pairs that need processing.
    # Entries that lack a usable book/author are tracked separately so
    # they still receive public_domain=False rather than being silently
    # skipped.
    # ------------------------------------------------------------------
    needs_update: "dict[tuple[str, str], list[int]]" = {}
    malformed_indices: "list[int]" = []
    for idx, entry in enumerate(entries):
        if not isinstance(entry, dict):
            continue
        if not args.force and "public_domain" in entry:
            continue  # already processed; skip unless --force
        book = str(entry.get("book", "")).strip()
        author = str(entry.get("author", "")).strip()
        if book and author:
            needs_update.setdefault((book, author), []).append(idx)
        else:
            malformed_indices.append(idx)

    total_unique = len(needs_update)
    work_keys = list(needs_update.keys())
    if args.limit:
        work_keys = work_keys[: args.limit]

    mode = "offline" if args.offline else "online (Open Library API)"
    print(f"Mode   : {mode}")
    print(f"Books  : {len(work_keys)} of {total_unique} unique (book, author) pairs")
    if malformed_indices:
        print(f"Skipped: {len(malformed_indices)} entries with missing book/author (will be set to false)")
    if not args.offline:
        print(
            f"Year   : {current_year} "
            f"(US PD cutoff ≤ {current_year - 96}, "
            f"life+70 cutoff ≤ {current_year - 71})"
        )
    print()

    # ------------------------------------------------------------------
    # Look up public-domain status for each unique (book, author) pair
    # ------------------------------------------------------------------
    pd_cache: "dict[tuple[str, str], bool]" = {}
    for i, key in enumerate(work_keys):
        book, author = key
        print(f"[{i + 1}/{len(work_keys)}] '{book}' by '{author}'")

        if args.offline:
            pd_cache[key] = False
            print("  → offline mode: not public domain")
            continue

        pub_year, author_key = search_open_library(book, author)
        time.sleep(RATE_LIMIT_DELAY)

        if pub_year is not None:
            result = is_public_domain_by_year(pub_year)
            reason = f"first published {pub_year}"
        else:
            # Fallback: use author death date
            death_year = None
            if author_key:
                death_year = get_author_death_year(author_key)
                time.sleep(RATE_LIMIT_DELAY)
            if death_year is None:
                # Last resort: search for the author by name
                death_year = search_author_death_year(author)
                time.sleep(RATE_LIMIT_DELAY)
            if death_year is not None:
                result = is_public_domain_by_death(death_year)
                reason = f"author died {death_year} (life+70)"
            else:
                result = False
                reason = "no publication year or death date found"

        pd_cache[key] = result
        print(f"  → {'public domain' if result else 'not public domain'} ({reason})")

    # ------------------------------------------------------------------
    # Apply results to entries
    # ------------------------------------------------------------------
    updated = 0
    for key, indices in needs_update.items():
        if key not in pd_cache:
            continue  # outside --limit range; leave untouched
        pd_value = pd_cache[key]
        for idx in indices:
            entries[idx]["public_domain"] = pd_value
            updated += 1

    # Entries with no usable book/author cannot be looked up; mark false.
    for idx in malformed_indices:
        entries[idx]["public_domain"] = False
        updated += 1

    pd_true = sum(1 for e in entries if e.get("public_domain") is True)
    pd_false = sum(1 for e in entries if e.get("public_domain") is False)

    print(f"\nUpdated          : {updated} entries")
    print(f"Public domain    : {pd_true} entries")
    print(f"Not public domain: {pd_false} entries")

    tmp_path = LITCLOCK_JSON.with_suffix(LITCLOCK_JSON.suffix + ".tmp")
    with tmp_path.open("w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    tmp_path.replace(LITCLOCK_JSON)

    print(f"Saved   : {LITCLOCK_JSON}")


if __name__ == "__main__":
    main()
