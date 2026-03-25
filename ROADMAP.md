# Literally Clock — Data Gap Roadmap

This document tracks every minute of the day that currently lacks a literary quote in `docs/litclock.json`, and outlines a research strategy for filling those gaps. It also documents the coverage status of the calendar datasets introduced alongside the Clock mode.

---

## Calendar Datasets

Three new datasets power the Day of Week, Date, and Month modes. Each file ships with one quote per entry; expanding them with additional quotes (like `litclock.json`) is encouraged.

| File | Entries | Status |
|---|---|---|
| `docs/litdays.json` | 7 (one per weekday) | ✅ All days covered |
| `docs/litdates.json` | Partial — see below | ⚠️ Not all dates covered |
| `docs/litmonths.json` | 12 (one per month) | ✅ All months covered |

### `litdates.json` coverage

`litdates.json` was seeded from the existing `litclock.json` dataset, extracting entries whose `quote` field contains an explicit calendar date. Many dates remain uncovered; when no entry exists for today's date the app falls back to displaying the date in bold. Adding entries for missing dates follows the same process as adding clock quotes — find a literary passage explicitly mentioning a specific date and append the entry with `"date": "M/D"` (e.g. `"3/25"`).

---

## Current Coverage

| Metric | Value |
|---|---|
| Total minutes in a day | 1,440 |
| Minutes with at least one quote | 1,309 |
| **Minutes with no quote (gaps)** | **131** |
| Overall coverage | **90.9 %** |

### Coverage by Hour

| Hour | Covered | Missing | Coverage |
|---|---|---|---|
| 00:xx (midnight) | 59 / 60 | 1 | 98 % ✅ |
| 01:xx | 60 / 60 | 0 | 100 % ✅ |
| 02:xx | 60 / 60 | 0 | 100 % ✅ |
| 03:xx | 60 / 60 | 0 | 100 % ✅ |
| 04:xx | 60 / 60 | 0 | 100 % ✅ |
| 05:xx | 60 / 60 | 0 | 100 % ✅ |
| 06:xx | 60 / 60 | 0 | 100 % ✅ |
| 07:xx | 58 / 60 | 2 | 97 % ✅ |
| 08:xx | 60 / 60 | 0 | 100 % ✅ |
| 09:xx | 53 / 60 | 7 | 88 % |
| 10:xx | 47 / 60 | 13 | 78 % ⚠️ |
| 11:xx | 48 / 60 | 12 | 80 % |
| 12:xx | 50 / 60 | 10 | 83 % |
| 13:xx | 52 / 60 | 8 | 87 % |
| 14:xx | 48 / 60 | 12 | 80 % ⚠️ |
| 15:xx | 50 / 60 | 10 | 83 % |
| 16:xx | 59 / 60 | 1 | 98 % ✅ |
| 17:xx | 55 / 60 | 5 | 92 % ✅ |
| 18:xx | 54 / 60 | 6 | 90 % |
| 19:xx | 53 / 60 | 7 | 88 % |
| 20:xx | 54 / 60 | 6 | 90 % |
| 21:xx | 47 / 60 | 13 | 78 % ⚠️ |
| 22:xx | 47 / 60 | 13 | 78 % ⚠️ |
| 23:xx | 55 / 60 | 5 | 92 % ✅ |

> ⚠️ = lowest coverage, prioritise first · ✅ = highest coverage, nearly complete

---

## Missing Times (Complete List)

Times are in 24-hour `H:MM` format, matching the `timecode` field in the dataset.

### Hour 00 — 1 missing
`0:35`

### Hour 01 — 0 missing
*(fully covered)*

### Hour 02 — 0 missing
*(fully covered)*

### Hour 03 — 0 missing
*(fully covered)*

### Hour 04 — 0 missing
*(fully covered)*

### Hour 05 — 0 missing
*(fully covered)*

### Hour 06 — 0 missing
*(fully covered)*

### Hour 07 — 2 missing
`7:16` `7:41`

### Hour 08 — 0 missing
*(fully covered)*

### Hour 09 — 7 missing
`9:39` `9:41` `9:43` `9:44` `9:46` `9:48` `9:51`

### Hour 10 — 13 missing
`10:04` `10:19` `10:24` `10:29` `10:33` `10:34` `10:39` `10:41` `10:42` `10:44` `10:46` `10:52` `10:54`

### Hour 11 — 12 missing
`11:11` `11:13` `11:21` `11:22` `11:24` `11:26` `11:33` `11:37` `11:39` `11:43` `11:49` `11:53`

### Hour 12 — 10 missing
`12:09` `12:13` `12:16` `12:18` `12:19` `12:31` `12:34` `12:37` `12:41` `12:48`

