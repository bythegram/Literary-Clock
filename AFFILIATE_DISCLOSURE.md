# Affiliate Disclosure Notice — Template

> ⚠️ **This is a template. It is NOT the live disclosure.**
> Every value enclosed in `[TODO: …]` is a placeholder that **must** be replaced
> with accurate, verified information **before** affiliate links are activated on
> the site. Publishing this document verbatim — with placeholders intact — would
> not satisfy FTC requirements.

This file is the canonical reference for all FTC-compliant disclosure text
associated with Literary Clock's participation in the
[Biblio.com affiliate program](https://www.biblio.com/affiliate_program/).
Once the program is approved, copy the appropriate sections below into
`docs/index.html` and `README.md`, replacing every `[TODO: …]` with real values.

See also: [`BIBLIO_AFFILIATE_APPLICATION.md`](BIBLIO_AFFILIATE_APPLICATION.md)

---

## Placeholder Checklist

Complete **every** item before activating affiliate links:

- [ ] **`[TODO: SITE_OWNER_LEGAL_NAME]`** — Replace with the site owner's real
  legal name or trading name (e.g. the maintainer's full name, or the name of
  any business entity that operates the site).
- [ ] **`[TODO: AFFILIATE_NETWORK]`** — Confirm which affiliate network will
  be used. Expected: **ShareASale** (see `BIBLIO_AFFILIATE_APPLICATION.md`).
  Update if a different network (FlexOffers, Awin, etc.) is actually used.
- [ ] **`[TODO: CONTACT_EMAIL]`** — Replace with a working email address
  visitors can use to ask questions about the disclosure.
- [ ] **`[TODO: EFFECTIVE_DATE]`** — Replace with the date the affiliate
  program is approved and affiliate tracking links go live (e.g.
  `1 January 2025`).
- [ ] **Add the Short Disclosure HTML** to `docs/index.html` — see the
  template block at the bottom of this file.
- [ ] **Add the Full Disclosure section** to `README.md` — copy the markdown
  block below into `README.md` under a new `## Affiliate Disclosure` heading
  (place it after the existing `## Credits` section).
- [ ] **Re-run `python3 scripts/add_biblio_links.py`** to ensure every
  `biblio_link` entry in `docs/litclock.json` carries the affiliate tracking
  parameter provided by the affiliate network.
- [ ] **Add the `.affiliate-disclosure` CSS rule** to `docs/style.css` — see
  the CSS template below.
- [ ] **Verify the `#affiliate-disclosure` anchor** — GitHub renders Markdown
  headings as lowercase, hyphen-separated IDs. The `## Affiliate Disclosure`
  heading in `README.md` renders as `#affiliate-disclosure`. If the heading
  text changes, update the `href` in the `<p class="affiliate-disclosure">`
  template in `docs/index.html` accordingly.
- [ ] **Legal review** — Have the final disclosure text reviewed by a qualified
  legal professional, especially if the site serves visitors in jurisdictions
  with additional requirements (EU/GDPR, UK CAP Code, etc.).

---

## Short Disclosure

*This is the notice shown to site visitors, placed in the page footer.*
*It must appear on every page that contains affiliate links.*

### Rendered text (what visitors will read)

> Some book links on this site are affiliate links to
> [Biblio.com](https://www.biblio.com/). **[TODO: SITE_OWNER_LEGAL_NAME]** may
> earn a small commission if you make a purchase through these links, at no
> extra cost to you.
> [Learn more](#affiliate-disclosure).

### HTML template (paste into `docs/index.html`)

Copy the `<p>` element below and place it inside `<footer class="credit">` in
`docs/index.html`. Replace every `[TODO: …]` value before uncommenting.

```html
<!-- AFFILIATE DISCLOSURE — uncomment when affiliate links are live.
     Replace all [TODO: …] values with confirmed information first.
<p class="affiliate-disclosure">
  Some book links on this site are
  <a href="https://www.biblio.com/" rel="noopener noreferrer">Biblio.com</a>
  affiliate links.
  <!-- TODO: Replace "[TODO: SITE_OWNER_LEGAL_NAME]" with the site owner's
       real legal name or trading name (e.g. "Jane Smith" or "Literary Clock").
       Remove this comment. -->
  [TODO: SITE_OWNER_LEGAL_NAME] may earn a small commission if you purchase
  through them, at no extra cost to you.
  <a href="https://github.com/bythegram/Literary-Clock#affiliate-disclosure"
     rel="noopener noreferrer">Learn more</a>.
</p>
-->
```

### CSS template (paste into `docs/style.css`)

Add this rule to `docs/style.css` in the `/* ── Credit Footer ── */` section
when the disclosure element is activated:

```css
/* ── Affiliate Disclosure (activate alongside affiliate links) ────────── */
.affiliate-disclosure {
  font-size: 0.7rem;
  color: var(--color-text);
  opacity: 0.65;
  margin: 0;
}
```

---

## Full Disclosure

*This longer version is used in `README.md` and can serve as a standalone*
*reference page.*

### Markdown template (paste into `README.md` after `## Credits`)

Copy this block verbatim into `README.md`, replacing every `[TODO: …]` value.

---

```markdown
## Affiliate Disclosure

<!-- TODO: Replace the entire block below with finalised disclosure text.
     Remove all [TODO: …] markers before merging. -->

> ⚠️ **Placeholder — not yet active.** This section will be updated when the
> affiliate program is approved and affiliate links go live. See
> [`AFFILIATE_DISCLOSURE.md`](AFFILIATE_DISCLOSURE.md) for the full template
> and activation checklist.

**[TODO: SITE_OWNER_LEGAL_NAME]** ("we", "us") operates Literary Clock at
<https://bythegram.github.io/Literary-Clock/>.

We participate in the **Biblio.com affiliate program**, managed through
**[TODO: AFFILIATE_NETWORK — expected: ShareASale; confirm upon approval]**.
When you click a "Find this book on Biblio" link and subsequently make a
purchase on [Biblio.com](https://www.biblio.com/), we may earn an affiliate
commission. **This commission comes at no additional cost to you.** The price
you pay is the same whether or not you use our affiliate link.

Our editorial choices — which quotes are included in the dataset and which
books are linked — are made independently and are not influenced by this
affiliate relationship.

Questions? Contact us at **[TODO: CONTACT_EMAIL]**.

*Effective: **[TODO: EFFECTIVE_DATE — insert the date affiliate links go live]**.*
```

---

## FTC Compliance Notes

The U.S. Federal Trade Commission (FTC) requires that any material connection
between a content publisher and a merchant be **clearly and conspicuously
disclosed** to readers. The table below shows how this template addresses each
key requirement.

| Requirement | How this template addresses it |
|---|---|
| **Proximity** | The Short Disclosure is placed in the page footer, present on every page load; the Full Disclosure is linked from the footer notice |
| **Plain language** | The text uses everyday words: "affiliate links", "earn a small commission", "at no extra cost to you" |
| **Prominence** | Disclosure is rendered as visible text — not hidden in a tooltip, collapsed accordion, or micro-print |
| **Consistency** | Footer notice appears on every page load (Literary Clock is a single-page app, so every session shows the notice) |
| **Accuracy** | The notice names the specific merchant (Biblio.com) and network, rather than using vague language |

> ⚠️ **[TODO: LEGAL REVIEW]** This template is provided as a practical starting
> point and is **not legal advice**. Before publishing, have the finalised text
> reviewed by a qualified legal professional — particularly if the site operator
> is based outside the United States or the site serves visitors in the European
> Union (where GDPR and the EU Unfair Commercial Practices Directive may impose
> additional requirements) or the United Kingdom (ICO guidelines, CAP Code).

**Reference:** [FTC Endorsement Guides — What People Are Asking](https://www.ftc.gov/tips-advice/business-center/guidance/ftcs-endorsement-guides-what-people-are-asking)

---

## Summary

| Item | Status |
|---|---|
| Template created | ✅ |
| `[TODO: SITE_OWNER_LEGAL_NAME]` | ⚠️ Placeholder — must be replaced |
| `[TODO: AFFILIATE_NETWORK]` | ⚠️ Placeholder — expected ShareASale; confirm on approval |
| `[TODO: CONTACT_EMAIL]` | ⚠️ Placeholder — must be replaced |
| `[TODO: EFFECTIVE_DATE]` | ⚠️ Placeholder — set to approval/go-live date |
| Short Disclosure added to `docs/index.html` | ⏳ Pending — see template above |
| Full Disclosure added to `README.md` | ⏳ Pending — see template above |
| CSS rule added to `docs/style.css` | ⏳ Pending — see template above |
| Legal review completed | ⏳ Pending |
