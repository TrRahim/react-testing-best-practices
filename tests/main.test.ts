import { describe, expect, it } from "vitest";

describe("group", () => {
  it("should", async () => {
    const response = await fetch("/categories");
    const data = await response.json();
    console.log(data);
    expect(data).toHaveLength(3);
  });
});
