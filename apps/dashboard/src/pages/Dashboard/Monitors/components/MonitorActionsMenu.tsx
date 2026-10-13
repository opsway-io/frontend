import {
  Box,
  Dropdown,
  IconButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import { useSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import {
  IoCreateOutline,
  IoEllipsisHorizontal,
  IoPauseOutline,
  IoPlayOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { Monitor } from "../../../../api/endpoints/monitors";
import { useUpdateMonitor } from "../../../../hooks/monitors.query";
import DeleteMonitorDialog from "./DeleteMonitorDialog";

interface MonitorActionsMenuProps {
  monitor: Monitor;
}

/** Pause/resume, edit and delete actions for a row in the monitors grid. */
const MonitorActionsMenu: FunctionComponent<MonitorActionsMenuProps> = ({
  monitor,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: update, isPending: isUpdating } = useUpdateMonitor(
    monitor.id,
  );

  const isActive = monitor.state === "ACTIVE";
  const isMaintenance = monitor.state === "MAINTENANCE";

  const toggleState = () => {
    if (isUpdating) {
      return;
    }

    update(
      { ...monitor, state: isActive ? "INACTIVE" : "ACTIVE" },
      {
        onError: () =>
          enqueueSnackbar("Failed to update monitor state", {
            variant: "error",
          }),
      },
    );
  };

  return (
    // React synthetic events bubble through portals (menu, dialog), so stop
    // them here to prevent the surrounding grid row from navigating.
    <Box
      component="span"
      sx={{ display: "inline-flex" }}
      onClick={(e) => e.stopPropagation()}
    >
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "plain", color: "neutral", size: "sm" },
          }}
          aria-label="Monitor actions"
          onClick={(e) => e.stopPropagation()}
        >
          <IoEllipsisHorizontal />
        </MenuButton>
        <Menu placement="bottom-end" size="sm" sx={{ minWidth: 160 }}>
          <MenuItem disabled={isMaintenance} onClick={toggleState}>
            <ListItemDecorator>
              {isActive ? <IoPauseOutline /> : <IoPlayOutline />}
            </ListItemDecorator>
            {isActive ? "Pause" : "Resume"}
          </MenuItem>

          <MenuItem component={Link} to={`/monitors/${monitor.id}/settings`}>
            <ListItemDecorator>
              <IoCreateOutline />
            </ListItemDecorator>
            Edit
          </MenuItem>

          <ListDivider />

          <MenuItem color="danger" onClick={() => setShowDeleteDialog(true)}>
            <ListItemDecorator>
              <IoTrashOutline />
            </ListItemDecorator>
            Delete
          </MenuItem>
        </Menu>
      </Dropdown>

      <DeleteMonitorDialog
        open={showDeleteDialog}
        monitor={monitor}
        onClose={() => setShowDeleteDialog(false)}
      />
    </Box>
  );
};

export default MonitorActionsMenu;
