import { FunctionComponent } from "react";
import { MonitorIncident } from "../../../../../api/endpoints/incidents";
import IncidentsDataGrid from "../../../Incidents/components/IncidentsDataGrid";
import SectionCard from "./SectionCard";

interface PastIncidentsCardProps {
  incidents: MonitorIncident[];
  onViewClick: (incidentId: number) => void;
}

const PastIncidentsCard: FunctionComponent<PastIncidentsCardProps> = (
  props,
) => {
  return (
    <SectionCard
      title="Past Incidents"
      description="Resolved incidents for this monitor"
    >
      <IncidentsDataGrid
        incidents={props.incidents}
        onViewClick={props.onViewClick}
      />
    </SectionCard>
  );
};

export default PastIncidentsCard;
