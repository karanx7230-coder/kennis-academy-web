# Kennis Academy Ropar — Website

Mobile-first, trust-focused landing page for **Kennis Academy (Kennis Academy Ropar)**.

> Learn, Grow, Succeed — Classes 1st–12th (CBSE · PSEB · ICSE) + Govt. Exam Coaching, Ropar, Punjab.

## Run it

No build step. Either:

- Open `index.html` directly in a browser, **or**
- Serve locally: `npx serve .` (Node) and open the printed URL.

## Structure

```
index.html          → full page (all sections, SEO meta, JSON-LD)
css/style.css       → mobile-first design system + all section styles
js/main.js          → menu, scroll effects, reveal animations, back-to-top
assets/favicon.svg  → placeholder monogram (replace with real logo)
assets/images/      → put REAL images here (see README inside)
```

## ✅ Before going live — replace placeholders

Everything marked with a `🔄 REPLACE` or `✏️ UPDATE` comment in `index.html`:

1. **Images** — all Unsplash/API placeholders → real photos
   (⭐ hero needs `assets/images/building.png` — building **without background**).
   See `assets/images/README.md`.
2. **Logo** — header/footer monogram → `assets/images/logo.png`.
3. **Director photo** — placeholder portrait → real Kuljeet Singh photo.
4. **Reviews** — the 3 testimonials are **SAMPLES** → replace with real parent/student reviews.
5. **Batch timings** — contact card + FAQ marked `✏️ UPDATE`.
6. **Monthly fees** — add exact rates when ready (currently "affordable, call for details").
7. **Facebook / Twitter links** — currently `#` → paste real page URLs.
8. **Google Map** — embed points at Ramleela Ground → replace with the academy's exact pin.
9. **Admission session badge** in hero — update the session year as needed.

## Deploy

Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages — just drag & drop this folder.
