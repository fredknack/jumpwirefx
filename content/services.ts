import type { Service } from "@/lib/types";

/**
 * Seed service pages. The database wins once DATABASE_URL is set; edit live
 * copy in the admin, not here.
 */
export const services: Service[] = [
  {
    id: "s-trade-show-kiosks",
    slug: "trade-show-kiosks",
    title: "Trade show kiosks",
    tagline: "A booth people cross the aisle for, and remember after the show.",
    summary:
      "Custom interactive kiosks for trade shows and conferences: touchscreens, physical buttons, LED lighting and sensors wrapped around your message, built to run all day on a show floor and ship to the next one.",
    body: `## Why a kiosk

A show floor is loud and crowded, and most booths look the same. A kiosk that reacts when someone walks up, lights up when they press a button, or hands them something for playing along pulls people in and keeps them there long enough to have a conversation.

## What JumpWire delivers

- **Concept and design.** The interaction is designed around your goal: capture leads, explain a product, run a game, or just stop traffic.
- **Hardware.** Cabinets, screens, arcade buttons, LED lighting, sensors and the custom electronics that tie them together, designed to survive setup crews and curious hands.
- **Software and content.** The on-screen experience, motion graphics and video, built in Unity to run unattended for a ten-hour day.
- **Delivery.** Tested as a complete unit before it ships, with setup instructions a booth crew can follow or on-site installation when the stakes are high.

## Bring what you already have

Already have a touchscreen or a cabinet? JumpWire can build the interactive software to fit it. Have an agency producing your video and graphics? Their files drop straight into the experience. The whole build is available, but no part of it is required.

## Good to know

- Content updates after the first show are part of the plan, so the same kiosk can carry a new campaign next season.
- Lead capture can feed your CRM or a simple spreadsheet, whichever your team will actually use.
- Loud, bright and physical beats subtle on a show floor. Expect to be told so.

## After launch

Content on the kiosk is yours to change. Log in from any browser, swap a video, fix a price, add this show's promotion, and the kiosk updates itself, whether it's on your loading dock or on the floor in Las Vegas. Every tap and button press is logged, so the morning after the show you can see how many people engaged, what they chose and when the booth was busiest.`,
    projectSlugs: ["netflix-cowboy-bebop-vending-machine", "kaiser-permanente-health-quiz-kiosk", "interactive-ipad-portfolio"],
    gallery: [],
    sortOrder: 10,
    published: true,
  },
  {
    id: "s-lobby-installations",
    slug: "lobby-installations",
    title: "Lobby installations",
    tagline: "A permanent piece that tells your story to everyone who walks in.",
    summary:
      "Interactive installations for corporate lobbies, visitor centers and campuses: multi-screen walls, timelines and touch displays that run every day, stay current through a simple editor, and survive years of visitors.",
    body: `## Built to stay

A lobby piece is on for years, not days. That changes the engineering: industrial displays, PCs that recover from a power cut on their own, and content that the client's team can change without calling a developer.

## What JumpWire delivers

- **Design for the space.** The installation is sized and shaped for the wall, the sightlines and the traffic flow, so it reads from the elevator and rewards people who walk up.
- **Synchronized screens.** Multiple displays driven by multiple PCs behave as one surface, so a tap on one screen can answer on another.
- **A content editor.** Milestones, people, video and images are edited in a browser by your team, and the wall updates itself.
- **Attract mode.** When nobody is touching it, the installation plays an ambient loop that still looks intentional from across the room.

## Bring what you already have

Existing displays, an AV integrator already under contract, or a brand team that produces your video: JumpWire works alongside them and builds the interactive layer. Or hand over the whole thing, from electronics to install.

## Good to know

- Reliability work happens up front: watchdogs, automatic restarts and remote monitoring so a frozen screen never greets a visitor.
- Content planning matters as much as the software. A timeline with twenty strong stories beats one with two hundred weak ones.
- Maintenance visits and content refreshes can be scheduled, so the piece ages well.

## After launch

The installation is edited by your team from any browser: new milestones, people, video and images go live without a developer or a site visit. Usage is logged, so you can see which stories visitors open most, when the lobby is busiest and whether a refresh changed anything.`,
    projectSlugs: ["interactive-corporate-timeline", "nyit-interactive-video-wall"],
    gallery: [],
    sortOrder: 20,
    published: true,
  },
  {
    id: "s-interactive-video-walls",
    slug: "interactive-video-walls",
    title: "Interactive video walls",
    tagline: "Many screens, one experience, driven by touch, sensors or a single button.",
    summary:
      "Multi-screen video walls that respond to people: touch-driven content across synchronized displays, ambient loops when idle, and physical controls when a wall needs to work for a crowd instead of one visitor.",
    body: `## More than a big screen

A video wall that only loops a reel is wallpaper. Making it respond to a touch, a wave or a button press turns it into something people cross a room for. JumpWire builds the software that keeps many displays in step and the controls that let people drive them.

## What JumpWire delivers

- **Synchronization.** Content stays frame-accurate across every display, including video that jumps from one screen to another.
- **Interaction.** Touch overlays, motion sensors, physical buttons or a kiosk in front of the wall, whichever fits the audience and the room.
- **Content.** Motion graphics and video produced for the exact pixel dimensions of the wall, or your team's files mapped onto it.
- **Operation.** Scheduled content, remote updates and recovery from power loss, so the wall runs without an operator.

## Bring what you already have

Walls are often sold by an AV integrator before anyone asks what will play on them. JumpWire regularly comes in at that point, builds the interactive experience for the screens already on the wall, and works with the integrator on the controller setup.

## Good to know

- Bezels, aspect ratio and viewing distance drive the design; JumpWire will ask for the wall's exact layout before proposing content.
- A wall can be interactive for one person and still broadcast to everyone else behind them. Designing for both is the interesting part.

## After launch

Playlists and interactive content are managed remotely, so the wall can change for an event, a season or a visiting client without anyone touching the controller. Interaction data shows what people reach for and how long they stay, which is how the next round of content gets better.`,
    projectSlugs: ["nyit-interactive-video-wall", "interactive-corporate-timeline"],
    gallery: [],
    sortOrder: 30,
    published: true,
  },
  {
    id: "s-remote-content-and-usage-data",
    slug: "remote-content-and-usage-data",
    title: "Remote content and usage data",
    tagline: "Change what the kiosk says from your laptop, and know exactly how many people touched it.",
    summary:
      "Every JumpWire build includes a browser-based content editor and a usage dashboard: update video, images and text on a kiosk or installation from anywhere, and see taps, button presses and dwell time logged in the cloud, by hour and by event.",
    body: `## The question your boss will ask

Did the booth work? Most interactive builds can't answer that. JumpWire builds can: every kiosk and installation ships with remote content control and cloud usage logging, so you can change what it shows without a technician and prove what it did without guessing.

## Update it from anywhere

Log in from any browser, on the show floor or from the office, and edit the content the kiosk plays: videos, images, text, prices, the promotion for this particular show. The kiosk picks up the change within a minute. Schedule content ahead of time, keep a version per event, and roll back if a change doesn't land.

*Screenshot placeholder: the content editor, with a kiosk's media list and a change being published.*

## See what visitors did

Every tap, button press and session is logged to the cloud as it happens. The dashboard shows how many people engaged, which screens and choices were most popular, how long people stayed, and how activity moved through the day. Compare one show to the next, export the numbers, and put a real figure in the post-show report.

*Screenshot placeholder: the usage dashboard, with interactions by hour and the most-played content.*

## What it is good for

- **Proving ROI.** Interactions per day, by show, in a spreadsheet your marketing team can use.
- **Tuning content.** If nobody opens the third option, change the third option before tomorrow.
- **Running several units.** One login manages every kiosk in the fleet, each with its own content and its own numbers.
- **Lead capture.** When the experience collects contact details, they land in the same dashboard, ready to export.

## FAQ

### Can we change the content ourselves?

Yes. The editor is built for marketing teams, not developers: upload a video, type a headline, publish. JumpWire sets it up and shows your team how it works at handover.

### What exactly is logged?

Anonymous interaction events: which button or screen was touched, when, and how long a session lasted. No cameras, no faces, no personal data, unless the experience includes a lead-capture form that visitors fill in on purpose.

### Who owns the data?

You do. It is collected for your installation, visible only to your logins, and exportable at any time.

### Does the kiosk need internet at the venue?

For live updates and live data, yes, through venue Wi-Fi or a cellular hotspot. Without a connection the kiosk keeps running on its last content and uploads the logged data when it reconnects.

### Does this cost extra?

It is included with every JumpWire build. Hosting for the editor and dashboard is part of the ongoing support arrangement, agreed up front.`,
    projectSlugs: ["interactive-corporate-timeline", "kaiser-permanente-health-quiz-kiosk", "netflix-cowboy-bebop-vending-machine"],
    gallery: [],
    sortOrder: 40,
    published: true,
  },
];
