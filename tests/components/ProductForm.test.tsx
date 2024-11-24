import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviderrs";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm onSubmit={vi.fn()} product={product} />, {
      wrapper: AllProviders,
    });

    return {
      waitForFormToLoad: async () => {
        await screen.findByRole("form");
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          cateogryInput: screen.getByRole("combobox", { name: /category/i }),
          sumbitButton: screen.getByRole("button"),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, priceInput, cateogryInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(cateogryInput).toBeInTheDocument();
  });

  it("should populate form fields when editting a product", async () => {
    const product: Product = {
      id: 1,
      name: "nothing",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad } = renderComponent(product);

    const { cateogryInput, nameInput, priceInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(cateogryInput).toHaveTextContent(category.name);
  });

  it("should put focus on the name field", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus();
  });

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad } = renderComponent();

      const form = await waitForFormToLoad();
      const user = userEvent.setup();
      if (name != undefined) await user.type(form.nameInput, name);
      await user.type(form.priceInput, "10");
      await user.click(form.cateogryInput);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(form.sumbitButton);

      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    }
  );
});
