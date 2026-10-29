export type FaqItem = { question: string; answer: string };

/**
 * Pull question/answer pairs out of a Markdown body: inside a "## FAQ"
 * section, each "### question" heading and the paragraphs under it until the
 * next heading. Lets editors write FAQs in the admin and get FAQPage markup.
 */
export function extractFaq(markdown: string): FaqItem[] {
  const lines = markdown.split(/\r?\n/);
  const items: FaqItem[] = [];
  let inFaq = false;
  let current: FaqItem | null = null;
  const flush = () => {
    if (current) items.push({ question: current.question, answer: current.answer.trim() });
    current = null;
  };
  for (const line of lines) {
    const h2 = /^##\s+(.*)$/.exec(line);
    if (h2 && !line.startsWith("###")) {
      flush();
      inFaq = /^faq\b/i.test(h2[1].trim());
      continue;
    }
    if (!inFaq) continue;
    const h3 = /^###\s+(.*)$/.exec(line);
    if (h3) {
      flush();
      current = { question: h3[1].trim(), answer: "" };
      continue;
    }
    if (current) current.answer += line + "\n";
  }
  flush();
  return items;
}

export function faqJsonLd(items: FaqItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })),
  };
}
