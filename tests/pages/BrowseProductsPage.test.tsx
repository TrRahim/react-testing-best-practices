import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "Category" + item });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );

    const getProductSkeleton = () =>
      screen.queryByRole("progressbar", {
        name: /products/i,
      });

    const getCategoriesSkeleton = () =>
      screen.queryByRole("progressbar", {
        name: /categories/i,
      });

    const getCategoriesCombobox = () => screen.queryByRole("combobox");

    const selectCategory = async (name: RegExp | string) => {
      await waitForElementToBeRemoved(getCategoriesSkeleton);
      const combobox = getCategoriesCombobox();
      const user = userEvent.setup();
      await user.click(combobox!);

      const option = screen.getByRole("option", { name });
      await user.click(option);
    };

    const expectProductsToBeInTheDocument = (products: Product[]) => {
      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1);
      expect(dataRows).toHaveLength(products.length);

      products.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    };

    return {
      getProductSkeleton,
      getCategoriesSkeleton,
      getCategoriesCombobox,
      selectCategory,
      expectProductsToBeInTheDocument,
    };
  };

  it("should render a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton } = renderComponent();
    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skseleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should show a loading skeleton when fetching products", async () => {
    simulateDelay("/products");

    const { getProductSkeleton } = renderComponent();
    expect(getProductSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    const { getProductSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductSkeleton);
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");
    const { getProductSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductSkeleton);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategoy = categories[0];
    await selectCategory(selectedCategoy.name);

    const products = getProductsByCategory(selectedCategoy.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    screen.debug();
    await selectCategory(/all/i);
    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });
});
