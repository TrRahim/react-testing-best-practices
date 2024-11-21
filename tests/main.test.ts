import { faker } from "@faker-js/faker";
import { describe, it } from "vitest";

describe("group", () => {
  it("should", async () => {
    console.log({
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 20, max: 50 }),
    });
  });
});
