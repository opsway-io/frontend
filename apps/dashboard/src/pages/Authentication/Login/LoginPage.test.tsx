import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";

vi.mock("./LoginForm", () => ({
  default: () => <div data-testid="login-form">Login Form Mock</div>,
}));

vi.mock("./SocialLoginButtons", () => ({
  default: () => (
    <div data-testid="social-login-form">Social Login Form Mock</div>
  ),
}));

describe("LoginPage", () => {
  it("renders the welcome text and login form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
