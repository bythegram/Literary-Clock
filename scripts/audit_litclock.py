#!/usr/bin/env python3
"""Audit docs/litclock.json for day-of-week, month, and date references, and
merge any newly discovered quotes into litdays.json, litmonths.json, and
litdates.json.

The source file (docs/litclock.json) is **never** modified — this is a pure
read-and-copy operation.

Patterns matched
----------------
* **Days**   — whole-word, case-insensitive match of Monday, Tuesday, …, Sunday.
* **Months** — whole-word, case-insensitive match of January, February, …,
  December.  Note: "May" is also a common English auxiliary verb; entries
  flagged by the audit should be reviewed before merging.
* **Dates**  — two complementary patterns:
    1. ``Month Day[ordinal]``  e.g. "January 1", "March 12th", "May 1st"
    2. ``Day[ordinal] [of] Month``  e.g. "1 January", "1st of July",
       "22nd April", "24 January"
  The ``date`` field is stored as ``M/D`` (e.g. ``"1/1"``, ``"3/12"``).

Deduplication
-------------
A quote already present in the target file (matched by normalised, lowercased
quote text) is silently skipped — no duplicate entries are added.

Usage
-----
  # Dry run — show counts without writing any files
  python3 scripts/audit_litclock.py --dry-run

  # Merge new quotes into all three target files
  python3 scripts/audit_litclock.py

  # Use a custom source file
  python3 scripts/audit_litclock.py --source docs/litclock.json
"""

import argparse
import json
import re
from pathlib import Path

DOCS_DIR = Path(__file__).parent.parent / "docs"

DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

MONTH_TO_NUM: dict[str, int] = {m.lower(): i + 1 for i, m in enumerate(MONTHS)}

# Pre-compile regexes for each day and month.
_DAY_PATTERNS: dict[str, re.Pattern[str]] = {
    day: re.compile(r"\b" + day + r"\b", re.IGNORECASE) for day in DAYS
}
_MONTH_PATTERNS: dict[str, re.Pattern[str]] = {
    month: re.compile(r"\b" + month + r"\b", re.IGNORECASE) for month in MONTHS
}

# Date patterns.
_MONTHS_ALT = "|".join(MONTHS)
# Pattern 1: Month name followed by a day number (with optional ordinal suffix)
#   e.g. "January 1", "March 12th", "May 1st"
_DATE_MONTH_FIRST = re.compile(
    r"\b(" + _MONTHS_ALT + r")\s+(\d{1,2})(?:st|nd|rd|th)?\b",
    re.IGNORECASE,
)
# Pattern 2: Day number (with optional ordinal suffix) followed by optional
#   "of" and a month name.
#   e.g. "1 January", "1st of July", "22nd April", "24 January"
_DATE_DAY_FIRST = re.compile(
    r"\b(\d{1,2})(?:st|nd|rd|th)?(?:\s+of)?\s+(" + _MONTHS_ALT + r")\b",
    re.IGNORECASE,
)


# ---------------------------------------------------------------------------
# Pattern-matching helpers
# ---------------------------------------------------------------------------


def find_days(quote: str) -> list[str]:
    """Return list of day-of-week names (title-cased) found in *quote*."""
    return [day for day in DAYS if _DAY_PATTERNS[day].search(quote)]


def find_months(quote: str) -> list[str]:
    """Return list of month names (title-cased) found in *quote*."""
    return [month for month in MONTHS if _MONTH_PATTERNS[month].search(quote)]


def find_dates(quote: str) -> list[tuple[str, str]]:
    """Return a list of ``(date_key, label)`` pairs for date references found
    in *quote*.

    *date_key* uses ``M/D`` format (e.g. ``"1/1"``, ``"3/12"``).
    *label* is the matched substring lowercased, suitable for highlighting.
    Duplicate date keys within the same quote are deduplicated.
    """
    found: list[tuple[str, str]] = []
    seen_keys: set[str] = set()

    for pattern in (_DATE_MONTH_FIRST, _DATE_DAY_FIRST):
        for m in pattern.finditer(quote):
            # Group indices differ between the two patterns.
            if pattern is _DATE_MONTH_FIRST:
                month_str, day_str = m.group(1), m.group(2)
            else:
                day_str, month_str = m.group(1), m.group(2)

            day_int = int(day_str)
            if not (1 <= day_int <= 31):
                continue

            month_num = MONTH_TO_NUM.get(month_str.lower())
            if month_num is None:
                continue

            date_key = f"{month_num}/{day_int}"
            if date_key not in seen_keys:
                seen_keys.add(date_key)
                found.append((date_key, m.group(0).lower()))

    return found


# ---------------------------------------------------------------------------
# Entry builders
# ---------------------------------------------------------------------------


def _extract_biblio_fields(entry: dict) -> dict:
    """Return a dict with ``biblio_link`` (and ``isbn`` if present) from *entry*."""
    result: dict = {}
    if entry.get("isbn"):
        result["isbn"] = entry["isbn"]
    if entry.get("biblio_link"):
        result["biblio_link"] = entry["biblio_link"]
    return result


def build_day_entry(day: str, entry: dict) -> dict:
    return {
        "day": day,
        "label": day.lower(),
        "quote": entry["quote"],
        "book": entry.get("book", ""),
        "author": entry.get("author", ""),
        **_extract_biblio_fields(entry),
    }


def build_month_entry(month: str, entry: dict) -> dict:
    return {
        "month": month,
        "label": month.lower(),
        "quote": entry["quote"],
        "book": entry.get("book", ""),
        "author": entry.get("author", ""),
        **_extract_biblio_fields(entry),
    }


