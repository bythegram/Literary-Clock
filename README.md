# LitClock

**[Live Demo](https://bythegram.github.io/Literary-Clock/)**

A literary clock that displays the current time — and calendar context — through quotations from famous novels and literary works. Instead of showing a traditional clock face, it finds a passage from literature that matches the current time, day of the week, calendar date, or month. The display updates automatically and can be toggled between modes via a navigation bar.

---

## Features

- **Clock mode** — displays the current time as a literary quote, updated every minute
- **Day of Week mode** — displays a literary passage for the current day of the week, refreshed at midnight
- **Date mode** — displays a literary passage for today's calendar date (`month/day`), refreshed at midnight
- **Month mode** — displays a literary passage for the current month, refreshed at the first instant of the next month
- Mode toggle bar at the bottom of the page: **Clock | Week | Date | Month | Info**
- Horizontal swipe navigation — swipe left to advance (Clock → Week → Date → Month → Info) or right to go back; works alongside the tab bar buttons
- Highlights the key time/date phrase within each quote using `<strong>` tags
- Shows the book title and author for every passage; links to Biblio.com when available
- Responsive design — works on desktop, tablet, and mobile (portrait/landscape)
- Quotes are shuffled on load so repeated visits show different passages for the same time/day
- Dark mode — automatically follows the system colour-scheme preference
- Installable as a Progressive Web App (PWA) — service worker caches all assets for offline use
- Content Security Policy (CSP) enforced via meta tag — no inline scripts, no `eval()`, no `unsafe-inline`
- Page Visibility API integration — re-renders and re-anchors all timers when a backgrounded tab becomes visible, preventing stale content after device sleep or tab switching

---

## Technologies Used

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES5 IIFE) |
| Temporal Polyfill | [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill) v0.5.1 — self-hosted at `docs/temporal-polyfill.js`; always loaded before `app.js`; exposes `Temporal` globally only when the native API is absent (e.g. iOS PWA standalone mode) |
| Styling | Custom CSS (`style.css`) with CSS custom properties; dark mode via `data-theme` attribute |
| Fonts | Self-hosted Playfair Display (quote serif, primary) and Open Sans Condensed (UI sans-serif); Roboto Slab is kept as a fallback. All declared in `fonts.css`, files in `docs/fonts/` |
| Data | JSON |
| Offline / PWA | Service worker (`sw.js`) caches all assets; Web App Manifest (`manifest.json`) |
| Security | `Content-Security-Policy` meta tag (`script-src 'self'`, no `unsafe-inline`) |
| Hosting | [GitHub Pages](https://pages.github.com/) |

---

## Project Structure

```
Literary-Clock/
├── docs/                           # Deployed app — served directly by GitHub Pages
│   ├── index.html                  # App shell HTML (CSP meta tag, no inline scripts)
│   ├── app.js                      # All app logic: shuffle, time-matching, mode switching, DOM updates
│   ├── temporal-polyfill.js        # @js-temporal/polyfill v0.5.1 UMD bundle — always loaded before app.js; exposes Temporal globally only when not natively available (e.g. iOS PWA)
│   ├── theme.js                    # Dark/light mode detection (loaded before CSS)
│   ├── sw-register.js              # Service worker registration
│   ├── style.css                   # Styles (CSS custom properties, dark mode, responsive layout, nav bar)
│   ├── fonts.css                   # @font-face declarations for self-hosted fonts
│   ├── fonts/                      # Self-hosted font files (woff2)
│   ├── sw.js                       # Service worker — caches all assets for offline/PWA use
│   ├── manifest.json               # Web App Manifest — enables PWA install on mobile/desktop
│   ├── icons/                      # App icons: icon-192.png, icon-512.png, icon-192-maskable.png, icon-512-maskable.png, apple-touch-icon.png
│   ├── litclock.json               # Dataset: 1,400+ time-tagged literary quotes (Clock mode)
│   ├── litdays.json                # Dataset: literary quotes for each day of the week (Day of Week mode)
│   ├── litmonths.json              # Dataset: literary quotes for each month (Month mode)
│   ├── litdates.json               # Dataset: literary quotes for specific calendar dates (Date mode)
│   └── favicon.ico
├── scripts/
│   ├── audit_litclock.py           # Audits litclock.json for day/month/date references and merges quotes into litdays/litmonths/litdates
│   ├── add_biblio_links.py         # Populates isbn and biblio_link fields; supports --file to target any dataset
│   └── add_public_domain.py        # Populates public_domain field via Open Library API
├── package.json                    # Dev dependency for local server (npx serve)
├── README.md
└── ROADMAP.md                      # Coverage gaps and research strategy
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (any modern version) — needed only to run the local development server

### Installation

```bash
git clone https://github.com/bythegram/Literary-Clock.git
cd Literary-Clock
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:3000/`. The app is served from the `docs/` directory.

---

## How It Works

### Clock mode
1. On load, `shuffleArray()` randomises the quote dataset so multiple quotes for the same minute appear in a random order across visits.
2. `getTime()` reads the current hour and zero-padded minute via `Temporal.Now.zonedDateTimeISO()`, filters `litclock.json` for matching `timecode` entries, and returns the first result (random due to the shuffle).
3. A `setTimeout` fires at the next wall-clock minute boundary (computed via `Temporal.ZonedDateTime.until().total('milliseconds')`), then reschedules itself. This ensures the quote always updates within a millisecond of the minute changing.

### Calendar modes
- **Day of Week** (`litdays.json`) — matches entries by `day` field against the locale day name from `Temporal.Now.zonedDateTimeISO()`; `setTimeout` re-anchors to the next midnight.
- **Date** (`litdates.json`) — matches entries by `date` field (`"M/D"` format) against `Temporal.Now.plainDateISO().month + '/' + day` (1-based, no `+1` hack); `setTimeout` re-anchors to the next midnight.
- **Month** (`litmonths.json`) — matches entries by `month` field against the locale month name from `Temporal.Now.zonedDateTimeISO()`; `setTimeout` re-anchors to the first instant of the next month.

Each mode has its own independent `setTimeout` chain; a midnight tick for the Day/Date scheduler never disturbs the Clock display.

### Page Visibility API
A `visibilitychange` listener triggers whenever the tab becomes visible. It immediately re-renders the current mode and reschedules all three timer chains anchored to *now*, preventing stale content after browser timer throttling, device sleep, or leaving the tab open overnight.

---

## Adding Quotes

### Clock quotes (`docs/litclock.json`)

Each entry must conform to the following schema:

```json
{
  "timecode": "13:01",
  "label": "one minute after one",
  "quote": "The time on the clock was one minute after one",
  "book": "Book Title",
  "author": "Author Name"
}
```

| Field | Required | Description |
|---|---|---|
| `timecode` | **Yes** | 24-hour time string in `H:MM` format (e.g. `"13:01"`) |
| `label` | **Yes** | Exact substring of the quote that represents the time (lowercase) |
| `quote` | **Yes** | Full sentence or passage containing the time reference |
| `book` | **Yes** | Title of the source work |
| `author` | **Yes** | Author of the source work |
| `isbn` | No | ISBN-13 (preferred) or ISBN-10, populated by `add_biblio_links.py` |
| `biblio_link` | No | Biblio.com search URL, populated by `add_biblio_links.py` |
| `public_domain` | No | `true` if the work is in the public domain, `false` otherwise; populated by `add_public_domain.py` |

The `isbn`, `biblio_link`, and `public_domain` fields are optional in new entries — they are populated automatically by the helper scripts described below.

### Calendar quotes

The three calendar datasets share the same `label`, `quote`, `book`, `author`, `isbn`, and `biblio_link` fields as `litclock.json`, plus a mode-specific key field:

| File | Key field | Values |
|---|---|---|
| `docs/litdays.json` | `day` | `"Sunday"` … `"Saturday"` |
| `docs/litdates.json` | `date` | `"M/D"` format, e.g. `"3/25"` |
| `docs/litmonths.json` | `month` | `"January"` … `"December"` |

Example `litdays.json` entry:
```json
{
  "day": "Wednesday",
  "label": "wednesday",
  "quote": "At three on the Wednesday afternoon that bit of the painting was completed.",
  "book": "The Moonstone",
  "author": "Wilkie Collins",
  "biblio_link": "https://www.biblio.com/search.php?title=The+Moonstone&author=Wilkie+Collins"
}
```

### Helper Scripts

```bash
# Audit litclock.json and copy matching quotes into litdays.json,
# litmonths.json, and litdates.json (litclock.json is never modified)
python3 scripts/audit_litclock.py

# Preview what would be added without writing any files
python3 scripts/audit_litclock.py --dry-run

# Populate isbn and biblio_link for entries in litclock.json (default)
python3 scripts/add_biblio_links.py

# Populate isbn and biblio_link for a calendar dataset file
python3 scripts/add_biblio_links.py --file docs/litdays.json
python3 scripts/add_biblio_links.py --file docs/litmonths.json
python3 scripts/add_biblio_links.py --file docs/litdates.json

# Run offline (skip Open Library API; write title/author search URLs only)
python3 scripts/add_biblio_links.py --offline
python3 scripts/add_biblio_links.py --offline --file docs/litdays.json

# Populate public_domain for entries that are missing it (requires internet)
python3 scripts/add_public_domain.py

# Run offline (sets public_domain=false where unknown, skips API calls)
python3 scripts/add_public_domain.py --offline
```

---

## Credits

Inspiration and quotes sourced from:
- [Literary Clock Made From E-reader](https://www.instructables.com/id/Literary-Clock-Made-From-E-reader/) (Instructables)
- [The Guardian Literary Clock](https://www.theguardian.com/books/table/2011/apr/21/literary-clock)
