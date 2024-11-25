import { screen } from "@testing-library/react";
import { Product } from "../src/entities";
import { db } from "./mocks/db";
import { navigateTo } from "./utils";

describe("Router", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render the home page for /", () => {
    navigateTo("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("should render the products page for /products", () => {
    navigateTo("/products");

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should render the product details page for /products/:id", async () => {
    navigateTo("/products/" + product.id);

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument();
  });

  it("should render the not found page for invalid routes", () => {
    navigateTo("/invalid-route");

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("should render the admin home page for /admin", () => {
    navigateTo("/admin");

    expect(screen.getByRole("heading", { name: /admin/i })).toBeInTheDocument();
  });

  it("should render the admin products home page for /admin/products", () => {
    navigateTo("/admin/products");

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should render the admin new products home page for /admin/products/new", () => {
    navigateTo("/admin/products/new");

    expect(
      screen.getByRole("heading", { name: /new product/i })
    ).toBeInTheDocument();
  });

  it("should render the admin edit product page for /admin/products/:id/edit", async () => {
    navigateTo("/admin/products/" + product.id + "/edit");

    expect(
      await screen.findByRole("heading", { name: /edit product/i })
    ).toBeInTheDocument();
  });
});
