import { Alert, Box, Button, Chip, IconButton, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import {
  IoClose,
  IoGitNetworkOutline,
  IoInformationCircleOutline,
  IoSparklesOutline,
  IoTerminalOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { IncidentInvestigation } from "../../api/endpoints/suite";
import { useEntitlements } from "../../hooks/suite.query";

interface AgentInsightsBannerProps {
  investigation?: IncidentInvestigation | null;
}

const AgentInsightsBanner: FunctionComponent<AgentInsightsBannerProps> = ({ investigation }) => {
  const { data: entData, isPending } = useEntitlements();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || isPending) {
    return null;
  }

  const entitlements = entData?.entitlements || [];
  const logSearchEnt = entitlements.find((e) => e.product === "log_search");
  const pantomathEnt = entitlements.find((e) => e.product === "pantomath");

  const logSearchDisabled = entitlements.length > 0 && (!logSearchEnt || !logSearchEnt.enabled);
  const pantomathDisabled = entitlements.length > 0 && (!pantomathEnt || !pantomathEnt.enabled);

  // Inspect completed investigation steps to detect when enabled products returned no matching data
  const isFinished =
    investigation &&
    (investigation.status === "COMPLETED" || investigation.status === "AWAITING_APPROVAL");

  let logSearchNoData = false;
  let pantomathNoData = false;

  if (isFinished && investigation) {
    const steps = investigation.steps || [];
    const logSteps = steps.filter(
      (s) => s.toolName?.startsWith("logs.") || s.serverName === "log-search-mcp"
    );
    const hasCorrelatedLogs = (investigation.correlatedLogs?.length || 0) > 0;
    const logsReturnedZero =
      logSteps.length === 0 ||
      logSteps.every(
        (s) =>
          s.status === "FAILED" ||
          s.outputSummary?.includes('"total_logs": 0') ||
          s.outputSummary?.includes('"total_returned": 0')
      );

    if (!logSearchDisabled && !hasCorrelatedLogs && logsReturnedZero) {
      logSearchNoData = true;
    }

    const pantoSteps = steps.filter(
      (s) => s.toolName?.startsWith("pantomath.") || s.serverName === "pantomath-mcp"
    );
    const pantoReturnedEmpty =
      pantoSteps.length === 0 ||
      pantoSteps.every(
        (s) =>
          s.status === "FAILED" ||
          s.outputSummary?.includes("No matching context was found")
      );

    if (!pantomathDisabled && pantoReturnedEmpty) {
      pantomathNoData = true;
    }
  }

  const showUpsell = logSearchDisabled || pantomathDisabled;
  const showOnboardingNudge = !showUpsell && (logSearchNoData || pantomathNoData);

  if (!showUpsell && !showOnboardingNudge) {
    return null;
  }

  return (
    <Alert
      variant="soft"
      color={showUpsell ? "primary" : "neutral"}
      sx={{
        alignItems: "flex-start",
        p: 2,
        border: "1px solid",
        borderColor: showUpsell ? "primary.outlinedBorder" : "divider",
      }}
      startDecorator={
        showUpsell ? <IoSparklesOutline size={20} /> : <IoInformationCircleOutline size={20} />
      }
      endDecorator={
        <IconButton
          variant="plain"
          size="sm"
          color="neutral"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
        >
          <IoClose size={16} />
        </IconButton>
      }
    >
      <Box sx={{ width: "100%" }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography level="title-sm">
              {showUpsell
                ? "Unlock Deeper Root-Cause Diagnostics for Your Autonomous Agent"
                : "Connect This Service for Richer Agent Context"}
            </Typography>
            {showUpsell && (
              <Chip size="sm" variant="outlined" color="primary">
                Opsway Suite
              </Chip>
            )}
          </Stack>

          <Typography level="body-xs" textColor="text.secondary">
            {showUpsell
              ? "Right now your agent is investigating with partial telemetry. Enabling the rest of the Opsway suite lets it correlate failures end-to-end:"
              : `This investigation for "${investigation?.serviceName || "this monitor"}" had limited cross-product context:`}
          </Typography>

          <Stack spacing={0.75} sx={{ pt: 0.25 }}>
            {(logSearchDisabled || logSearchNoData) && (
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Box sx={{ pt: 0.2, color: "primary.plainColor" }}>
                  <IoTerminalOutline size={15} />
                </Box>
                <Typography level="body-xs" textColor="text.secondary">
                  <strong>Opsway Log Search</strong>:{" "}
                  {logSearchDisabled
                    ? "Automatically inspect live error spikes, stack traces, and ±20 surrounding log lines instead of relying on external probe timings alone."
                    : "Returned 0 matching logs for this service. Map its ingested service label in the Service Catalog so the agent can correlate live error logs."}
                </Typography>
              </Stack>
            )}

            {(pantomathDisabled || pantomathNoData) && (
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Box sx={{ pt: 0.2, color: "primary.plainColor" }}>
                  <IoGitNetworkOutline size={15} />
                </Box>
                <Typography level="body-xs" textColor="text.secondary">
                  <strong>Pantomath Code Graph</strong>:{" "}
                  {pantomathDisabled
                    ? "Map failing endpoints to their owning Kubernetes deployments, pods, upstream dependencies, and exact source files for targeted remediation."
                    : "Found no matching codebase or cluster context. Link this monitor's repository and product in the Service Catalog so the agent knows which pods and dependencies to inspect."}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ pt: 0.5 }} flexWrap="wrap">
            {showUpsell ? (
              <Button
                component={Link}
                to="/settings/billing"
                size="sm"
                variant="solid"
                color="primary"
              >
                Enable Suite Add-ons
              </Button>
            ) : (
              <Button
                component={Link}
                to="/services"
                size="sm"
                variant="outlined"
                color="neutral"
              >
                Configure Service Catalog
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Alert>
  );
};

export default AgentInsightsBanner;
