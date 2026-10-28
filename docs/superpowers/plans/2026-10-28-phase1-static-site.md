# jumpwirefx Phase 1: Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a fast, readable, SEO-ready Next.js portfolio for jumpwirefx.com with thumbnail-triggered video modals and static decorative art, deployed as a Vercel preview and pushed to GitHub.

**Architecture:** Next.js App Router with static generation. All content flows through one module, `lib/content.ts`, backed in this phase by typed seed files in `content/`. Videos are re-encoded once by a script and uploaded to Vercel Blob; pages only reference poster images until a visitor opens the modal.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, pnpm, Vitest + Testing Library, `react-markdown` + `remark-gfm`, `@vercel/blob`, `@next/third-parties`, ffmpeg (local tool only).

**Spec:** `docs/superpowers/specs/2026-10-28-jumpwirefx-site-design.md`

## Global Constraints

- Repo remote: `https://github.com/fredknack/jumpwirefx.git`, branch `main`.
- `_reference/` is gitignored and must never be committed.
- No credentials in the repo; every env var is listed in `.env.example`.
- No `<video>` element exists in the DOM until a visitor opens a modal; the only video attribute used is `preload="metadata"`.
- No animated SVG; CSS motion only under `@media (prefers-reduced-motion: no-preference)`.
- Body text 18px on desktop (16px on phone), measure 60-70ch, no text column narrower than 20rem, 16px side gutters on phone, content max width 72rem.
- Each project copy: tagline + 2-3 sentence summary + 2-4 "what I built" bullets + skills, under 120 words total. Home intro under 80 words.
- Headline: "Interactive kiosks for trade shows and lobbies." Subhead: "Lights, buttons, sensors and screens, built to make people stop and play."
- Video encode: H.264 High, max 1080p, CRF 23, `-movflags +faststart`, AAC 128k.
- Analytics: GA4 `G-M2WVRYNXYJ` only.
- Old routes `/home`, `/player`, `/mobilevideo/:id` → 308 to `/`.

## Review Focus

1. A project with no video (`video` undefined) must render its page and card with a plain image and no play button. Test in Task 6.
2. Opening a modal then pressing Esc must remove the `<video>` from the DOM and return focus to the thumbnail that opened it. Test in Task 5.
3. Visiting `/work/not-a-real-slug` must return a 404 page, not a crash. Test in Task 6.
4. A project with `published: false` must be absent from the grid, sitemap, and `generateStaticParams`. Test in Task 2 and Task 7.
5. The media script must be safe to re-run: skip encodes whose output exists and whose source is older, and never overwrite `content/media.json` with partial results if an upload fails. Test in Task 3.

---

### Task 1: Scaffold the app, tooling, and Vercel project

**Files:**
- Create: Next app at repo root (`app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/globals.css`)
- Create: `vitest.config.ts`, `vitest.setup.ts`, `.env.example`, `README.md`
- Modify: `.gitignore` (keep existing entries; create-next-app must not clobber `_reference/`)

**Interfaces:**
- Produces: `pnpm test` runs Vitest with jsdom and `@testing-library/jest-dom`; `pnpm dev`, `pnpm build`, `pnpm lint`.

- [ ] **Step 1: Scaffold** — run `pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-pnpm --yes` in the repo root. If it refuses a non-empty directory, scaffold into `_scaffold/`, move contents up, and merge `.gitignore` (ours wins; append theirs).
- [ ] **Step 2: Add test tooling** — `pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`. Write `vitest.config.ts` (react plugin, `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]`, alias `@` → repo root) and `vitest.setup.ts` importing `@testing-library/jest-dom/vitest`. Add `"test": "vitest run"` script.
- [ ] **Step 3: Smoke test** — write `lib/__tests__/smoke.test.ts` asserting `1 + 1 === 2`; run `pnpm test`; expected PASS. Run `pnpm build`; expected success.
- [ ] **Step 4: Env and docs** — write `.env.example` with `BLOB_READ_WRITE_TOKEN=` and `NEXT_PUBLIC_SITE_URL=https://jumpwirefx.com`, and a short `README.md` (what the site is, `pnpm dev`, `pnpm media`, where content lives).
- [ ] **Step 5: Vercel project** — run `vercel link --yes` (creates project `jumpwirefx` under the logged-in scope). Confirm `.vercel/` is ignored.
- [ ] **Step 6: Commit and push** — `git add -A && git commit -m "chore: scaffold Next.js app with tooling"`, then `git push -u origin main`. Verify with `git ls-files | grep -c _reference` → `0`.

