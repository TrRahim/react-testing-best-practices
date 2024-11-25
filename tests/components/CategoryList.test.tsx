import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import { Category } from "../../src/entities";
import AllProviders from "../AllProviderrs";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });
  });

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProviders });
  };

  it("should render a list of categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("should render a loading message when fetchind categories", () => {
    simulateDelay("/cateogries");

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render an error if fetching categories fails", async () => {
    simulateError("/categories");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
