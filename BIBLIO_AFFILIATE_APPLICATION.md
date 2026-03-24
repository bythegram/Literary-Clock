# Biblio.com Affiliate Program — Application Document

This document outlines the information required to apply for the
[Biblio.com Affiliate Program](https://www.biblio.com/affiliate_program/) and
provides the relevant details drawn from this project.

Biblio's affiliate program is managed through **ShareASale** (and also available
via FlexOffers and Awin). Affiliates earn a **5% commission** on every sale
generated through a referral link, with a **45-day tracking cookie** window.

---

## Application Requirements

The following sections mirror the fields requested on the affiliate application
form. Each field is filled in with information specific to the Literary Clock
project.

---

### 1. Full Name

> *The legal name of the applicant (individual or organisation contact).*

**bythegram** *(repository owner / project maintainer)*

---

### 2. Email Address

> *A working email address for account setup, approval notifications, and
> affiliate reporting.*

Use the email address associated with the GitHub account **bythegram**. This
can be found in the GitHub profile or supplied directly during form submission.

---

### 3. Website URL

> *The primary URL of the site that will carry Biblio affiliate links.*

**https://bythegram.github.io/Literary-Clock/**

The site is a live, publicly accessible Progressive Web App (PWA) hosted on
GitHub Pages.

---

### 4. Business or Organisation Name

> *Trading name or organisation, if different from the individual's name.*

**Literary Clock** *(open-source personal project)*

---

### 5. Description of Your Site / Audience

> *Describe your content, target audience, and why your platform is a good fit
> for Biblio.*

**Literary Clock** is a static web application that displays the current time
as a matching quotation from world literature. Every minute of the day is mapped
to one or more literary passages that explicitly mention that time; the app
selects a random passage for the current minute and updates automatically.

The dataset contains **over 1,400 time-tagged quotes** drawn from classic and
contemporary fiction, detective novels, war narratives, diaries, and science
fiction. Many entries already carry `biblio_link` fields linking directly to
Biblio.com search results so visitors can purchase the source book.

**Target audience:**
- Book lovers and literary enthusiasts who leave the app open on a screen or use
  it as a desktop widget
- Readers discovering new titles through the quotes displayed
- Users interested in rare, used, and antiquarian books — precisely the inventory
  Biblio specialises in

This makes Literary Clock a natural fit for Biblio's affiliate program: every
quote is an implicit book recommendation, and the existing Biblio.com links
already direct curious readers to the marketplace.

---

### 6. Primary Promotion Methods

> *Explain how you plan to promote Biblio products.*

1. **Contextual deep links on every quote card** — each displayed quote already
   shows the book title and author; the existing `biblio_link` field (populated by
   `scripts/add_biblio_links.py`) will be updated to carry the affiliate tracking
   parameter, turning every quote into a live purchase opportunity.

2. **"Find this book on Biblio" call-to-action** — a dedicated link or button
   beneath each quote will invite visitors to browse and buy the source work on
   Biblio.com.

3. **README / GitHub repository** — the project README
   (`https://github.com/bythegram/Literary-Clock`) credits Biblio as the book
   marketplace partner, exposing the link to developers and contributors who fork
   or star the repository.

4. **PWA / offline-capable install** — because the app is installable as a
   Progressive Web App, engaged users may open it many times per day, increasing
   affiliate link impressions organically.

---

### 7. Social Media Links

> *Any social media profiles associated with the site.*

- **GitHub:** https://github.com/bythegram/Literary-Clock
- Additional social profiles can be supplied by the maintainer at the time of
  application.

---

### 8. Country of Residence

> *The country in which the applicant is based, for tax and payment purposes.*

To be confirmed by the project maintainer at the time of application.

---

### 9. Payment Information

> *Bank account, PayPal, or other payment details. Typically collected by
> ShareASale after application approval.*

Payment details are supplied directly to ShareASale upon account approval and
are not stored in this document.

---

## Implementation Plan (Post-Approval)

Once the affiliate account is approved and a ShareASale affiliate ID is issued,
the following technical changes are needed in this repository:

1. **Update `scripts/add_biblio_links.py`** — append the ShareASale tracking
   parameter (e.g. `?afftrack=YOUR_ID&sscid=...`) or use the affiliate deep-link
   format provided by ShareASale when constructing `biblio_link` values.

2. **Re-run the script** against `docs/litclock.json` to refresh all existing
   `biblio_link` entries with affiliate URLs.

3. **Publish the FTC disclosure notice** — fill in every `[TODO: …]` placeholder
   in [`AFFILIATE_DISCLOSURE.md`](AFFILIATE_DISCLOSURE.md) and follow the
   pre-activation checklist to add the notice to `docs/index.html` and `README.md`.

4. **Test** a sample of generated links to confirm they resolve correctly and
   that the affiliate ID is recognised in the ShareASale dashboard.

---

## Programme Summary

| Detail | Value |
|---|---|
| Affiliate Network | ShareASale (also FlexOffers, Awin) |
| Commission Rate | 5% per sale |
| Cookie Duration | 45 days |
| Programme Page | https://www.biblio.com/affiliate_program/ |
| Relevant Site | https://bythegram.github.io/Literary-Clock/ |
| Integration Point | `biblio_link` field in `docs/litclock.json` |
