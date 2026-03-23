# LitClock

**[Live Demo](https://bythegram.github.io/Literary-Clock/)**

A literary clock that displays the current time through quotations from famous novels and literary works. Instead of showing a traditional clock face, it finds a passage from literature where the time mentioned matches the current real-world time — updated every minute.

---

## Features

- Displays the current time as a literary quote from a curated collection of over 1,400 passages
- Highlights the time-referencing phrase within each quote
- Shows the book title and author for every passage
- Responsive design — works on desktop, tablet, and mobile (portrait/landscape)
- Quotes are shuffled on load so repeated visits show different passages for the same time
- Apple mobile web app meta tags for a PWA-like experience on iOS

---

## Technologies Used

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES5 IIFE) |
| Styling | [Bootstrap 5](https://getbootstrap.com/) (CDN), CSS, Google Fonts |
| Data | JSON |
| Hosting | [GitHub Pages](https://pages.github.com/) |

---

## Project Structure

```
Literary-Clock/
├── docs/                           # Deployed app — served directly by GitHub Pages
│   ├── index.html                  # App shell HTML
│   ├── app.js                      # Clock logic: shuffle, time-matching, DOM updates
│   ├── style.css                   # Styles (responsive font sizing, portrait layout)
│   ├── litclock.json               # Dataset: 1,400+ time-tagged literary quotes
│   └── favicon.ico
├── scripts/
│   ├── add_biblio_links.py         # Populates isbn and biblio_link fields in litclock.json
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

1. On load, `shuffleArray()` randomises the quote dataset so multiple quotes for the same minute appear in a random order across visits.
2. `getTime()` reads the current hour and zero-padded minute, filters the dataset for matching `timecode` entries, and returns the first result (which is random due to the shuffle).
3. The matched quote's time-label string is wrapped in `<strong>` tags for visual emphasis.
4. A `setTimeout` fires at the next wall-clock minute boundary (computed as `(60 - seconds) * 1000 - milliseconds`), then a regular 60-second `setInterval` takes over. This ensures the quote always updates within a second of the minute changing, regardless of when the app was opened.

---

## Adding Quotes

The quote data lives in `docs/litclock.json`. Each entry must conform to the following schema:

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

### Helper Scripts

```bash
# Populate isbn and biblio_link for entries that are missing them
python3 scripts/add_biblio_links.py

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
