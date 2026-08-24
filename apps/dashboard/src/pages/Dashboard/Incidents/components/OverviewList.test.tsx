import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import IncidentPageOverviewList from "./OverviewList";
import { MonitorsWithIncidents } from "../../../../../src/api/endpoints/monitors";

const mockMonitors: MonitorsWithIncidents[] = [
  {
    id: 1,
    name: "Production API",
    incidents: [
      { id: 100, monitorId: 1 } as any,
      { id: 101, monitorId: 1 } as any,
    ],
  } as any,
];

describe("IncidentPageOverviewList", () => {
  it("renders empty state correctly", () => {
    render(
      <BrowserRouter>
        <IncidentPageOverviewList monitors={[]} />
      </BrowserRouter>,
    );
    expect(
      screen.getByText(
        "No active incidents right now. Everything is running smoothly!",
      ),
    ).toBeInTheDocument();
  });

  it("renders monitor and incident counts correctly", () => {
    render(
      <BrowserRouter>
        <IncidentPageOverviewList monitors={mockMonitors} />
      </BrowserRouter>,
    );
    expect(screen.getByText("Production API")).toBeInTheDocument();
    expect(screen.getByText("2 active incidents")).toBeInTheDocument();
  });
});
