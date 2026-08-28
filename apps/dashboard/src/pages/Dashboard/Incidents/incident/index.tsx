import { Button, Skeleton } from "@mui/material";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container";
import { useIncident } from "../../../../hooks/incidents.query";
import IncidentDetailsContent from "./components/IncidentDetailsContent";

const IncidentDetailView: FunctionComponent = () => {
  const params = useParams();
  const incidentId = (params.incidentId as number | undefined) || 0;

  const {
    data: incident,
    error,
    isLoading,
  } = useIncident(incidentId);

  return (
    <>
      <Helmet>
        <title>
          {isLoading ? "Incident" : `Incident | ${incident?.title}`}
        </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link key="incidents-link" to="/incidents">Incidents</Link>,
          isLoading ? (
            <Skeleton key="skeleton" variant="text" width={150} />
          ) : (
            <span key="title">{incident?.title}</span>
          ),
        ]}
        loading={isLoading}
        error={
          error ? "Failed to load incident, try to reload the page." : undefined
        }
        primaryActions={
          incident?.monitorId ? [
            <Button
              key="view-monitor"
              component={Link}
              to={`/monitors/${incident.monitorId}`}
              variant="outlined"
            >
              View Monitor
            </Button>
          ] : []
        }
      >
        <IncidentDetailsContent incidentId={incidentId} />
      </Container>
    </>
  );
};

export default IncidentDetailView;
