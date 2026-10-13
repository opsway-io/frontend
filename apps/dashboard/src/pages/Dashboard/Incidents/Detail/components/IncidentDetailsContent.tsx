import { Stack, Switch, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoGlobeOutline } from "react-icons/io5";
import Placeholder from "../../../../../components/Placeholder/Placeholder";
import {
  useIncident,
  useUpdateIncidentVisibility,
} from "../../../../../hooks/incidents.query";
import ActiveIncidentBanner from "./ActiveIncidentBanner";
import AlertHistoryCard from "./AlertHistoryCard";
import ResolvedIncidentBanner from "./ResolvedIncidentBanner";
import TriggerHistoryCard from "./TriggerHistoryCard";

interface IncidentDetailsContentProps {
  incidentId: number;
}

/**
 * Incident status, actions and history. Used by the incident page and the
 * incident drawer on the monitor page.
 */
const IncidentDetailsContent: FunctionComponent<
  IncidentDetailsContentProps
> = ({ incidentId }) => {
  const { data: incident, isPending, error } = useIncident(incidentId);
  const updateVisibility = useUpdateIncidentVisibility();

  if (isPending) {
    return <Placeholder />;
  }

  if (error || !incident) {
    return (
      <Typography color="danger">Failed to load incident details.</Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography level="title-lg">Incident Details</Typography>
        <Switch
          checked={incident.isStatusPageVisible}
          onChange={(e) =>
            updateVisibility.mutate({
              incidentId: incident.id,
              isStatusPageVisible: e.target.checked,
            })
          }
          endDecorator={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <IoGlobeOutline />
              <Typography level="body-sm">Visible on Status Page</Typography>
            </Stack>
          }
        />
      </Stack>

      {incident.resolved ? (
        <ResolvedIncidentBanner incident={incident} />
      ) : (
        <ActiveIncidentBanner incident={incident} />
      )}

      <AlertHistoryCard incidentId={incident.id} />
      <TriggerHistoryCard incidentId={incident.id} />
    </Stack>
  );
};

export default IncidentDetailsContent;
