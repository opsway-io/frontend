import { Stack, Typography, useTheme } from "@mui/joy";
import { FunctionComponent } from "react";
import PulseDot from "../../../../../components/PulseDot/PulseDot";
import { secondsHumanize } from "../../../../../utilities/time";
import { stripProtocolAndPath } from "../../../../../utilities/url";

interface MonitorStatusHeaderProps {
  url?: string;
  active: boolean;
  maintenance: boolean;
  frequencySeconds?: number;
}

/** Pulsing status dot, the monitored host and whether monitoring is active. */
const MonitorStatusHeader: FunctionComponent<MonitorStatusHeaderProps> = (
  props,
) => {
  const theme = useTheme();

  const getStatusText = () => {
    if (props.active && props.frequencySeconds) {
      return `Monitoring is active, checking every ${secondsHumanize(props.frequencySeconds)}`;
    }
    if (!props.active && !props.maintenance) {
      return "Monitoring is paused";
    }
    return null;
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <PulseDot
        color={
          props.active ? theme.palette.success[500] : theme.palette.neutral[500]
        }
      />

      <Stack sx={{ minWidth: 0 }}>
        <Typography level="h3" sx={{ wordBreak: "break-all" }}>
          {stripProtocolAndPath(props.url)}
        </Typography>
        <Typography level="body-sm" textColor="text.secondary">
          {getStatusText()}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default MonitorStatusHeader;
