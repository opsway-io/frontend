import { Box, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";

interface ComponentStatusProps {
  name: string;
  status: string;
  layout: string;
}

const ComponentStatus: FunctionComponent<ComponentStatusProps> = ({
  name,
  status,
  layout,
}) => {

  const isOperational = status === "OPERATIONAL";
  const statusColor = isOperational ? "#10b981" : "#f43f5e";
  const statusText = isOperational ? "Operational" : "Outage";

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
          <Stack direction="row" spacing={0.5} sx={{ width: "100%", overflow: "hidden" }}>
            {new Array(90).fill(0).map((_, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  height: "2rem",
                  backgroundColor: getColor(status),
                  borderRadius: 0.5,
                  transition: "all 0.2s ease",
                  '&:hover': {
                    opacity: 0.7,
                    transform: "scaleY(1.2)"
                  }
                }}
              />
            ))}
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
              90 days ago
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
              99.99% uptime
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
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
