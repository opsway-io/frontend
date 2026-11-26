import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Routes from "./routes";
import { getSubdomainMode } from "./subdomain";

vi.mock("../hooks/authentication.store", () => ({
  default: () => ({
    isAuthenticated: () => true,
    currentTeamId: 1,
    currentUserId: 1,
  }),
}));

vi.mock("./RestrictedRoute", () => ({
  default: ({ children }: { children?: React.ReactNode }) =>
    children ? <>{children}</> : <Outlet />,
}));

vi.mock("../pages/Dashboard/DashboardLayout", () => ({
  default: () => (
    <div data-testid="dashboard-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("../pages/Errors/ErrorLayout", () => ({
  default: () => (
    <div data-testid="error-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("../pages/Errors/NotFoundPage", () => ({
  default: () => <div>404 Not Found</div>,
}));

vi.mock("../pages/Dashboard/Monitors/MonitorsPage", () => ({
  default: () => <div>Monitors Page</div>,
}));

vi.mock("../pages/Dashboard/Pantomath/PantomathPage", () => ({
  default: () => <div>Agent Context Page</div>,
}));

vi.mock("../pages/Dashboard/Hub/HubOverviewPage", () => ({
  default: () => <div>Hub Overview Page</div>,
}));

vi.mock("../pages/Dashboard/Agents/AgentsPage", () => ({
  default: () => <div>Agents Page</div>,
}));

vi.mock("../pages/Dashboard/Services/ServiceCatalogPage", () => ({
  default: () => <div>Service Catalog Page</div>,
}));

vi.mock("../pages/Dashboard/Info/ProductInfoPage", () => ({
  default: () => <div>Product Info Page</div>,
}));

const originalHostname = window.location.hostname;

const setHostname = (hostname: string) => {
  Object.defineProperty(window, "location", {
    value: { ...window.location, hostname },
    writable: true,
    configurable: true,
  });
};

const renderAt = (hostname: string, path: string) => {
  setHostname(hostname);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes />
    </MemoryRouter>,
  );
};

afterEach(() => {
  setHostname(originalHostname);
});

describe("getSubdomainMode", () => {
  it("resolves local development hosts to local", () => {
    expect(getSubdomainMode("localhost")).toBe("local");
    expect(getSubdomainMode("127.0.0.1")).toBe("local");
    expect(getSubdomainMode("dev.localhost")).toBe("local");
    expect(getSubdomainMode("opsway.local")).toBe("local");
    expect(getSubdomainMode("")).toBe("local");
  });

  it("resolves production subdomains strictly", () => {
    expect(getSubdomainMode("monitoring.opsway.eu")).toBe("monitoring");
    expect(getSubdomainMode("agent-context.opsway.eu")).toBe("agent-context");
    expect(getSubdomainMode("pantomath.opsway.eu")).toBe("agent-context");
    expect(getSubdomainMode("my.opsway.eu")).toBe("hub");
    expect(getSubdomainMode("app.opsway.eu")).toBe("hub");
  });
});

describe("Subdomain route boundaries", () => {
  it("returns 404 for /monitors on agent-context.opsway.eu", async () => {
    renderAt("agent-context.opsway.eu", "/monitors");
    expect(await screen.findByText("404 Not Found")).toBeInTheDocument();
  });

  it("returns 404 for /agents on agent-context.opsway.eu", async () => {
    renderAt("agent-context.opsway.eu", "/agents");
    expect(await screen.findByText("404 Not Found")).toBeInTheDocument();
  });

  it("returns 404 for /info/monitoring on agent-context.opsway.eu", async () => {
    renderAt("agent-context.opsway.eu", "/info/monitoring");
    expect(await screen.findByText("404 Not Found")).toBeInTheDocument();
  });

  it("renders Agent Context on agent-context.opsway.eu/products", async () => {
    renderAt("agent-context.opsway.eu", "/products");
    expect(await screen.findByText("Agent Context Page")).toBeInTheDocument();
  });

  it("returns 404 for /products on monitoring.opsway.eu", async () => {
    renderAt("monitoring.opsway.eu", "/products");
    expect(await screen.findByText("404 Not Found")).toBeInTheDocument();
  });

  it("returns 404 for /agents on monitoring.opsway.eu", async () => {
    renderAt("monitoring.opsway.eu", "/agents");
    expect(await screen.findByText("404 Not Found")).toBeInTheDocument();
  });

  it("renders Monitors on monitoring.opsway.eu/monitors", async () => {
    renderAt("monitoring.opsway.eu", "/monitors");
    expect(await screen.findByText("Monitors Page")).toBeInTheDocument();
  });

  it("returns 404 for /monitors on my.opsway.eu", async () => {
    renderAt("my.opsway.eu", "/monitors");
    expect(await screen.findByText("404 Not Found")).toBeInTheDocument();
  });

  it("returns 404 for /products on my.opsway.eu", async () => {
    renderAt("my.opsway.eu", "/products");
    expect(await screen.findByText("404 Not Found")).toBeInTheDocument();
  });

  it("renders Hub & Agents on my.opsway.eu", async () => {
    const { unmount } = renderAt("my.opsway.eu", "/");
    expect(await screen.findByText("Hub Overview Page")).toBeInTheDocument();
    unmount();

    renderAt("my.opsway.eu", "/agents");
    expect(await screen.findByText("Agents Page")).toBeInTheDocument();
  });

  it("keeps shared routes like /services accessible across subdomains", async () => {
    for (const host of [
      "my.opsway.eu",
      "monitoring.opsway.eu",
      "agent-context.opsway.eu",
    ]) {
      const { unmount } = renderAt(host, "/services");
      expect(await screen.findByText("Service Catalog Page")).toBeInTheDocument();
      unmount();
    }
  });

  it("keeps all product routes open on localhost", async () => {
    for (const [path, expected] of [
      ["/", "Hub Overview Page"],
      ["/monitors", "Monitors Page"],
      ["/products", "Agent Context Page"],
      ["/agents", "Agents Page"],
    ] as const) {
      const { unmount } = renderAt("localhost", path);
      expect(await screen.findByText(expected)).toBeInTheDocument();
      unmount();
    }
  });
});
