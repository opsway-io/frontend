import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FunctionComponent, useMemo, useState } from "react";
import { IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { TiPencil } from "react-icons/ti";
import { RiMore2Line } from "react-icons/ri";
import { IMonitorResponse } from "../../../../api/endpoints/monitors";
import DeleteMonitorDialog from "./DeleteMonitorDialog";
import { useMutateMonitor } from "../../../../hooks/monitors.query";
import { enqueueSnackbar } from "notistack";
import { Link } from "react-router-dom";

interface ItemMenuProps {
  monitor: IMonitorResponse;
}

const ItemMenu: FunctionComponent<ItemMenuProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: update, isLoading: isUpdating } = useMutateMonitor(
    props.monitor.id,
  );

  const setMonitorState = (state: "ACTIVE" | "INACTIVE") => {
    if (isUpdating) {
      return;
    }

    try {
      update({
        ...props.monitor,
        state: state,
      });
    } catch (e) {
      enqueueSnackbar("Failed to update monitor state", { variant: "error" });
    }
  };

  const isActive = useMemo(
    () => props.monitor.state === "ACTIVE",
    [props.monitor.state],
  );

  return (
    <>
      <IconButton
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
          setOpen(true);
          event.stopPropagation();
        }}
      >
        <RiMore2Line />
      </IconButton>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            setMonitorState(isActive ? "INACTIVE" : "ACTIVE");
          }}
        >
          <ListItemIcon>{isActive ? <IoPause /> : <IoPlay />}</ListItemIcon>
          <Typography variant="inherit">
            {isActive ? "Pause" : "Resume"}
          </Typography>
        </MenuItem>

        <MenuItem
          component={Link}
          to={`/monitors/${props.monitor.id}/settings`}
        >
          <ListItemIcon>
            <TiPencil />
          </ListItemIcon>
          <Typography variant="inherit">Edit</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpen(false);
            setShowDeleteDialog(true);
          }}
        >
          <ListItemIcon>
            <IoTrash />
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>

      <DeleteMonitorDialog
        open={showDeleteDialog}
        monitor={props.monitor}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
};

export default ItemMenu;