### Task 2: Content model and seed content

**Files:**
- Create: `lib/types.ts`, `content/site.ts`, `content/projects.ts`, `content/media.json` (placeholder `{}`), `lib/content.ts`
- Test: `lib/__tests__/content.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // lib/types.ts
  export type ProjectKind = "kiosk" | "installation" | "game" | "experiment";
  export interface Media { url: string; width?: number; height?: number; alt: string }
  export interface Project {
    id: string; slug: string; title: string; tagline: string; client?: string; year?: number;
    kind: ProjectKind; summary: string; body: string; built: string[]; skills: string[];
    thumbnail: Media; video?: Media; gallery: Media[];
    featured: boolean; sortOrder: number; published: boolean;
  }
  export interface SiteSettings {
    headline: string; subhead: string; intro: string; aboutShort: string;
    email: string; location: string; socialLinks: { label: string; url: string }[];
  }
  // lib/content.ts
  export async function getProjects(opts?: { includeUnpublished?: boolean }): Promise<Project[]>; // sorted by sortOrder asc
  export async function getProject(slug: string): Promise<Project | null>;                       // published only
  export async function getSiteSettings(): Promise<SiteSettings>;
  ```
- `content/media.json` shape: `Record<slug, { video?: Media; thumbnail: Media }>`; `content/projects.ts` merges it over each project's `thumbnail`/`video` so Task 3 output flows in without editing copy.

- [ ] **Step 1: Write failing tests** in `lib/__tests__/content.test.ts`: `slugs are unique`, `getProjects returns only published, sorted by sortOrder`, `getProject returns null for unknown slug`, `every project copy is under 120 words` (count words in tagline + summary + built.join), `site intro is under 80 words`.
- [ ] **Step 2: Run** `pnpm test content`; expected FAIL (module not found).
- [ ] **Step 3: Implement types and `lib/content.ts`** as above, reading from `content/`.
- [ ] **Step 4: Write `content/site.ts`** with the headline and subhead from Global Constraints, an intro under 80 words that names trade shows, corporate lobbies, Portland Oregon, and the hardware (LED, buttons, sensors), `aboutShort`, `email: "fred@jumpwirefx.com"` (placeholder; Fred confirms), `location: "Portland, Oregon"`, socialLinks empty.
- [ ] **Step 5: Write `content/projects.ts`** with 8 projects, slugs: `interactive-corporate-timeline`, `netflix-cowboy-bebop-vending-machine`, `nyit-interactive-video-wall`, `kaiser-permanente-health-quiz-kiosk`, `interactive-ipad-portfolio`, `3d-first-person-shooter`, `meta2-augmented-reality-breakout`, `unity-samples-reel`. Kinds: first four `kiosk`/`installation`, iPad `kiosk`, FPS `game`, Meta2 `experiment`, reel `experiment`. Kiosk projects get `featured: true` and the lowest sortOrders. Rewrite copy from `_reference` text per Global Constraints, buyer-facing. Thumbnails point at `/media/<slug>/thumb.jpg` (Task 3 creates them).
- [ ] **Step 6: Run** `pnpm test content`; expected PASS.
- [ ] **Step 7: Commit** — `git commit -m "feat: content model and seed projects"`.

### Task 3: Media pipeline (encode, posters, Blob upload)

**Files:**
- Create: `scripts/media.ts`, `scripts/lib/encode.ts`, `scripts/lib/upload.ts`
- Create (generated, committed): `public/media/<slug>/thumb.jpg`, `public/media/<slug>/thumb.webp`, `content/media.json`
- Create (generated, ignored): `_reference/encoded/*.mp4`
- Test: `scripts/__tests__/encode.test.ts`

