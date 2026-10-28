import Link from "next/link";
import { Container } from "@/components/container";

export default function ProjectNotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl font-bold">That project isn&apos;t here</h1>
      <p className="mt-3 text-white/70">It may have moved or been retired.</p>
      <Link href="/#work" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-black">See all work</Link>
    </Container>
  );
}
