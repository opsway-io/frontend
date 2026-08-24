import { LoadingButton } from "@mui/lab";
import {
  Alert,
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
import { IoPause, IoPlay, IoSettings } from "react-icons/io5";
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
import { useCurrentUserRole } from "../../../../hooks/user.query";
import { useMaintenanceWindows } from "../../../../hooks/maintenance.query";
import moment from "moment";
import { secondsHumanize } from "../../../../utilities/time";
import { stripProtocolAndPath } from "../../../../utilities/url";
import AverageResponseTimeCard from "./components/AverageResponseTimeCard";
import { ChecksDataGrid } from "./components/ChecksDataGrid";
import LastCheckCard from "./components/LastCheckCard";
import ResponseTimeGraph from "./components/ResponseTimesGraph";
import TLSCard from "./components/TLSCard";
import UptimeCard from "./components/UptimeCard";

const MonitorDetailView: FunctionComponent = () => {
  const params = useParams();
  const monitorId = (params.id as number | undefined) || 0;

  const theme = useTheme();

  const [timeInterval, setTimeInterval] = useState(604800000);

  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const currentRole = useCurrentUserRole();

  const { data, error, isLoading } = useMonitor(monitorId);
  const { mutate: updateState, isLoading: isUpdatingState } =
    useUpdateMonitorState(monitorId);

  const isActive = useMemo(() => data?.state === "ACTIVE", [data?.state]);

  const { data: maintenances } = useMaintenanceWindows();
  const now = moment();
  const isGlobalMaintenance = useMemo(() => {
    if (!maintenances) return false;
    return maintenances.some((w) => {
      const start = moment(w.settings?.startAt);
      const end = moment(w.settings?.endAt);
      const isWindowActive = start.isSameOrBefore(now) && end.isAfter(now);
      if (!isWindowActive) return false;
      // Check if it applies to all monitors or specifically this one
      if (!w.monitors || w.monitors.length === 0) return true;
      return w.monitors.some((m: any) => m.id === monitorId);
    });
  }, [maintenances, monitorId]);

  const isMaintenance = useMemo(
    () => data?.state === "MAINTENANCE" || isGlobalMaintenance,
    [data?.state, isGlobalMaintenance],
  );

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
      <div
        key="resume"
        style={{ display: "inline-block" }}
        title={
          isMaintenance
            ? "Cannot resume while an active maintenance window is ongoing"
            : undefined
        }
      >
        <LoadingButton
          startIcon={isActive ? <IoPause /> : <IoPlay />}
          color="secondary"
          sx={{
            span: {
              color: (t) =>
                isActive && !isMaintenance
                  ? t.palette.info.main
                  : !isMaintenance
                    ? t.palette.success.main
                    : t.palette.grey[500],
            },
          }}
          loading={isUpdatingState}
          disabled={isMaintenance}
          onClick={() => setMonitorState(isActive ? "INACTIVE" : "ACTIVE")}
        >
          {isActive ? "Pause monitor" : "Resume monitor"}
        </LoadingButton>
      </div>,
      <Button
        startIcon={<IoSettings />}
        color="secondary"
        sx={{
          span: {
            color: (t) => t.palette.grey[800],
          },
        }}
        component={NavLink}
        to={`/monitors/${params.id}/settings`}
      >
        Settings
      </Button>,
    ];
  }, [currentRole, data, params, isUpdatingState]);

  return (
    <>
      <Helmet>
        <title>{isLoading ? "Monitors" : `Monitors | ${data?.name}`}</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/monitors">Monitors</Link>,
          isLoading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <span>{data?.name}</span>
          ),
        ]}
        loading={isLoading}
        error={
          error ? "Failed to load monitor, try to reload the page." : undefined
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
        <Stack direction="row" spacing={2} alignItems={"center"}>
          <PulseDot
            color={
              isActive ? theme.palette.success.main : theme.palette.grey[500]
            }
          />

          <Stack>
            <Typography color="primary" fontSize={24}>
              {stripProtocolAndPath(data?.settings.url)}
            </Typography>
            <Typography color="secondary">
              <Conditional value={isActive && data?.settings.frequencySeconds}>
                Monitoring is active, checking every{" "}
                {secondsHumanize(data?.settings.frequencySeconds as number)}
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
              onChange={(_, value) => {
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

export default MonitorDetailView;