**Interfaces:**
- Consumes: slugs from `content/projects.ts`.
- Produces: `content/media.json` as defined in Task 2; `pnpm media` script.
- `scripts/lib/encode.ts`: `export function ffmpegArgs(src: string, dst: string): string[]` (pure; returns the exact arg list implementing the Global Constraints encode); `export function needsEncode(src: string, dst: string): boolean` (false when `dst` exists and is newer than `src`); `export function posterArgs(src: string, dst: string, atSeconds: number): string[]`.
- `scripts/lib/upload.ts`: `export async function uploadVideo(slug: string, file: string): Promise<Media>` using `@vercel/blob` `put` with `access: "public"`, `addRandomSuffix: false`, pathname `videos/<slug>.mp4`.

- [ ] **Step 1: Source map** — in `scripts/media.ts` define `const SOURCES: Record<slug, { video?: string; posterAt: number; thumbFrom?: string }>` mapping the 8 slugs to files under `_reference/firebase-export/public/assets/videos/` and `.../images/` (reel → `Fred-Knack-Unity-Samples-V3.mp4`; timeline → `Inflection-Wall-Case-Study.mp4`; bebop → `CowBoy-Bebop-Case-Study.mp4`; NYIT → `NYIT-Case-Study.mp4`; Kaiser → `Kaiser-Kiosk-Case-Study.mp4`; iPad → `iPad-Portfolio-Case-Study.mp4`; FPS → `TTC-Case-Study.mp4`; Meta2 → `Meta2-Cylo-Case-Study.mp4`). Thumbnails come from the existing card JPGs where one exists (`Inflection-Wall.jpg`, `CowBoy-Bebop.jpg`, `NYIT-NY.jpg`, `KP-Kiosk.jpg`, `Portfolio.jpg`, `TTC.jpg`, `Breakout.jpg`), else from the poster frame.
- [ ] **Step 2: Failing tests** for `ffmpegArgs` (contains `-crf 23`, `-movflags +faststart`, `-c:a aac -b:a 128k`, a scale filter capping height at 1080 with even dimensions), `needsEncode` (true when dst missing, false when dst newer), `posterArgs` (contains `-ss <atSeconds>` and `-frames:v 1`).
- [ ] **Step 3: Run** `pnpm test encode`; expected FAIL.
- [ ] **Step 4: Implement** `scripts/lib/encode.ts` and `scripts/lib/upload.ts`; `pnpm add @vercel/blob tsx sharp`; add script `"media": "tsx scripts/media.ts"`.
- [ ] **Step 5: Run** `pnpm test encode`; expected PASS.
- [ ] **Step 6: Implement `scripts/media.ts`** — for each slug: encode if needed, extract poster, resize thumb to 1280x720 JPEG q80 + WebP via `sharp`, upload the encoded video, collect results in memory, and only after all succeed write `content/media.json` atomically (write temp, rename). `--no-upload` flag skips Blob and leaves `video` undefined.
- [ ] **Step 7: Provision Blob** — `vercel blob store add jumpwirefx-media` (link to project when prompted), then `vercel env pull .env.local`. If the CLI refuses, stop and report; continue with `pnpm media --no-upload`.
- [ ] **Step 8: Run** `pnpm media`; expected: 8 thumbs under `public/media/`, `content/media.json` with 8 entries, each `video.url` beginning with `https://` and returning 200 to `curl -I`.
- [ ] **Step 9: Commit** generated thumbs, `media.json`, and scripts — `git commit -m "feat: media pipeline and encoded project media"`.

### Task 4: Layout, design tokens, static decoration

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `components/site-header.tsx`, `components/site-footer.tsx`, `components/container.tsx`, `public/art/hex-dots.svg`, `public/art/squares.svg`, `public/art/logo.svg`
- Test: `components/__tests__/site-header.test.tsx`

