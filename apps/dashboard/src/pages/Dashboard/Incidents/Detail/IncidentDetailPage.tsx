import { Button, Skeleton } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import { useIncident } from "../../../../hooks/incidents.query";
import IncidentDetailsContent from "./components/IncidentDetailsContent";

const IncidentDetailPage: FunctionComponent = () => {
  const params = useParams();
  const incidentId = Number(params.incidentId) || 0;

  const { data: incident, error, isPending } = useIncident(incidentId);

  return (
    <>
      <Helmet>
        <title>
          {isPending ? "Incident" : `Incident | ${incident?.title}`}
        </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link key="incidents" to="/incidents">
            Incidents
          </Link>,
          isPending ? (
            <Skeleton key="skeleton" variant="text" width={150} />
          ) : (
            <span key="title">{incident?.title}</span>
          ),
        ]}
        loading={isPending}
        error={
          error ? "Failed to load incident, try to reload the page." : undefined
        }
        primaryActions={
          incident?.monitorId
            ? [
                <Button
                  key="view-monitor"
                  component={Link}
                  to={`/monitors/${incident.monitorId}`}
                  variant="outlined"
                  color="neutral"
                >
                  View Monitor
                </Button>,
              ]
            : []
        }
      >
        <IncidentDetailsContent incidentId={incidentId} />
      </Container>
    </>
  );
};

export default IncidentDetailPage;
