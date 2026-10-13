import { Alert, Button, Chip, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { FunctionComponent } from "react";
import {
  IoAlertCircleOutline,
  IoCheckmark,
  IoOpenOutline,
  IoSearch,
  IoWarningOutline,
} from "react-icons/io5";
import { MonitorIncident } from "../../../../../api/endpoints/incidents";

interface ActiveIncidentAlertProps {
  incident: MonitorIncident;
  onFocusGraph: () => void;
  onViewDetails: () => void;
  onResolve: () => void;
}

const ActiveIncidentAlert: FunctionComponent<ActiveIncidentAlertProps> = ({
  incident,
  ...props
}) => {
  const color = incident.acknowledged ? "warning" : "danger";
  const hasTrigger = incident.operator || incident.target || incident.property;

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
      sx={{
        alignItems: "flex-start",
        borderRadius: "lg",
        border: "1px solid",
        borderColor: `${color}.outlinedBorder`,
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography level="title-sm" color={color}>
          {incident.acknowledged ? "Acknowledged Incident" : "Active Incident"}
        </Typography>

        {incident.acknowledged && (
          <Typography level="body-sm" textColor="text.secondary">
            <strong>Acknowledged</strong>{" "}
            {incident.acknowledgedBy
              ? `by ${incident.acknowledgedBy.displayName} `
              : "(auto-acknowledged) "}
            {incident.acknowledgedAt
              ? `on ${moment(incident.acknowledgedAt).format("LLL")}`
              : ""}
          </Typography>
        )}

        <Typography level="body-md" textColor="text.primary">
          {incident.title || "An error occurred with this monitor."}
        </Typography>

        {hasTrigger && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            {incident.property && (
              <Typography
                level="body-sm"
                textColor="text.secondary"
                sx={{ mr: 1 }}
              >
                Property: {incident.property}
              </Typography>
            )}
            <Typography level="body-sm" textColor="text.secondary">
              Trigger condition:
            </Typography>
            {incident.operator && (
              <Chip variant="solid" color="danger">
                {incident.operator}
              </Chip>
            )}
            {incident.target && (
              <Chip variant="outlined" color="danger">
                {incident.target}
              </Chip>
            )}
          </Stack>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 0.5, sm: 4 }}
        >
          <Typography level="body-xs" textColor="text.secondary">
            <strong>First occurrence:</strong>{" "}
            {new Date(incident.createdAt).toLocaleString()}
          </Typography>
          <Typography level="body-xs" textColor="text.secondary">
            <strong>Latest occurrence:</strong>{" "}
            {new Date(incident.updatedAt).toLocaleString()}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ pt: 0.5 }}
        >
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<IoSearch />}
            onClick={props.onFocusGraph}
          >
            Focus Graph
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<IoOpenOutline />}
            onClick={props.onViewDetails}
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<IoCheckmark />}
            onClick={props.onResolve}
          >
            Mark Resolved
          </Button>
        </Stack>
      </Stack>
    </Alert>
  );
};

export default ActiveIncidentAlert;
