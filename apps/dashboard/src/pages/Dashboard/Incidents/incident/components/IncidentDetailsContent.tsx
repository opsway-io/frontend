import { FunctionComponent } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { IoCheckmark, IoGlobeOutline } from "react-icons/io5";
import moment from "moment";
import {
  useIncident,
  useSolveIncident,
  useAcknowledgeIncident,
  useUpdateIncidentVisibility,
} from "../../../../../hooks/incidents.query";
import Placeholder from "../../../../../components/Placeholder";
import AlertHistoryCard from "./AlertHistoryCard";
import TriggerHistoryCard from "./TriggerHistoryCard";

interface IncidentDetailsContentProps {
  incidentId: number;
}

const IncidentDetailsContent: FunctionComponent<
  IncidentDetailsContentProps
> = ({ incidentId }) => {
  const { data: incidentData, isLoading, error } = useIncident(incidentId);
  const solveIncident = useSolveIncident();
  const acknowledgeIncident = useAcknowledgeIncident();
  const updateVisibility = useUpdateIncidentVisibility();

  if (isLoading) {
    return <Placeholder />;
  }

  if (error || !incidentData) {
    return (
      <Typography color="error">Failed to load incident details.</Typography>
    );
  }

  const incident = incidentData;

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Incident Details</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={incident.isStatusPageVisible}
              onChange={(e) =>
                updateVisibility.mutate({
                  incidentId: incident.id,
                  isStatusPageVisible: e.target.checked,
                })
              }
              color="primary"
            />
          }
          label={
            <Stack direction="row" alignItems="center" spacing={1}>
              <IoGlobeOutline />
              <Typography variant="body2">Visible on Status Page</Typography>
            </Stack>
          }
        />
      </Stack>

      {!incident.resolved ? (
        <Alert
          severity="error"
          action={
            <Stack direction="row" spacing={1}>
              {!incident.acknowledged && (
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<IoCheckmark />}
                  onClick={() =>
                    acknowledgeIncident.mutate({ incidentId: incident.id })
                  }
                >
                  Acknowledge
                </Button>
              )}
              <Button
                color="inherit"
                size="small"
                startIcon={<IoCheckmark />}
                onClick={() =>
                  solveIncident.mutate({ incidentId: incident.id })
                }
              >
                Mark Resolved
              </Button>
            </Stack>
          }
        >
          <AlertTitle>Active Incident: {incident.title}</AlertTitle>
          {incident.description}
          <br />
          This incident was triggered on{" "}
          {moment(incident.createdAt).format("LLL")}.
          {incident.occurrences > 1 && (
            <>
              <br />
              <br />
              <strong>Occurrences:</strong> {incident.occurrences}
            </>
          )}
          {incident.acknowledged && (
            <>
              <br />
              <br />
              <strong>Acknowledged</strong>{" "}
              {incident.acknowledgedAt
                ? `on ${moment(incident.acknowledgedAt).format("LLL")}`
                : ""}
            </>
          )}
          {incident.rootCauseAnalysis && (
            <>
              <br />
              <br />
              <strong>Root Cause Analysis (AI generated):</strong>
              <br />
              {incident.rootCauseAnalysis}
            </>
          )}
        </Alert>
      ) : (
        <Alert severity="success">
          <AlertTitle>Resolved Incident: {incident.title}</AlertTitle>
          {incident.description}
          <br />
          This incident occurred on {moment(incident.createdAt).format(
            "LLL",
          )}{" "}
          and is now resolved.
        </Alert>
      )}

      <AlertHistoryCard incidentId={incident.id} />
      <TriggerHistoryCard incidentId={incident.id} />
    </Stack>
  );
};

export default IncidentDetailsContent;
