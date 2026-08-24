import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import IncidentMonitorDetailsView from "./index";

vi.mock("../../../../hooks/authentication.store", () => ({
  default: () => 1, // teamId
}));

vi.mock("../../../../hooks/user.query", () => ({
  useCurrentUserRole: () => "ADMIN",
}));

vi.mock("../../../../hooks/monitors.query", () => ({
  useMonitor: vi.fn(() => ({
    data: {
      name: "API Monitor",
      state: "ACTIVE",
      settings: { url: "https://api.example.com", frequencySeconds: 60 },
    },
    isLoading: false,
  })),
  useUpdateMonitorState: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
}));

vi.mock("../../../../hooks/incidents.query", () => ({
  useMonitorIncidents: vi.fn(() => ({
    data: {
      incidents: [
        {
          id: 42,
          property: "status",
          operator: "==",
          target: "200",
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T01:00:00Z",
        },
      ],
    },
  })),
  useSolveIncident: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual("react-router-dom")) as any;
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
  };
});

// Mock complex sub-components
vi.mock("./components/AverageResponseTimeCard", () => ({
  default: () => <div>Avg Response</div>,
}));
vi.mock("./components/ChecksDataGrid", () => ({
  ChecksDataGrid: () => <div>Checks Grid</div>,
}));
vi.mock("./components/LastCheckCard", () => ({
  default: () => <div>Last Check</div>,
}));
vi.mock("./components/ResponseTimesGraph", () => ({
  default: () => <div>Response Graph</div>,
}));
vi.mock("./components/TLSCard", () => ({ default: () => <div>TLS Card</div> }));
vi.mock("./components/UptimeCard", () => ({
  default: () => <div>Uptime Card</div>,
}));

describe("IncidentMonitorDetailsView", () => {
  it("renders incident triggers correctly", () => {
    render(
      <BrowserRouter>
        <IncidentMonitorDetailsView />
      </BrowserRouter>,
    );
    expect(screen.getByText("API Monitor")).toBeInTheDocument();

    // Verify the incident details render correctly
    expect(screen.getByText(/status/)).toBeInTheDocument();
    expect(screen.getByText("==")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });
});
