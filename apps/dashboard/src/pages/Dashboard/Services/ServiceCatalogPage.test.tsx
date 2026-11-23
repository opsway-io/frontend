import { fireEvent, render, screen, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CssVarsProvider } from "@mui/joy";
import { JoyTheme } from "@opsway/ui";
import ServiceCatalogPage from "./ServiceCatalogPage";
import {
  useDeleteServiceCatalogItem,
  useLogSearchServices,
  useServiceCatalog,
  useUpsertServiceCatalogItem,
} from "../../../hooks/suite.query";
import { useMonitors } from "../../../hooks/monitors.query";

vi.mock("../../../hooks/suite.query", () => ({
  useServiceCatalog: vi.fn(),
  useLogSearchServices: vi.fn(),
  useUpsertServiceCatalogItem: vi.fn(),
  useDeleteServiceCatalogItem: vi.fn(),
}));

vi.mock("../../../hooks/monitors.query", () => ({
  useMonitors: vi.fn(),
}));

vi.mock("notistack", () => ({
  enqueueSnackbar: vi.fn(),
}));

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

const renderWithProviders = (component: React.ReactNode) =>
  render(
    <CssVarsProvider theme={JoyTheme} defaultMode="dark">
      <BrowserRouter>{component}</BrowserRouter>
    </CssVarsProvider>
  );

describe("ServiceCatalogPage", () => {
  const upsertMutate = vi.fn();
  const deleteMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpsertServiceCatalogItem).mockReturnValue({
      mutate: upsertMutate,
      isPending: false,
    } as any);

    vi.mocked(useDeleteServiceCatalogItem).mockReturnValue({
      mutate: deleteMutate,
      isPending: false,
    } as any);

    vi.mocked(useMonitors).mockReturnValue({
      data: {
        monitors: [
          { id: 10, name: "Checkout API" },
          { id: 11, name: "Payments Webhook" },
        ],
      },
      isPending: false,
    } as any);
  });

  it("surfaces unregistered Log-Search services and hides already registered ones", () => {
    vi.mocked(useServiceCatalog).mockReturnValue({
      data: {
        services: [
          {
            id: 1,
            teamId: 1,
            slug: "checkout-service",
            name: "Checkout Service",
            logSearchServices: ["checkout-service"],
            monitorIds: [10],
            repositoryUrl: "https://github.com/opsway-io/checkout",
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
          },
        ],
      },
      isPending: false,
    } as any);

    vi.mocked(useLogSearchServices).mockReturnValue({
      data: {
        services: ["checkout-service", "payment-worker", "auth-service"],
      },
      isPending: false,
    } as any);

    renderWithProviders(<ServiceCatalogPage />);

    const discoveredCard = screen.getByTestId("discovered-services-card");
    expect(within(discoveredCard).getByText("Discovered from Log-Search (2)")).toBeInTheDocument();
    expect(within(discoveredCard).getByText("payment-worker")).toBeInTheDocument();
    expect(within(discoveredCard).getByText("auth-service")).toBeInTheDocument();
    expect(within(discoveredCard).queryByText("checkout-service")).not.toBeInTheDocument();

    // Linked monitor name is rendered in table instead of "Auto-linked"
    expect(screen.getByText("Checkout API")).toBeInTheDocument();
    expect(screen.getByText("opsway-io/checkout")).toBeInTheDocument();
  });

  it("quick-registers a discovered service on click", () => {
    vi.mocked(useServiceCatalog).mockReturnValue({
      data: { services: [] },
      isPending: false,
    } as any);

    vi.mocked(useLogSearchServices).mockReturnValue({
      data: { services: ["payment-worker"] },
      isPending: false,
    } as any);

    renderWithProviders(<ServiceCatalogPage />);

    fireEvent.click(screen.getByRole("button", { name: "Quick Add" }));

    expect(upsertMutate).toHaveBeenCalledWith(
      {
        slug: "payment-worker",
        name: "Payment Worker",
        logSearchServices: ["payment-worker"],
        monitorIds: [],
      },
      expect.any(Object)
    );
  });

  it("pre-fills the modal when configuring a discovered service", () => {
    vi.mocked(useServiceCatalog).mockReturnValue({
      data: { services: [] },
      isPending: false,
    } as any);

    vi.mocked(useLogSearchServices).mockReturnValue({
      data: { services: ["auth-service"] },
      isPending: false,
    } as any);

    renderWithProviders(<ServiceCatalogPage />);

    fireEvent.click(screen.getByRole("button", { name: "Configure" }));

    expect(screen.getByDisplayValue("Auth Service")).toBeInTheDocument();
    expect(screen.getByDisplayValue("auth-service")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register Service" })).toBeInTheDocument();
  });

  it("opens edit modal for an existing service and submits updated payload with id and monitorIds", () => {
    vi.mocked(useServiceCatalog).mockReturnValue({
      data: {
        services: [
          {
            id: 42,
            teamId: 1,
            slug: "checkout-service",
            name: "Checkout Service",
            description: "Handles orders",
            logSearchServices: ["checkout-service"],
            monitorIds: [10, 11],
            repositoryUrl: "https://github.com/opsway-io/checkout",
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
          },
        ],
      },
      isPending: false,
    } as any);

    vi.mocked(useLogSearchServices).mockReturnValue({
      data: { services: ["checkout-service"] },
      isPending: false,
    } as any);

    renderWithProviders(<ServiceCatalogPage />);

    expect(screen.getByText("2 monitors")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit Checkout Service" }));

    const nameInput = screen.getByDisplayValue("Checkout Service");
    fireEvent.change(nameInput, { target: { value: "Checkout Core" } });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(upsertMutate).toHaveBeenCalledWith(
      {
        id: 42,
        slug: "checkout-service",
        name: "Checkout Core",
        description: "Handles orders",
        logSearchServices: ["checkout-service"],
        monitorIds: [10, 11],
        repositoryUrl: "https://github.com/opsway-io/checkout",
      },
      expect.any(Object)
    );
  });
});
