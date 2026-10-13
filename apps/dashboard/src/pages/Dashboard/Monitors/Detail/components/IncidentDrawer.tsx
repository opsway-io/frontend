import { Box, Drawer, IconButton, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoClose } from "react-icons/io5";
import IncidentDetailsContent from "../../../Incidents/Detail/components/IncidentDetailsContent";

interface IncidentDrawerProps {
  /** Incident to show; the drawer is closed when null. */
  incidentId: number | null;
  onClose: () => void;
}

const IncidentDrawer: FunctionComponent<IncidentDrawerProps> = (props) => {
  return (
    <Drawer
      anchor="right"
      open={props.incidentId !== null}
      onClose={props.onClose}
      slotProps={{
        content: {
          sx: {
            width: { xs: "100%", sm: 500, md: 600 },
            p: 3,
            bgcolor: "background.surface",
            borderLeft: "1px solid",
            borderColor: "divider",
          },
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography level="title-lg">Incident Details</Typography>
        <IconButton
          variant="plain"
          color="neutral"
          aria-label="Close"
          onClick={props.onClose}
        >
          <IoClose />
        </IconButton>
      </Stack>
      {props.incidentId !== null && (
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <IncidentDetailsContent incidentId={props.incidentId} />
        </Box>
      )}
    </Drawer>
  );
};

export default IncidentDrawer;
