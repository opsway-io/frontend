import { FunctionComponent } from "react";
import { Alert, AlertTitle, Button, Stack, Typography } from "@mui/material";
import { IoCheckmark } from "react-icons/io5";
import moment from "moment";
import { useIncident, useSolveIncident, useAcknowledgeIncident } from "../../../../../hooks/incidents.query";
import Placeholder from "../../../../../components/Placeholder";
import AlertHistoryCard from "./AlertHistoryCard";

interface IncidentDetailsContentProps {
  incidentId: number;
}

const IncidentDetailsContent: FunctionComponent<IncidentDetailsContentProps> = ({ incidentId }) => {
  const { data: incidentData, isLoading, error } = useIncident(incidentId);
  const solveIncident = useSolveIncident();
  const acknowledgeIncident = useAcknowledgeIncident();

  if (isLoading) {
    return <Placeholder />;
  }

  if (error || !incidentData) {
    return <Typography color="error">Failed to load incident details.</Typography>;
  }

  const incident = incidentData;

  return (
    <Stack spacing={3}>
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
                  onClick={() => acknowledgeIncident.mutate({ incidentId: incident.id })}
                >
                  Acknowledge
                </Button>
              )}
              <Button
                color="inherit"
                size="small"
                startIcon={<IoCheckmark />}
                onClick={() => solveIncident.mutate({ incidentId: incident.id })}
              >
                Mark Resolved
              </Button>
            </Stack>
          }
        >
          <AlertTitle>Active Incident: {incident.title}</AlertTitle>
          {incident.description}
          <br />
          This incident was triggered on {moment(incident.createdAt).format("LLL")}.
          {incident.acknowledged && (
            <>
              <br />
              <br />
              <strong>Acknowledged</strong> {incident.acknowledgedAt ? `on ${moment(incident.acknowledgedAt).format("LLL")}` : ""}
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
          This incident occurred on {moment(incident.createdAt).format("LLL")} and is now resolved.
        </Alert>
      )}

      <AlertHistoryCard incidentId={incident.id} />
    </Stack>
  );
};

export default IncidentDetailsContent;
