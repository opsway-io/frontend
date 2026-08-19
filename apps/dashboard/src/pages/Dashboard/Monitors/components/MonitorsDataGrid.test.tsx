import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
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
    settings: {
      url: "https://api.example.com",
      frequencySeconds: 60,
    } as any,
    stats: {
      averageResponseTime: 120,
      p99: 300,
      p95: 200,
    } as any,
  } as any,
];

describe("MonitorsDataGrid", () => {
  it("renders correctly with empty data", () => {
    render(
      <BrowserRouter>
        <MonitorsDataGrid monitors={[]} />
      </BrowserRouter>
    );
    expect(screen.getByText("No monitors")).toBeInTheDocument();
  });

  it("renders monitor items properly", () => {
    render(
      <BrowserRouter>
        <MonitorsDataGrid monitors={mockMonitors} />
      </BrowserRouter>
    );
    expect(screen.getByText("Production API")).toBeInTheDocument();
    expect(screen.getByText("api.example.com")).toBeInTheDocument();
    expect(screen.getByText("300ms")).toBeInTheDocument();
    expect(screen.getByText("200ms")).toBeInTheDocument();
  });
});
