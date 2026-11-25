import { Alert, Box, Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useTeamUsage } from "../../hooks/suite.query";

/**
 * Global top banner shown across the dashboard when any product enters GRACE or THROTTLED state.
 */
const QuotaBanner: FunctionComponent = () => {
  const { data: usage } = useTeamUsage("current_cycle");

  const activeAlerts = (usage?.enforcement ?? []).filter(
    (e) => e.state === "THROTTLED" || e.state === "GRACE",
  );

  if (activeAlerts.length === 0) return null;

  const isThrottled = activeAlerts.some((e) => e.state === "THROTTLED");
  const primary = activeAlerts.find((e) => e.state === "THROTTLED") ?? activeAlerts[0];

  return (
    <Alert
      color={isThrottled ? "danger" : "warning"}
      variant="soft"
      startDecorator={<IoWarningOutline size={18} />}
      sx={{
        borderRadius: 0,
        borderBottom: "1px solid",
        borderColor: isThrottled ? "danger.outlinedBorder" : "warning.outlinedBorder",
        py: 1,
        px: 2.5,
      }}
      endDecorator={
        <Stack direction="row" spacing={1} flexShrink={0}>
          <Button
            size="sm"
            variant="outlined"
            color={isThrottled ? "danger" : "warning"}
            component={Link}
            to="/settings/usage"
          >
            View Usage
          </Button>
          <Button
            size="sm"
            variant="solid"
            color={isThrottled ? "danger" : "warning"}
            component={Link}
            to="/settings/billing"
          >
            Upgrade Plan
          </Button>
        </Stack>
      }
    >
      <Box>
        <Typography level="title-sm">
          {primary.label} quota {isThrottled ? "exceeded" : "in grace period"}
          {primary.state === "GRACE" && primary.graceHoursRemaining !== undefined
            ? ` (${primary.graceHoursRemaining}h remaining)`
            : ""}
          {activeAlerts.length > 1 ? ` (+${activeAlerts.length - 1} more)` : ""}
        </Typography>
        <Typography level="body-xs">
          {primary.behaviorSummary}
          {primary.topConsumerHint ? ` · ${primary.topConsumerHint}` : ""}
        </Typography>
      </Box>
    </Alert>
  );
};

export default QuotaBanner;
