# GitHub Copilot — Repository Instructions for Literary Clock

These instructions give AI coding agents the context needed to work effectively in this repository. Read them before making any changes.

---

## 1. Project Overview

**Literary Clock** is a static, single-page web application that displays the current time as a matching quotation from world literature. Every minute of the day is mapped to one or more literary passages that explicitly mention that time; the app shows a random passage for the current minute and updates automatically.

- **Live demo:** <https://bythegram.github.io/Literary-Clock/>
- **Hosting:** GitHub Pages (served directly from the `docs/` directory on the `gh-pages` branch)
- **No build step.** Everything in `docs/` is plain HTML/CSS/JS and is deployed as-is.

---

## 2. Repository Structure

```
Literary-Clock/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: push docs/ to gh-pages on pushes to main + manual runs
├── docs/                       # ← The entire deployed application lives here
│   ├── index.html              # App shell; loads Bootstrap 5 from CDN, Google Fonts, app.js
│   ├── app.js                  # All clock logic (ES5 IIFE); no build or bundler
│   ├── style.css               # Responsive styles; portrait/landscape, font-size scaling
│   ├── litclock.json           # ← PRIMARY DATA SOURCE: 1,400+ time-tagged literary quotes
│   └── favicon.ico
├── scripts/
│   └── add_biblio_links.py     # Enriches litclock.json with isbn + biblio_link fields
├── package.json                # No declared deps; dev server run via `npx serve docs`
├── README.md                   # Setup, usage, and contributor guide
└── ROADMAP.md                  # Coverage-gap tracker and research strategy
```

> **Rule:** Never move or rename files inside `docs/`. GitHub Pages serves them at fixed relative paths.

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Language | Vanilla JavaScript **ES5** | The entire app is one IIFE in `docs/app.js` — no modules, no transpilation |
| Styling | Bootstrap 5 (CDN) + custom CSS | Bootstrap loaded from jsDelivr CDN with SRI integrity hash |
| Fonts | Google Fonts (CDN) | Open Sans Condensed 300 and Roboto Slab 300/700 |
| Data | JSON | `docs/litclock.json` — edited directly, no compile step |
| Dev server | `npx serve docs` | Run `npm start`; navigate to `http://localhost:3000/` |
| Deployment | GitHub Actions → GitHub Pages | `.github/workflows/deploy.yml` |
| Scripting | Python 3 | `scripts/add_biblio_links.py`; no external dependencies beyond the stdlib |

---

## 4. The Data File — `docs/litclock.json`

### 4.1 Schema

Every entry is a JSON object with these fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `timecode` | string | **Yes** | 24-hour time in `H:MM` format, e.g. `"9:05"` or `"14:37"`. **No leading zero on the hour.** |
| `label` | string | **Yes** | The exact substring of `quote` that expresses the time (lowercase). Used to wrap the time phrase in `<strong>` tags. |
| `quote` | string | **Yes** | The full sentence or self-contained passage containing the time reference. |
| `book` | string | **Yes** | Title of the source work. |
| `author` | string | **Yes** | Author of the source work. |
| `isbn` | string | No | ISBN-13 (preferred) or ISBN-10, populated by `add_biblio_links.py`. |
| `biblio_link` | string | No | Biblio.com URL, populated by `add_biblio_links.py`. ISBN-keyed if `isbn` exists; title/author search otherwise. |

### 4.2 Timecode Format Rules

- Format is `H:MM` — the hour has **no leading zero**, the minute is **zero-padded to two digits**.
- Examples: `"0:00"`, `"0:05"`, `"9:07"`, `"13:01"`, `"23:59"`.
- This matches exactly what `app.js` produces: `date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2)`.
- **Do NOT use** `"09:07"` (padded hour) — it will never match and the quote will never be shown.

### 4.3 Label Rules

- `label` must be a **verbatim, case-insensitive substring** of `quote`.
- Both `quote` and `label` are lowercased in `app.js` before the substring replacement, so case in the JSON does not matter for matching — but keep `label` lowercase as a convention.
- The substring match is a simple `String.replace(label, '<strong>' + label + '</strong>')` — if `label` appears more than once in `quote`, only the **first occurrence** is wrapped.
- `label` should be the shortest unambiguous phrase that unambiguously names the time (e.g. `"quarter past three"`, `"two forty-seven"`, `"14:37"`).

