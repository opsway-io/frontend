import { Box, Card, Chip, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import {
  MdNotificationsActive,
  MdOutlineMonitor,
  MdWarning,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { IAlertRule } from "../../../../api/endpoints/alerting";
import { parseChannels } from "../alertRules";

interface AlertRuleCardProps {
  rule: IAlertRule;
}

const AlertRuleCard: FunctionComponent<AlertRuleCardProps> = ({ rule }) => (
  <Card
    component={Link}
    to={`/alerting/${rule.id}`}
    sx={{
      textDecoration: "none",
      transition: "background-color 120ms, border-color 120ms",
      "&:hover": {
        bgcolor: "background.level1",
        borderColor: "neutral.outlinedBorder",
      },
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Typography level="title-md" textColor="text.primary">
          {rule.name}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ color: "text.tertiary" }}
        >
          {rule.condition === "monitor_down" ? (
            <MdOutlineMonitor size={16} />
          ) : (
            <MdWarning size={16} />
          )}
          <Typography level="body-sm" textColor="text.secondary">
            Condition:{" "}
            <Typography textColor="text.primary" fontWeight={500}>
              {rule.condition}
            </Typography>
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ color: "text.tertiary" }}
        >
          <MdNotificationsActive size={16} />
          <Typography level="body-xs" textColor="text.secondary">
            Channels:
          </Typography>
          {parseChannels(rule.channels).map((channel) => (
            <Chip key={channel} variant="outlined" color="neutral">
              {channel}
            </Chip>
          ))}
        </Stack>
      </Stack>
      <Box sx={{ flexShrink: 0 }}>
        <Chip variant="soft" color={rule.enabled ? "success" : "neutral"}>
          {rule.enabled ? "Enabled" : "Disabled"}
        </Chip>
      </Box>
    </Stack>
  </Card>
);

export default AlertRuleCard;
