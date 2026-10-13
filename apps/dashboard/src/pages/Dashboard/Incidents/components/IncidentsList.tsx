import { Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { MonitorIncident } from "../../../../api/endpoints/incidents";
import IncidentsListItem from "./IncidentsListItem";

interface IncidentsListProps {
  incidents?: MonitorIncident[];
}

const IncidentsList: FunctionComponent<IncidentsListProps> = ({
  incidents,
}) => (
  <Stack spacing={1.5}>
    {incidents?.map((incident) => (
      <IncidentsListItem key={incident.id} incident={incident} />
    ))}
  </Stack>
);

export default IncidentsList;
