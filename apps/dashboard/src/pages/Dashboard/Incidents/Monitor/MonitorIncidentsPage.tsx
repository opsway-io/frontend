import { Skeleton, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { useMonitorIncidents } from "../../../../hooks/incidents.query";
import { useMonitor } from "../../../../hooks/monitors.query";
import { stripProtocolAndPath } from "../../../../utilities/url";
import IncidentsList from "../components/IncidentsList";

/** Active incidents of a single monitor (`/incidents/:id/monitor`). */
const MonitorIncidentsPage: FunctionComponent = () => {
  const params = useParams();
  const monitorId = Number(params.id) || 0;

  const { data: monitor, isPending: monitorIsLoading } = useMonitor(monitorId);
  const { data: monitorIncidents, isPending: incidentsAreLoading } =
    useMonitorIncidents(monitorId);

  const incidentCount = monitorIncidents?.incidents.length ?? 0;

  return (
    <>
      <Helmet>
        <title>
          {monitorIsLoading ? "Monitors" : `Monitors | ${monitor?.name}`}
        </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link key="incidents" to="/incidents">
            Incidents
          </Link>,
          monitorIsLoading ? (
            <Skeleton key="skeleton" variant="text" width={150} />
          ) : (
            <span key="name">{monitor?.name}</span>
          ),
        ]}
      >
        <Stack spacing={0.5}>
          <Typography level="h3">
            {stripProtocolAndPath(monitor?.steps?.[0]?.url)}
          </Typography>
          <Typography level="body-md" textColor="text.secondary">
            {!incidentsAreLoading && incidentCount > 0
              ? `${incidentCount} active incidents on monitor`
              : "No incidents yet"}
          </Typography>
        </Stack>
        {incidentsAreLoading ? (
          <Placeholder />
        ) : (
          <IncidentsList incidents={monitorIncidents?.incidents} />
        )}
      </Container>
    </>
  );
};

export default MonitorIncidentsPage;
