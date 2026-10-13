import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoAdd, IoCloudUploadOutline, IoPulse } from "react-icons/io5";
import { NavLink } from "react-router-dom";

interface MonitorsEmptyStateProps {
  onImportClick: () => void;
}

const MonitorsEmptyState: FunctionComponent<MonitorsEmptyStateProps> = (
  props,
) => {
  return (
    <Sheet
      variant="plain"
      sx={{
        borderRadius: "xl",
        border: "1px dashed",
        borderColor: "neutral.outlinedBorder",
        bgcolor: "transparent",
        px: { xs: 3, md: 6 },
        py: { xs: 6, md: 10 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "lg",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.level1",
          border: "1px solid",
          borderColor: "divider",
          color: "semantic.monitors",
          fontSize: 22,
          mb: 0.5,
        }}
      >
        <IoPulse />
      </Box>

      <Typography level="title-lg">You don't have any monitors yet</Typography>

      <Typography
        level="body-sm"
        textColor="text.secondary"
        sx={{ maxWidth: 440 }}
      >
        Monitors are used to check the availability of your services. You can
        create a monitor for a website, API, or any other service that you want
        to monitor.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ pt: 1.5 }}
      >
        <Button
          startDecorator={<IoAdd />}
          component={NavLink}
          to="/monitors/create"
        >
          Create monitor
        </Button>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<IoCloudUploadOutline />}
          onClick={props.onImportClick}
        >
          Import from OpenAPI
        </Button>
      </Stack>
    </Sheet>
  );
};

export default MonitorsEmptyState;
