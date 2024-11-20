import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";

describe("OrderStatusSelector", () => {
  it("should render New as default value", () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
        );
      </Theme>
    );

    const button = screen.getByRole("combobox");
    expect(button).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
        );
      </Theme>
    );

    const button = screen.getByRole("combobox");
    const user = userEvent.setup();
    await user.click(button);

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
});
