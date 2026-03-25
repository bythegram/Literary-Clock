#!/usr/bin/env python3
"""Populate isbn and biblio_link fields in docs/litclock.json (default) or any
other JSON file in docs/ that shares the same entry schema.

The script processes every entry that is missing ``isbn``, ``biblio_link``,
or both, according to the following rules:

* If an entry already has ``isbn`` but no ``biblio_link``, the ISBN-keyed
  Biblio.com URL is generated directly — no API call is made and the
  existing ``isbn`` value is preserved.
* In online mode (default), entries without ``isbn`` are looked up via the
  Open Library search API.  If an ISBN-13 is found, both ``isbn`` and an
  ISBN-keyed Biblio.com URL are written.
* If no ISBN is found (or in ``--offline`` mode), a title/author keyword
  search URL on Biblio.com is written; no ``isbn`` field is added.

Entries that already have both ``isbn`` and ``biblio_link`` are skipped
entirely.

Usage
-----
  # Online run – query Open Library for missing ISBNs (requires internet)
  python3 scripts/add_biblio_links.py

  # Offline run – skip API calls, write title/author search URLs for every
  # entry that lacks a biblio_link (useful when no internet is available)
  python3 scripts/add_biblio_links.py --offline

  # Process a different data file (e.g. litdays.json or litmonths.json)
  python3 scripts/add_biblio_links.py --offline --file docs/litdays.json

  # Limit – process only the first N unique (book, author) pairs
  python3 scripts/add_biblio_links.py --limit 10
"""

import argparse
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

LITCLOCK_JSON = Path(__file__).parent.parent / "docs" / "litclock.json"
OPEN_LIBRARY_API = "https://openlibrary.org/search.json"
RATE_LIMIT_DELAY = 0.5  # seconds between successive API requests


# ---------------------------------------------------------------------------
# ISBN / URL helpers
# ---------------------------------------------------------------------------

def search_open_library(title: str, author: str) -> "str | None":
    """Return the best ISBN-13 for *title* / *author* via Open Library, or None."""
    params = {
        "title": title.strip(),
        "author": author.strip(),
        "limit": 1,
        "fields": "isbn",
    }
    url = f"{OPEN_LIBRARY_API}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read())
        docs = data.get("docs", [])
        if docs:
            isbns = docs[0].get("isbn", [])
            isbn13 = [i for i in isbns if len(i) == 13]
            return isbn13[0] if isbn13 else (isbns[0] if isbns else None)
    except Exception as exc:
        print(f"  Warning: API error for '{title}' by '{author}': {exc}")
    return None


def biblio_link_isbn(isbn: str) -> str:
    return f"https://www.biblio.com/search.php?keyisbn={isbn}"


def biblio_link_search(title: str, author: str) -> str:
    qs = urllib.parse.urlencode({"title": title.strip(), "author": author.strip()})
    return f"https://www.biblio.com/search.php?{qs}"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Add isbn / biblio_link fields to a Literary Clock JSON dataset (default: docs/litclock.json)"
    )
    parser.add_argument(
        "--file",
        type=Path,
        default=LITCLOCK_JSON,
        metavar="PATH",
        help="Path to the JSON data file to process (default: docs/litclock.json)",
    )
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Skip Open Library API calls; use title/author search URLs instead",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        metavar="N",
        help="Process at most N unique (book, author) pairs (0 = no limit)",
    )
    args = parser.parse_args()
    target_file = args.file.resolve()

    with open(target_file, encoding="utf-8") as fh:
        entries = json.load(fh)

    # ------------------------------------------------------------------
    # Collect unique (book, author) pairs that still need isbn / biblio_link
    # ------------------------------------------------------------------
    needs_update: "dict[tuple[str, str], list[int]]" = {}
    for idx, entry in enumerate(entries):
        if not isinstance(entry, dict):
            continue
        if entry.get("isbn") and entry.get("biblio_link"):
            continue  # already complete
        book = str(entry.get("book", "")).strip()
        author = str(entry.get("author", "")).strip()
        if book and author:
            needs_update.setdefault((book, author), []).append(idx)

    total_unique = len(needs_update)
    work_keys = list(needs_update.keys())
    if args.limit:
        work_keys = work_keys[: args.limit]

    mode = "offline (title/author search links)" if args.offline else "online (Open Library API)"
    print(f"Mode   : {mode}")
    print(f"Books  : {len(work_keys)} of {total_unique} unique (book, author) pairs")
    print()

    # ------------------------------------------------------------------
    # Look up ISBNs (or skip in offline mode)
    # Only query the API for books that don't already have an isbn.
    # ------------------------------------------------------------------
    isbn_cache: "dict[tuple[str, str], str | None]" = {}
    for i, key in enumerate(work_keys):
        book, author = key
        # Check whether any entry for this key already carries an isbn.
        existing_isbn = next(
            (str(entries[idx].get("isbn", "")) for idx in needs_update[key]
             if entries[idx].get("isbn")),
            None,
        )
        if existing_isbn:
            # Use the curated isbn as-is; no API call needed.
            isbn_cache[key] = existing_isbn
        elif args.offline:
            isbn_cache[key] = None
        else:
            print(f"[{i + 1}/{len(work_keys)}] '{book}' by '{author}'")
            isbn = search_open_library(book, author)
            isbn_cache[key] = isbn
            print(f"  → {isbn if isbn else 'not found'}")
            time.sleep(RATE_LIMIT_DELAY)

    # ------------------------------------------------------------------
    # Apply updates to entries
    # ------------------------------------------------------------------
    updated = 0
    for key, indices in needs_update.items():
        if key not in isbn_cache:
            continue  # outside --limit range; leave untouched
        book, author = key
        isbn = isbn_cache[key]
        for idx in indices:
            entry = entries[idx]
            if isbn:
                entry["isbn"] = isbn
                entry["biblio_link"] = biblio_link_isbn(isbn)
            else:
                # No ISBN available – write a keyword search link and omit isbn
                entry["biblio_link"] = biblio_link_search(book, author)
            updated += 1

    print(f"\nUpdated : {updated} entries")

    tmp_path = target_file.with_suffix(target_file.suffix + ".tmp")
    with tmp_path.open("w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    tmp_path.replace(target_file)

    print(f"Saved   : {target_file}")


if __name__ == "__main__":
    main()