def build_date_entry(date_key: str, label: str, entry: dict) -> dict:
    return {
        "date": date_key,
        "label": label,
        "quote": entry["quote"],
        "book": entry.get("book", ""),
        "author": entry.get("author", ""),
        **_extract_biblio_fields(entry),
    }


# ---------------------------------------------------------------------------
# File I/O
# ---------------------------------------------------------------------------


def load_json(path: Path) -> list:
    """Load a JSON array from *path*, returning an empty list if missing."""
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def save_json(path: Path, data: list) -> None:
    """Write *data* to *path* atomically via a ``.tmp`` rename."""
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    tmp.replace(path)


# ---------------------------------------------------------------------------
# Deduplication key
# ---------------------------------------------------------------------------


def quote_key(quote: str) -> str:
    """Normalised string used for deduplication (strip + lowercase)."""
    return quote.strip().lower()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Audit litclock.json for day-of-week, month, and date references "
            "and merge new quotes into litdays.json, litmonths.json, litdates.json."
        )
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=DOCS_DIR / "litclock.json",
        metavar="PATH",
        help="Source JSON file to audit (default: docs/litclock.json)",
    )
    parser.add_argument(
        "--days-file",
        type=Path,
        default=DOCS_DIR / "litdays.json",
        metavar="PATH",
        help="Target file for day-of-week quotes (default: docs/litdays.json)",
    )
    parser.add_argument(
        "--months-file",
        type=Path,
        default=DOCS_DIR / "litmonths.json",
        metavar="PATH",
        help="Target file for month quotes (default: docs/litmonths.json)",
    )
    parser.add_argument(
        "--dates-file",
        type=Path,
        default=DOCS_DIR / "litdates.json",
        metavar="PATH",
        help="Target file for date quotes (default: docs/litdates.json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show match counts without writing any files",
    )
    args = parser.parse_args()

    source = args.source.resolve()
    days_file = args.days_file.resolve()
    months_file = args.months_file.resolve()
    dates_file = args.dates_file.resolve()

    # ------------------------------------------------------------------
    # Load source
    # ------------------------------------------------------------------
    with source.open(encoding="utf-8") as fh:
        clock_entries: list[dict] = json.load(fh)

    # ------------------------------------------------------------------
    # Load existing targets and build deduplication sets (by quote text)
    # ------------------------------------------------------------------
    existing_days = load_json(days_file)
    existing_months = load_json(months_file)
    existing_dates = load_json(dates_file)

    days_existing_quotes: set[str] = {
        quote_key(e["quote"]) for e in existing_days if e.get("quote")
    }
    months_existing_quotes: set[str] = {
        quote_key(e["quote"]) for e in existing_months if e.get("quote")
    }
    dates_existing_quotes: set[str] = {
        quote_key(e["quote"]) for e in existing_dates if e.get("quote")
    }

    # ------------------------------------------------------------------
    # Audit
    # ------------------------------------------------------------------
    new_days: list[dict] = []
    new_months: list[dict] = []
    new_dates: list[dict] = []

    # Track (category_value, quote_key) pairs already added in this run
    # to avoid creating duplicates from the source file itself.
    seen_days: set[tuple[str, str]] = set()
    seen_months: set[tuple[str, str]] = set()
    seen_dates: set[tuple[str, str]] = set()

    for entry in clock_entries:
        if not isinstance(entry, dict):
            continue
        quote = entry.get("quote", "")
        if not quote:
            continue
        qk = quote_key(quote)

        for day in find_days(quote):
            pair = (day, qk)
            if qk not in days_existing_quotes and pair not in seen_days:
                seen_days.add(pair)
                new_days.append(build_day_entry(day, entry))

        for month in find_months(quote):
            pair = (month, qk)
            if qk not in months_existing_quotes and pair not in seen_months:
                seen_months.add(pair)
                new_months.append(build_month_entry(month, entry))

        for date_key, label in find_dates(quote):
            pair = (date_key, qk)
            if qk not in dates_existing_quotes and pair not in seen_dates:
                seen_dates.add(pair)
                new_dates.append(build_date_entry(date_key, label, entry))

    # ------------------------------------------------------------------
    # Report
    # ------------------------------------------------------------------
    print(f"Source             : {source}")
    print(f"New days entries   : {len(new_days)}")
    print(f"New months entries : {len(new_months)}")
    print(f"New dates entries  : {len(new_dates)}")

    if args.dry_run:
        print("\n--dry-run: no files written.")
        return

    # ------------------------------------------------------------------
    # Merge and save
    # ------------------------------------------------------------------
    if new_days:
        merged = existing_days + new_days
        save_json(days_file, merged)
        print(f"Saved {days_file}   ({len(merged)} total entries)")

    if new_months:
        merged = existing_months + new_months
        save_json(months_file, merged)
        print(f"Saved {months_file} ({len(merged)} total entries)")

    if new_dates:
        merged = existing_dates + new_dates
        save_json(dates_file, merged)
        print(f"Saved {dates_file}  ({len(merged)} total entries)")

    # ------------------------------------------------------------------
    # Validate output files are parseable JSON (AC 3.2)
    # ------------------------------------------------------------------
    for target in (days_file, months_file, dates_file):
        if target.exists():
            with target.open(encoding="utf-8") as fh:
                json.load(fh)  # raises if invalid

    print("\nAll output files passed JSON validation.")


if __name__ == "__main__":
    main()
