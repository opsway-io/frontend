import { Box, Stack, Typography } from "@mui/material";
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

    let color = "#10b981"; // Emerald
    let title = `${uptime.toFixed(1)}% uptime`;

    if (uptime === -1) {
      color = "#9ca3af"; // Gray for no data
      title = "No data";
    } else if (uptime < 90) {
      color = "#f59e0b"; // Amber
    } else if (uptime < 50) {
      color = "#f43f5e"; // Rose
    }

    return { color, title, uptime };
  });

  let calculatedUptime = 100;
  const daysWithData = chartDays.filter((day) => day.uptime !== -1);
  if (daysWithData.length > 0) {
    const sum = daysWithData.reduce((acc, curr) => acc + curr.uptime, 0);
    calculatedUptime = sum / daysWithData.length;
  }

  const uptimeText = `${calculatedUptime.toFixed(2)}% uptime`;

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
              <Box
                key={index}
                title={dayData.title}
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

const getColor = (status: string) => {
  if (status === "OPERATIONAL") return "#10b981"; // Emerald
  return "#f43f5e"; // Rose
};

export default ComponentStatus;
