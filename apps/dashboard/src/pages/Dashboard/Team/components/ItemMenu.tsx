import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { AiOutlineCrown } from "react-icons/ai";
import { IoRocket, IoTrash } from "react-icons/io5";
import { RiMore2Line } from "react-icons/ri";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import { Restrict, Role } from "../../../../components/Restrict";
import { removeTeamUser } from "../../../../hooks/team.query";
import ChangeRoleModal from "./ChangeRoleDialog";
import TransferOwnerShipDialog from "./TransferOwnershipDialog";
interface ItemMenuProps {
  user?: IGetTeamUserResponse;
  team?: IGetTeamResponse;
}

const ItemMenu: FunctionComponent<ItemMenuProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Remove user

  const removeUser = async () => {
    if (!props.team || !props.user) {
      return;
    }

    try {
      await removeTeamUser(props.team?.id, props.user?.id);
    } catch {
      enqueueSnackbar(
        `Failed to remove ${props.user?.displayName} from the team.`,
        { variant: "error" },
      );
    }

    setOpen(false);
  };

  const [openChangeRoleModal, setOpenChangeRoleModal] = useState(false);
  const [openTransferOwnershipModal, setOpenTransferOwnershipModal] =
    useState(false);

  const changeRole = () => {
    setOpen(false);
    setOpenChangeRoleModal(true);
  };

  const transferOwnership = () => {
    setOpen(false);
    setOpenTransferOwnershipModal(true);
  };

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
        <Restrict specific={Role.OWNER}>
          <MenuItem onClick={transferOwnership}>
            <ListItemIcon>
              <AiOutlineCrown />
            </ListItemIcon>
            <Typography variant="inherit">Transfer Ownership</Typography>
          </MenuItem>
        </Restrict>

        <MenuItem onClick={changeRole}>
          <ListItemIcon>
            <IoRocket />
          </ListItemIcon>
          <Typography variant="inherit">Change role</Typography>
        </MenuItem>

        <MenuItem onClick={removeUser}>
          <ListItemIcon>
            <IoTrash />
          </ListItemIcon>
          <Typography variant="inherit">Remove from team</Typography>
        </MenuItem>
      </Menu>

      {props.team && props.user && (
        <>
          <ChangeRoleModal
            open={openChangeRoleModal}
            onClose={() => setOpenChangeRoleModal(false)}
            user={props.user}
            team={props.team}
          />

          <TransferOwnerShipDialog
            open={openTransferOwnershipModal}
            onClose={() => setOpenTransferOwnershipModal(false)}
            receiver={props.user}
            team={props.team}
          />
        </>
      )}
    </>
  );
};

export default ItemMenu;
