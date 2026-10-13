import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FormEvent, FunctionComponent, useState } from "react";
import { IGetTeamResponse } from "../../../../api/endpoints/teams";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { useMutateCurrentTeam } from "../../../../hooks/team.query";
import { toTeamUpdateRequest } from "../teamUpdateRequest";

interface TeamNameCardProps {
  team: IGetTeamResponse;
}

const TeamNameCard: FunctionComponent<TeamNameCardProps> = ({ team }) => {
  const { mutate, isPending } = useMutateCurrentTeam();
  const [displayName, setDisplayName] = useState(team.displayName ?? "");

  const changed = displayName !== (team.displayName ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!changed) return;

    mutate(toTeamUpdateRequest(team, { displayName }), {
      onSuccess: () => {
        enqueueSnackbar("Settings saved", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Failed to save settings", { variant: "error" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard
        title="Team name"
        description="The team slug cannot be changed and is used in URLs. The display name is the name of the team visible to users."
        actions={
          <Button type="submit" disabled={!changed} loading={isPending}>
            Save
          </Button>
        }
      >
        <FormControl disabled>
          <FormLabel>Team slug</FormLabel>
          <Input value={team.name} readOnly />
        </FormControl>

        <FormControl>
          <FormLabel>Display name</FormLabel>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </FormControl>
      </SettingsCard>
    </form>
  );
};

export default TeamNameCard;
