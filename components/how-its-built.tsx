import { Container } from "@/components/container";

const ITEMS = [
  { title: "Custom hardware", body: "Circuit boards, lighting, buttons and sensors designed and built for the cabinet, not bolted on after." },
  { title: "Physical controls", body: "Buttons, coin slots, motion sensors and lights, wired to the screen so a press or a wave triggers the show. Custom microcontroller electronics, built in-house." },
  { title: "On-screen experience", body: "Touch interfaces, synchronized video walls and animation built in Unity to run all day without a hiccup." },
  { title: "Remote content and analytics", body: "Clients change the media from any browser, and every tap and button press is logged to a dashboard they can open the next morning." },
];

export function HowItsBuilt() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-24">
      <Container>
        <div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:whitespace-nowrap">The whole build, or just the part you need</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            Electronics, software and content can all come from one place, with no hand-offs between an electronics shop, a software team and a content studio. Already have a touchscreen, or a team that makes your video and graphics? JumpWire fits around them and handles the rest.
          </p>
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it) => (
            <li key={it.title} className="border-t-2 border-brand pt-4">
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-white/70">{it.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
