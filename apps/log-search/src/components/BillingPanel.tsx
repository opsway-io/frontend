"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  BillingEntitlementTier,
  ProductBillingShell,
  ShellCatalogProductAddon,
  ShellEnforcementSummary,
  ShellQuotaItem,
  ShellStatItem,
  ShellTeamEntitlement,
  ShellTeamSubscription,
} from "@opsway/shell";

const OPSWAY_API_URL =
  process.env.NEXT_PUBLIC_OPSWAY_API_URL || "https://api.opsway.eu";

interface BillingSummaryPayload {
  teamId: number;
  paymentPlan: "FREE" | "PRO" | "ENTERPRISE";
  canManageBilling: boolean;
  subscription?: ShellTeamSubscription | null;
  entitlements: ShellTeamEntitlement[];
  catalog?: {
    addons?: ShellCatalogProductAddon[];
  };
}

interface LogSearchUsagePayload {
  products: {
    logSearch: {
      quotas: ShellQuotaItem[];
      eventsIngested: number;
      bytesIngested: number;
      activeServices: number;
      triggerRules: number;
      logTriggeredInvestigations: number;
    };
  };
  enforcement?: ShellEnforcementSummary[];
}

export function BillingPanel() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [summary, setSummary] = useState<BillingSummaryPayload | null>(null);
  const [usage, setUsage] = useState<LogSearchUsagePayload | null>(null);

  const fetchBillingState = useCallback(async () => {
    let meRes = await fetch(`${OPSWAY_API_URL}/v1/auth/me`, {
      credentials: "include",
    });
    if (meRes.status === 401) {
      const refreshRes = await fetch(`${OPSWAY_API_URL}/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshRes.ok) {
        meRes = await fetch(`${OPSWAY_API_URL}/v1/auth/me`, {
          credentials: "include",
        });
      }
    }
    if (meRes.status === 401) {
      return {
        error:
          "Sign in to your Opsway account to view Log Search usage and quotas.",
        teamId: null as number | null,
        summary: null as BillingSummaryPayload | null,
        usage: null as LogSearchUsagePayload | null,
      };
    }
    if (!meRes.ok) {
      throw new Error(`Failed to resolve Opsway user (${meRes.status})`);
    }
    const meData = await meRes.json();
    const userId: number | undefined = meData?.user?.id ?? meData?.id;
    if (!userId) {
      throw new Error("Could not determine authenticated Opsway user.");
    }

    const teamsRes = await fetch(
      `${OPSWAY_API_URL}/v1/users/${userId}/teams`,
      { credentials: "include" },
    );
    if (!teamsRes.ok) {
      throw new Error(`Failed to resolve Opsway team (${teamsRes.status})`);
    }
    const teamsData = await teamsRes.json();
    const firstTeamId: number | undefined =
      teamsData?.teams?.[0]?.id ?? teamsData?.[0]?.id;
    if (!firstTeamId) {
      throw new Error("No Opsway team found for this account.");
    }

    const [sumRes, usageRes] = await Promise.all([
      fetch(`${OPSWAY_API_URL}/v1/teams/${firstTeamId}/billing/summary`, {
        credentials: "include",
      }),
      fetch(
        `${OPSWAY_API_URL}/v1/teams/${firstTeamId}/usage?range=current_cycle`,
        { credentials: "include" },
      ),
    ]);

    return {
      error: null as string | null,
      teamId: firstTeamId,
      summary: sumRes.ok
        ? ((await sumRes.json()) as BillingSummaryPayload)
        : null,
      usage: usageRes.ok
        ? ((await usageRes.json()) as LogSearchUsagePayload)
        : null,
    };
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBillingState();
      setError(result.error);
      setTeamId(result.teamId);
      setSummary(result.summary);
      setUsage(result.usage);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Log Search billing & usage data.",
      );
    } finally {
      setLoading(false);
    }
  }, [fetchBillingState]);

  useEffect(() => {
    let cancelled = false;
    fetchBillingState()
      .then((result) => {
        if (cancelled) return;
        setError(result.error);
        setTeamId(result.teamId);
        setSummary(result.summary);
        setUsage(result.usage);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Log Search billing & usage data.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchBillingState]);

  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/billing`
      : "https://logs.opsway.eu/billing";

  const handleSelectAddonTier = async (tier: BillingEntitlementTier) => {
    if (!teamId) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/billing/addons`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: "log_search",
            tier,
            returnUrl,
          }),
        },
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update Log Search add-on");
      }
      const data = await res.json();
      if (data?.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      setNotice(
        tier === "FREE"
          ? "Log Search add-on removed."
          : `Updated Log Search to ${tier}.`,
      );
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update add-on");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleEnabled = async (enabled: boolean) => {
    if (!teamId) return;
    setBusy(true);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/entitlements`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: "log_search", enabled }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to toggle Log Search entitlement");
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle product");
    } finally {
      setBusy(false);
    }
  };

  const handleOpenPortal = async () => {
    if (!teamId) return;
    setBusy(true);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/customer-portal`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ returnUrl }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.url) window.location.assign(data.url);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleResume = async () => {
    if (!teamId) return;
    setBusy(true);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/billing/resume`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        setNotice("Subscription resumed.");
        await loadData();
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-[#a3aab7]">
        Loading Log Search usage &amp; quotas…
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="p-6 rounded-xl bg-[#1d2128] border border-white/[0.08] flex flex-col gap-3">
        <div className="text-sm text-[#fca5a5]">{error}</div>
        <div className="flex gap-3">
          <a
            href="https://my.opsway.eu/login"
            className="px-3 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold no-underline"
          >
            Sign in on Opsway Hub
          </a>
          <a
            href="https://my.opsway.eu/settings/billing"
            className="px-3 py-1.5 rounded-lg border border-white/10 text-[#93c5fd] text-xs font-medium no-underline"
          >
            Open Suite Billing ↗
          </a>
        </div>
      </div>
    );
  }

  const logEnt = summary?.entitlements?.find((e) => e.product === "log_search");
  const logAddon = summary?.catalog?.addons?.find(
    (a) => a.product === "log_search",
  );
  const logEnforcement = usage?.enforcement?.find(
    (e) => e.product === "log_search",
  );
  const quotas: ShellQuotaItem[] = usage?.products?.logSearch?.quotas ?? [];
  const stats: ShellStatItem[] = usage?.products?.logSearch
    ? [
        {
          label: "Events Ingested",
          value: usage.products.logSearch.eventsIngested,
        },
        {
          label: "Active Services",
          value: usage.products.logSearch.activeServices,
        },
        {
          label: "Trigger Rules",
          value: usage.products.logSearch.triggerRules,
        },
        {
          label: "Log-Triggered RCAs",
          value: usage.products.logSearch.logTriggeredInvestigations,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-3">
      {notice && (
        <div className="px-4 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
          {notice}
        </div>
      )}
      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
          {error}
        </div>
      )}
      <ProductBillingShell
        product="log_search"
        title="Opsway Log Search"
        description="Milvus vector & SQL log engine, OTLP log ingestion, semantic log search, and built-in MCP server."
        accentColor="#5185a5"
        teamPlan={summary?.paymentPlan ?? "FREE"}
        subscription={summary?.subscription}
        entitlement={logEnt}
        quotas={quotas}
        stats={stats}
        enforcement={logEnforcement}
        addonCatalog={logAddon}
        canManageBilling={summary?.canManageBilling ?? false}
        isBusy={busy}
        hubBillingUrl="https://my.opsway.eu/settings/billing"
        hubUsageUrl="https://my.opsway.eu/settings/usage"
        onToggleEnabled={handleToggleEnabled}
        onSelectAddonTier={handleSelectAddonTier}
        onOpenCustomerPortal={handleOpenPortal}
        onResumeSubscription={handleResume}
      />
    </div>
  );
}
