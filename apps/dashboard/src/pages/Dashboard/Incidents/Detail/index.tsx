import { FunctionComponent } from "react";
import { useMonitorIncidents } from "../../../../hooks/incidents.query";
import { Helmet } from "react-helmet";
import { Link, NavLink, useParams } from "react-router-dom";
import { useMonitor } from "../../../../hooks/monitors.query";
interface IncidentsWindowDetailViewProps {}
import Container from "../../../../components/Container";
import { Button, Skeleton } from "@mui/material";
import Placeholder from "../../../../components/Placeholder";
import IncidentsList from "../components/IncidentsList";

const IncidentsWindowDetailView: FunctionComponent<
  IncidentsWindowDetailViewProps
> = () => {
  let params = useParams();
  const monitorId = (params.id as number | undefined) || 0;

  const { data, error, isLoading } = useMonitor(monitorId);

  // Get incidents
  const {
    data: monitorIncidents,
    error: incidentsError,
    isLoading: incidentsAreLoading,
  } = useMonitorIncidents(monitorId);
  return (
    <>
      <Helmet>
        <title>{isLoading ? "Monitors" : `Monitors | ${data?.name}`}</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/incidents">Incidents</Link>,
          isLoading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <span>{data?.name}</span>
          ),
        ]}
      >
        {incidentsAreLoading ? (
          <Placeholder />
        ) : (
          <IncidentsList incidents={monitorIncidents?.incidents} />
        )}
      </Container>
    </>
  );
};

export default IncidentsWindowDetailView;
