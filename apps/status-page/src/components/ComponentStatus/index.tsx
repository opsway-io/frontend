import { Box, Stack, Typography, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

interface ComponentStatusProps {
  idk?: string;
}

const ComponentStatus: FunctionComponent<ComponentStatusProps> = () => {
  const theme = useTheme();

  return (
    <Stack direction="column" spacing={1}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FaRegCheckCircle color={theme.palette.success.main} />

        <Typography
          variant="body1"
          fontWeight={800}
          marginRight="auto !important"
          marginLeft="8px !important"
        >
          Name of component
        </Typography>

        <Typography variant="body1" color="text.secondary">
          99.99% uptime
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        {new Array(80).fill(0).map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: "2rem",
              backgroundColor: randomColor(),
              borderRadius: 0.3,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

const randomColor = () => {
  const colors = ["success.main", "warning.main", "error.main"];

  // 99% chance of success
  if (Math.random() < 0.99) {
    return colors[0];
  }

  // 0.5% chance of warning
  if (Math.random() < 0.05) {
    return colors[1];
  }

  return colors[2];
};

export default ComponentStatus;