### Hour 13 — 8 missing
`13:08` `13:12` `13:28` `13:29` `13:38` `13:40` `13:46` `13:52`

### Hour 14 — 12 missing ⚠️ (lowest coverage, tied)
`14:07` `14:09` `14:12` `14:18` `14:21` `14:24` `14:26` `14:27` `14:31` `14:37` `14:47` `14:53`

### Hour 15 — 10 missing
`15:06` `15:11` `15:12` `15:17` `15:19` `15:24` `15:26` `15:38` `15:43` `15:54`

### Hour 16 — 1 missing ✅ (near complete)
`16:38`

### Hour 17 — 5 missing
`17:13` `17:17` `17:24` `17:38` `17:52`

### Hour 18 — 6 missing
`18:01` `18:09` `18:19` `18:37` `18:38` `18:43`

### Hour 19 — 7 missing
`19:03` `19:28` `19:29` `19:31` `19:33` `19:37` `19:46`

### Hour 20 — 6 missing
`20:12` `20:13` `20:37` `20:39` `20:51` `20:52`

### Hour 21 — 13 missing ⚠️ (lowest coverage, tied)
`21:06` `21:08` `21:19` `21:37` `21:39` `21:41` `21:43` `21:44` `21:46` `21:48` `21:49` `21:51` `21:56`

### Hour 22 — 13 missing ⚠️ (lowest coverage, tied)
`22:01` `22:04` `22:07` `22:28` `22:29` `22:34` `22:37` `22:39` `22:42` `22:43` `22:51` `22:52` `22:54`

### Hour 23 — 5 missing ✅ (near complete)
`23:02` `23:13` `23:14` `23:24` `23:37`

---

## Research Strategy

### Priority Order

Target hours in order of lowest coverage first, then finish the near-complete hours last:

1. **10:xx** — 78 % (13 missing) ⚠️ — morning
2. **14:xx** — 80 % (12 missing) ⚠️ — afternoon
3. **21:xx** — 78 % (13 missing) ⚠️ — evening
4. **22:xx** — 78 % (13 missing) ⚠️ — night
5. **11:xx** — 80 % (12 missing) — late morning
6. **12:xx** / **15:xx** — 83 % (10 missing each) — midday / afternoon
7. **13:xx** — 87 % (8 missing)
8. **09:xx** / **19:xx** — 88 % (7 missing each)
9. **18:xx** / **20:xx** — 90 % (6 missing each) — evening
10. **17:xx** / **23:xx** — 92 % (5 missing each) ✅
11. **00:xx** — 98 % (1 missing) ✅
12. **07:xx** — 97 % (2 missing) ✅
13. **16:xx** — 98 % (1 missing) ✅ — finish last

---

### Time-to-English Phrase Cheat Sheet

When searching for literary quotes, use these natural-language equivalents:

| Minute | Phrases to search |
|---|---|
| `:01` | "one minute past", "one minute after" |
| `:02` | "two minutes past", "two minutes after" |
| `:03` | "three minutes past", "three minutes after" |
| `:04` | "four minutes past" |
| `:05` | "five past", "five minutes past" |
| `:06` | "six minutes past" |
| `:07` | "seven minutes past" |
| `:08` | "eight minutes past" |
| `:09` | "nine minutes past" |
| `:10` | "ten past", "ten minutes past" |
| `:11` | "eleven minutes past" |
| `:12` | "twelve minutes past" |
| `:13` | "thirteen minutes past" |
| `:14` | "fourteen minutes past" |
| `:15` | "quarter past", "quarter after", "fifteen minutes past" |
| `:16` | "sixteen minutes past" |
| `:17` | "seventeen minutes past" |
| `:18` | "eighteen minutes past" |
| `:19` | "nineteen minutes past" |
| `:20` | "twenty past", "twenty minutes past" |
| `:21` | "twenty-one minutes past" |
| `:22` | "twenty-two minutes past" |
| `:23` | "twenty-three minutes past" |
| `:24` | "twenty-four minutes past" |
| `:25` | "twenty-five past", "twenty-five minutes past" |
| `:26` | "twenty-six minutes past" |
| `:27` | "twenty-seven minutes past" |
| `:28` | "twenty-eight minutes past" |
| `:29` | "twenty-nine minutes past" |
| `:30` | "half past", "half-past", "thirty" |
| `:31` | "twenty-nine to", "thirty-one" |
| `:32` | "twenty-eight to", "thirty-two" |
| `:33` | "twenty-seven to", "thirty-three" |
| `:34` | "twenty-six to", "thirty-four" |
| `:35` | "twenty-five to", "thirty-five" |
| `:36` | "twenty-four to", "thirty-six" |
| `:37` | "twenty-three to", "thirty-seven" |
| `:38` | "twenty-two to", "thirty-eight" |
| `:39` | "twenty-one to", "thirty-nine" |
| `:40` | "twenty to", "forty" |
| `:41` | "nineteen to", "forty-one" |
| `:42` | "eighteen to", "forty-two" |
| `:43` | "seventeen to", "forty-three" |
| `:44` | "sixteen to", "forty-four" |
| `:45` | "quarter to", "quarter of", "forty-five" |
| `:46` | "fourteen to", "forty-six" |
| `:47` | "thirteen to", "forty-seven" |
| `:48` | "twelve to", "forty-eight" |
| `:49` | "eleven to", "forty-nine" |
| `:50` | "ten to", "fifty" |
| `:51` | "nine to", "fifty-one" |
| `:52` | "eight to", "fifty-two" |
| `:53` | "seven to", "fifty-three" |
| `:54` | "six to", "fifty-four" |
| `:55` | "five to", "fifty-five" |
| `:56` | "four to", "fifty-six" |
| `:57` | "three to", "fifty-seven" |
| `:58` | "two to", "fifty-eight" |
| `:59` | "one to", "fifty-nine" |

