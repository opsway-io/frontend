import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import MaintenancePage from "./MaintenancePage";
import { useMaintenanceWindows } from "../../../hooks/maintenance.query";
import { CssVarsProvider } from "@mui/joy";
import { JoyTheme } from "@opsway/ui";

// Mock the hook
vi.mock("../../../hooks/maintenance.query", () => ({
  useMaintenanceWindows: vi.fn(),
}));

// Mock Restrict component to just render children
vi.mock("../../../components/Restrict", () => ({
  Restrict: ({ children }: any) => <>{children}</>,
  Role: { ADMIN: "ADMIN", USER: "USER", VIEWER: "VIEWER" },
}));

// jsdom doesn't implement matchMedia, which Joy's CssVarsProvider relies on
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <CssVarsProvider theme={JoyTheme} defaultMode="dark">
      <BrowserRouter>{component}</BrowserRouter>
    </CssVarsProvider>,
  );
};

describe("MaintenancePage", () => {
  it("renders loading state", () => {
    vi.mocked(useMaintenanceWindows).mockReturnValue({
      data: undefined,
      isPending: true,
    } as any);

    renderWithProviders(<MaintenancePage />);
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    vi.mocked(useMaintenanceWindows).mockReturnValue({
      data: [],
      isPending: false,
    } as any);

    renderWithProviders(<MaintenancePage />);
    expect(
      screen.getByText("No active maintenance windows"),
    ).toBeInTheDocument();
  });

  it("renders maintenance windows", () => {
    const now = new Date();
    const start = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago
    const end = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour later

    vi.mocked(useMaintenanceWindows).mockReturnValue({
      data: [
        {
          id: 1,
          title: "Database Upgrade",
          settings: { startAt: start.toISOString(), endAt: end.toISOString() },
        },
      ],
      isPending: false,
    } as any);

    renderWithProviders(<MaintenancePage />);
    expect(screen.getByText("Database Upgrade")).toBeInTheDocument();
  });
});
