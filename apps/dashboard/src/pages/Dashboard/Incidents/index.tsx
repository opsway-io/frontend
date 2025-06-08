import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import IncidentOverviewList from "./components/OverviewList";
// import { useIncidents } from "../../../hooks/incidents.query";
import { useMonitorsIncidents } from "../../../hooks/monitors.query";



const IncidentsView: FunctionComponent = () => {

  // Get incidents
    const {
      data: monitorsIncidents,
      error: incidentsError,
      isLoading: incidentsAreLoading,
    } = useMonitorsIncidents();
  return (
    <>
      <Helmet>
        <title>Incidents</title>
      </Helmet>

      <Container
        header="Incidents"
        description="An overview active and resolved incidents across your infrastructure."
      >
        {incidentsAreLoading ? (<Placeholder />) :
             ( <IncidentOverviewList monitors={monitorsIncidents?.monitors} />)
        }

      </Container>
    </>
  );
};

export default IncidentsView;
