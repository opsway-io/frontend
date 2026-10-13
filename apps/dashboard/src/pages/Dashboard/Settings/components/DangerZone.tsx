import { Button, FormControl, FormLabel, Option, Select } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { IGetTeamResponse } from "../../../../api/endpoints/teams";
import { Role } from "../../../../components/Restrict";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { useTeamUsers } from "../../../../hooks/team.query";
import TransferOwnershipDialog from "../../Team/components/TransferOwnershipDialog";
import DeleteTeamDialog from "./DeleteTeamDialog";

interface DangerZoneProps {
  team: IGetTeamResponse;
}

/** Owner-only actions: hand the team over to another member or delete it. */
const DangerZone: FunctionComponent<DangerZoneProps> = ({ team }) => {
  const { data: usersData } = useTeamUsers();
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const candidates = (usersData?.users ?? []).filter(
    (user) => !Role.OWNER.equalOrHigher(user.role),
  );
  const receiver = candidates.find((user) => user.id === receiverId);

  return (
    <>
      <SettingsCard
        danger
        title="Transfer ownership"
        description="Make another member the owner of this team. You will be downgraded to an admin."
        actions={
          <Button
            color="danger"
            variant="outlined"
            disabled={!receiver}
            onClick={() => setOpenTransferDialog(true)}
          >
            Transfer ownership
          </Button>
        }
      >
        <FormControl>
          <FormLabel>New owner</FormLabel>
          <Select
            placeholder={
              candidates.length ? "Select a member" : "No other members yet"
            }
            value={receiverId}
            onChange={(_, value) => setReceiverId(value)}
            disabled={candidates.length === 0}
          >
            {candidates.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.displayName || user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </FormControl>
      </SettingsCard>

      <SettingsCard
        danger
        title="Delete team"
        description="Deleting a team will permanently remove all data associated with it, including monitors, incidents and status pages. This action cannot be undone."
        actions={
          <Button color="danger" onClick={() => setOpenDeleteDialog(true)}>
            Delete team
          </Button>
        }
      />

      {receiver && openTransferDialog && (
        <TransferOwnershipDialog
          open
          receiver={receiver}
          team={team}
          onClose={() => {
            setOpenTransferDialog(false);
            setReceiverId(null);
          }}
        />
      )}

      {openDeleteDialog && (
        <DeleteTeamDialog
          team={team}
          onClose={() => setOpenDeleteDialog(false)}
        />
      )}
    </>
  );
};

export default DangerZone;
