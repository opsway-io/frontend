import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import MaintenanceView from "./index";
import { useMaintenanceWindows } from "../../../hooks/maintenance.query";
import { ThemeProvider, createTheme } from "@mui/material";

// Mock the hook
vi.mock("../../../hooks/maintenance.query", () => ({
  useMaintenanceWindows: vi.fn(),
}));

// Mock Restrict component to just render children
vi.mock("../../../components/Restrict", () => ({
  Restrict: ({ children }: any) => <>{children}</>,
  Role: { ADMIN: "ADMIN", USER: "USER", VIEWER: "VIEWER" }
}));

const mockTheme = createTheme();

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      <BrowserRouter>{component}</BrowserRouter>
    </ThemeProvider>
  );
};

describe("MaintenanceView", () => {
  it("renders loading state", () => {
    vi.mocked(useMaintenanceWindows).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithProviders(<MaintenanceView />);
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    vi.mocked(useMaintenanceWindows).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderWithProviders(<MaintenanceView />);
    expect(screen.getByText("No active maintenance windows")).toBeInTheDocument();
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
      isLoading: false,
    } as any);

    renderWithProviders(<MaintenanceView />);
    expect(screen.getByText("Database Upgrade")).toBeInTheDocument();
  });
});
