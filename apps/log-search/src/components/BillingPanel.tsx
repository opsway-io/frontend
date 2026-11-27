"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { OPSWAY_API_URL, resolveOpswaySession } from "../lib/opswayApi";

type UsageRange = "current_cycle" | "7d" | "30d" | "90d";
type LogTrendMetric = "logMb" | "logEvents";

const RANGE_LABELS: Record<UsageRange, string> = {
  current_cycle: "Current Billing Cycle",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

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

interface DailyUsagePoint {
  date: string;
  logBytes: number;
  logEvents: number;
}

interface TopLogServiceConsumer {
  serviceName: string;
  events: number;
  bytes: number;
  sharePct: number;
}

interface OverageSettingsPayload {
  allowOverage: boolean;
  overageSpendCapCents?: number | null;
  estimatedOverageCents: number;
  eligible: boolean;
}

interface LogSearchUsagePayload {
  plan: string;
  billingCycle?: {
    start: string;
    end: string;
    daysElapsed: number;
    daysTotal: number;
    daysRemaining: number;
  };
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
  timeseries?: DailyUsagePoint[];
  topConsumers?: {
    logServices?: TopLogServiceConsumer[];
  };
  enforcement?: ShellEnforcementSummary[];
  overage?: OverageSettingsPayload;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  if (kb >= 1) return `${kb.toFixed(1)} KB`;
  return `${bytes} B`;
}

export function BillingPanel() {
  const [range, setRange] = useState<UsageRange>("current_cycle");
  const [trendMetric, setTrendMetric] = useState<LogTrendMetric>("logMb");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [savingOverage, setSavingOverage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [summary, setSummary] = useState<BillingSummaryPayload | null>(null);
  const [usage, setUsage] = useState<LogSearchUsagePayload | null>(null);
  const [draftAllowOverage, setDraftAllowOverage] = useState<boolean | null>(
    null,
  );
  const [draftSpendCap, setDraftSpendCap] = useState<string | null>(null);

  const fetchBillingState = useCallback(async (selectedRange: UsageRange) => {
    const session = await resolveOpswaySession();
    if (!session.authenticated || !session.teamId) {
      return {
        error:
          session.error ??
          "Sign in to your Opsway account to view Log Search usage and quotas.",
        teamId: null as number | null,
        summary: null as BillingSummaryPayload | null,
        usage: null as LogSearchUsagePayload | null,
      };
    }

    const [sumRes, usageRes] = await Promise.all([
      fetch(`${OPSWAY_API_URL}/v1/teams/${session.teamId}/billing/summary`, {
        credentials: "include",
      }),
      fetch(
        `${OPSWAY_API_URL}/v1/teams/${session.teamId}/usage?range=${encodeURIComponent(selectedRange)}`,
        { credentials: "include" },
      ),
    ]);

    return {
      error: null as string | null,
      teamId: session.teamId,
      summary: sumRes.ok
        ? ((await sumRes.json()) as BillingSummaryPayload)
        : null,
      usage: usageRes.ok
        ? ((await usageRes.json()) as LogSearchUsagePayload)
        : null,
    };
  }, []);

  const loadData = useCallback(
    async (selectedRange: UsageRange = range) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBillingState(selectedRange);
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
    },
    [fetchBillingState, range],
  );

  useEffect(() => {
    let cancelled = false;
    fetchBillingState(range)
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
  }, [fetchBillingState, range]);

  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/billing`
      : "https://logs.opsway.eu/billing";

  const chartData = useMemo(() => {
    return (usage?.timeseries ?? []).map((pt) => ({
      date: pt.date,
      logMb: Math.round((pt.logBytes / (1024 * 1024)) * 100) / 100,
      logEvents: pt.logEvents,
    }));
  }, [usage?.timeseries]);

  const highUtilizationQuotas = useMemo(() => {
    return (usage?.products?.logSearch?.quotas ?? []).filter(
      (q) => q.status === "warning" || q.status === "critical",
    );
  }, [usage?.products?.logSearch?.quotas]);

  const allowOverage =
    draftAllowOverage ?? usage?.overage?.allowOverage ?? false;
  const spendCapEuros =
    draftSpendCap ??
    (usage?.overage?.overageSpendCapCents
      ? String(Math.round(usage.overage.overageSpendCapCents / 100))
      : "");

  const handleExportCsv = () => {
    const pts = usage?.timeseries ?? [];
    const header = ["date", "log_bytes", "log_mb", "log_events"];
    const rows = pts.map((pt) => [
      pt.date,
      pt.logBytes,
      (pt.logBytes / (1024 * 1024)).toFixed(2),
      pt.logEvents,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `opsway-log-search-usage-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveOverage = async () => {
    if (!teamId) return;
    setSavingOverage(true);
    setNotice(null);
    setError(null);
    try {
      const parsed = spendCapEuros.trim()
        ? Math.round(Number(spendCapEuros) * 100)
        : null;
      const capCents =
        parsed !== null && !Number.isNaN(parsed) && parsed > 0 ? parsed : null;
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/overage-settings`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            allowOverage,
            overageSpendCapCents: capCents,
          }),
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to save overage settings (${res.status})`);
      }
      setDraftAllowOverage(null);
      setDraftSpendCap(null);
      setNotice("Pay-as-you-go overage settings updated.");
      await loadData(range);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save overage settings",
      );
    } finally {
      setSavingOverage(false);
    }
  };

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
      await loadData(range);
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
      await loadData(range);
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
        await loadData(range);
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-[#a3aab7]">
        Loading Log Search usage &amp; billing…
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
          label: "Volume Ingested",
          value: formatBytes(usage.products.logSearch.bytesIngested),
        },
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
  const topLogServices = usage?.topConsumers?.logServices ?? [];

  return (
    <div className="flex flex-col gap-5">
      {/* Settings Header & Top Selection Bar (matches monitoring & agent-context SettingsPage) */}
      <div>
        <h1 className="m-0 text-2xl font-semibold text-[#e7e9ee]">Settings</h1>
        <p className="mt-1 mb-0 text-sm text-[#a3aab7]">
          Manage your team&apos;s profile, integrations, API keys and billing.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-white/[0.08] overflow-x-auto">
        {[
          { label: "General", href: "https://my.opsway.eu/settings/general" },
          {
            label: "Integrations",
            href: "https://my.opsway.eu/settings/integrations",
          },
          { label: "API Keys", href: "https://my.opsway.eu/settings/api-keys" },
          { label: "AI Agent", href: "https://my.opsway.eu/settings/ai-agent" },
        ].map((tab) => (
          <a
            key={tab.label}
            href={tab.href}
            className="px-3.5 py-2 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-[#a3aab7] hover:text-[#e7e9ee] no-underline transition-colors"
          >
            {tab.label}
          </a>
        ))}
        <span className="px-3.5 py-2 text-sm font-medium whitespace-nowrap border-b-2 border-[#5185a5] text-[#e7e9ee]">
          Usage &amp; Billing
        </span>
      </div>

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

      {/* High-Utilization Warning Banner */}
      {highUtilizationQuotas.length > 0 && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs flex flex-wrap justify-between items-center gap-2">
          <div>
            <div className="font-semibold text-sm">
              Approaching Log Search quota limits
            </div>
            <div className="text-amber-200/80 mt-0.5">
              {highUtilizationQuotas
                .map(
                  (q) =>
                    `${q.label} (${q.used}/${q.limit} ${q.unit}, ${q.percent.toFixed(0)}%)`,
                )
                .join(" · ")}
            </div>
          </div>
        </div>
      )}

      {/* Product-Scoped Plans, Quotas & Billing Shell */}
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
        hubUsageUrl="https://my.opsway.eu/settings/billing"
        onToggleEnabled={handleToggleEnabled}
        onSelectAddonTier={handleSelectAddonTier}
        onOpenCustomerPortal={handleOpenPortal}
        onResumeSubscription={handleResume}
      />

      {/* Analytics Header: Range Selector, Cycle Reset & CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="m-0 text-base font-semibold text-[#e7e9ee]">
            Log Search Analytics, Trends &amp; Overage Protection
          </h3>
          {usage?.billingCycle && (
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/10 text-[#a3aab7]">
              Resets in {usage.billingCycle.daysRemaining}d
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as UsageRange)}
            aria-label="Usage range"
            className="bg-[#1d2128] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e7e9ee] outline-none"
          >
            {(Object.keys(RANGE_LABELS) as UsageRange[]).map((k) => (
              <option key={k} value={k}>
                {RANGE_LABELS[k]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#1d2128] text-xs font-medium text-[#e7e9ee] hover:bg-white/[0.06] cursor-pointer"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Daily Log Ingestion Trend Chart */}
      <div className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-5 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <div className="text-sm font-semibold text-[#e7e9ee]">
              Daily Log Consumption Trend
            </div>
            <div className="text-xs text-[#7c8494]">
              {RANGE_LABELS[range]} ({chartData.length} days)
            </div>
          </div>
          <select
            value={trendMetric}
            onChange={(e) => setTrendMetric(e.target.value as LogTrendMetric)}
            aria-label="Trend metric"
            className="bg-[#161920] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e7e9ee] outline-none"
          >
            <option value="logMb">Log Ingestion (MB)</option>
            <option value="logEvents">Log Events</option>
          </select>
        </div>

        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="logUsageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5185a5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#5185a5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#9fa6ad", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9fa6ad", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161920",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#e7e9ee",
                }}
              />
              <Area
                type="monotone"
                dataKey={trendMetric}
                name={trendMetric === "logMb" ? "Ingestion (MB)" : "Log Events"}
                stroke="#5185a5"
                strokeWidth={2}
                fill="url(#logUsageFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Top Log Service Consumers & Pay-As-You-Go Overage Protection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Log Services Table */}
        <div className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-5 flex flex-col gap-3">
          <div>
            <div className="text-sm font-semibold text-[#e7e9ee]">
              Top Log Service Consumers
            </div>
            <div className="text-xs text-[#7c8494]">
              Services generating the highest log ingestion volume this period.
            </div>
          </div>

          {topLogServices.length === 0 ? (
            <div className="text-xs text-[#7c8494] py-4">
              No log service ingestion recorded in this time range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#7c8494]">
                    <th className="py-2 pr-3 font-medium">Service</th>
                    <th className="py-2 px-3 font-medium text-right">Events</th>
                    <th className="py-2 px-3 font-medium text-right">Volume</th>
                    <th className="py-2 pl-3 font-medium text-right">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {topLogServices.map((svc) => (
                    <tr
                      key={svc.serviceName}
                      className="border-b border-white/[0.05] text-[#e7e9ee]"
                    >
                      <td className="py-2 pr-3 font-medium">
                        {svc.serviceName}
                      </td>
                      <td className="py-2 px-3 text-right text-[#a3aab7]">
                        {svc.events.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-[#a3aab7]">
                        {formatBytes(svc.bytes)}
                      </td>
                      <td className="py-2 pl-3 text-right text-[#93c5fd] font-medium">
                        {svc.sharePct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pay-As-You-Go Overage & Quota Protection */}
        <div className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-5 flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-sm font-semibold text-[#e7e9ee]">
                Pay-As-You-Go Overage &amp; Quota Protection
              </div>
              <div className="text-xs text-[#7c8494] mt-0.5">
                Prevent log ingestion throttling by enabling metered overages
                with an optional monthly spend cap.
              </div>
            </div>

            {logEnforcement && logEnforcement.state !== "NORMAL" && (
              <div className="p-3 rounded-lg bg-[#161920] border border-white/[0.08] text-xs text-[#a3aab7]">
                <div className="font-semibold text-[#e7e9ee]">
                  {logEnforcement.label} — {logEnforcement.state}
                </div>
                {logEnforcement.behaviorSummary && (
                  <div className="mt-1">{logEnforcement.behaviorSummary}</div>
                )}
              </div>
            )}

            {usage?.overage?.eligible ? (
              <div className="flex flex-col gap-3 pt-1">
                <label className="inline-flex items-center gap-2.5 text-xs text-[#e7e9ee] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowOverage}
                    disabled={!summary?.canManageBilling || savingOverage}
                    onChange={(e) => setDraftAllowOverage(e.target.checked)}
                    className="accent-[#5185a5]"
                  />
                  <span>Enable Pay-As-You-Go overage billing (€0.50 / GB)</span>
                </label>

                <div className="flex items-center gap-2 flex-wrap">
                  <label
                    htmlFor="log-spend-cap"
                    className="text-xs text-[#a3aab7]"
                  >
                    Monthly spend cap (€):
                  </label>
                  <input
                    id="log-spend-cap"
                    type="number"
                    min={0}
                    placeholder="No cap"
                    value={spendCapEuros}
                    disabled={!summary?.canManageBilling || savingOverage}
                    onChange={(e) => setDraftSpendCap(e.target.value)}
                    className="w-28 bg-[#161920] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#e7e9ee] outline-none"
                  />
                  <button
                    type="button"
                    disabled={!summary?.canManageBilling || savingOverage}
                    onClick={handleSaveOverage}
                    className="px-3 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {savingOverage ? "Saving…" : "Save Settings"}
                  </button>
                </div>

                {usage.overage.estimatedOverageCents > 0 && (
                  <div className="text-xs text-[#93c5fd]">
                    Estimated current cycle overage: €
                    {(usage.overage.estimatedOverageCents / 100).toFixed(2)}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#161920] border border-white/[0.08] text-xs text-[#a3aab7]">
                Pay-as-you-go overages are available on Pro and Enterprise
                plans. Free teams receive a 24h / +10% grace buffer before cold
                storage protection activates.
              </div>
            )}
          </div>

          <div className="text-[11px] text-[#7c8494] pt-2 border-t border-white/[0.08]">
            Log Search overage rate: €0.50 / GB.
            {logEnforcement?.state === "THROTTLED"
              ? " Excess logs are currently preserved in cold storage."
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
