import { FunctionComponent } from "react";
import { useMonitorIncidents } from "../../../../hooks/incidents.query";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { useMonitor } from "../../../../hooks/monitors.query";
interface IncidentsWindowDetailViewProps {}
import Container from "../../../../components/Container";
import { Skeleton , Stack, Typography } from "@mui/material";
import Placeholder from "../../../../components/Placeholder";
import IncidentsList from "../components/IncidentsList";
import Conditional from "../../../../components/Conditional";
import { stripProtocolAndPath } from "../../../../utilities/url";


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
        <Stack direction="row" spacing={2} alignItems={"center"}>
          <Stack>
            <Typography color="primary" fontSize={24}>
              {stripProtocolAndPath(data?.settings.url)}
            </Typography>
            <Typography color="secondary">

              <Conditional value={!incidentsAreLoading && monitorIncidents != undefined && monitorIncidents?.incidents.length > 0}>
                {monitorIncidents?.incidents.length} active incidents on monitor
               
              </Conditional>

              <Conditional value={monitorIncidents?.incidents.length == 0}>No Incidents!! :D</Conditional>
            </Typography>
          </Stack>
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

export default IncidentsWindowDetailView;
