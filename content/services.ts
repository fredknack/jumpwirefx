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
- Loud, bright and physical beats subtle on a show floor. Expect to be told so.`,
    projectSlugs: ["netflix-cowboy-bebop-vending-machine", "kaiser-permanente-health-quiz-kiosk", "interactive-ipad-portfolio"],
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
- Maintenance visits and content refreshes can be scheduled, so the piece ages well.`,
    projectSlugs: ["interactive-corporate-timeline", "nyit-interactive-video-wall"],
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
- A wall can be interactive for one person and still broadcast to everyone else behind them. Designing for both is the interesting part.`,
    projectSlugs: ["nyit-interactive-video-wall", "interactive-corporate-timeline"],
    sortOrder: 30,
    published: true,
  },
];
