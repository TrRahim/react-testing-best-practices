import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
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
    const onSubmit = vi.fn();
    render(
      <>
        <ProductForm onSubmit={onSubmit} product={product} />
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
      onSubmit,

      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },

      waitForFormToLoad: async () => {
        const nameInput = await screen.findByPlaceholderText(/name/i);
        const priceInput = await screen.findByPlaceholderText(/price/i);
        const categoryInput = await screen.findByRole("combobox", {
          name: /category/i,
        });
        const sumbitButton = await screen.findByRole("button");

        type FormData = {
          [K in keyof Product]: any;
        };

        const validData: FormData = {
          id: 1,
          name: "Brahim",
          price: 10,
          categoryId: category.id,
        };

        const fill = async (product: FormData) => {
          const user = userEvent.setup();

          if (product.name != undefined)
            await user.type(nameInput, product.name);

          if (product.price != undefined)
            await user.type(priceInput, product.price.toString());

          await user.tab();
          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(sumbitButton);
        };

        await screen.findByRole("form");

        return {
          nameInput,
          priceInput,
          categoryInput,
          sumbitButton,
          validData,
          fill,
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editting a product", async () => {
    const product: Product = {
      id: 1,
      name: "nothing",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad } = renderComponent(product);

    const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
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
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const from = await waitForFormToLoad();
      await from.fill({ ...from.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "0",
      price: 0,
      errorMessage: /1/i,
    },
    {
      scenario: "negative",
      price: -1,
      errorMessage: /1/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /1000/i,
    },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/i,
    },
  ])(
    "should an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it("should call onSubmit with the correct data", async () => {
    const { onSubmit, waitForFormToLoad } = renderComponent();

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    const { id, ...formData } = form.validData;
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  it("should dispaly a toast if submission fails", async () => {
    const { onSubmit, waitForFormToLoad } = renderComponent();
    onSubmit.mockRejectedValue({});

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it("should disable submit button uppon submission", async () => {
    const { onSubmit, waitForFormToLoad } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {}));

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.sumbitButton).toBeDisabled();
  });

  it("should re-enable the submit button after submission", async () => {
    const { onSubmit, waitForFormToLoad } = renderComponent();
    onSubmit.mockResolvedValue({});

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.sumbitButton).not.toBeDisabled();
  });

  it("should re-enable the submit button after submission", async () => {
    const { onSubmit, waitForFormToLoad } = renderComponent();
    onSubmit.mockRejectedValue("error");

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.sumbitButton).not.toBeDisabled();
  });
});
