import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Input,
  LinearProgress,
  Option,
  Select,
  Sheet,
  Stack,
  Switch,
  Tab,
  TabList,
  Table,
  Tabs,
  Typography,
} from "@mui/joy";
import type { ApexOptions } from "apexcharts";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import {
  IoCardOutline,
  IoCodeSlashOutline,
  IoDownloadOutline,
  IoPulseOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { PiTerminalWindowBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import type {
  ProductEnforcementSummary,
  QuotaEnforcementState,
  QuotaItem,
  UsageRange,
} from "../../../../api/endpoints/suite";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import {
  useSetActivePantomathProduct,
  useTeamUsage,
  useUpdateOverageSettings,
} from "../../../../hooks/suite.query";
import { usePlatformProducts } from "../../../../hooks/platform.query";
import { getSubdomainMode } from "../../../../routes/subdomain";

type ProductFilter = "all" | "monitoring" | "log_search" | "managed_agent" | "pantomath";
type TrendMetric = "probes" | "logMb" | "agentRuns" | "agentTokens" | "mcpCalls" | "notifications";
type ConsumerTab = "monitors" | "logServices" | "pantomath" | "triggers" | "services";

const RANGE_LABELS: Record<UsageRange, string> = {
  current_cycle: "Current Billing Cycle",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

const TREND_META: Record<TrendMetric, { label: string; color: string; unit: string }> = {
  probes: { label: "Probe Executions", color: "#79ab5d", unit: "probes" },
  logMb: { label: "Log Ingestion (MB)", color: "#5185a5", unit: "MB" },
  agentRuns: { label: "AI Investigations", color: "#A871B7", unit: "runs" },
  agentTokens: { label: "LLM Tokens", color: "#6ba0c2", unit: "tokens" },
  mcpCalls: { label: "MCP Gateway Calls", color: "#f4ac45", unit: "calls" },
  notifications: { label: "Alert Notifications", color: "#e07a5f", unit: "alerts" },
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
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

function formatQuotaUsed(used: number, unit: string): string {
  if (unit === "GB" && used > 0 && used < 0.1) {
    const mb = used * 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(mb * 1024).toFixed(0)} KB`;
  }
  return `${used.toLocaleString()} ${unit}`;
}

function quotaColor(status: QuotaItem["status"]): "primary" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "critical":
      return "danger";
    case "warning":
      return "warning";
    case "unlimited":
      return "neutral";
    default:
      return "primary";
  }
}

interface QuotaRowProps {
  quota: QuotaItem;
  compact?: boolean;
}

const QuotaRow: FunctionComponent<QuotaRowProps> = ({ quota, compact }) => {
  const isUnlimited = quota.status === "unlimited" || quota.limit < 0;
  const clampedPct = Math.min(100, Math.max(0, quota.percent));

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography level={compact ? "body-xs" : "body-sm"} textColor="text.secondary">
          {quota.label}
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography level={compact ? "body-xs" : "body-sm"} fontWeight={600}>
            {formatQuotaUsed(quota.used, quota.unit)}
            {!isUnlimited && ` / ${quota.limit.toLocaleString()} ${quota.unit}`}
          </Typography>
          {isUnlimited ? (
            <Chip size="sm" variant="soft" color="neutral">
              Unlimited
            </Chip>
          ) : (
            <Chip size="sm" variant="soft" color={quotaColor(quota.status)}>
              {quota.percent.toFixed(0)}%
            </Chip>
          )}
        </Stack>
      </Stack>
      {!isUnlimited && (
        <LinearProgress
          determinate
          value={clampedPct}
          color={quotaColor(quota.status)}
          size="sm"
          sx={{ borderRadius: "sm" }}
        />
      )}
      {quota.projected !== undefined && !isUnlimited && (
        <Typography level="body-xs" textColor="text.tertiary">
          Projected end-of-cycle: {quota.projected.toLocaleString()} {quota.unit}
        </Typography>
      )}
    </Stack>
  );
};

interface StatPillProps {
  label: string;
  value: string | number;
}

const StatPill: FunctionComponent<StatPillProps> = ({ label, value }) => (
  <Box
    sx={{
      p: 1.25,
      borderRadius: "sm",
      bgcolor: "background.level1",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Typography level="body-xs" textColor="text.tertiary">
      {label}
    </Typography>
    <Typography level="title-md" sx={{ mt: 0.25 }}>
      {typeof value === "number" ? formatCompact(value) : value}
    </Typography>
  </Box>
);

function enforcementChipColor(
  state: QuotaEnforcementState,
): "neutral" | "warning" | "danger" | "primary" | "success" {
  switch (state) {
    case "THROTTLED":
      return "danger";
    case "GRACE":
    case "WARNING":
      return "warning";
    case "OVERAGE_BILLING":
      return "primary";
    default:
      return "success";
  }
}

function enforcementLabel(e: ProductEnforcementSummary): string {
  switch (e.state) {
    case "THROTTLED":
      return "Protection Mode";
    case "GRACE":
      return e.graceHoursRemaining !== undefined
        ? `Grace (${e.graceHoursRemaining}h left)`
        : "Grace Period";
    case "OVERAGE_BILLING":
      return "Pay-As-You-Go";
    case "WARNING":
      return "Warning (80%+)";
    default:
      return "Healthy";
  }
}

interface UsageTabProps {
  /** When embedded inside BillingTab, skips duplicate product quota cards and Manage Plan links. */
  embedded?: boolean;
}

const UsageTab: FunctionComponent<UsageTabProps> = ({ embedded = false }) => {
  const subdomainMode = getSubdomainMode();
  const scopedProduct: Exclude<ProductFilter, "all"> | null =
    subdomainMode === "monitoring"
      ? "monitoring"
      : subdomainMode === "agent-context"
        ? "pantomath"
        : null;

  const [range, setRange] = useState<UsageRange>("current_cycle");
  const [productFilter, setProductFilter] = useState<ProductFilter>(
    scopedProduct ?? "all",
  );
  const [trendMetric, setTrendMetric] = useState<TrendMetric>(
    scopedProduct === "pantomath" ? "mcpCalls" : "probes",
  );
  const [consumerTab, setConsumerTab] = useState<ConsumerTab>(
    scopedProduct === "pantomath" ? "pantomath" : "monitors",
  );
  const [draftAllowOverage, setDraftAllowOverage] = useState<boolean | null>(null);
  const [draftSpendCap, setDraftSpendCap] = useState<string | null>(null);

  const { data: usage, isPending, isError } = useTeamUsage(range);
  const { data: platformProducts } = usePlatformProducts();
  const updateOverage = useUpdateOverageSettings();
  const setActivePantomath = useSetActivePantomathProduct();

  const isProductVisible = (
    product: "monitoring" | "log_search" | "managed_agent" | "pantomath",
  ) => platformProducts?.products?.[product] !== false;

  const allowOverage = draftAllowOverage ?? usage?.overage?.allowOverage ?? false;
  const spendCapDollars =
    draftSpendCap ??
    (usage?.overage?.overageSpendCapCents
      ? String(Math.round(usage.overage.overageSpendCapCents / 100))
      : "");

  const enforcementByProduct = useMemo(() => {
    const map: Partial<Record<ProductEnforcementSummary["product"], ProductEnforcementSummary>> = {};
    for (const item of usage?.enforcement ?? []) {
      map[item.product] = item;
    }
    return map;
  }, [usage?.enforcement]);

  const handleSaveOverage = () => {
    const parsed = spendCapDollars.trim() ? Math.round(Number(spendCapDollars) * 100) : null;
    const capCents = parsed !== null && !Number.isNaN(parsed) && parsed > 0 ? parsed : null;
    updateOverage.mutate(
      { allowOverage, overageSpendCapCents: capCents },
      {
        onSuccess: () => {
          setDraftAllowOverage(null);
          setDraftSpendCap(null);
          enqueueSnackbar("Pay-as-you-go overage settings updated", { variant: "success" });
        },
        onError: (err) => {
          enqueueSnackbar(err.message || "Failed to update overage settings", { variant: "error" });
        },
      },
    );
  };

  const highUtilizationQuotas = useMemo(() => {
    if (!usage) return [];
    const all: QuotaItem[] =
      scopedProduct === "monitoring"
        ? [...usage.products.monitoring.quotas, usage.platform.teamSeats]
        : scopedProduct === "pantomath"
          ? [...usage.products.pantomath.quotas]
          : scopedProduct === "log_search"
            ? [...usage.products.logSearch.quotas]
            : scopedProduct === "managed_agent"
              ? [...usage.products.managedAgent.quotas]
              : [
                  ...usage.products.monitoring.quotas,
                  ...usage.products.logSearch.quotas,
                  ...usage.products.managedAgent.quotas,
                  ...usage.products.pantomath.quotas,
                  usage.platform.teamSeats,
                ];
    return all.filter((q) => q.status === "warning" || q.status === "critical");
  }, [usage, scopedProduct]);

  const chartSeries = useMemo(() => {
    if (!usage) return [];
    const meta = TREND_META[trendMetric];
    return [
      {
        name: meta.label,
        data: usage.timeseries.map((pt) =>
          trendMetric === "logMb"
            ? Math.round((pt.logBytes / (1024 * 1024)) * 100) / 100
            : pt[trendMetric],
        ),
      },
    ];
  }, [usage, trendMetric]);

  const chartOptions: ApexOptions = useMemo(() => {
    const meta = TREND_META[trendMetric];
    const categories = usage?.timeseries.map((pt) => pt.date) ?? [];
    return {
      chart: {
        type: "area",
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "Inter, sans-serif",
      },
      theme: { mode: "dark" },
      colors: [meta.color],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 95, 100],
        },
      },
      grid: {
        borderColor: "rgba(255, 255, 255, 0.08)",
        strokeDashArray: 4,
      },
      xaxis: {
        categories,
        labels: {
          rotate: -30,
          style: { colors: "#9fa6ad", fontSize: "11px" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#9fa6ad", fontSize: "11px" },
          formatter: (val: number) => formatCompact(Math.round(val)),
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val: number) => `${val.toLocaleString()} ${meta.unit}`,
        },
      },
    };
  }, [usage, trendMetric]);

  const handleExportCsv = () => {
    if (!usage) return;
    const header = [
      "date",
      "probes",
      "log_bytes",
      "log_events",
      "agent_runs",
      "agent_tokens",
      "mcp_calls",
      "notifications",
      "incidents",
    ];
    const rows = usage.timeseries.map((pt) => [
      pt.date,
      pt.probes,
      pt.logBytes,
      pt.logEvents,
      pt.agentRuns,
      pt.agentTokens,
      pt.mcpCalls,
      pt.notifications,
      pt.incidents,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `opsway-usage-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isPending) return <Placeholder />;

  if (isError || !usage) {
    return (
      <Alert color="danger" variant="soft">
        Failed to load usage metrics. Please refresh the page or try again shortly.
      </Alert>
    );
  }

  const { monitoring, logSearch, managedAgent, pantomath } = usage.products;
  const activeFilter: ProductFilter = scopedProduct ?? productFilter;
  const showProduct = (slug: ProductFilter) => {
    if (slug !== "all" && !isProductVisible(slug)) return false;
    return activeFilter === "all" || activeFilter === slug;
  };
  const scopedLabel =
    scopedProduct === "monitoring"
      ? "Opsway Monitoring"
      : scopedProduct === "pantomath"
        ? "Agent Context"
        : null;

  return (
    <Stack spacing={3}>
      {/* Header & Controls */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        gap={2}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography level={embedded ? "title-md" : "title-lg"}>
              {embedded
                ? scopedLabel
                  ? `${scopedLabel} Analytics, Trends & Overage Protection`
                  : "Platform Analytics, Trends & Overage Protection"
                : scopedLabel
                  ? `${scopedLabel} Usage & Quotas`
                  : "Platform Usage & Quotas"}
            </Typography>
            {!embedded && (
              <Chip size="sm" variant="soft" color="primary">
                {usage.plan === "TEAM" ? "PRO" : usage.plan} Plan
              </Chip>
            )}
            <Chip size="sm" variant="outlined" color="neutral">
              Resets in {usage.billingCycle.daysRemaining}d
            </Chip>
          </Stack>
          <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.5 }}>
            {scopedLabel
              ? `Consumption and quota status scoped to ${scopedLabel}.`
              : "Track consumption across Monitoring, Log Search, Autonomous Agents, and Agent Context."}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
          <Select
            size="sm"
            value={range}
            onChange={(_, val) => {
              if (val) setRange(val);
            }}
            sx={{ minWidth: 185 }}
          >
            {(Object.keys(RANGE_LABELS) as UsageRange[]).map((k) => (
              <Option key={k} value={k}>
                {RANGE_LABELS[k]}
              </Option>
            ))}
          </Select>

          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            startDecorator={<IoDownloadOutline />}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>

          {!embedded && (
            <Button
              size="sm"
              variant="soft"
              color="primary"
              component={Link}
              to="/settings/billing"
              startDecorator={<IoCardOutline />}
            >
              Manage Plan
            </Button>
          )}

          {!embedded && scopedProduct && (
            <Button
              size="sm"
              variant="outlined"
              color="primary"
              component="a"
              href="https://my.opsway.eu/settings/billing"
            >
              Full Platform Usage ↗
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Conditional High-Utilization Alert Banner */}
      {highUtilizationQuotas.length > 0 && (
        <Alert
          color={highUtilizationQuotas.some((q) => q.status === "critical") ? "danger" : "warning"}
          variant="soft"
          startDecorator={<IoWarningOutline size={20} />}
          endDecorator={
            <Button
              size="sm"
              variant="solid"
              color={highUtilizationQuotas.some((q) => q.status === "critical") ? "danger" : "warning"}
              component={Link}
              to="/settings/billing"
            >
              Upgrade Plan
            </Button>
          }
        >
          <Box>
            <Typography level="title-sm">Approaching plan quota limits</Typography>
            <Typography level="body-xs">
              {highUtilizationQuotas
                .map((q) => `${q.label} (${q.used}/${q.limit} ${q.unit}, ${q.percent.toFixed(0)}%)`)
                .join(" · ")}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Product Filter Tabs (Hub-only when standalone; BillingTab already renders all 4 product cards) */}
      {!embedded && !scopedProduct && (
        <Tabs
          value={productFilter}
          onChange={(_, val) => setProductFilter(val as ProductFilter)}
          sx={{ bgcolor: "transparent" }}
        >
          <TabList variant="plain" size="sm" sx={{ gap: 0.5 }}>
            <Tab value="all">All Products</Tab>
            {isProductVisible("monitoring") && <Tab value="monitoring">Monitoring</Tab>}
            {isProductVisible("log_search") && <Tab value="log_search">Log-Search</Tab>}
            {isProductVisible("managed_agent") && <Tab value="managed_agent">AI Agents &amp; MCP</Tab>}
            {isProductVisible("pantomath") && <Tab value="pantomath">Agent Context</Tab>}
          </TabList>
        </Tabs>
      )}

      {/* Modular Product Usage Cards (shown when standalone; BillingTab renders them in unified view) */}
      {!embedded && (
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns:
            productFilter === "all"
              ? { xs: "1fr", lg: "repeat(2, 1fr)" }
              : "1fr",
        }}
      >
        {/* 1. Monitoring */}
        {showProduct("monitoring") && (
          <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box sx={{ p: 1, borderRadius: "sm", bgcolor: "rgba(121, 171, 93, 0.14)", color: "#79ab5d" }}>
                  <IoPulseOutline size={18} />
                </Box>
                <Box>
                  <Typography level="title-md">Opsway Monitoring</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Probes, heartbeats, alerting &amp; status pages
                  </Typography>
                </Box>
              </Stack>
              <Chip size="sm" variant="soft" color="success">
                {monitoring.tier}
              </Chip>
            </Stack>

            <Stack spacing={1.5}>
              {monitoring.quotas.map((q) => (
                <QuotaRow key={q.key} quota={q} />
              ))}
            </Stack>

            <Divider />

            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
              <StatPill label="Probe Executions" value={monitoring.probeExecutions} />
              <StatPill label="Heartbeats" value={monitoring.activeHeartbeats} />
              <StatPill label="Alerts Sent" value={monitoring.notificationsSent} />
              <StatPill label="Incidents" value={monitoring.incidentsOpened} />
              <StatPill label="Page Subscribers" value={monitoring.statusPageSubscribers} />
            </Box>
          </Card>
        )}

        {/* 2. Autonomous Agents & MCP */}
        {showProduct("managed_agent") && (
          <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box sx={{ p: 1, borderRadius: "sm", bgcolor: "rgba(168, 113, 183, 0.16)", color: "#A871B7" }}>
                  <IoSparklesOutline size={18} />
                </Box>
                <Box>
                  <Typography level="title-md">Autonomous Agents &amp; MCP</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Managed AI RCA, BYOA runs, tokens &amp; MCP gateway
                  </Typography>
                </Box>
              </Stack>
              <Chip size="sm" variant="soft" color="primary">
                {managedAgent.tier}
              </Chip>
            </Stack>

            <Stack spacing={1.5}>
              {managedAgent.quotas.map((q) => (
                <QuotaRow key={q.key} quota={q} />
              ))}
            </Stack>

            <Divider />

            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
              <StatPill label="LLM Tokens" value={managedAgent.tokensUsed} />
              <StatPill label="MCP Tool Calls" value={managedAgent.mcpCalls} />
              <StatPill label="BYO / Webhook Runs" value={managedAgent.byoaRuns} />
              <StatPill
                label="Remediations"
                value={`${managedAgent.remediationsExecuted}/${managedAgent.remediationsSuggested}`}
              />
              <StatPill
                label="Avg Duration"
                value={managedAgent.avgDurationMs > 0 ? `${(managedAgent.avgDurationMs / 1000).toFixed(1)}s` : "—"}
              />
            </Box>
          </Card>
        )}

        {/* 3. Log-Search */}
        {showProduct("log_search") && (
          <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box sx={{ p: 1, borderRadius: "sm", bgcolor: "rgba(81, 133, 165, 0.16)", color: "#6ba0c2" }}>
                  <PiTerminalWindowBold size={18} />
                </Box>
                <Box>
                  <Typography level="title-md">Opsway Log-Search</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    OTLP ingestion, SQL/LogQL &amp; Milvus semantic search
                  </Typography>
                </Box>
              </Stack>
              <Chip size="sm" variant="soft" color="primary">
                {logSearch.tier}
              </Chip>
            </Stack>

            <Stack spacing={1.5}>
              {logSearch.quotas.map((q) => (
                <QuotaRow key={q.key} quota={q} />
              ))}
            </Stack>

            <Divider />

            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
              <StatPill label="Events Ingested" value={logSearch.eventsIngested} />
              <StatPill label="Data Ingested" value={formatBytes(logSearch.bytesIngested)} />
              <StatPill label="Active Services" value={logSearch.activeServices} />
              <StatPill label="Log Trigger Rules" value={logSearch.triggerRules} />
              <StatPill label="Log-Triggered RCA" value={logSearch.logTriggeredInvestigations} />
            </Box>
          </Card>
        )}

        {/* 4. Pantomath */}
        {showProduct("pantomath") && (
          <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box sx={{ p: 1, borderRadius: "sm", bgcolor: "rgba(244, 172, 69, 0.14)", color: "#f4ac45" }}>
                  <IoCodeSlashOutline size={18} />
                </Box>
                <Box>
                  <Typography level="title-md">Agent Context</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Git AST parsing, Kustomize topology &amp; GraphRAG
                  </Typography>
                </Box>
              </Stack>
              <Chip size="sm" variant="soft" color="warning">
                {pantomath.tier}
              </Chip>
            </Stack>

            <Stack spacing={1.5}>
              {pantomath.quotas.map((q) => (
                <QuotaRow key={q.key} quota={q} />
              ))}
            </Stack>

            <Divider />

            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
              <StatPill label="Indexed Repos" value={pantomath.linkedRepositories} />
              <StatPill label="Vector Chunks" value={pantomath.vectorChunks} />
              <StatPill label="Graph Edges" value={pantomath.graphEdges} />
              <StatPill label="GraphRAG Queries" value={pantomath.queriesExecuted} />
              <StatPill label="Deploy-Triggered RCA" value={pantomath.pantomathTriggeredInvestigations} />
            </Box>
          </Card>
        )}
      </Box>
      )}

      {/* Daily Consumption Trend Chart */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1.5}
        >
          <Box>
            <Typography level="title-md">Daily Consumption Trend</Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              {RANGE_LABELS[range]} ({usage.timeseries.length} days)
            </Typography>
          </Box>
          <Select
            size="sm"
            value={trendMetric}
            onChange={(_, val) => {
              if (val) setTrendMetric(val);
            }}
            sx={{ minWidth: 200 }}
          >
            {(Object.keys(TREND_META) as TrendMetric[]).map((m) => (
              <Option key={m} value={m}>
                {TREND_META[m].label}
              </Option>
            ))}
          </Select>
        </Stack>

        <Box sx={{ width: "100%", minHeight: 260 }}>
          <Chart options={chartOptions} series={chartSeries} type="area" height={260} />
        </Box>
      </Card>

      {/* Bottom Two-Column Section: Top Consumers & Platform Governance */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" },
          alignItems: "start",
        }}
      >
        {/* Top Consumers */}
        <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography level="title-md">Top Resource Consumers</Typography>
            <Tabs
              value={consumerTab}
              onChange={(_, val) => setConsumerTab(val as ConsumerTab)}
              sx={{ bgcolor: "transparent" }}
            >
              <TabList variant="soft" size="sm">
                {isProductVisible("monitoring") && <Tab value="monitors">Monitors</Tab>}
                {isProductVisible("log_search") && <Tab value="logServices">Log Services</Tab>}
                {isProductVisible("pantomath") && <Tab value="pantomath">Agent Context</Tab>}
                {isProductVisible("managed_agent") && <Tab value="triggers">Agent Triggers</Tab>}
                {isProductVisible("managed_agent") && <Tab value="services">AI Services</Tab>}
              </TabList>
            </Tabs>
          </Stack>

          <Sheet variant="outlined" sx={{ borderRadius: "sm", overflow: "auto" }}>
            {consumerTab === "monitors" && (
              <Table size="sm" hoverRow>
                <thead>
                  <tr>
                    <th>Monitor</th>
                    <th style={{ textAlign: "right" }}>Probes</th>
                    <th style={{ textAlign: "right" }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.topConsumers.monitors.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <Typography level="body-xs" textColor="text.tertiary" textAlign="center" py={2}>
                          No probe executions recorded in this period.
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    usage.topConsumers.monitors.map((m) => (
                      <tr key={m.monitorId}>
                        <td>{m.name}</td>
                        <td style={{ textAlign: "right" }}>{m.probes.toLocaleString()}</td>
                        <td style={{ textAlign: "right" }}>{m.sharePct.toFixed(1)}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}

            {consumerTab === "logServices" && (
              <Table size="sm" hoverRow>
                <thead>
                  <tr>
                    <th>Log Service</th>
                    <th style={{ textAlign: "right" }}>Events</th>
                    <th style={{ textAlign: "right" }}>Volume</th>
                    <th style={{ textAlign: "right" }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {(usage.topConsumers.logServices?.length ?? 0) === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <Typography level="body-xs" textColor="text.tertiary" textAlign="center" py={2}>
                          No log ingestion recorded in this period.
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    usage.topConsumers.logServices.map((ls) => (
                      <tr key={ls.serviceName}>
                        <td>{ls.serviceName}</td>
                        <td style={{ textAlign: "right" }}>{formatCompact(ls.events)}</td>
                        <td style={{ textAlign: "right" }}>{formatBytes(ls.bytes)}</td>
                        <td style={{ textAlign: "right" }}>{ls.sharePct.toFixed(1)}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}

            {consumerTab === "pantomath" && (
              <Table size="sm" hoverRow>
                <thead>
                  <tr>
                    <th>Indexed Product</th>
                    <th style={{ textAlign: "right" }}>Repos</th>
                    <th style={{ textAlign: "right" }}>Vector Chunks</th>
                    <th style={{ textAlign: "right" }}>Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(usage.topConsumers.pantomathProducts?.length ?? 0) === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <Typography level="body-xs" textColor="text.tertiary" textAlign="center" py={2}>
                          No Agent Context products indexed yet.
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    usage.topConsumers.pantomathProducts.map((pm) => {
                      const isScheduledDelete = pm.status === "scheduled_delete";
                      const daysLeft = pm.deleteAt
                        ? Math.max(
                            0,
                            Math.ceil(
                              (new Date(pm.deleteAt).getTime() - new Date(usage.rangeEnd).getTime()) /
                                (1000 * 60 * 60 * 24),
                            ),
                          )
                        : 7;
                      return (
                        <tr key={pm.product}>
                          <td>{pm.product}</td>
                          <td style={{ textAlign: "right" }}>{pm.repoCount.toLocaleString()}</td>
                          <td style={{ textAlign: "right" }}>{formatCompact(pm.vectorChunks)}</td>
                          <td style={{ textAlign: "right" }}>
                            {isScheduledDelete ? (
                              <Chip size="sm" variant="soft" color="danger">
                                Locked · Deletes in {daysLeft}d
                              </Chip>
                            ) : (
                              <Chip
                                size="sm"
                                variant="soft"
                                color={pm.source === "indexed" ? "success" : "neutral"}
                              >
                                {pm.source === "indexed" ? "Searchable" : pm.source}
                              </Chip>
                            )}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {isScheduledDelete ? (
                              <Button
                                size="sm"
                                variant="soft"
                                color="primary"
                                loading={
                                  setActivePantomath.isPending &&
                                  setActivePantomath.variables === pm.product
                                }
                                onClick={() =>
                                  setActivePantomath.mutate(pm.product, {
                                    onSuccess: () =>
                                      enqueueSnackbar(
                                        `Switched active Agent Context product to ${pm.product}`,
                                        { variant: "success" },
                                      ),
                                  })
                                }
                              >
                                Keep This
                              </Button>
                            ) : (
                              <Typography level="body-xs" textColor="text.tertiary">
                                Active
                              </Typography>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            )}

            {consumerTab === "triggers" && (
              <Table size="sm" hoverRow>
                <thead>
                  <tr>
                    <th>Trigger Source</th>
                    <th style={{ textAlign: "right" }}>Runs</th>
                    <th style={{ textAlign: "right" }}>Tokens</th>
                    <th style={{ textAlign: "right" }}>Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.topConsumers.agentTriggers.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <Typography level="body-xs" textColor="text.tertiary" textAlign="center" py={2}>
                          No agent investigations recorded in this period.
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    usage.topConsumers.agentTriggers.map((tr) => (
                      <tr key={tr.triggerSource}>
                        <td>
                          <Chip size="sm" variant="soft" color="neutral">
                            {tr.triggerSource}
                          </Chip>
                        </td>
                        <td style={{ textAlign: "right" }}>{tr.runs.toLocaleString()}</td>
                        <td style={{ textAlign: "right" }}>{formatCompact(tr.tokensUsed)}</td>
                        <td style={{ textAlign: "right" }}>
                          {tr.avgDurationMs > 0 ? `${(tr.avgDurationMs / 1000).toFixed(1)}s` : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}

            {consumerTab === "services" && (
              <Table size="sm" hoverRow>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th style={{ textAlign: "right" }}>Investigations</th>
                    <th style={{ textAlign: "right" }}>Tokens Used</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.topConsumers.services.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <Typography level="body-xs" textColor="text.tertiary" textAlign="center" py={2}>
                          No service-attributed investigations in this period.
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    usage.topConsumers.services.map((svc) => (
                      <tr key={svc.serviceName}>
                        <td>{svc.serviceName}</td>
                        <td style={{ textAlign: "right" }}>{svc.runs.toLocaleString()}</td>
                        <td style={{ textAlign: "right" }}>{formatCompact(svc.tokensUsed)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Sheet>
        </Card>

        {/* Platform & Governance Quotas */}
        <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 2 }}>
          <Typography level="title-md">Platform &amp; Governance</Typography>

          <QuotaRow quota={usage.platform.teamSeats} />
          <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: -1 }}>
            {usage.platform.activeMembers} active members · {usage.platform.pendingInvitations} pending invites
          </Typography>

          <Divider />

          <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(2, 1fr)" }}>
            <StatPill label="Service Catalog" value={usage.platform.serviceCatalogCount} />
            <StatPill label="Active API Keys" value={usage.platform.activeApiKeys} />
            <StatPill label="Reports Generated" value={usage.platform.reportsGenerated} />
            <StatPill label="Active Trigger Rules" value={managedAgent.activeTriggerRules} />
          </Box>
        </Card>
      </Box>

      {/* Pay-As-You-Go Overage & Grace Policy */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", gap: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={2}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={{ p: 1, borderRadius: "sm", bgcolor: "rgba(107, 160, 194, 0.16)", color: "#6ba0c2" }}>
              <IoShieldCheckmarkOutline size={20} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography level="title-md">Overage Protection &amp; Pay-As-You-Go</Typography>
                {usage.overage?.allowOverage && (
                  <Chip size="sm" variant="soft" color="primary">
                    Active · Est. ${((usage.overage.estimatedOverageCents || 0) / 100).toFixed(2)}
                  </Chip>
                )}
              </Stack>
              <Typography level="body-xs" textColor="text.secondary">
                {usage.overage?.eligible
                  ? "Paid plans include a 72h / +15% grace buffer. Enable Pay-As-You-Go to stay unthrottled past quota with an optional monthly spend cap."
                  : "Free plan includes a 24h / +10% grace buffer, then switches to zero-data-loss protection (cold log spillover, read-only Agent Context, BYO-LLM fallback). Upgrade to Team to unlock Pay-As-You-Go overages."}
              </Typography>
            </Box>
          </Stack>

          {usage.overage?.eligible ? (
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Switch
                checked={allowOverage}
                onChange={(e) => setDraftAllowOverage(e.target.checked)}
                endDecorator={
                  <Typography level="body-xs" fontWeight={600}>
                    Allow Overages
                  </Typography>
                }
              />
              {allowOverage && (
                <Input
                  size="sm"
                  type="number"
                  placeholder="Optional cap ($)"
                  startDecorator="$"
                  value={spendCapDollars}
                  onChange={(e) => setDraftSpendCap(e.target.value)}
                  sx={{ width: 150 }}
                />
              )}
              <Button
                size="sm"
                variant="solid"
                color="primary"
                loading={updateOverage.isPending}
                onClick={handleSaveOverage}
              >
                Save Policy
              </Button>
            </Stack>
          ) : (
            <Button
              size="sm"
              variant="soft"
              color="primary"
              component={Link}
              to="/settings/billing"
            >
              Upgrade for Pay-As-You-Go
            </Button>
          )}
        </Stack>

        {(usage.enforcement ?? []).some(
          (e) => e.state !== "NORMAL" && (!scopedProduct || e.product === scopedProduct),
        ) && (
          <>
            <Divider />
            <Stack spacing={1}>
              {(usage.enforcement ?? [])
                .filter(
                  (e) => e.state !== "NORMAL" && (!scopedProduct || e.product === scopedProduct),
                )
                .map((e) => (
                  <Stack
                    key={`${e.product}-${e.quotaKey}`}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={1}
                    sx={{ p: 1.25, borderRadius: "sm", bgcolor: "background.level1" }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography level="title-sm">{e.label}</Typography>
                        <Chip size="sm" variant="soft" color={enforcementChipColor(e.state)}>
                          {enforcementLabel(e)}
                        </Chip>
                      </Stack>
                      <Typography level="body-xs" textColor="text.secondary" sx={{ mt: 0.25 }}>
                        {e.behaviorSummary}
                      </Typography>
                    </Box>
                    {e.topConsumerHint && (
                      <Typography level="body-xs" textColor="text.tertiary">
                        {e.topConsumerHint}
                      </Typography>
                    )}
                  </Stack>
                ))}
            </Stack>
          </>
        )}

        <Typography level="body-xs" textColor="text.tertiary">
          Pay-as-you-go rates: €0.50 / GB Log-Search · €0.25 / Managed AI run · €1.00 / Monitor · €10.00 / Agent Context product.
          {(!scopedProduct || scopedProduct === "log_search") &&
          enforcementByProduct.log_search?.state === "THROTTLED"
            ? " Excess logs are currently preserved in cold storage."
            : ""}
        </Typography>
      </Card>
    </Stack>
  );
};

export default UsageTab;
