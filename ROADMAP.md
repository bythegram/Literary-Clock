# Literally Clock — Data Gap Roadmap

This document tracks every minute of the day that currently lacks a literary quote in `docs/litclock.json` / `data/litclock_annotated.csv`, and outlines a research strategy for filling those gaps.

---

## Current Coverage

| Metric | Value |
|---|---|
| Total minutes in a day | 1,440 |
| Minutes with at least one quote | 925 |
| **Minutes with no quote (gaps)** | **515** |
| Overall coverage | **64.2 %** |

### Coverage by Hour

| Hour | Covered | Missing | Coverage |
|---|---|---|---|
| 00:xx (midnight) | 46 / 60 | 14 | 77 % |
| 01:xx | 32 / 60 | 28 | 53 % |
| 02:xx | 35 / 60 | 25 | 58 % |
| 03:xx | 39 / 60 | 21 | 65 % |
| 04:xx | 38 / 60 | 22 | 63 % |
| 05:xx | 36 / 60 | 24 | 60 % |
| 06:xx | 30 / 60 | 30 | 50 % |
| 07:xx | 37 / 60 | 23 | 62 % |
| 08:xx | 46 / 60 | 14 | 77 % |
| 09:xx | 45 / 60 | 15 | 75 % |
| 10:xx | 42 / 60 | 18 | 70 % |
| 11:xx | 46 / 60 | 14 | 77 % |
| 12:xx | 44 / 60 | 16 | 73 % |
| 13:xx | 37 / 60 | 23 | 62 % |
| 14:xx | 30 / 60 | 30 | 50 % |
| 15:xx | 39 / 60 | 21 | 65 % |
| 16:xx | 55 / 60 | 5  | 92 % ✅ |
| 17:xx | 32 / 60 | 28 | 53 % |
| 18:xx | 32 / 60 | 28 | 53 % |
| 19:xx | 33 / 60 | 27 | 55 % |
| 20:xx | 40 / 60 | 20 | 67 % |
| 21:xx | 34 / 60 | 26 | 57 % |
| 22:xx | 33 / 60 | 27 | 55 % |
| 23:xx | 44 / 60 | 16 | 73 % |

> ⚠️ = lowest coverage, prioritise first · ✅ = highest coverage, nearly complete

---

## Missing Times (Complete List)

Times are in 24-hour `H:MM` format, matching the `timecode` field in the dataset.

### Hour 00 — 14 missing
`0:19` `0:27` `0:35` `0:36` `0:37` `0:38` `0:39` `0:41` `0:44` `0:46` `0:48` `0:49` `0:51` `0:52`

### Hour 01 — 28 missing
`1:02` `1:03` `1:04` `1:05` `1:07` `1:14` `1:18` `1:19` `1:21` `1:31` `1:34` `1:35` `1:36` `1:37` `1:39` `1:41` `1:42` `1:43` `1:47` `1:48` `1:49` `1:52` `1:53` `1:55` `1:56` `1:57` `1:58` `1:59`

### Hour 02 — 25 missing
`2:03` `2:06` `2:08` `2:09` `2:11` `2:14` `2:16` `2:19` `2:22` `2:23` `2:29` `2:38` `2:39` `2:41` `2:42` `2:44` `2:48` `2:49` `2:50` `2:51` `2:52` `2:53` `2:54` `2:57` `2:58`

### Hour 03 — 21 missing
`3:02` `3:03` `3:06` `3:08` `3:09` `3:11` `3:12` `3:13` `3:16` `3:18` `3:22` `3:23` `3:24` `3:26` `3:31` `3:32` `3:46` `3:48` `3:52` `3:53` `3:56`

### Hour 04 — 22 missing
`4:09` `4:10` `4:19` `4:20` `4:21` `4:24` `4:26` `4:27` `4:28` `4:29` `4:33` `4:34` `4:37` `4:39` `4:42` `4:44` `4:47` `4:49` `4:51` `4:52` `4:53` `4:56`

