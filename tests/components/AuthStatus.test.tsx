import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { AuthState, mockAuthState } from "../utils";

describe("AuthStatus", () => {
  const renderComponent = (authstatus: AuthState) => {
    mockAuthState(authstatus);

    render(<AuthStatus />);

    return {
      getLoginButton: () => screen.queryByRole("button", { name: /log in/i }),
      getLogoutButton: () => screen.queryByRole("button", { name: /log out/i }),
    };
  };

  it("should render the loading status while fetching the auth status", () => {
    renderComponent({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    expect(screen.getByText(/loading/i));
  });

  it("should render the login button if user is not authenticated", () => {
    const { getLoginButton } = renderComponent({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    expect(getLoginButton()).toBeInTheDocument();
  });

  it("should render the username if user is authenticated", () => {
    const { getLoginButton, getLogoutButton } = renderComponent({
      isLoading: false,
      isAuthenticated: true,
      user: {
        name: "brahim",
      },
    });

    expect(screen.getByText(/brahim/i)).toBeInTheDocument();
    expect(getLogoutButton()).toBeInTheDocument();
    expect(getLoginButton()).not.toBeInTheDocument();
  });
});
