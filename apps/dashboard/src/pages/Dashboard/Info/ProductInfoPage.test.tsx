import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductInfoPage from "./ProductInfoPage";

const originalHostname = window.location.hostname;

const renderWithProviders = (initialEntry: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/info" element={<ProductInfoPage />} />
          <Route path="/info/:productId" element={<ProductInfoPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const setHostname = (hostname: string) => {
  Object.defineProperty(window, "location", {
    value: { ...window.location, hostname },
    writable: true,
    configurable: true,
  });
};

afterEach(() => {
  setHostname(originalHostname);
});

describe("ProductInfoPage", () => {
  it("keeps the product switcher bar visible when clicking Monitoring & Status Pages", () => {
    setHostname("my.opsway.eu");

    renderWithProviders("/info");

    const monitoringTab = screen.getByRole("tab", {
      name: /Monitoring & Status Pages/i,
    });
    fireEvent.click(monitoringTab);

    expect(
      screen.getByRole("tab", { name: /Monitoring & Status Pages/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tab", { name: /Opsway Hub & Catalog/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Log Search/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Autonomous Agents & MCP/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Agent Context/i }),
    ).toBeInTheDocument();
  });

  it("hides the product switcher bar on the monitoring subdomain", () => {
    setHostname("monitoring.opsway.eu");

    renderWithProviders("/info/monitoring");

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(
      screen.getByText("Opsway Monitoring & Status Pages"),
    ).toBeInTheDocument();
  });
});
