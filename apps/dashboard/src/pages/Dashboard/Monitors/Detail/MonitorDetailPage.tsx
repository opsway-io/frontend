import { Alert, Skeleton, Stack } from "@mui/joy";
import moment from "moment";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoConstructOutline } from "react-icons/io5";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Container from "../../../../components/Container/Container";
import { Role } from "../../../../components/Restrict";
import {
  useMonitorIncidents,
  useSolveIncident,
} from "../../../../hooks/incidents.query";
import { useMonitor } from "../../../../hooks/monitors.query";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import ActiveIncidentAlert from "./components/ActiveIncidentAlert";
import CheckPhaseLegend from "./components/CheckPhaseLegend";
import ChecksDataGrid from "./components/ChecksDataGrid";
import IncidentDrawer from "./components/IncidentDrawer";
import MonitorDetailActions from "./components/MonitorDetailActions";
import MonitorDetailSkeleton from "./components/MonitorDetailSkeleton";
import MonitorStatCards from "./components/MonitorStatCards";
import MonitorStatusHeader from "./components/MonitorStatusHeader";
import PastIncidentsCard from "./components/PastIncidentsCard";
import ResponseTimesGraph from "./components/ResponseTimesGraph";
import SectionCard from "./components/SectionCard";
import TimeRangeToggle from "./components/TimeRangeToggle";
import useIsMonitorInMaintenance from "./hooks/useIsMonitorInMaintenance";

const ONE_WEEK_MS = 604800000;

const MonitorDetailPage: FunctionComponent = () => {
  const params = useParams();
  const monitorId = Number(params.id) || 0;

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const startParam = searchParams.get("start") || undefined;
  const endParam = searchParams.get("end") || undefined;
  const isCustomRange = !!startParam && !!endParam;

  const [timeInterval, setTimeInterval] = useState(ONE_WEEK_MS);
  const [drawerIncidentId, setDrawerIncidentId] = useState<number | null>(null);

  const currentRole = useCurrentUserRole();
  const isAdmin = !!currentRole && Role.ADMIN.equalOrHigher(currentRole);

  const { data, error, isPending } = useMonitor(monitorId);
  const isActive = data?.state === "ACTIVE";
  const isInMaintenanceWindow = useIsMonitorInMaintenance(monitorId);
  const isMaintenance = data?.state === "MAINTENANCE" || isInMaintenanceWindow;

  const { data: monitorIncidents } = useMonitorIncidents(monitorId, 0, 100);
  const solveIncident = useSolveIncident();
  const incidents = monitorIncidents?.incidents || [];
  const activeIncidents = incidents.filter((i) => !i.resolved);
  const pastIncidents = incidents.filter((i) => i.resolved);

  /** Zooms the graph to one hour around the incident. */
  const focusGraphOn = (createdAt: string, updatedAt: string) => {
    const start = moment(createdAt).subtract(1, "hour").toISOString();
    const end = moment(updatedAt).add(1, "hour").toISOString();
    navigate(
      `/monitors/${monitorId}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
    );
  };

  const changeTimeInterval = (interval: number) => {
    setTimeInterval(interval);
    if (isCustomRange) {
      navigate(location.pathname);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isPending ? "Monitors" : `Monitors | ${data?.name}`}</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link key="monitors" to="/monitors">
            Monitors
          </Link>,
          isPending ? (
            <Skeleton key="name" variant="text" width={150} />
          ) : (
            <span key="name">{data?.name}</span>
          ),
        ]}
        loading={isPending}
        error={
          error ? "Failed to load monitor, try to reload the page." : undefined
        }
        skeleton={<MonitorDetailSkeleton />}
      >
        {activeIncidents.length > 0 && (
          <Stack spacing={1.5}>
            {activeIncidents.map((incident) => (
              <ActiveIncidentAlert
                key={incident.id}
                incident={incident}
                onFocusGraph={() =>
                  focusGraphOn(incident.createdAt, incident.updatedAt)
                }
                onViewDetails={() => setDrawerIncidentId(incident.id)}
                onResolve={() =>
                  solveIncident.mutate({ incidentId: incident.id })
                }
              />
            ))}
          </Stack>
        )}

        <MonitorStatusHeader
          url={data?.steps?.[0]?.url}
          active={isActive}
          maintenance={isMaintenance}
          frequencySeconds={data?.settings.frequencySeconds}
        />

        {isMaintenance && (
          <Alert
            color="warning"
            variant="soft"
            startDecorator={<IoConstructOutline size={18} />}
            sx={{ borderRadius: "lg" }}
          >
            Prober and alerts are turned off due to maintenance.
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <div>
            {isAdmin && (
              <MonitorDetailActions
                monitorId={monitorId}
                active={isActive}
                maintenance={isMaintenance}
              />
            )}
          </div>

          <TimeRangeToggle
            value={isCustomRange ? null : timeInterval}
            onChange={changeTimeInterval}
          />
        </Stack>

        <MonitorStatCards monitorId={monitorId} />

        <SectionCard
          title="Response times"
          description="From the selected range"
        >
          <ResponseTimesGraph
            monitorId={monitorId}
            interval={timeInterval}
            start={startParam}
            end={endParam}
          />
        </SectionCard>

        <SectionCard
          title="Checks"
          description="Result from latest monitor runs"
          headerAction={<CheckPhaseLegend />}
        >
          <ChecksDataGrid monitorId={monitorId} />
        </SectionCard>

        {pastIncidents.length > 0 && (
          <PastIncidentsCard
            incidents={pastIncidents}
            onViewClick={setDrawerIncidentId}
          />
        )}
      </Container>

      <IncidentDrawer
        incidentId={drawerIncidentId}
        onClose={() => setDrawerIncidentId(null)}
      />
    </>
  );
};

export default MonitorDetailPage;
