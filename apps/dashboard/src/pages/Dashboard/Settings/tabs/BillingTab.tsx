import { Alert, Box, Button, Stack, Typography } from "@mui/joy";
import {
  BillingEntitlementTier,
  BillingProductSlug,
  ProductBillingShell,
  ProductUsageCard,
  ShellQuotaItem,
  ShellStatItem,
} from "@opsway/shell";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useMemo } from "react";
import { IoOpenOutline } from "react-icons/io5";
import type { TeamUsageResponse } from "../../../../api/endpoints/suite";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { usePlatformProducts } from "../../../../hooks/platform.query";
import {
  useEntitlements,
  useTeamUsage,
  useUpdateEntitlement,
} from "../../../../hooks/suite.query";
import {
  useBillingSummary,
  useChangePlan,
  useCurrentTeam,
  useGetProducts,
  useOpenCustomerPortal,
  useResumeSubscription,
  useUpsertProductAddon,
} from "../../../../hooks/team.query";
import { getSubdomainMode } from "../../../../routes/subdomain";
import { FREE_PLAN, normalizePlanId, toBillingPlans } from "../billingPlans";
import PricingCard from "../components/PricingCard";
import UsageTab from "./UsageTab";

const PRODUCT_META: Record<
  BillingProductSlug,
  { title: string; description: string; accentColor: string }
> = {
  monitoring: {
    title: "Opsway Monitoring",
    description:
      "Multi-location probes, IsolationForest anomaly detection, status pages, and on-call alerting.",
    accentColor: "#79ab5d",
  },
  log_search: {
    title: "Opsway Log Search",
    description:
      "Milvus vector & SQL log engine, OTLP log ingestion, semantic log search, and built-in MCP server.",
    accentColor: "#5185a5",
  },
  pantomath: {
    title: "Agent Context",
    description:
      "Git AST parsing & Kubernetes manifest property graph for line-level root-cause diagnosis.",
    accentColor: "#2dd4bf",
  },
  managed_agent: {
    title: "Autonomous Agents",
    description:
      "Managed AI SRE investigations, Unified MCP Gateway (/v1/mcp), and automated remediation.",
    accentColor: "#a871b7",
  },
};

function getProductQuotasAndStats(
  product: BillingProductSlug,
  usage?: TeamUsageResponse,
): { quotas: ShellQuotaItem[]; stats: ShellStatItem[] } {
  if (!usage) return { quotas: [], stats: [] };

  switch (product) {
    case "monitoring":
      return {
        quotas: [
          ...usage.products.monitoring.quotas,
          usage.platform.teamSeats,
        ],
        stats: [
          { label: "Probe Executions", value: usage.products.monitoring.probeExecutions },
          { label: "Active Heartbeats", value: usage.products.monitoring.activeHeartbeats },
          { label: "Incidents Opened", value: usage.products.monitoring.incidentsOpened },
          { label: "Notifications Sent", value: usage.products.monitoring.notificationsSent },
        ],
      };
    case "log_search":
      return {
        quotas: usage.products.logSearch.quotas,
        stats: [
          { label: "Events Ingested", value: usage.products.logSearch.eventsIngested },
          { label: "Active Services", value: usage.products.logSearch.activeServices },
          { label: "Trigger Rules", value: usage.products.logSearch.triggerRules },
          { label: "Log-Triggered RCAs", value: usage.products.logSearch.logTriggeredInvestigations },
        ],
      };
    case "pantomath":
      return {
        quotas: usage.products.pantomath.quotas,
        stats: [
          { label: "Linked Repos", value: usage.products.pantomath.linkedRepositories },
          { label: "Vector Chunks", value: usage.products.pantomath.vectorChunks },
          { label: "Graph Edges", value: usage.products.pantomath.graphEdges },
          { label: "Queries Executed", value: usage.products.pantomath.queriesExecuted },
        ],
      };
    case "managed_agent":
      return {
        quotas: usage.products.managedAgent.quotas,
        stats: [
          { label: "Managed Runs", value: usage.products.managedAgent.managedRuns },
          { label: "BYOA Runs", value: usage.products.managedAgent.byoaRuns },
          { label: "LLM Tokens Used", value: usage.products.managedAgent.tokensUsed },
          { label: "MCP Calls", value: usage.products.managedAgent.mcpCalls },
        ],
      };
  }
}

const ALL_PRODUCTS: BillingProductSlug[] = [
  "monitoring",
  "log_search",
  "pantomath",
  "managed_agent",
];