### Hour 05 — 24 missing
`5:17` `5:18` `5:19` `5:21` `5:22` `5:27` `5:29` `5:32` `5:33` `5:36` `5:39` `5:41` `5:42` `5:44` `5:47` `5:48` `5:49` `5:50` `5:51` `5:53` `5:54` `5:56` `5:57` `5:59`

### Hour 06 — 30 missing
`6:01` `6:03` `6:04` `6:07` `6:09` `6:11` `6:12` `6:14` `6:16` `6:18` `6:21` `6:22` `6:23` `6:24` `6:26` `6:28` `6:31` `6:34` `6:39` `6:41` `6:42` `6:47` `6:48` `6:51` `6:52` `6:53` `6:54` `6:56` `6:57` `6:58`

### Hour 07 — 23 missing
`7:01` `7:07` `7:11` `7:16` `7:18` `7:21` `7:22` `7:24` `7:26` `7:28` `7:31` `7:33` `7:37` `7:38` `7:41` `7:43` `7:47` `7:48` `7:49` `7:52` `7:54` `7:57` `7:58`

### Hour 08 — 14 missing
`8:06` `8:07` `8:14` `8:18` `8:21` `8:22` `8:31` `8:33` `8:34` `8:36` `8:38` `8:46` `8:48` `8:53`

### Hour 09 — 15 missing
`9:26` `9:29` `9:31` `9:34` `9:38` `9:39` `9:41` `9:43` `9:44` `9:46` `9:48` `9:49` `9:51` `9:56` `9:57`

### Hour 10 — 18 missing
`10:04` `10:06` `10:08` `10:19` `10:24` `10:28` `10:29` `10:33` `10:34` `10:39` `10:41` `10:42` `10:44` `10:46` `10:51` `10:52` `10:54` `10:56`

### Hour 11 — 14 missing
`11:11` `11:13` `11:16` `11:21` `11:22` `11:23` `11:24` `11:26` `11:33` `11:37` `11:39` `11:43` `11:49` `11:53`

### Hour 12 — 16 missing
`12:09` `12:13` `12:16` `12:18` `12:19` `12:29` `12:31` `12:34` `12:36` `12:37` `12:38` `12:41` `12:48` `12:51` `12:56` `12:57`

### Hour 13 — 23 missing
`13:07` `13:08` `13:12` `13:14` `13:19` `13:21` `13:22` `13:27` `13:28` `13:29` `13:31` `13:35` `13:36` `13:38` `13:40` `13:41` `13:43` `13:46` `13:51` `13:52` `13:53` `13:54` `13:56`

### Hour 14 — 30 missing ⚠️ (lowest coverage)
`14:03` `14:07` `14:08` `14:09` `14:11` `14:12` `14:14` `14:17` `14:18` `14:21` `14:23` `14:24` `14:26` `14:27` `14:29` `14:31` `14:34` `14:37` `14:38` `14:42` `14:44` `14:46` `14:47` `14:48` `14:49` `14:51` `14:52` `14:53` `14:57` `14:59`

### Hour 15 — 21 missing
`15:02` `15:06` `15:11` `15:12` `15:17` `15:18` `15:19` `15:21` `15:22` `15:24` `15:26` `15:28` `15:31` `15:38` `15:42` `15:43` `15:46` `15:47` `15:48` `15:52` `15:54`

### Hour 16 — 5 missing ✅ (highest coverage)
`16:27` `16:36` `16:38` `16:41` `16:44`

### Hour 17 — 28 missing
`17:07` `17:08` `17:09` `17:11` `17:13` `17:16` `17:17` `17:22` `17:24` `17:26` `17:27` `17:28` `17:29` `17:31` `17:32` `17:34` `17:35` `17:36` `17:38` `17:39` `17:41` `17:43` `17:44` `17:47` `17:49` `17:51` `17:52` `17:56`

### Hour 18 — 28 missing
`18:01` `18:02` `18:06` `18:07` `18:09` `18:11` `18:12` `18:13` `18:14` `18:16` `18:17` `18:18` `18:19` `18:23` `18:24` `18:27` `18:28` `18:29` `18:37` `18:38` `18:39` `18:42` `18:43` `18:44` `18:47` `18:48` `18:52` `18:54`

