# jumpwirefx.com rebuild — design

Date: 2026-10-28. Author: Claude, from a brainstorming conversation with Fred Knack.

## Intent

Replace the 2023 Angular/Firebase portfolio at jumpwirefx.com with a fast, readable,
SEO-friendly Next.js site that positions Fred's business as a builder of interactive
kiosks for trade shows and corporate lobbies, and that Fred can update himself through
a small admin CMS.

The old site's problems, confirmed by inspection on 2026-10-28:
- 16 `<video preload="auto">` elements load on page open (each project has a desktop
  and a mobile player), roughly 680 MB of MP4 requested up front.
- Case-study text is squeezed into a ~60px-wide column with 10-11px type.
- Hundreds of animated SVG decorations run continuously.
- Headline positioning is "Unity Programmer", which attracts developers, not buyers.

## Positioning (decided)

Lead with the outcome, prove it with the craft.

- Headline direction: "Interactive kiosks for trade shows and lobbies."
- Subhead direction: "Lights, buttons, sensors and screens, built to make people stop
  and play."
- A short "Built end to end by one person" block lists the craft: custom hardware,
  Arduino, Unity for the on-screen content, motion graphics, installation. Unity stays
  visible for technical buyers but is never the headline.
- Audience: marketing and event people at brands, experiential agencies, and fabrication
  shops that need the technical side.

## Goals

1. Page loads nothing heavier than poster images until a visitor asks for a video.
2. Every project has its own URL with real HTML content (titles, body, image alt text),
   so search engines and AI crawlers can read it.
3. Type is comfortably readable on phone and desktop.
4. Fred can add or edit a project, upload its video and images, and publish, without
   touching code.
5. Keep the visual identity people recognize: the orange-to-red gradient, the hex and
   square motifs, the dark page frame. Keep them as stills.

## Non-goals

- Pixel-for-pixel recreation of the old layout.
- A blog, multi-user accounts, roles, or comments.
- Supporting the old `/player` and `/mobilevideo/:id` routes beyond a redirect to home.

## Anti-goals (would make this a failure)

- A site that still feels slow on a phone over hotel Wi-Fi.
- Copy that reads like a developer résumé.
- A CMS so elaborate it is harder to use than editing a file.

## Site map

| Route | Purpose |
|---|---|
| `/` | Hero, what I build, project grid (thumbnails), how it's built, short about, contact CTA |
| `/work/[slug]` | One project: hero image or video thumbnail, tagline, body, skills, gallery |
| `/contact` | Email link and a short form (mailto fallback; no backend required in phase 1) |
| `/admin` | CMS (phase 2): list projects, edit, upload media, publish |
| `/admin/login` | Single-admin password login |
| `/sitemap.xml`, `/robots.txt` | Generated |

Old routes `/home`, `/player`, `/mobilevideo/:id` permanently redirect to `/`.

## Content model

Shared between the seed file (phase 1) and the database (phase 2).

```
Project
  id, slug, title, tagline, client?, year?, kind ("kiosk" | "installation" | "game" | "experiment")
  summary (one paragraph, used on cards and meta description)
  body (markdown)
  skills: string[]            // "Custom PCB", "Arduino", "Unity", ...
  thumbnail: Media            // 16:9 still for the grid and the video poster
  video?: Media               // MP4 in Vercel Blob
  gallery: Media[]
  featured: boolean, sortOrder: number, published: boolean
  createdAt, updatedAt

Media
  url, width?, height?, alt

SiteSettings (single row)
  headline, subhead, aboutShort, email, location, socialLinks
```

## Video handling (decided)

- Thumbnails only in the page. Clicking opens an accessible modal (focus trap, Esc
  closes, scroll locked) containing a single `<video controls preload="metadata">`
  created on open and destroyed on close. Nothing video-related downloads before that.
- Each video also has its own `?video=1` query state on the project page so the modal
  is linkable, and the project page itself shows the poster with a play button.
