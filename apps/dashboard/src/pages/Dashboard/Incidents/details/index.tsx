import { LoadingButton } from "@mui/lab";
import {
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
import { secondsHumanize } from "../../../../utilities/time";
import { stripProtocolAndPath } from "../../../../utilities/url";
import AverageResponseTimeCard from "./components/AverageResponseTimeCard";
import { ChecksDataGrid } from "./components/ChecksDataGrid";
import LastCheckCard from "./components/LastCheckCard";
import ResponseTimeGraph from "./components/ResponseTimesGraph";
import TLSCard from "./components/TLSCard";
import UptimeCard from "./components/UptimeCard";

const IncidentMonitorDetailsView: FunctionComponent = () => {
  let params = useParams();
  const monitorId = (params.id as number | undefined) || 0;

  const theme = useTheme();

  const [timeInterval, setTimeInterval] = useState(604800000);

  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const currentRole = useCurrentUserRole();

  const { data, error, isLoading } = useMonitor(monitorId);
  const { mutate: updateState, isLoading: isUpdatingState } =
    useUpdateMonitorState(monitorId);

  const isActive = useMemo(() => data?.state === "ACTIVE", [data?.state]);

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
            color: (t) =>
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

              <Conditional value={!isActive}>Monitoring is paused</Conditional>
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
                setTimeInterval(value)
              }}}
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
                sx={{ backgroundColor: alpha("#9b59b6", 0.5) }} // TODO: use theme color
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

export default IncidentMonitorDetailsView;
