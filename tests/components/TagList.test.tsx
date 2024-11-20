import { render, screen } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render tags list", async () => {
    render(<TagList />);

    const listItems = await screen.findAllByRole("list");
    expect(listItems.length).toBeGreaterThan(0);
  });
});