- All source MP4s are re-encoded once with ffmpeg: H.264 High, max 1080p, CRF 23,
  `-movflags +faststart`, AAC 128k. OGV and WebM sources are dropped. Posters are
  extracted from a representative frame and saved as JPEG plus a WebP.
- Video files live in Vercel Blob. Images live in `public/` (phase 1) and Blob (phase 2
  uploads). Images are served through `next/image`.

## Visual direction (decided)

- Keep: the orange/red gradient hero, the hex-dot and square motifs, black page
  background, white content cards.
- Convert every animated SVG to a static SVG or PNG background. Allow at most one
  subtle, CSS-only effect (gradient on the hero) that respects `prefers-reduced-motion`.
- Typography: one variable sans (Inter via `next/font`), 18px base body on desktop,
  measure 60-70 characters, headings with tight tracking. No text column narrower
  than 20rem.
- Layout: max content width 72rem, 16px side gutters on phone, grid of 16:9 cards.

## Copy direction (decided; final copy is the builder's, Fred reviews)

- Cut each case study to: one-line tagline, a 2-3 sentence "what it was", a 2-4
  bullet "what I built", and a skills row. Target under 120 words per project.
- The home page explains the business in under 80 words before the project grid.
- Replace "I was the only Unity programmer" phrasing with "Built end to end" style
  claims that speak to a buyer.

## SEO and AI readability (decided)

- Server-rendered HTML for all public pages (static generation with revalidation).
- Unique `<title>` and meta description per project, Open Graph and Twitter cards with
  the poster image.
- JSON-LD: `Organization` / `Person` on home, `CreativeWork` per project, `VideoObject`
  where a video exists.
- `sitemap.xml`, `robots.txt`, canonical URLs, descriptive alt text, semantic headings
  (one `h1` per page).
- Keep Google Analytics 4 (G-M2WVRYNXYJ) via `@next/third-parties`. Drop the dead UA
  tag and GTM container unless Fred uses GTM.
- Plain-language copy with the business's search terms in headings: "interactive
  kiosk", "trade show", "corporate lobby", "Portland, Oregon".
- A `/llms.txt` summarizing the business and linking each project page.

## Phases

### Phase 1 — static site on Vercel

- Next.js 16 App Router, TypeScript, Tailwind v4, pnpm.
- Content comes from `content/projects.ts` and `content/site.ts` (same shape as the
  DB rows). Data access goes through one module, `lib/content.ts`, so phase 2 swaps
  the source without touching pages.
- Media pipeline script `scripts/media.ts`: re-encode videos, extract posters, upload
  videos to Blob, write the resulting URLs into `content/media.json`.
- Deploy to Vercel as a preview. Production domain switch is Fred's call.

### Phase 2 — CMS

- Neon Postgres (Vercel Marketplace) with Drizzle ORM and migrations.
- `lib/content.ts` reads from the DB when `DATABASE_URL` is set, else the seed file.
  A one-off `scripts/seed.ts` loads the seed file into the DB.
- Admin UI at `/admin`: project list, create/edit form with markdown body, skill tags,
  drag-to-reorder, publish toggle, media upload (Vercel Blob client upload with
  server-signed tokens), delete with confirm. Saving revalidates the affected pages.
- Auth: single admin. `ADMIN_PASSWORD_HASH` (bcrypt) in env. Login form posts to a
  server action that verifies the hash and sets an HttpOnly, Secure, SameSite=Lax
  cookie containing a signed JWT (`jose`, `AUTH_SECRET`), 7-day expiry. Proxy/middleware
  guards `/admin/*`. Failed logins are rate-limited in memory per instance (good
  enough for one admin). Logout clears the cookie.

## Constraints

- Repo: https://github.com/fredknack/jumpwirefx.git (empty at start).
- Old site export stays in `_reference/` which is gitignored.
- No credentials in the repo. `.env.example` documents every variable.
- Hobby-tier friendly: static generation, no always-on compute.

## Left to the builder

- Exact component structure, Tailwind tokens, and card hover treatment.
- Which frame to use as each video's poster.
- Final wording of each project's shortened copy (Fred reviews after).
- Admin form library choice (plain server actions preferred over a form framework).
