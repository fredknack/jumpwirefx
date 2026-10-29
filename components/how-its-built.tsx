import { Container } from "@/components/container";

const ITEMS = [
  { title: "Custom hardware", body: "Circuit boards, lighting, buttons and sensors designed and built for the cabinet, not bolted on after." },
  { title: "Arduino and sensors", body: "Microcontrollers tie the physical parts to the screen so a coin, a button or a wave triggers the show." },
  { title: "On-screen experience", body: "Touch interfaces, synchronized video walls and animation built in Unity to run all day without a hiccup." },
  { title: "Content and install", body: "Motion graphics, video editing and on-site setup, so the kiosk arrives finished and working." },
];

export function HowItsBuilt() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built end to end under one roof</h2>
          <p className="mt-3 text-white/70">
            No hand-offs between an electronics shop, a software team and a content studio. JumpWire owns the whole build.
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
