import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  const user: User = { id: 1, name: "Brahim" };

  it("should render user name", () => {
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should render edit button if user is admin", () => {
    render(<UserAccount user={{ ...user, isAdmin: true }} />);

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("should not render edit button if user is not admin", () => {
    render(<UserAccount user={user} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