**Interfaces:**
- Produces: `<Container>` (max-w-6xl, px-4), header with logo link to `/` and nav (`Work` → `/#work`, `Contact` → `/contact`), footer with name, location, email, year.

- [ ] **Step 1: Art stills** — copy `_reference/.../assets/images/Logo.svg` to `public/art/logo.svg`; copy `HexagonDots.svg` and `Hexagons.svg` to `public/art/` and strip any `<animate>`, `<animateTransform>`, `<script>`, and CSS `@keyframes` nodes (verify with `grep -c animate` → `0`).
- [ ] **Step 2: Tokens** — in `globals.css` define `--color-brand: #ff6a00`, `--color-brand-deep: #c8102e`, `--color-ink: #111`, `--color-paper: #fff`, `--gradient-hero: linear-gradient(135deg, #ffb300 0%, #ff6a00 55%, #c8102e 100%)`; base `html { font-size: 16px }` and `@media (min-width: 768px) { html { font-size: 18px } }`; `.prose-measure { max-width: 65ch }`.
- [ ] **Step 3: Font** — `next/font/google` Inter (variable) in `layout.tsx`; `<html lang="en" className={inter.variable}>`; body `bg-black text-white antialiased`.
- [ ] **Step 4: Failing test** — header renders a link with accessible name "Fred Knack" to `/` and links "Work" and "Contact".
- [ ] **Step 5: Implement** header, footer, container; metadata base in `layout.tsx` (`metadataBase` from `NEXT_PUBLIC_SITE_URL`, default title template `%s | Fred Knack`).
- [ ] **Step 6: Run** `pnpm test site-header`; expected PASS. `pnpm build`; expected success.
- [ ] **Step 7: Commit** — `git commit -m "feat: layout, tokens, header and footer"`.

### Task 5: Video thumbnail and modal

**Files:**
- Create: `components/video-modal.tsx`, `components/video-thumb.tsx`
- Test: `components/__tests__/video-thumb.test.tsx`

**Interfaces:**
- Produces: `<VideoThumb thumbnail={Media} video={Media} title={string} priority?={boolean} />` (client component; renders `next/image` poster + play button; on click mounts `<VideoModal>`); `<VideoModal video={Media} title={string} onClose={() => void} />` using native `<dialog>` with `showModal()`, `<video controls preload="metadata" autoPlay src={video.url}>`, close on Esc and backdrop click, `document.body` scroll lock while open.

- [ ] **Step 1: Failing tests** — `renders no video element before click`, `click opens dialog containing a video with preload=metadata and the src`, `Escape closes and removes the video`, `focus returns to the play button after close`, `renders plain image with no button when video is undefined`.
- [ ] **Step 2: Run** `pnpm test video-thumb`; expected FAIL. (jsdom lacks `showModal`; polyfill in `vitest.setup.ts`: `HTMLDialogElement.prototype.showModal ??= function(){ this.open = true }` and `close` likewise.)
- [ ] **Step 3: Implement** both components. Play button is a `<button aria-label={`Play video: ${title}`}>` overlaying the image.
- [ ] **Step 4: Run** `pnpm test video-thumb`; expected PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: video thumbnail with on-demand modal player"`.

### Task 6: Home page and project page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/work/[slug]/page.tsx`, `app/work/[slug]/not-found.tsx`, `components/hero.tsx`, `components/project-card.tsx`, `components/project-grid.tsx`, `components/how-its-built.tsx`, `components/markdown.tsx`, `components/json-ld.tsx`, `lib/seo.ts`
- Test: `components/__tests__/project-card.test.tsx`, `lib/__tests__/seo.test.ts`

**Interfaces:**
- Consumes: Task 2 `getProjects`, `getProject`, `getSiteSettings`; Task 5 `VideoThumb`.
- Produces: `lib/seo.ts` with `projectMetadata(p: Project, site: SiteSettings): Metadata` and `projectJsonLd(p: Project, siteUrl: string): object` (`CreativeWork`, plus nested `VideoObject` with `thumbnailUrl`, `contentUrl`, `name`, `description`, `uploadDate` when `video` exists) and `personJsonLd(site: SiteSettings, siteUrl: string): object`.

