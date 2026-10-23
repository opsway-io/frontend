import { Box, Button, Stack, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { IoOpenOutline } from "react-icons/io5";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import {
  useChangePlan,
  useCurrentTeam,
  useGetProducts,
  useOpenCustomerPortal,
} from "../../../../hooks/team.query";
import { FREE_PLAN, toBillingPlans } from "../billingPlans";
import PricingCard from "../components/PricingCard";

const BillingTab: FunctionComponent = () => {
  const { data: team, isPending: isLoadingTeam } = useCurrentTeam();
  const { data: productsData, isPending: isLoadingProducts } = useGetProducts();
  const changePlan = useChangePlan();
  const customerPortal = useOpenCustomerPortal();

  if (isLoadingTeam || isLoadingProducts) return <Placeholder />;

  const plans = toBillingPlans(productsData?.products);
  const hasPaidPlan = !!team?.paymentPlan && team.paymentPlan !== FREE_PLAN.id;

  const selectPlan = (planId: string) => {
    changePlan.mutate(planId, {
      onSuccess: (checkoutUrl) => {
        // New subscriptions are completed in Stripe Checkout.
        if (checkoutUrl) {
          window.location.assign(checkoutUrl);
          return;
        }

        enqueueSnackbar(
          planId === FREE_PLAN.id
            ? "Successfully cancelled subscription"
            : "Successfully updated subscription",
          { variant: "success" },
        );
      },
      onError: (error) => {
        enqueueSnackbar(error.message || "Failed to process plan change", {
          variant: "error",
        });
      },
    });
  };

  const openCustomerPortal = () => {
    customerPortal.mutate(undefined, {
      onSuccess: (url) => window.location.assign(url),
      onError: () => {
        enqueueSnackbar("Failed to open the billing portal", {
          variant: "error",
        });
      },
    });
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-end" }}
        gap={2}
      >
        <Box>
          <Typography level="title-lg">Choose a subscription</Typography>
          <Typography level="body-sm" textColor="text.secondary">
            Pick the plan that fits your team. You can change it at any time.
          </Typography>
        </Box>
        {hasPaidPlan && (
          <Button
            variant="outlined"
            color="neutral"
            endDecorator={<IoOpenOutline />}
            loading={customerPortal.isPending}
            onClick={openCustomerPortal}
          >
            Manage subscription (billing portal)
          </Button>
        )}
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
            selected={team?.paymentPlan === plan.id}
            isLoading={changePlan.isPending && changePlan.variables === plan.id}
            disabled={changePlan.isPending}
            onSelect={() => selectPlan(plan.id)}
          />
        ))}
      </Box>

      {/* Modular Product Suite Overview */}
      <Box sx={{ pt: 2 }}>
        <Typography level="title-md" mb={0.5}>
          Opsway Modular Product Suite &amp; Agent Entitlements
        </Typography>
        <Typography level="body-xs" textColor="text.tertiary" mb={2}>
          Every Opsway product works standalone with its own free tier or combines into a unified ecosystem via the Unified MCP Gateway.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.surface", border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography level="title-sm">Opsway Monitoring</Typography>
              <Chip size="sm" variant="soft" color="success">Active</Chip>
            </Stack>
            <Typography level="body-xs" textColor="text.secondary">
              Multi-location probes, IsolationForest anomaly detection, status pages, and on-call alerting.
            </Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.surface", border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography level="title-sm">Opsway Log-Search</Typography>
              <Chip size="sm" variant="soft" color="info">Active</Chip>
            </Stack>
            <Typography level="body-xs" textColor="text.secondary">
              Milvus vector &amp; SQL log engine, OTLP log ingestion, semantic log search, and built-in MCP server.
            </Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.surface", border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography level="title-sm">Pantomath Code Graph</Typography>
              <Chip size="sm" variant="soft" color="warning">Ready</Chip>
            </Stack>
            <Typography level="body-xs" textColor="text.secondary">
              Git AST parsing &amp; Kubernetes manifest property graph for line-level root-cause diagnosis.
            </Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.surface", border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography level="title-sm">Autonomous Agent (BYOA)</Typography>
              <Chip size="sm" variant="soft" color="primary">Included</Chip>
            </Stack>
            <Typography level="body-xs" textColor="text.secondary">
              Unified MCP Gateway (`/v1/mcp`) &amp; outbound signed webhooks to connect Claude, Cursor, or custom agents.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default BillingTab;
