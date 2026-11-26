import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import BillingTab from "./BillingTab";

vi.mock("../../../../hooks/platform.query", () => ({
  usePlatformProducts: () => ({
    data: {
      products: {
        monitoring: true,
        log_search: true,
        pantomath: true,
        managed_agent: true,
      },
    },
  }),
}));

vi.mock("../../../../hooks/suite.query", () => ({
  useEntitlements: () => ({
    data: {
      entitlements: [
        { id: 1, teamId: 1, product: "monitoring", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 50, currentUsage: 4 },
        { id: 2, teamId: 1, product: "log_search", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 50, currentUsage: 2 },
        { id: 3, teamId: 1, product: "pantomath", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 5, currentUsage: 1 },
        { id: 4, teamId: 1, product: "managed_agent", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 30, currentUsage: 5 },
      ],
    },
  }),
  useTeamUsage: () => ({
    data: {
      plan: "PRO",
      products: {
        monitoring: {
          tier: "PRO",
          enabled: true,
          quotas: [{ key: "monitors", label: "Active Monitors", used: 4, limit: 50, unit: "monitors", percent: 8, status: "ok" }],
          probeExecutions: 1200,
          activeHeartbeats: 2,
          notificationsSent: 3,
          incidentsOpened: 1,
          statusPageSubscribers: 5,
        },
        logSearch: {
          tier: "PRO",
          enabled: true,
          quotas: [{ key: "ingestion_gb", label: "Monthly Log Ingestion", used: 2, limit: 50, unit: "GB", percent: 4, status: "ok" }],
          eventsIngested: 50000,
          bytesIngested: 2147483648,
          activeServices: 4,
          triggerRules: 2,
          logTriggeredInvestigations: 1,
        },
        pantomath: {
          tier: "PRO",
          enabled: true,
          quotas: [{ key: "indexed_repos", label: "Indexed Repositories", used: 1, limit: 5, unit: "repos", percent: 20, status: "ok" }],
          linkedRepositories: 1,
          vectorChunks: 4200,
          graphEdges: 900,
          queriesExecuted: 18,
          pantomathTriggeredInvestigations: 0,
          mcpCalls: 12,
        },
        managedAgent: {
          tier: "PRO",
          enabled: true,
          quotas: [{ key: "managed_investigations", label: "Managed AI Runs", used: 5, limit: 30, unit: "runs", percent: 16.6, status: "ok" }],
          managedRuns: 5,
          byoaRuns: 2,
          tokensUsed: 12000,
          avgDurationMs: 1400,
          mcpCalls: 45,
          remediationsSuggested: 2,
          remediationsExecuted: 1,
          activeTriggerRules: 3,
        },
      },
      platform: {
        teamSeats: { key: "seats", label: "Team Members", used: 2, limit: 5, unit: "members", percent: 40, status: "ok" },
      },
      enforcement: [],
    },
  }),
  useUpdateEntitlement: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("../../../../hooks/team.query", () => ({
  useCurrentTeam: () => ({
    data: { id: 1, name: "acme", paymentPlan: "PRO" },
    isPending: false,
  }),
  useGetProducts: () => ({
    data: {
      products: [
        { id: "PRO", name: "Pro", price: 20, currency: "eur", lookupKey: "pro", marketing_features: ["50 Monitors"] },
        { id: "ENTERPRISE", name: "Enterprise", price: 100, currency: "eur", lookupKey: "enterprise", marketing_features: ["Unlimited Monitors"] },
      ],
    },
    isPending: false,
  }),
  useBillingSummary: () => ({
    data: {
      teamId: 1,
      paymentPlan: "PRO",
      canManageBilling: true,
      subscription: { baseTier: "PRO", status: "active", cancelAtPeriodEnd: false },
      entitlements: [
        { id: 1, teamId: 1, product: "monitoring", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 50, currentUsage: 4 },
        { id: 2, teamId: 1, product: "log_search", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 50, currentUsage: 2 },
        { id: 3, teamId: 1, product: "pantomath", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 5, currentUsage: 1 },
        { id: 4, teamId: 1, product: "managed_agent", tier: "PRO", source: "SUITE", enabled: true, monthlyQuota: 30, currentUsage: 5 },
      ],
      catalog: { currency: "eur", plans: [], addons: [] },
    },
  }),
  useChangePlan: () => ({ mutate: vi.fn(), isPending: false, variables: undefined }),
  useOpenCustomerPortal: () => ({ mutate: vi.fn(), isPending: false }),
  useUpsertProductAddon: () => ({ mutate: vi.fn(), isPending: false }),
  useResumeSubscription: () => ({ mutate: vi.fn(), isPending: false }),
}));

const originalHostname = window.location.hostname;
const setHostname = (hostname: string) => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, hostname, origin: `https://${hostname}` },
  });
};

afterEach(() => {
  setHostname(originalHostname);
});

describe("BillingTab subdomain scoping", () => {
  it("shows only Monitoring billing plans, usage, and Hub link on monitoring.opsway.eu", () => {
    setHostname("monitoring.opsway.eu");
    render(
      <MemoryRouter>
        <BillingTab />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Opsway Monitoring — Billing & Usage/i)).toBeTruthy();
    expect(screen.getByText("Monitoring Pro")).toBeTruthy();
    expect(screen.getByText("Monitoring Enterprise")).toBeTruthy();
    expect(screen.getByText("Active Monitors")).toBeTruthy();
    expect(screen.getByText(/All Product Billings in Hub/i)).toBeTruthy();
    expect(screen.queryByText("Monthly Log Ingestion")).toBeNull();
    expect(screen.queryByText("Log Search Pro")).toBeNull();
    expect(screen.queryByText("Indexed Repositories")).toBeNull();
    expect(screen.queryByText("Managed AI Runs")).toBeNull();
  });

  it("shows only Agent Context billing plans, usage, and Hub link on agent-context.opsway.eu", () => {
    setHostname("agent-context.opsway.eu");
    render(
      <MemoryRouter>
        <BillingTab />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Agent Context — Billing & Usage/i)).toBeTruthy();
    expect(screen.getByText("Agent Context Pro")).toBeTruthy();
    expect(screen.getByText("Agent Context Enterprise")).toBeTruthy();
    expect(screen.getByText("Indexed Repositories")).toBeTruthy();
    expect(screen.queryByText("Active Monitors")).toBeNull();
    expect(screen.queryByText("Monitoring Pro")).toBeNull();
    expect(screen.queryByText("Monthly Log Ingestion")).toBeNull();
  });

  it("shows the full 4-product Opsway Suite billing overview on my.opsway.eu", () => {
    setHostname("my.opsway.eu");
    render(
      <MemoryRouter>
        <BillingTab />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Opsway Suite Subscription/i)).toBeTruthy();
    expect(screen.getByText("Active Monitors")).toBeTruthy();
    expect(screen.getByText("Monthly Log Ingestion")).toBeTruthy();
    expect(screen.getByText("Indexed Repositories")).toBeTruthy();
    expect(screen.getByText("Managed AI Runs")).toBeTruthy();
  });
});