const BillingTab: FunctionComponent = () => {
  const subdomainMode = getSubdomainMode();
  const scopedProduct: BillingProductSlug | null =
    subdomainMode === "monitoring"
      ? "monitoring"
      : subdomainMode === "agent-context"
        ? "pantomath"
        : null;

  const { data: team, isPending: isLoadingTeam } = useCurrentTeam();
  const { data: productsData, isPending: isLoadingProducts } = useGetProducts();
  const { data: billingSummary } = useBillingSummary();
  const { data: entitlementsData } = useEntitlements();
  const { data: usageData } = useTeamUsage("current_cycle");
  const { data: platformProducts } = usePlatformProducts();

  const changePlan = useChangePlan();
  const customerPortal = useOpenCustomerPortal();
  const upsertAddon = useUpsertProductAddon();
  const resumeSub = useResumeSubscription();
  const updateEntitlement = useUpdateEntitlement();

  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/settings/billing`
      : undefined;

  const enforcementByProduct = useMemo(() => {
    const map: Partial<Record<BillingProductSlug, TeamUsageResponse["enforcement"][number]>> = {};
    for (const item of usageData?.enforcement ?? []) {
      map[item.product] = item;
    }
    return map;
  }, [usageData?.enforcement]);

  if (isLoadingTeam || isLoadingProducts) return <Placeholder />;

  const isProductVisible = (product: BillingProductSlug) =>
    platformProducts?.products?.[product] !== false;

  const plans = toBillingPlans(productsData?.products);
  const currentPlanId = normalizePlanId(
    billingSummary?.paymentPlan ?? team?.paymentPlan,
  );
  const hasPaidPlan = currentPlanId !== FREE_PLAN.id;
  const canManageBilling = billingSummary?.canManageBilling ?? true;
  const subscription = billingSummary?.subscription ?? null;
  const entitlements =
    billingSummary?.entitlements ?? entitlementsData?.entitlements ?? [];
  const getEnt = (product: BillingProductSlug) =>
    entitlements.find((e) => e.product === product);
  const getAddonCatalog = (product: BillingProductSlug) =>
    billingSummary?.catalog?.addons?.find((a) => a.product === product);

  const isMutating =
    changePlan.isPending ||
    customerPortal.isPending ||
    upsertAddon.isPending ||
    resumeSub.isPending ||
    updateEntitlement.isPending;

  const selectPlan = (planId: string) => {
    changePlan.mutate(
      { plan: planId, returnUrl },
      {
        onSuccess: (checkoutUrl) => {
          if (checkoutUrl) {
            window.location.assign(checkoutUrl);
            return;
          }
          enqueueSnackbar(
            planId === FREE_PLAN.id
              ? "Subscription scheduled to cancel at end of billing period"
              : "Successfully updated subscription",
            { variant: "success" },
          );
        },
        onError: (error) => {
          enqueueSnackbar(error.message || "Failed to process plan change", {
            variant: "error",
          });
        },
      },
    );
  };

  const openCustomerPortal = () => {
    customerPortal.mutate(returnUrl, {
      onSuccess: (url) => {
        if (url) window.location.assign(url);
      },
      onError: () => {
        enqueueSnackbar("Failed to open the billing portal", {
          variant: "error",
        });
      },
    });
  };

  const handleResumeSubscription = () => {
    resumeSub.mutate(undefined, {
      onSuccess: () => {
        enqueueSnackbar("Subscription resumed", { variant: "success" });
      },
      onError: (error) => {
        enqueueSnackbar(error.message || "Failed to resume subscription", {
          variant: "error",
        });
      },
    });
  };

  const handleSelectAddon = (
    product: BillingProductSlug,
    tier: BillingEntitlementTier,
  ) => {
    upsertAddon.mutate(
      { product, tier, returnUrl },
      {
        onSuccess: (res) => {
          if (res?.checkoutUrl) {
            window.location.assign(res.checkoutUrl);
            return;
          }
          enqueueSnackbar(
            tier === "FREE"
              ? "Product add-on removed"
              : `Updated ${PRODUCT_META[product].title} to ${tier}`,
            { variant: "success" },
          );
        },
        onError: (error) => {
          enqueueSnackbar(error.message || "Failed to update product add-on", {
            variant: "error",
          });
        },
      },
    );
  };

  const handleToggleProduct = (product: BillingProductSlug, enabled: boolean) => {
    const ent = getEnt(product);
    updateEntitlement.mutate(
      { product, tier: ent?.tier ?? "FREE", enabled },
      {
        onSuccess: () => {
          enqueueSnackbar(
            `${PRODUCT_META[product].title} ${enabled ? "enabled" : "disabled"}`,
            { variant: "success" },
          );
        },
        onError: (error) => {
          enqueueSnackbar(error.message || "Failed to update product status", {
            variant: "error",
          });
        },
      },
    );
  };

  // Product-scoped billing view on standalone product subdomains
  // (monitoring.opsway.eu, agent-context.opsway.eu / pantomath.opsway.eu)
  if (scopedProduct) {
    const meta = PRODUCT_META[scopedProduct];
    const { quotas, stats } = getProductQuotasAndStats(scopedProduct, usageData);
    return (
      <Stack spacing={3}>
        <ProductBillingShell
          product={scopedProduct}
          title={meta.title}
          description={meta.description}
          accentColor={meta.accentColor}
          teamPlan={currentPlanId}
          subscription={subscription}
          entitlement={getEnt(scopedProduct)}
          quotas={quotas}
          stats={stats}
          enforcement={enforcementByProduct[scopedProduct]}
          addonCatalog={getAddonCatalog(scopedProduct)}
          canManageBilling={canManageBilling}
          isBusy={isMutating}
          hubBillingUrl="https://my.opsway.eu/settings/billing"
          hubUsageUrl="https://my.opsway.eu/settings/billing"
          onToggleEnabled={(enabled) => handleToggleProduct(scopedProduct, enabled)}
          onSelectAddonTier={(tier) => handleSelectAddon(scopedProduct, tier)}
          onOpenCustomerPortal={openCustomerPortal}
          onResumeSubscription={handleResumeSubscription}
        />
        <UsageTab embedded />
      </Stack>
    );
  }

  // Main Opsway Hub (my.opsway.eu / local): full cross-product Suite billing view
  const isCanceling = Boolean(subscription?.cancelAtPeriodEnd);
  const isPastDue = subscription?.status === "past_due";

  return (
    <Stack spacing={2.5}>
      {isPastDue && (
        <Alert
          color="danger"
          variant="soft"
          endDecorator={
            canManageBilling && (
              <Button size="sm" color="danger" onClick={openCustomerPortal}>
                Update Payment Method
              </Button>
            )
          }
        >
          Your subscription payment is past due. Please update your payment method in the billing portal.
        </Alert>
      )}

      {isCanceling && (
        <Alert
          color="warning"
          variant="soft"
          endDecorator={
            canManageBilling && (
              <Button
                size="sm"
                color="warning"
                loading={resumeSub.isPending}
                onClick={handleResumeSubscription}
              >
                Resume Subscription
              </Button>
            )
          }
        >
          Your subscription is scheduled to cancel at the end of the current billing period.
        </Alert>
      )}

      {!canManageBilling && (
        <Alert color="neutral" variant="soft">
          Only team owners can change subscriptions or manage payment methods.
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-end" }}
        gap={2}
      >
        <Box>
          <Typography level="title-lg">Opsway Suite Subscription</Typography>
          <Typography level="body-sm" textColor="text.secondary">
            Choose a base Suite plan across all Opsway products, or scale individual products below with modular add-ons.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {hasPaidPlan && (
            <Button
              variant="outlined"
              color="neutral"
              endDecorator={<IoOpenOutline />}
              loading={customerPortal.isPending}
              disabled={!canManageBilling}
              onClick={openCustomerPortal}
            >
              Manage subscription (billing portal)
            </Button>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          alignItems: "stretch",
        }}
      >
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            selected={currentPlanId === plan.id}
            isLoading={
              changePlan.isPending &&
              (typeof changePlan.variables === "string"
                ? changePlan.variables === plan.id
                : changePlan.variables?.plan === plan.id)
            }
            disabled={!canManageBilling || changePlan.isPending}
            onSelect={() => selectPlan(plan.id)}
          />
        ))}
      </Box>

      {/* Modular Product Suite Overview (Hub-only cross-product view) */}
      <Box sx={{ pt: 2 }}>
        <Typography level="title-md" mb={0.5}>
          Opsway Modular Product Suite — Live Usage, Quotas &amp; Add-ons
        </Typography>
        <Typography level="body-xs" textColor="text.tertiary" mb={2}>
          Every Opsway product works standalone on its Free tier, inherits your base Suite plan, or scales independently with a modular add-on.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
          }}
        >
          {ALL_PRODUCTS.filter(isProductVisible).map((product) => {
            const meta = PRODUCT_META[product];
            const { quotas, stats } = getProductQuotasAndStats(product, usageData);
            return (
              <ProductUsageCard
                key={product}
                product={product}
                title={meta.title}
                description={meta.description}
                accentColor={meta.accentColor}
                entitlement={getEnt(product)}
                quotas={quotas}
                stats={stats}
                enforcement={enforcementByProduct[product]}
                addonCatalog={getAddonCatalog(product)}
                canManageBilling={canManageBilling}
                isBusy={isMutating}
                onToggleEnabled={(enabled) => handleToggleProduct(product, enabled)}
                onSelectAddonTier={(tier) => handleSelectAddon(product, tier)}
              />
            );
          })}
        </Box>
      </Box>
      {/* Unified Platform Analytics, Trends, Top Consumers & Overage Protection */}
      <Box sx={{ pt: 1 }}>
        <UsageTab embedded />
      </Box>
    </Stack>
  );
};

export default BillingTab;
