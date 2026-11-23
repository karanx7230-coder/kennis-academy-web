# Kennis Academy Ropar — Website

Mobile-first, trust-focused landing page for **Kennis Academy (Kennis Academy Ropar)**.

> Learn, Grow, Succeed — Classes 1st–12th (CBSE · PSEB · ICSE) + Govt. Exam Coaching, Ropar, Punjab.

**Design:** refined editorial. Deep teal `#193C42`, warm ivory `#F4F1E8`, muted
gold `#B87939`, sage `#DCE5DE`, charcoal `#293238`. Fraunces serif headlines +
Inter body, generous whitespace, four distinct program entries, a prominent
director feature, an honest "How we teach" approach section and a real
**admission-enquiry form** that composes a WhatsApp message. Gentle scroll-zoom
on photos, drawing-underline hovers, scroll progress bar. **No prices shown.**
Long scroll, mobile-first. Respects `prefers-reduced-motion`.

## Run it

No build step. Either:

- Open `index.html` directly in a browser, **or**
- Serve locally: `npx serve .` (Node) and open the printed URL.

## Structure

```
index.html          → full page (hero, programs, approach, director, enquiry form, footer)
css/style.css       → editorial design system + all section styles
js/main.js          → menu, reveals, scroll-zoom, progress, enquiry form → WhatsApp
tools/dev-server.cjs→ zero-dependency local preview server
tools/fetch-placeholders.mjs → re-download placeholder photos
assets/images/      → local WebP photos (swap with real ones anytime)
```

## ✅ Before going live

1. **Photos** — local placeholder WebP images in `assets/images/`. Swap with real
   academy photos (hero, programs, director) anytime; re-fetch via the tools script.
2. **Director photo** — placeholder portrait → real Kuljeet Singh photo.
3. **Logo / favicon** — `assets/favicon.svg` monogram → real logo.
4. **Enquiry form** — currently opens WhatsApp to **88729-81296** with the details
   pre-filled. Change the number in `js/main.js` if needed (or wire a form backend).
5. **Google Map link** — points at Ramleela Ground → replace with the exact pin.
6. **Instagram** — linked; add Facebook/X if you have them.

> No prices are displayed anywhere by design.

## Deploy

Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages — just drag & drop this folder.
