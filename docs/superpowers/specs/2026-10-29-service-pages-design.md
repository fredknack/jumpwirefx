# Service pages — design

**Intent.** Buyers search by need ("trade show kiosk", "lobby installation", "interactive video wall"), while the site is organized by project. One page per service gives search engines and AI answers a page to match each intent, and gives JumpWire a place for buyer-facing specifics (lead time, booth size, what the client can supply). Pages are editable in the admin like projects.

**Content model (`Service`).** `id`, `slug` (same rules as projects), `title`, `tagline` (one line under the title), `summary` (one paragraph; meta description and home-page teaser), `body` (Markdown), `heroImage?` (Media), `projectSlugs` (ordered related projects, published ones shown), `sortOrder`, `published`. Seed file `content/services.ts` with three services; the database wins when `DATABASE_URL` is set, exactly as for projects.

**Public.** `/services/<slug>`: title, tagline, hero image when set, body, "Related work" grid from `projectSlugs`, contact CTA. Home page gets a "Services" section (cards with title + summary linking to each page) between the hero and the work grid; header gets a "Services" link to `/#services`. Each page carries `Service` JSON-LD (provider = JumpWire Organization, areaServed US) and canonical/Open Graph metadata; sitemap and llms.txt list published services. Unknown or unpublished slugs 404.

**Admin.** `/admin/services` list (reorder, publish toggle, edit), `/admin/services/new`, `/admin/services/[id]` form with Markdown preview, hero image upload, related projects as checkboxes of all projects (drafts included, marked), delete with typed slug. Saves call `updateTag("content")`.

**Out of scope.** A `/services` index page (the home section serves as the index), service-specific contact forms, pricing.