Also search for digital-clock formats such as `1:47`, `14:47`, `2:47 a.m.`, etc. — novels set in modern times often use these.

---

### Recommended Search Sources

#### Full-text search engines
- **[Project Gutenberg](https://www.gutenberg.org/)** — thousands of public-domain novels fully searchable. Use the search form or download `.txt` files and grep for time phrases.
- **[Internet Archive — Open Library](https://archive.org/details/texts)** — scanned books with OCR text. Search for time strings like `"quarter past two"`.
- **[HathiTrust Digital Library](https://www.hathitrust.org/)** — full-text search across millions of digitised books (requires free account for snippet view).

#### Quotation databases
- **[The Guardian Literary Clock](https://www.theguardian.com/books/table/2011/apr/21/literary-clock)** — the original crowdsourced list that inspired this project; scan for times not yet in the dataset.
- **[Goodreads Quotes](https://www.goodreads.com/quotes)** — search for time-related phrases (e.g. `"quarter past three"`).
- **[Wikiquote](https://en.wikiquote.org/)** — per-author quote pages; scan dialogue-heavy works.

#### Genre-specific recommendations
Many of the missing times fall in the awkward "odd minutes" range (e.g. `14:37`, `21:43`). Precise times like these appear most often in:

| Genre / Style | Why | Example authors |
|---|---|---|
| Crime & detective fiction | Characters track exact times as evidence | Agatha Christie, Raymond Chandler, P.D. James |
| War & military fiction | Military time (`0347h`, `14:52`) is used precisely | Ernest Hemingway, Sebastian Faulks, Pat Barker |
| Science fiction | Clocks, countdowns, ship logs | Isaac Asimov, Philip K. Dick, Arthur C. Clarke |
| Journalism / non-fiction narrative | Timestamped reconstructions | Truman Capote (*In Cold Blood*), Erik Larson |
| Diaries & epistolary novels | Dated entries with exact times | Samuel Pepys, Anne Frank, Bram Stoker (*Dracula*) |
| Spy fiction | Mission schedules | John le Carré, Ian Fleming |

---

### How to Add a New Quote

1. Find a passage containing a clearly stated time that matches one of the missing timecodes above.
2. Add a new entry directly to `docs/litclock.json`.

**JSON entry format** (the `label` must be an exact substring of `quote`):

```json
{
  "timecode": "14:37",
  "label": "twenty-three to three",
  "quote": "The little clock on the mantelpiece had its hands set at twenty-three to three.",
  "book": "Example Novel",
  "author": "A. N. Author"
}
```

Key rules:
- `timecode` must use `H:MM` format (no leading zero on the hour).
- `label` must be a verbatim lowercase substring of `quote`.
- `quote` should be a complete sentence or self-contained passage — avoid fragments that lose their meaning out of context.
- Prefer public-domain works or quotes short enough to qualify as fair use.
- The `isbn`, `biblio_link`, and `public_domain` fields are optional in the entry itself — run the helper scripts after adding entries to populate them:
  ```bash
  python3 scripts/add_biblio_links.py
  python3 scripts/add_public_domain.py
  ```

---

## Progress Tracking

As gaps are filled, update the table in the **Coverage by Hour** section and remove the resolved timecodes from the missing-times lists above. Open a pull request for each batch of additions so changes can be reviewed.