- [ ] **Step 1: Failing tests** — `project-card`: shows title, tagline, link to `/work/<slug>`, and a play button only when video exists. `seo`: `projectJsonLd` includes `VideoObject` iff video present; `projectMetadata` title equals project title and `openGraph.images[0].url` is the thumbnail.
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement home** — sections in order: `Hero` (headline `h1`, subhead, intro, CTA "See the work" → `#work`, hero gradient with `hex-dots.svg` as a static background image), `ProjectGrid id="work"` (featured kiosks first, 3 columns on desktop, 1 on phone, each card = `VideoThumb` or image + title + tagline + skills row), `HowItsBuilt` (four short items: Custom hardware & PCBs, Arduino & sensors, Unity on-screen content, Motion graphics & install), short about, contact CTA linking `/contact`.
- [ ] **Step 4: Implement project page** — `generateStaticParams` from published projects, `generateMetadata` via `projectMetadata`, `notFound()` on null; layout: `h1` title, tagline, `VideoThumb` (priority) or image, `Markdown` body in `.prose-measure`, "What I built" bullets, skills, gallery grid, prev/next links, `JsonLd` script. `Markdown` wraps `react-markdown` + `remark-gfm` (`pnpm add react-markdown remark-gfm`).
- [ ] **Step 5: Run** tests; expected PASS. `pnpm build`; expected 8 static `/work/*` pages listed.
- [ ] **Step 6: Manual check** — `pnpm dev`, open `/` and one project at 390px and 1440px widths in the browser; confirm no `<video>` in DOM before clicking, no horizontal scroll at 390px.
- [ ] **Step 7: Commit** — `git commit -m "feat: home and project pages with SEO metadata"`.

### Task 7: Contact, redirects, sitemap, robots, llms.txt, analytics

**Files:**
- Create: `app/contact/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, `app/not-found.tsx`
- Modify: `next.config.ts` (redirects), `app/layout.tsx` (GA4)
- Test: `app/__tests__/sitemap.test.ts`

**Interfaces:**
- Consumes: Task 2 `getProjects`, `getSiteSettings`.

- [ ] **Step 1: Failing test** — `sitemap()` returns `/`, `/contact`, and one entry per published project, none for unpublished.
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement** sitemap, robots (`allow: /`, sitemap URL), `llms.txt` route returning plain text: one paragraph on the business, then `- [title](url): summary` per project. Contact page: heading, one paragraph, `mailto:` button, location. Redirects in `next.config.ts` per Global Constraints. GA4 via `<GoogleAnalytics gaId="G-M2WVRYNXYJ" />` from `@next/third-parties/google` (`pnpm add @next/third-parties`). Custom `not-found.tsx` with a link home.
- [ ] **Step 4: Run** tests; expected PASS. `pnpm build`; `curl -sI localhost:3000/player` on `pnpm start` → `308` with `location: /`.
- [ ] **Step 5: Commit** — `git commit -m "feat: contact, redirects, sitemap, robots, llms.txt, analytics"`.

### Task 8: Verify, deploy preview, push

**Files:** none new.

- [ ] **Step 1:** `pnpm lint && pnpm test && pnpm build`; all must pass.
- [ ] **Step 2:** `vercel deploy` (preview). Record the URL.
- [ ] **Step 3:** In the browser on the preview URL: load `/`, confirm via DevTools-equivalent JS that `document.querySelectorAll('video').length === 0` and total transferred bytes for the initial load are under 3 MB; open a modal; confirm one video request; press Esc.
- [ ] **Step 4:** `git push origin main`. Confirm `gh repo view fredknack/jumpwirefx --json isEmpty` → `false`.
- [ ] **Step 5:** Write `docs/recommendations.md` covering the SEO/AI-readability measures implemented, the remaining recommendations (domain cutover, Search Console, backlinks, case-study depth, testimonials, a "process" page), and the copy-reduction rationale. Commit and push.
