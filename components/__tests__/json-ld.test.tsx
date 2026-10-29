import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { JsonLd } from "@/components/json-ld";

describe("JsonLd", () => {
  test("escapes < so CMS content cannot close the script tag", () => {
    const { container } = render(<JsonLd data={{ "@type": "Person", name: "</script><script>alert(1)</script>" }} />);
    const text = container.querySelector("script")!.innerHTML;
    expect(text).not.toContain("</script>");
    expect(text).toContain("\\u003c/script>");
    expect(JSON.parse(text).name).toBe("</script><script>alert(1)</script>");
  });
});
