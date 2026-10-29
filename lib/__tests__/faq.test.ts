import { describe, expect, test } from "vitest";
import { extractFaq, faqJsonLd } from "@/lib/faq";

const body = `## What you get

Some text.

## FAQ

### Can we change the content ourselves?

Yes. Log in from any browser and edit text, images and video.

Changes reach the kiosk within a minute.

### What is logged?

Anonymous interaction events: taps, button presses and dwell time.

## Something after

Not a question.`;

describe("extractFaq", () => {
  test("reads question/answer pairs from the FAQ section only", () => {
    expect(extractFaq(body)).toEqual([
      { question: "Can we change the content ourselves?", answer: "Yes. Log in from any browser and edit text, images and video.\n\nChanges reach the kiosk within a minute." },
      { question: "What is logged?", answer: "Anonymous interaction events: taps, button presses and dwell time." },
    ]);
  });

  test("returns an empty list without a FAQ section", () => {
    expect(extractFaq("## Why\n\nText")).toEqual([]);
  });
});

describe("faqJsonLd", () => {
  test("builds FAQPage structured data", () => {
    const ld = faqJsonLd(extractFaq(body)) as { "@type": string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[1].name).toBe("What is logged?");
    expect(ld.mainEntity[1].acceptedAnswer.text).toMatch(/Anonymous/);
  });
});
