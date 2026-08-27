import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import * as api from "./api";

vi.mock("./api", () => ({
  getPublicStatusPage: vi.fn(),
  verifySubscriber: vi.fn(),
}));

describe("StatusPage App", () => {
  it("renders loading state initially", () => {
    (api.getPublicStatusPage as any).mockImplementation(
      () => new Promise(() => undefined),
    );
    render(<App />);
    expect(screen.getByText("Loading status page...")).toBeInTheDocument();
  });

  it("renders status page with data", async () => {
    (api.getPublicStatusPage as any).mockResolvedValue({
      name: "Opsway Status",
      monitors: [{ id: 1, name: "Production API", status: "OPERATIONAL" }],
      showBranding: true,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Opsway Status")).toBeInTheDocument();
    });
    expect(screen.getByText("Production API")).toBeInTheDocument();
    expect(screen.getByText("All Systems Operational")).toBeInTheDocument();
  });
});