### 4.4 Quote Quality Guidelines

- Prefer **complete sentences** — fragments lose meaning out of context.
- Prefer **public-domain works** or passages short enough to qualify as fair use.
- The app applies a CSS `smaller` class when `quote.length > 300`; keep quotes under 300 characters where possible.
- Avoid quotes that require heavy contextual knowledge to understand the time reference.

### 4.5 Multiple Quotes Per Timecode

- Multiple entries with the same `timecode` are fully supported and encouraged.
- On page load, `shuffleArray()` randomises the full dataset, so each visit shows a different passage for the same minute.

---

## 5. JavaScript Conventions (`docs/app.js`)

- **ES5 only** — use `var`, `function` declarations, and prototype-style code. Do **not** use `let`, `const`, arrow functions, template literals, classes, or any ES6+ syntax. The file has no transpilation step.
- The entire file is wrapped in an immediately-invoked function expression (IIFE): `(function () { ... }());`
- DOM manipulation uses `document.getElementById()` and manual `innerHTML`/`textContent` assignment — no jQuery, no framework.
- The clock update cycle:
  1. On data load: call `updateDisplay()` immediately.
  2. `setTimeout` fires at the **next wall-clock minute boundary** (`(60 - seconds) * 1000 - milliseconds` ms from now).
  3. After that, a `setInterval` fires every 60 000 ms.
- `biblio_link` is optional — always guard with `if (litTime.biblio_link)` before creating an anchor element.

---

## 6. Python Scripting Conventions (`scripts/`)

- **Python 3** only; use only the standard library (no `pip install` required).
- `add_biblio_links.py` modifies `docs/litclock.json` **in-place** via an atomic `.tmp` → rename pattern.
- Rate-limit Open Library API calls to at least 0.5 s between requests (`RATE_LIMIT_DELAY`).
- Biblio.com URL patterns:
  - With ISBN: `https://www.biblio.com/search.php?keyisbn={isbn}`
  - Without ISBN: `https://www.biblio.com/search.php?title={title}&author={author}` (URL-encoded)

---

## 7. Development Workflow

### Local Development

```bash
npm install      # optional — only needed if/when dependencies are added; `npm start` works without it
npm start        # launches `npx serve docs` on http://localhost:3000/
```

The app fetches `litclock.json` via `fetch('litclock.json')` — a live server is required (opening `index.html` directly will fail due to CORS restrictions on `file://` URLs).

### Running the Biblio-Links Script

```bash
# Online — queries Open Library for ISBNs (requires internet access)
python3 scripts/add_biblio_links.py

# Offline — skips API, writes title/author search links for every entry
python3 scripts/add_biblio_links.py --offline

# Limit to the first 10 unique (book, author) pairs
python3 scripts/add_biblio_links.py --limit 10
```

### Deployment

- Push to `main` → GitHub Actions runs `deploy.yml` → `docs/` is pushed to the `gh-pages` branch → GitHub Pages serves the site.
- No manual build step. Changes to any file in `docs/` are live within a minute of merging.

---

## 8. Adding New Quotes (Step-by-Step)

1. Identify a missing timecode from `ROADMAP.md` (prioritise hours with lowest coverage).
2. Find a literary passage that **explicitly states** that time in words or digits.
3. Construct the JSON entry:

   ```json
   {
     "timecode": "9:15",
     "label": "quarter past nine",
     "quote": "The church bell struck quarter past nine as she pulled on her coat.",
     "book": "Example Novel",
     "author": "A. N. Author"
   }
   ```

4. Append the entry to `docs/litclock.json`. The array order does not matter (the app shuffles on load).
5. Validate the entry:
   - `timecode` uses `H:MM` format (no leading zero on hour, two-digit minute).
   - `label` is an exact substring of `quote` (case-insensitive).
   - The JSON file remains valid (no trailing commas, correct nesting).
6. Optionally run `python3 scripts/add_biblio_links.py --limit 1` to populate `isbn` and `biblio_link` for the new entry.
7. Update the coverage table and missing-times list in `ROADMAP.md`.
8. Open a pull request; keep each PR focused on a single batch of additions.

### Time-to-Phrase Reference

