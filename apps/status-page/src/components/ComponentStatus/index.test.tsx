import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ComponentStatus from "./index";

describe("ComponentStatus", () => {
  it("renders correctly with operational status", () => {
    render(
      <ComponentStatus name="API Server" status="OPERATIONAL" layout="STATS" />,
    );

    expect(screen.getByText("API Server")).toBeInTheDocument();
    expect(screen.getByText("99.99% uptime")).toBeInTheDocument();
  });

  it("renders correctly with error status", () => {
    render(
      <ComponentStatus
        name="Background Workers"
        status="MAJOR_OUTAGE"
        layout="STATS"
      />,
    );

    expect(screen.getByText("Background Workers")).toBeInTheDocument();
    expect(screen.getByText("99.99% uptime")).toBeInTheDocument();
  });
});
