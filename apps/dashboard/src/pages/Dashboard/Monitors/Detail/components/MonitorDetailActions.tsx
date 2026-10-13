import { Box, Button, Stack } from "@mui/joy";
import { useSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { IoPause, IoPlay, IoSettingsOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useUpdateMonitorState } from "../../../../../hooks/monitors.query";

interface MonitorDetailActionsProps {
  monitorId: number;
  active: boolean;
  maintenance: boolean;
}

/** Pause/resume and settings buttons (admins only). */
const MonitorDetailActions: FunctionComponent<MonitorDetailActionsProps> = (
  props,
) => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateState, isPending } = useUpdateMonitorState(
    props.monitorId,
  );

  const toggleState = () =>
    updateState(props.active ? "INACTIVE" : "ACTIVE", {
      onError: () =>
        enqueueSnackbar("Failed to update monitor state", { variant: "error" }),
    });

  const iconColor = props.maintenance
    ? "neutral.500"
    : props.active
      ? "info.400"
      : "success.400";

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <span
        title={
          props.maintenance
            ? "Cannot resume while an active maintenance window is ongoing"
            : undefined
        }
      >
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={
            <Box
              component={props.active ? IoPause : IoPlay}
              sx={{ color: iconColor }}
            />
          }
          loading={isPending}
          disabled={props.maintenance}
          onClick={toggleState}
        >
          {props.active ? "Pause monitor" : "Resume monitor"}
        </Button>
      </span>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<IoSettingsOutline />}
        component={NavLink}
        to={`/monitors/${props.monitorId}/settings`}
      >
        Settings
      </Button>
    </Stack>
  );
};

export default MonitorDetailActions;
