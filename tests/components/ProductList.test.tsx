import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";

describe("ProductList", () => {
  it("should render the list of products", async () => {
    render(<ProductList />);

    const items = await screen.findAllByRole("listitem");

    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no products found", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));
    render(<ProductList />);

    const text = await screen.findByText(/No products/i);
    expect(text).toBeInTheDocument();
  });
});
