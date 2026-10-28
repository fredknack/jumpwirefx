# Recommendations for jumpwirefx.com

Written 2026-10-28 alongside the Phase 1 rebuild. Items marked **done** shipped in Phase 1.

## 1. SEO and AI readability

### Done in Phase 1
- **Server-rendered HTML for every page.** The old site was an Angular bundle; crawlers saw an empty `<app-root>`. Every page is now static HTML with real headings and text.
- **One URL per project** (`/work/<slug>`) with a unique title, meta description, canonical link, Open Graph and Twitter card using the project poster.
- **Structured data.** `Person` JSON-LD on the home page; `CreativeWork` with a nested `VideoObject` on each project page, so Google can show video results.
- **`sitemap.xml` and `robots.txt`** generated from the content, so new projects are indexed without manual work.
- **`/llms.txt`**, a plain-text summary of the business and every project, for AI crawlers and assistants.
- **Buyer-language headings.** "Interactive kiosks for trade shows and lobbies", "Portland, Oregon", "custom hardware", "Arduino", "touchscreen" all appear in `h1`/`h2` text, not just body copy.
- **Descriptive alt text** on every thumbnail.
- **Old routes redirect** (`/home`, `/player`, `/mobilevideo/:id` → `/`) so existing links and search results don't 404.
- **GA4 only.** The dead Universal Analytics tag and the GTM container were dropped. Re-add GTM only if you actually use it.

### Still to do (in priority order)
1. **Point the domain at Vercel and submit the sitemap in Google Search Console.** Until the domain moves, Google keeps indexing the old site. After cutover, request re-indexing of the home page and each project URL.
2. **Add a Google Business Profile** for "Fred Knack · Interactive kiosks" in Portland. Local-intent searches ("trade show kiosk Portland") weight this heavily.
3. **Get a few real backlinks.** Ask past clients or agencies (Netflix launch agency, NYIT, Kaiser event team) for a credit link. One link from an event-industry blog or a Unity showcase is worth more than any on-page tweak.
4. **Write one page per service** ("Trade show kiosks", "Lobby installations", "Interactive video walls") with 300-500 words each. Project pages prove the work; service pages catch the searches.
5. **Add dates and client names where you can.** `CreativeWork.dateCreated` and `sourceOrganization` are already emitted when a project has `year`/`client` set. Fill them in.
6. **Testimonials with names and titles.** Add a `testimonial` field to projects later; schema.org `Review` markup can follow.
7. **Open Graph image per project is the thumbnail.** If you want richer social cards, add a 1200x630 version with the title overlaid (Next.js can generate these with `opengraph-image.tsx`).

## 2. Clearer copy and a stronger pitch

### Done in Phase 1
- **Positioning changed from "Unity programmer" to "interactive kiosks for trade shows and lobbies."** Unity still appears as a tool, in the "Built end to end" section and on every project's skills row, but it is no longer the headline.
- **Every project cut to under 120 words** (tagline, short summary, "what I built" bullets) with a few extra sentences in the body. The old pages ran 150-250 words in a 60px column.
- **Home page explains the business in under 80 words** before the work grid.
- **"I was the only Unity programmer" became "Built end to end."** Same fact, framed as a benefit to the buyer: one person, no hand-offs.

### Recommendations
1. **Lead with the kiosks.** The grid already puts the four kiosk/installation projects first. Consider moving the FPS game, AR experiment and iPad portfolio under a separate "Experiments" heading so a buyer sees only commercial work above the fold.
2. **Add numbers.** "16 displays, 8 PCs, 150+ milestones", "4 screens in sync", "9-screen wall". Buyers remember scale. The timeline project does this well; the others could.
3. **Add a short process strip:** Brief → Concept → Build → Install → Support. Four or five words each. It answers "what is it like to work with you" without a paragraph.
4. **One line on lead time and budget range** on the contact page ("Most kiosks take 6-10 weeks from brief to show floor") filters tire-kickers and reassures serious buyers.
5. **A photo of you with a kiosk** on the home page. Portfolio sites for a one-person business convert better with a face.
6. **Contact form later.** A `mailto:` link works today. When the CMS lands, a form that posts to a server action and emails you (Resend or similar) removes friction for people on locked-down work laptops.
7. **Retire the reel from the hero if the Blob bandwidth cost shows up.** It only loads on click, so it is cheap, but a 30-second cut would be stronger than four minutes.

## 3. Performance

### Done in Phase 1
- **No video loads until a visitor clicks.** The old site loaded 16 `<video preload="auto">` elements (about 680 MB) on page open. The new site loads only poster images (1.1 MB total for all eight).
- **Videos re-encoded** from 680 MB to about 300 MB at the same visual quality (H.264, CRF 23, max 1080p, faststart) and hosted on Vercel Blob with byte-range support, so playback starts immediately.
- **Static SVG art only.** The animated SVGs (hundreds of elements animating continuously) were replaced with stills.
- **Responsive images** through `next/image` with per-breakpoint sizes.

### Recommendations
- Watch Vercel Blob bandwidth in the dashboard for the first month. If the reel gets played a lot, cut it shorter.
- Run Lighthouse after the domain cutover and check Core Web Vitals in Search Console.

## 4. Phase 2: CMS (next plan)

Neon Postgres via Drizzle, admin pages under `/admin` guarded by a single-password login with a signed cookie, image and video uploads straight to Vercel Blob, and on-save revalidation. The content module (`lib/content.ts`) is the only file that changes for pages.
