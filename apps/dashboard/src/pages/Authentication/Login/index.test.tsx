import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginView from "./index";

// Mock child components
vi.mock("./form", () => ({
  default: () => <div data-testid="login-form">Login Form Mock</div>,
}));

vi.mock("./social", () => ({
  default: () => (
    <div data-testid="social-login-form">Social Login Form Mock</div>
  ),
}));

describe("LoginView", () => {
  it("renders the welcome text and login form", () => {
    render(
      <MemoryRouter>
        <LoginView />
      </MemoryRouter>,
    );

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
