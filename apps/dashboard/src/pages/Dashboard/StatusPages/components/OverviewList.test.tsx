import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import StatusPageOverviewList from "./OverviewList";
import * as statuspagesQuery from "../../../../hooks/statuspages.query";

vi.mock("../../../../hooks/statuspages.query", () => ({
  useStatusPages: vi.fn(),
}));

describe("StatusPageOverviewList", () => {
  it("renders loading state", () => {
    vi.mocked(statuspagesQuery.useStatusPages).mockReturnValue({
      isLoading: true,
      error: null,
      data: undefined,
    } as any);

    render(<StatusPageOverviewList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    vi.mocked(statuspagesQuery.useStatusPages).mockReturnValue({
      isLoading: false,
      error: new Error("Failed to load"),
      data: undefined,
    } as any);

    render(<StatusPageOverviewList />);
    expect(screen.getByText("Error loading status pages")).toBeInTheDocument();
  });

  it("renders no status pages found", () => {
    vi.mocked(statuspagesQuery.useStatusPages).mockReturnValue({
      isLoading: false,
      error: null,
      data: { statusPages: [] },
    } as any);

    render(<StatusPageOverviewList />);
    expect(screen.getByText("No status pages found")).toBeInTheDocument();
  });

  it("renders a list of status pages", () => {
    vi.mocked(statuspagesQuery.useStatusPages).mockReturnValue({
      isLoading: false,
      error: null,
      data: {
        statusPages: [
          {
            id: 1,
            name: "My API Status",
            domain: "status.opsway.eu",
          },
        ],
      },
    } as any);

    render(
      <MemoryRouter>
        <StatusPageOverviewList />
      </MemoryRouter>
    );

    expect(screen.getByText("My API Status - status.opsway.eu")).toBeInTheDocument();
  });
});
