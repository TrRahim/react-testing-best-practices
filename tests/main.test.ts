import { describe, it } from "vitest";
import { db } from "./mocks/db";

describe("group", () => {
  it("should", async () => {
    db.product.create({ name: "Apple" });
    console.log(db.product.delete({ where: { id: { equals: 1 } } }));
  });
});
