import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { server } from "../mocks/server";

describe("BrowseProductsPage", () => {
  const renderCoponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  };
  it("should render a loading skeleton when fetching categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderCoponent();

    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skseleton after categories are fetched", async () => {
    renderCoponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should show a loading skeleton when fetching products", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderCoponent();

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    renderCoponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
  });
});
