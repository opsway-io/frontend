import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/joy/styles";
import { JoyTheme } from "@opsway/ui";
import { ReactNode } from "react";
import MonitorsDataGrid from "./MonitorsDataGrid";
import { MonitorWithStats } from "../../../../api/endpoints/monitors";

vi.mock("../../../../hooks/user.query", () => ({
  useCurrentUserRole: () => "ADMIN",
}));

const mockMonitors: MonitorWithStats[] = [
  {
    id: 1,
    teamID: 1,
    name: "Production API",
    state: "ACTIVE",
    steps: [{ url: "https://api.example.com" }] as any,
    settings: {
      url: "https://api.example.com",
      frequencySeconds: 60,
    } as any,
    stats: {
      averageResponseTime: 120,
      averageResponseTimes: [120, 130, 110],
      p99: 300,
      p95: 200,
    } as any,
  } as any,
];

const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <ThemeProvider theme={JoyTheme}>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

describe("MonitorsDataGrid", () => {
  it("renders correctly with empty data", () => {
    render(
      <Providers>
        <MonitorsDataGrid monitors={[]} />
      </Providers>,
    );
    expect(screen.getByText("No monitors")).toBeInTheDocument();
  });

  it("renders monitor items properly", () => {
    render(
      <Providers>
        <MonitorsDataGrid monitors={mockMonitors} />
      </Providers>,
    );
    expect(screen.getByText("Production API")).toBeInTheDocument();
    expect(screen.getByText("api.example.com")).toBeInTheDocument();
    expect(screen.getByText("300ms")).toBeInTheDocument();
    expect(screen.getByText("200ms")).toBeInTheDocument();
  });
});
