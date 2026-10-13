import {
  Dropdown,
  IconButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { AiOutlineCrown } from "react-icons/ai";
import { IoRocketOutline, IoTrashOutline } from "react-icons/io5";
import { RiMore2Line } from "react-icons/ri";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import { Restrict, Role } from "../../../../components/Restrict";
import { removeTeamUser } from "../../../../hooks/team.query";
import ChangeRoleDialog from "./ChangeRoleDialog";
import TransferOwnershipDialog from "./TransferOwnershipDialog";

interface MemberActionsMenuProps {
  user: IGetTeamUserResponse;
  team: IGetTeamResponse;
}

const MemberActionsMenu: FunctionComponent<MemberActionsMenuProps> = ({
  user,
  team,
}) => {
  const [openChangeRoleDialog, setOpenChangeRoleDialog] = useState(false);
  const [openTransferOwnershipDialog, setOpenTransferOwnershipDialog] =
    useState(false);

  const removeUser = async () => {
    try {
      await removeTeamUser(team.id, user.id);
    } catch {
      enqueueSnackbar(
        `Failed to remove ${user.displayName || user.name} from the team.`,
        { variant: "error" },
      );
    }
  };

  return (
    <>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "plain", color: "neutral", size: "sm" },
          }}
          aria-label="Member actions"
          onClick={(event) => event.stopPropagation()}
        >
          <RiMore2Line />
        </MenuButton>

        <Menu
          placement="bottom-end"
          size="sm"
          sx={{ minWidth: 200 }}
          onClick={(event) => event.stopPropagation()}
        >
          <Restrict specific={Role.OWNER}>
            <MenuItem onClick={() => setOpenTransferOwnershipDialog(true)}>
              <ListItemDecorator>
                <AiOutlineCrown />
              </ListItemDecorator>
              Transfer ownership
            </MenuItem>
          </Restrict>

          <MenuItem onClick={() => setOpenChangeRoleDialog(true)}>
            <ListItemDecorator>
              <IoRocketOutline />
            </ListItemDecorator>
            Change role
          </MenuItem>

          <ListDivider />

          <MenuItem color="danger" onClick={removeUser}>
            <ListItemDecorator sx={{ color: "inherit" }}>
              <IoTrashOutline />
            </ListItemDecorator>
            Remove from team
          </MenuItem>
        </Menu>
      </Dropdown>

      {/* Mounted only while open so they start from the member's current state. */}
      {openChangeRoleDialog && (
        <ChangeRoleDialog
          open
          onClose={() => setOpenChangeRoleDialog(false)}
          user={user}
          team={team}
        />
      )}

      {openTransferOwnershipDialog && (
        <TransferOwnershipDialog
          open
          onClose={() => setOpenTransferOwnershipDialog(false)}
          receiver={user}
          team={team}
        />
      )}
    </>
  );
};

export default MemberActionsMenu;
