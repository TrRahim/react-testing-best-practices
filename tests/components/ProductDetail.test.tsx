import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    server.use(
      http.get("/products/" + productId, () => HttpResponse.json(null))
    );
    render(<ProductDetail productId={productId} />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render an error for invalid productId", async () => {
    render(<ProductDetail productId={0} />);

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });

  it("should render an error if data fetching fails", async () => {
    server.use(http.get("/products/" + productId, () => HttpResponse.error()));
    render(<ProductDetail productId={productId} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the loading indicator when fetching data", async () => {
    server.use(
      http.get("/products/" + productId, async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={productId} />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading indicator after data is fetched", async () => {
    render(<ProductDetail productId={productId} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator when fetching data failed", async () => {
    server.use(http.get("/products/" + productId, () => HttpResponse.error()));

    render(<ProductDetail productId={productId} />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
