import type { Media, Project } from "@/lib/types";
import mediaJson from "@/content/media.json";

type MediaOverrides = Record<string, { video?: Media; thumbnail?: Media }>;
const media = mediaJson as MediaOverrides;

const thumb = (slug: string, alt: string): Media => ({
  url: `/media/${slug}/thumb.jpg`,
  width: 1280,
  height: 720,
  alt,
});

const seed: Project[] = [
  {
    id: "p-timeline",
    slug: "interactive-corporate-timeline",
    title: "Interactive Corporate Timeline",
    tagline: "A 16-screen lobby wall that lights up as visitors explore 150+ milestones.",
    kind: "installation",
    summary:
      "A corporate lobby installation of 16 displays driven by 8 synchronized PCs. Tap any of more than 150 points on the timeline and the wall answers with text, images and video on the screen above or below. Related milestones pulse together so visitors see the connections.",
    body: `Sixteen displays, eight PCs, one timeline. Every point on the wall is a milestone with its own text, image and video, and tapping one plays that video on the display directly above or below it so the story stays where your eyes are.

The content lives in the cloud and the client's team edits it through a custom content management system, so the wall stays current without a developer. All eight PCs stay in sync in real time, which is what makes the group pulsing and the cross-screen video cues possible.`,
    built: [
      "Unity front end kept in sync across 8 PCs in real time",
      "Cloud content store with a custom CMS for the client's team",
      "Touch, video and animation choreography across 16 screens",
    ],
    skills: ["Unity", "Multi-screen sync", "Touchscreen", "Firebase", "Custom CMS"],
    thumbnail: thumb("interactive-corporate-timeline", "Visitor touching a milestone on a wide multi-screen timeline wall"),
    gallery: [],
    featured: true,
    sortOrder: 10,
    published: true,
  },
  {
    id: "p-bebop",
    slug: "netflix-cowboy-bebop-vending-machine",
    title: "Netflix Cowboy Bebop Vending Machine",
    tagline: "Drop a coin, trigger a show, win a prize.",
    client: "Netflix",
    year: 2021,
    kind: "kiosk",
    summary:
      "For the Cowboy Bebop reboot at ComplexCon 2021, Netflix needed a vending machine that felt like the series. Fans inserted Woolong coins, four screens and LED light boxes fired a 15-second synchronized animation, and the machine dispensed gifts and event tickets.",
    body: `Woolong is the currency in Cowboy Bebop, so the machine only takes Woolong coins. Drop one in and four displays, a bank of LED light boxes and the soundtrack all fire together for fifteen seconds before the prize drops.

We built the on-screen visuals, programmed the link between the screens and the Arduino that runs the lights and the vending mechanism, and timed the lighting to the music.`,
    built: [
      "Four-screen animation synced to music and LED light boxes",
      "Arduino control of lighting and the vending mechanism",
      "Coin-trigger to dispense flow, end to end",
    ],
    skills: ["Unity", "Arduino", "LED lighting", "Audio and video editing"],
    thumbnail: thumb("netflix-cowboy-bebop-vending-machine", "Cowboy Bebop branded vending machine with four screens lit up"),
    gallery: [],
    featured: true,
    sortOrder: 20,
    published: true,
  },
  {
    id: "p-nyit",
    slug: "nyit-interactive-video-wall",
    title: "NYIT Interactive Video Wall",
    tagline: "Nine screens, one story, built to be touched.",
    client: "New York Institute of Technology",
    kind: "installation",
    summary:
      "NYIT installed a nine-display interactive wall and needed content worth touching. We designed the interface, produced the motion graphics and programmed the whole experience so visitors can browse text, images and video about the school. An ambient 3D loop takes over when nobody is interacting.",
    body: `The wall had to work for a first-time visitor with no instructions. The interface uses big targets, clear sections and short reads, with video and motion graphics doing most of the talking.

When the wall is idle it drops into an ambient loop that mixes 2D graphics with 3D objects, which draws people over from across the lobby.`,
    built: [
      "UI and UX for a nine-screen touch wall",
      "Motion graphics and the ambient attract loop",
      "All programming and content integration",
    ],
    skills: ["Unity", "UI/UX design", "Motion graphics", "Video wall"],
    thumbnail: thumb("nyit-interactive-video-wall", "Nine-screen interactive video wall in the NYIT lobby"),
    gallery: [],
    featured: true,
    sortOrder: 30,
    published: true,
  },
  {
    id: "p-kaiser",
    slug: "kaiser-permanente-health-quiz-kiosk",
    title: "Kaiser Permanente Health Quiz Kiosk",
    tagline: "Answer wrong, do the workout, print a prize.",
    client: "Kaiser Permanente",
    kind: "kiosk",
    summary:
      "A touchscreen health quiz for Kaiser Permanente events. Miss a question and the kiosk challenges you to hit big lit buttons as they flash around the cabinet. Finish the quiz and the exercises and it prints a coupon.",
    body: `This one is as much hardware as software. We designed the circuit board that drives the 12V button lights and the rest of the cabinet electronics in Autodesk Eagle, had it fabricated, and soldered it up. The oversized acrylic buttons were laser cut and use capacitive touch sensing, so there are no moving parts to wear out on a show floor.

The quiz, the timed exercise rounds and the receipt printer all run from one application.`,
    built: [
      "Custom circuit board designed in Eagle, fabricated and hand-soldered",
      "Laser-cut acrylic buttons with capacitive touch and 12V lighting",
      "Quiz, exercise timer and receipt-printer integration",
    ],
    skills: ["Custom PCB", "Arduino", "Capacitive touch", "Laser cutting", "Unity"],
    thumbnail: thumb("kaiser-permanente-health-quiz-kiosk", "Kaiser Permanente kiosk with a touchscreen and large illuminated buttons"),
    gallery: [],
    featured: true,
    sortOrder: 40,
    published: true,
  },
  {
    id: "p-ipad",
    slug: "interactive-ipad-portfolio",
    title: "Interactive iPad Portfolio",
    tagline: "A touch portfolio that shows the work and the craft at once.",
    kind: "kiosk",
    summary:
      "An iPad app for browsing the studio's motion graphics, video editing and 3D work. The interface is the demo: fluid, responsive and built in Unity to show what a custom touch experience can feel like.",
    body: `Two goals: make the portfolio easy to flip through, and prove that a custom-built touch interface feels better than a web page on a tablet. It runs fully offline, which is how a kiosk on a show floor has to behave.`,
    built: [
      "Dynamic touch interface built in Unity",
      "Motion graphics and video content",
      "Fully offline and self-contained",
    ],
    skills: ["Unity", "iOS", "Motion graphics", "UI design"],
    thumbnail: thumb("interactive-ipad-portfolio", "iPad showing a grid of motion graphics portfolio pieces"),
    gallery: [],
    featured: false,
    sortOrder: 50,
    published: true,
  },
  {
    id: "p-fps",
    slug: "3d-first-person-shooter",
    title: "3D First-Person Shooter",
    tagline: "A lockdown project that became a complete game.",
    year: 2020,
    kind: "game",
    summary:
      "When events paused in 2020 we built a first-person shooter from scratch: the 3D models, textures, level design and all the code. A Node.js backend runs the online leaderboard, and a VR port for Meta Quest is in progress.",
    body: `Trade shows stopped in 2020, so we used the time to build a game end to end. Every model and texture, every level and all of the gameplay code are ours, and we learned enough Node.js to run the leaderboard API. It started as a VR project, pivoted to first-person to nail the foundation, and is now heading back to VR on Meta Quest.`,
    built: [
      "3D modeling and texturing in Cinema 4D",
      "Level design and gameplay programming",
      "Node.js leaderboard API",
    ],
    skills: ["Unity", "Cinema 4D", "C#", "Node.js"],
    thumbnail: thumb("3d-first-person-shooter", "Screenshot from a 3D first-person shooter level"),
    gallery: [],
    featured: false,
    sortOrder: 60,
    published: true,
  },
  {
    id: "p-meta2",
    slug: "meta2-augmented-reality-breakout",
    title: "Augmented Reality Breakout",
    tagline: "Breakout, but you are inside the bricks.",
    kind: "experiment",
    summary:
      "A weekend experiment with the Meta2 augmented reality headset: a take on Breakout where you stand trapped inside a cylinder of bricks and throw spheres to break free. Built to learn what see-through AR could do in a real room.",
    body: `The Meta2 was an early see-through AR headset (no relation to the company now called Meta). In one weekend we built a room-scale Breakout where the bricks surround the player. The headset is discontinued, but the lessons about spatial interaction carry straight into kiosk and installation work.`,
    built: ["Room-scale gameplay for a see-through AR headset", "3D assets and physics"],
    skills: ["Unity", "Augmented reality", "3D modeling"],
    thumbnail: thumb("meta2-augmented-reality-breakout", "Player inside a cylinder of colored bricks in augmented reality"),
    gallery: [],
    featured: false,
    sortOrder: 70,
    published: true,
  },
  {
    id: "p-reel",
    slug: "interactive-work-reel",
    title: "Interactive Work Reel",
    tagline: "Demo reel · 4 min",
    kind: "experiment",
    summary:
      "A quick tour of interactive projects: touchscreen kiosks, multi-screen walls, physical buttons and animated content, all built to hold attention on a busy show floor.",
    body: `A compilation of installation and kiosk work. Watch it for the feel of the projects; the individual case studies cover how each one was built.`,
    built: ["Compilation of installation and kiosk work"],
    skills: ["Unity", "Motion graphics"],
    thumbnail: thumb("interactive-work-reel", "Montage of interactive kiosks and video walls"),
    gallery: [],
    featured: false,
    sortOrder: 80,
    published: true,
  },
];

export const projects: Project[] = seed.map((p) => {
  const m = media[p.slug];
  return m ? { ...p, thumbnail: m.thumbnail ?? p.thumbnail, video: m.video ?? p.video } : p;
});
