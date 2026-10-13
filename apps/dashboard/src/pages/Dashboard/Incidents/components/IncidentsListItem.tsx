import {
  Box,
  Card,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import moment from "moment";
import { FunctionComponent } from "react";
import { IoCheckmark, IoStatsChart } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";
import { MonitorIncident } from "../../../../api/endpoints/incidents";
import { useSolveIncident } from "../../../../hooks/incidents.query";

interface IncidentsListItemProps {
  incident: MonitorIncident;
}

/** Link to the monitor page zoomed in on the incident's timeframe. */
const monitorTimeframeUrl = (incident: MonitorIncident) => {
  const start = moment(incident.createdAt).subtract(1, "hour").toISOString();
  const end = moment(incident.updatedAt).add(1, "hour").toISOString();
  return `/monitors/${incident.monitorId}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
};

const IncidentSummary: FunctionComponent<IncidentsListItemProps> = ({
  incident,
}) => {
  if (incident.operator) {
    return (
      <>
        Assertion failed: {incident.title} {incident.operator} {incident.target}
      </>
    );
  }

  return (
    <>
      {incident.description || incident.title}
      {incident.rootCauseAnalysis && (
        <>
          <br />
          <strong>AI Insight:</strong> {incident.rootCauseAnalysis}
        </>
      )}
    </>
  );
};

const IncidentsListItem: FunctionComponent<IncidentsListItemProps> = ({
  incident,
}) => {
  const solveIncident = useSolveIncident();

  return (
    <Card
      sx={{
        transition: "background-color 120ms, border-color 120ms",
        "&:hover": {
          bgcolor: "background.level1",
          borderColor: "neutral.outlinedBorder",
        },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={{ xs: 2, md: 4 }}
      >
        <Link
          overlay
          component={RouterLink}
          to={monitorTimeframeUrl(incident)}
          level="body-sm"
          textColor="text.primary"
          underline="none"
          sx={{ display: "block", minWidth: 0, flex: 1 }}
        >
          <IncidentSummary incident={incident} />
        </Link>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack
            spacing={0.25}
            sx={{ textAlign: { xs: "left", md: "right" }, flex: 1 }}
          >
            <Typography level="body-xs" textColor="text.tertiary">
              first occurrence {new Date(incident.createdAt).toLocaleString()}
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              latest occurrence {new Date(incident.updatedAt).toLocaleString()}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              color: "text.tertiary",
            }}
          >
            <IoStatsChart size={28} />
          </Box>
          <Tooltip title="Solve incident">
            <IconButton
              variant="outlined"
              color="success"
              aria-label="Solve incident"
              sx={{ position: "relative", zIndex: 1 }}
              onClick={() => solveIncident.mutate({ incidentId: incident.id })}
            >
              <IoCheckmark size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
};

export default IncidentsListItem;