Use the cheat sheet in `ROADMAP.md §Time-to-English Phrase Cheat Sheet` when searching for literary passages. Key patterns:
- `:00` → `"o'clock"`, `"on the hour"`
- `:15` → `"quarter past"`, `"quarter after"`
- `:30` → `"half past"`, `"half-past"`
- `:45` → `"quarter to"`, `"quarter of"`
- Also search digital formats: `"9:07"`, `"9:07 a.m."`, `"09:07"` (novels set in modern times).

### Best Source Genres for Odd Minutes

Precise odd-minute times (`21:43`, `14:37`, etc.) appear most often in:
- **Crime & detective fiction** (Agatha Christie, Raymond Chandler, P.D. James)
- **War & military fiction** (Hemingway, Sebastian Faulks, Pat Barker)
- **Science fiction** (Asimov, Philip K. Dick, Arthur C. Clarke)
- **Diaries & epistolary novels** (Samuel Pepys, Anne Frank, Bram Stoker's *Dracula*)
- **Spy fiction** (John le Carré, Ian Fleming)

---

## 9. Validating Changes

There is no automated test suite. Validate changes manually:

### JSON validation

```bash
python3 -c "import json; json.load(open('docs/litclock.json'))" && echo "Valid JSON"
```

### Label / timecode spot-check

```python
import json

entries = json.load(open('docs/litclock.json'))
errors = []
for i, e in enumerate(entries):
    tc = e.get('timecode', '')
    label = e.get('label', '')
    quote = e.get('quote', '')
    if ':' not in tc:
        errors.append(f"[{i}] timecode missing colon: {repr(tc)}")
        continue
    if label and label.lower() not in quote.lower():
        errors.append(f"[{i}] label not in quote — timecode {tc}")
    h, m = tc.split(':', 1)
    try:
        hour = int(h)
        minute = int(m)
    except ValueError:
        errors.append(f"[{i}] non-numeric timecode: {tc}")
        continue
    if not (0 <= hour <= 23):
        errors.append(f"[{i}] hour out of range (0–23): {tc}")
    if not (0 <= minute <= 59):
        errors.append(f"[{i}] minute out of range (0–59): {tc}")
    if len(h) > 1 and h.startswith('0'):
        errors.append(f"[{i}] bad timecode format (leading zero on hour): {tc}")
    if len(m) != 2:
        errors.append(f"[{i}] minute not zero-padded: {tc}")
print('\n'.join(errors) if errors else 'All entries valid')
```

### Visual check

Run `npm start`, open `http://localhost:3000/`, and manually set your system clock (or temporarily hard-code a time in `app.js`) to verify a new quote appears correctly and the time phrase is highlighted in bold.

---

## 10. CI / CD

- **Workflow file:** `.github/workflows/deploy.yml`
- **Trigger:** push to `main` branch, or manual `workflow_dispatch`.
- **Action:** [`JamesIves/github-pages-deploy-action@v4`](https://github.com/JamesIves/github-pages-deploy-action) — pushes `docs/` to the `gh-pages` branch.
- **Permissions required:** `contents: write` (set in the workflow).
- There are no linting or testing jobs in CI. JSON validity and manual visual checks are the only quality gates today.

---

## 11. Coverage Tracking

`ROADMAP.md` is the single source of truth for dataset coverage. Whenever a gap is filled:

1. Remove the resolved timecode from the missing-times list in `ROADMAP.md`.
2. Increment the "Covered" count for the relevant hour row in the coverage table.
3. Recalculate the percentage.
4. Update the top-level "Minutes with at least one quote" and "Minutes with no quote" summary metrics.

Current overall coverage is ~90.9% (1,309 / 1,440 minutes covered). Priority hours for gap-filling are `10:xx`, `14:xx`, `21:xx`, and `22:xx` (currently around 78–80% coverage).

---

## 12. Key Conventions Summary

| Topic | Convention |
|---|---|
| Data file to edit | `docs/litclock.json` — edit this directly |
| Timecode format | `H:MM` — no leading zero on hour, zero-padded minute |
| JS style | ES5 IIFE — `var`, no arrow functions, no modules |
| Quote length | Prefer < 300 characters |
| Label | Lowercase, exact substring of quote |
| New dependencies | Do not add npm/pip dependencies unless absolutely necessary |
| PR scope | One focused batch of additions per pull request |
| File locations | Never rename or move files inside `docs/` |
