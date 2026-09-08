import { Box, Stack, Typography, Tooltip } from "@mui/material";
import { FunctionComponent } from "react";
import dayjs from "dayjs";

interface ComponentStatusProps {
  name: string;
  status: string;
  layout: string;
  createdAt?: string;
  uptimePercentage?: number;
  dailyUptimes?: number[];
}

const ComponentStatus: FunctionComponent<ComponentStatusProps> = ({
  name,
  status,
  layout,
  createdAt,
  uptimePercentage,
  dailyUptimes,
}) => {
  const isOperational = status === "OPERATIONAL";
  const statusColor = isOperational ? "#10b981" : "#f43f5e";
  const statusText = isOperational ? "Operational" : "Outage";

  let displayDays = 90;
  if (createdAt) {
    const createdDate = dayjs(createdAt);
    const now = dayjs();
    let daysDiff = now.diff(createdDate, "day");
    if (isNaN(daysDiff) || daysDiff < 1) daysDiff = 1;
    displayDays = Math.min(daysDiff, 90);
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime === -1) return "#9ca3af"; // Gray
    if (uptime >= 99.9) return "#10b981"; // Emerald
    if (uptime <= 90) return "#f43f5e"; // Rose

    const parseHex = (hex: string) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];

    const interpolate = (c1: number[], c2: number[], factor: number) => {
      const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
      const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
      const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const red = parseHex("#f43f5e");
    const yellow = parseHex("#f59e0b");
    const green = parseHex("#10b981");

    if (uptime < 99) {
      const factor = (uptime - 90) / 9; // 90 to 99
      return interpolate(red, yellow, factor);
    } else {
      const factor = (uptime - 99) / 0.9; // 99 to 99.9
      return interpolate(yellow, green, factor);
    }
  };

  const chartDays = new Array(displayDays).fill(0).map((_, index) => {
    // Determine how many days ago this box represents (0 = today)
    const daysAgo = displayDays - 1 - index;
    // Get the uptime from the backend array, or default to 100
    // Backend array is ordered ASC (oldest first). So the last element is today.
    let uptime = 100;
    if (dailyUptimes && dailyUptimes.length > 0) {
      // Find the element from the end
      const arrIndex = dailyUptimes.length - 1 - daysAgo;
      if (arrIndex >= 0 && arrIndex < dailyUptimes.length) {
        uptime = dailyUptimes[arrIndex];
      }
    } else {
      // If no data, use current status color
      uptime = isOperational ? 100 : 0;
    }

    const date = dayjs().subtract(daysAgo, "day").format("MMM D, YYYY");
    let title = `${date}: ${uptime.toFixed(1)}% uptime`;
    if (uptime === -1) {
      title = `${date}: No data`;
    }
    const color = getUptimeColor(uptime);

    return { color, title, uptime };
  });

  const uptimeText =
    uptimePercentage != null
      ? `${uptimePercentage.toFixed(2)}% uptime (90 days)`
      : "100.00% uptime (90 days)";

  return (
    <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography
          variant="body1"
          fontWeight={600}
          marginRight="auto !important"
          sx={{ fontSize: "1.05rem" }}
        >
          {name}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2" color={statusColor} fontWeight={600}>
            {statusText}
          </Typography>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: statusColor,
              boxShadow: `0 0 10px ${statusColor}`,
              animation: !isOperational ? "pulse 2s infinite" : "none",
            }}
          />
        </Stack>
      </Stack>

      {layout !== "COMPACT" && (
        <Stack direction="column" spacing={1}>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ width: "100%", overflow: "hidden" }}
          >
            {chartDays.map((dayData, index) => (
              <Tooltip key={index} title={dayData.title} arrow placement="top">
                <Box
                  sx={{
                    flex: 1,
                    height: "2rem",
                    backgroundColor: dayData.color,
                    borderRadius: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 0.7,
                      transform: "scaleY(1.2)",
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.6 }}
            >
              {displayDays} {displayDays === 1 ? "day" : "days"} ago
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.6 }}
            >
              {uptimeText}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.6 }}
            >
              Today
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ComponentStatus;
