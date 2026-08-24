import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { IoCheckmark, IoPause, IoPlay, IoSettings } from "react-icons/io5";
import { Link, NavLink, useParams } from "react-router-dom";
import Conditional from "../../../../components/Conditional";
import Container from "../../../../components/Container";
import PulseDot from "../../../../components/PulseDot";
import { Role } from "../../../../components/Restrict";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import {
  useMonitor,
  useUpdateMonitorState,
} from "../../../../hooks/monitors.query";
import {
  useIncident,
  useSolveIncident,
  useAcknowledgeIncident,
} from "../../../../hooks/incidents.query";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import { secondsHumanize } from "../../../../utilities/time";
import { stripProtocolAndPath } from "../../../../utilities/url";
import AverageResponseTimeCard from "../details/components/AverageResponseTimeCard";
import { ChecksDataGrid } from "../details/components/ChecksDataGrid";
import LastCheckCard from "../details/components/LastCheckCard";
import ResponseTimeGraph from "../details/components/ResponseTimesGraph";
import TLSCard from "../details/components/TLSCard";
import UptimeCard from "../details/components/UptimeCard";

const IncidentDetailView: FunctionComponent = () => {
  const params = useParams();
  const incidentId = (params.incidentId as number | undefined) || 0;

  const theme = useTheme();

  const [timeInterval, setTimeInterval] = useState(604800000);

  const teamId = useAuthenticationStore((state: any) => state.currentTeamId);
  const currentRole = useCurrentUserRole();

  const {
    data: incident,
    error: incidentError,
    isLoading: incidentLoading,
  } = useIncident(incidentId);
  const monitorId = incident?.monitorId || 0;

  const {
    data: monitorData,
    error: monitorError,
    isLoading: monitorLoading,
  } = useMonitor(monitorId);
  const { mutate: updateState, isLoading: isUpdatingState } =
    useUpdateMonitorState(monitorId);

  const solveIncident = useSolveIncident();
  const acknowledgeIncident = useAcknowledgeIncident();

  const isActive = useMemo(
    () => monitorData?.state === "ACTIVE",
    [monitorData?.state],
  );
  const isMaintenance = useMemo(
    () => monitorData?.state === "MAINTENANCE",
    [monitorData?.state],
  );
  const isLoading = incidentLoading || monitorLoading;
  const error = incidentError || monitorError;

  const setMonitorState = (state: "ACTIVE" | "INACTIVE") => {
    if (isLoading) {
      return;
    }

    try {
      updateState(state);
    } catch (e) {
      enqueueSnackbar("Failed to update monitor state", { variant: "error" });
    }
  };

  const primaryActions = useMemo(() => {
    if (!currentRole) {
      return [];
    }

    if (!Role.ADMIN.equalOrHigher(currentRole)) {
      return [];
    }

    return [
      <LoadingButton
        startIcon={isActive ? <IoPause /> : <IoPlay />}
        color="secondary"
        sx={{
          span: {
            color: (t: any) =>
              isActive ? t.palette.info.main : t.palette.success.main,
          },
        }}
        loading={isUpdatingState}
        onClick={() => setMonitorState(isActive ? "INACTIVE" : "ACTIVE")}
      >
        {isActive ? "Pause monitor" : "Resume monitor"}
      </LoadingButton>,
      <Button
        startIcon={<IoSettings />}
        color="secondary"
        sx={{
          span: {
            color: (t: any) => t.palette.grey[800],
          },
        }}
        component={NavLink}
        to={`/monitors/${monitorId}/settings`}
      >
        Settings
      </Button>,
    ];
  }, [currentRole, monitorData, params, isUpdatingState]);

  return (
    <>
      <Helmet>
        <title>
          {isLoading ? "Incident" : `Incident | ${incident?.title}`}
        </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/incidents">Incidents</Link>,
          isLoading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <span>{incident?.title}</span>
          ),
        ]}
        loading={isLoading}
        error={
          error ? "Failed to load incident, try to reload the page." : undefined
        }
        skeleton={
          <>
            <Skeleton variant="rectangular" height={40} />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rectangular" height={100} sx={{ flex: 1 }} />
              <Skeleton variant="rectangular" height={100} sx={{ flex: 1 }} />
              <Skeleton variant="rectangular" height={100} sx={{ flex: 1 }} />
              <Skeleton variant="rectangular" height={100} sx={{ flex: 1 }} />
            </Stack>
            <Skeleton variant="rectangular" height={500} />
            <Skeleton variant="rectangular" height={200} />
          </>
        }
      >
        {incident && !incident.resolved && (
          <Stack spacing={2} mb={2}>
            <Alert
              severity="error"
              action={
                <Stack direction="row" spacing={1}>
                  {!incident.acknowledged && (
                    <Button
                      color="inherit"
                      size="small"
                      startIcon={<IoCheckmark />}
                      onClick={() =>
                        acknowledgeIncident.mutate({ incidentId: incident.id })
                      }
                    >
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<IoCheckmark />}
                    onClick={() =>
                      solveIncident.mutate({ incidentId: incident.id })
                    }
                  >
                    Mark Resolved
                  </Button>
                </Stack>
              }
            >
              <AlertTitle>Active Incident: {incident.title}</AlertTitle>
              {incident.description}
              <br />
              This incident was triggered on {incident.createdAt}.
              {incident.acknowledged && (
                <>
                  <br />
                  <br />
                  <strong>Acknowledged</strong>{" "}
                  {incident.acknowledgedAt
                    ? `on ${incident.acknowledgedAt}`
                    : ""}
                </>
              )}
              {incident.rootCauseAnalysis && (
                <>
                  <br />
                  <br />
                  <strong>Root Cause Analysis (AI generated):</strong>
                  <br />
                  {incident.rootCauseAnalysis}
                </>
              )}
            </Alert>
          </Stack>
        )}

        {incident && incident.resolved && (
          <Stack spacing={2} mb={2}>
            <Alert severity="success">
              <AlertTitle>Resolved Incident: {incident.title}</AlertTitle>
              {incident.description}
              <br />
              This incident occurred on {incident.createdAt} and is now
              resolved.
            </Alert>
          </Stack>
        )}

        <Stack direction="row" spacing={2} alignItems={"center"}>
          <PulseDot
            color={
              isActive ? theme.palette.success.main : theme.palette.grey[500]
            }
          />

          <Stack>
            <Typography color="primary" fontSize={24}>
              {stripProtocolAndPath(monitorData?.settings.url)}
            </Typography>
            <Typography color="secondary">
              <Conditional
                value={isActive && monitorData?.settings.frequencySeconds}
              >
                Monitoring is active, checking every{" "}
                {secondsHumanize(
                  monitorData?.settings.frequencySeconds as number,
                )}
              </Conditional>

              <Conditional value={!isActive && !isMaintenance}>
                Monitoring is paused
              </Conditional>

              <Conditional value={isMaintenance}>
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Prober and alerts are turned off due to maintenance.
                </Alert>
              </Conditional>
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1} flex="1" direction="row">
          <Stack flex="1" direction="row" alignItems="left" spacing={2}>
            {primaryActions?.map((action, index) => {
              return <span key={index}>{action}</span>;
            })}
          </Stack>

          <Stack direction="row" alignItems="right" spacing={2}>
            <ToggleButtonGroup
              value={timeInterval}
              exclusive
              sx={{
                maxHeight: 32,
              }}
              onChange={(_: any, value: any) => {
                if (value != null) {
                  setTimeInterval(value);
                }
              }}
            >
              <ToggleButton value={86400000}>Day</ToggleButton>
              <ToggleButton value={604800000}>Week</ToggleButton>
              <ToggleButton value={18144000000}>Month</ToggleButton>
              <ToggleButton value={217728000000}>Year</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={1}
        >
          <UptimeCard monitorId={monitorId} />
          <AverageResponseTimeCard monitorId={monitorId} />
          <LastCheckCard monitorId={monitorId} />
          <TLSCard monitorId={monitorId} />
        </Stack>

        <Card>
          <Stack direction="row" alignItems="center">
            <CardHeader
              title="Response times"
              subheader="From the selected range"
              sx={{
                flex: 1,
              }}
            />
          </Stack>
          <CardContent>
            <ResponseTimeGraph monitorId={monitorId} interval={timeInterval} />
          </CardContent>
        </Card>

        <Card>
          <Stack direction="row" alignItems="center">
            <CardHeader
              title="Checks"
              subheader="Result from latest monitor runs"
            />
            <Stack
              direction="row"
              spacing={1}
              sx={{
                marginLeft: "auto",
                marginRight: 2,
              }}
            >
              <Chip
                sx={{ backgroundColor: alpha(theme.palette.info.main, 0.5) }}
                label="DNS"
              />
              <Chip
                sx={{ backgroundColor: alpha(theme.palette.success.main, 0.5) }}
                label="TCP"
              />
              <Chip
                sx={{ backgroundColor: alpha(theme.palette.warning.main, 0.5) }}
                label="TLS"
              />
              <Chip
                sx={{
                  backgroundColor: alpha(theme.palette.secondary.main, 0.5),
                }}
                label="Processing"
              />
              <Chip
                sx={{ backgroundColor: alpha(theme.palette.error.main, 0.5) }}
                label="Transfer"
              />
            </Stack>
          </Stack>
          <CardContent>
            <ChecksDataGrid teamId={teamId} monitorId={monitorId} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default IncidentDetailView;
