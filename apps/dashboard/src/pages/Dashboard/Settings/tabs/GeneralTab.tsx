import { Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { Restrict, Role } from "../../../../components/Restrict";
import { useCurrentTeam } from "../../../../hooks/team.query";
import DangerZone from "../components/DangerZone";
import TeamAvatarCard from "../components/TeamAvatarCard";
import TeamNameCard from "../components/TeamNameCard";

const GeneralTab: FunctionComponent = () => {
  const { data: team } = useCurrentTeam();

  if (!team) return <Placeholder />;

  return (
    <Stack spacing={2}>
      {/* Keyed on updatedAt so the form picks up saved values. */}
      <TeamNameCard key={team.updatedAt} team={team} />
      <TeamAvatarCard team={team} />
      <Restrict specific={Role.OWNER}>
        <DangerZone team={team} />
      </Restrict>
    </Stack>
  );
};

export default GeneralTab;
