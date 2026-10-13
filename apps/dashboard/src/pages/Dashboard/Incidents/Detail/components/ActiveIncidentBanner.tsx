import { Alert, Box, Button, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { FunctionComponent, ReactNode } from "react";
import {
  IoAlertCircleOutline,
  IoCheckmark,
  IoWarningOutline,
} from "react-icons/io5";
import { GetIncidentResponse } from "../../../../../api/endpoints/incidents";
import {
  useAcknowledgeIncident,
  useSolveIncident,
} from "../../../../../hooks/incidents.query";
import PreformattedBlock from "./PreformattedBlock";

interface ActiveIncidentBannerProps {
  incident: GetIncidentResponse;
}

const Paragraph: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <>
    <br />
    <br />
    {children}
  </>
);

const acknowledgedByLabel = (incident: GetIncidentResponse) => {
  if (incident.acknowledgedBy)
    return `by ${incident.acknowledgedBy.displayName}`;
  if (incident.acknowledgedByIntegration)
    return `by ${incident.acknowledgedByIntegration}`;
  return "(auto-acknowledged)";
};

/** Status banner with acknowledge / resolve actions for an open incident. */
const ActiveIncidentBanner: FunctionComponent<ActiveIncidentBannerProps> = ({
  incident,
}) => {
  const solveIncident = useSolveIncident();
  const acknowledgeIncident = useAcknowledgeIncident();
  const color = incident.acknowledged ? "warning" : "danger";

  return (
    <Alert
      color={color}
      variant="soft"
      startDecorator={
        incident.acknowledged ? (
          <IoWarningOutline size={20} />
        ) : (
          <IoAlertCircleOutline size={20} />
        )
      }
      sx={{ alignItems: "flex-start", flexWrap: { xs: "wrap", sm: "nowrap" } }}
      endDecorator={
        <Stack direction="row" spacing={1}>
          {!incident.acknowledged && (
            <Button
              variant="outlined"
              color={color}
              startDecorator={<IoCheckmark />}
              onClick={() =>
                acknowledgeIncident.mutate({ incidentId: incident.id })
              }
            >
              Acknowledge
            </Button>
          )}
          <Button
            variant="solid"
            color={color}
            startDecorator={<IoCheckmark />}
            onClick={() => solveIncident.mutate({ incidentId: incident.id })}
          >
            Mark Resolved
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography level="title-sm" color={color} sx={{ mb: 0.5 }}>
          {incident.acknowledged ? "Acknowledged Incident" : "Active Incident"}:{" "}
          {incident.title}
        </Typography>
        <Typography level="body-sm" color={color} component="div">
          {incident.description && (
            <PreformattedBlock monospace>
              {incident.description}
            </PreformattedBlock>
          )}
          This incident was triggered on{" "}
          {moment(incident.createdAt).format("LLL")}.
          {incident.occurrences > 1 && (
            <Paragraph>
              <strong>Occurrences:</strong> {incident.occurrences}
            </Paragraph>
          )}
          {incident.acknowledged && (
            <Paragraph>
              <strong>Acknowledged</strong> {acknowledgedByLabel(incident)}
              {incident.acknowledgedAt &&
                ` on ${moment(incident.acknowledgedAt).format("LLL")}`}
            </Paragraph>
          )}
          {incident.rootCauseAnalysis && (
            <Paragraph>
              <strong>Root Cause Analysis (AI generated):</strong>
              <PreformattedBlock>
                {incident.rootCauseAnalysis}
              </PreformattedBlock>
            </Paragraph>
          )}
        </Typography>
      </Box>
    </Alert>
  );
};

export default ActiveIncidentBanner;