### Hour 19 — 27 missing
`19:03` `19:04` `19:05` `19:06` `19:07` `19:09` `19:13` `19:18` `19:26` `19:27` `19:28` `19:29` `19:31` `19:32` `19:33` `19:34` `19:36` `19:37` `19:38` `19:39` `19:41` `19:43` `19:44` `19:46` `19:47` `19:48` `19:51`

### Hour 20 — 20 missing
`20:08` `20:09` `20:11` `20:12` `20:13` `20:19` `20:22` `20:26` `20:28` `20:31` `20:34` `20:37` `20:38` `20:39` `20:41` `20:48` `20:51` `20:52` `20:54` `20:59`

### Hour 21 — 26 missing
`21:06` `21:07` `21:08` `21:14` `21:16` `21:19` `21:21` `21:26` `21:27` `21:29` `21:33` `21:37` `21:39` `21:40` `21:41` `21:43` `21:44` `21:46` `21:48` `21:49` `21:51` `21:52` `21:53` `21:54` `21:55` `21:56`

### Hour 22 — 27 missing
`22:01` `22:03` `22:04` `22:07` `22:09` `22:13` `22:16` `22:19` `22:22` `22:23` `22:28` `22:29` `22:32` `22:34` `22:36` `22:37` `22:38` `22:39` `22:42` `22:43` `22:47` `22:51` `22:52` `22:53` `22:54` `22:56` `22:57`

### Hour 23 — 16 missing
`23:01` `23:02` `23:04` `23:06` `23:08` `23:09` `23:13` `23:14` `23:17` `23:21` `23:23` `23:24` `23:28` `23:29` `23:37` `23:38`

---

## Research Strategy

### Priority Order

Target hours in order of lowest coverage first, then finish the near-complete hours last:

1. **06:xx** — 50 % (30 missing) — dawn, rich in literary awakenings
2. **14:xx** — 50 % (30 missing) — afternoon, lots of literary action scenes
3. **01:xx** — 53 % (28 missing) — late-night, rich in literary insomnia/drama
4. **17:xx** — 53 % (28 missing) — late afternoon
5. **18:xx** — 53 % (28 missing) — evening, dinner, social scenes
6. **19:xx** — 55 % (27 missing) — evening
7. **22:xx** — 55 % (27 missing) — night
8. **21:xx** — 57 % (26 missing) — evening
9. **02:xx** — 58 % (25 missing)
10. **05:xx** — 60 % (24 missing)
11. **07:xx** / **13:xx** — 62 % (23 missing each)
12. **04:xx** — 63 % (22 missing)
13. **03:xx** / **15:xx** — 65 % (21 missing each)
14. **20:xx** — 67 % (20 missing)
15. **10:xx** — 70 % (18 missing)
16. **12:xx** / **23:xx** — 73 % (16 missing each)
17. **00:xx** — 77 % (14 missing) · **09:xx** — 75 % (15 missing)
18. **08:xx** / **11:xx** — 77 % (14 missing each)
19. **16:xx** — 92 % (5 missing) — finish last

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
2. Add a row to `data/litclock_annotated.csv` (or directly to `docs/litclock.json`).

**CSV row format** (pipe-separated within the `quote` field is fine — just keep the five comma-separated columns):

```
timecode,label,quote,book,author
14:37,"twenty-three to three","The little clock on the mantelpiece had its hands set at twenty-three to three.","Example Novel","A. N. Author"
```

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

After editing the CSV, regenerate `docs/litclock.json` by running:

```bash
node dist/csv-to-json.js   # if the conversion script exists
# or manually copy the formatted JSON entry into docs/litclock.json
```

---

## Progress Tracking

As gaps are filled, update the table in the **Coverage by Hour** section and remove the resolved timecodes from the missing-times lists above. Open a pull request for each batch of additions so changes can be reviewed.
