import { Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import * as TeamsAPI from "../../../../api/endpoints/teams";
import Avatar from "../../../../components/Avatar/Avatar";
import ChangeAvatarDialog from "../../../../components/ChangeAvatarDialog/ChangeAvatarDialog";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";

interface TeamAvatarCardProps {
  team: TeamsAPI.IGetTeamResponse;
}

const TeamAvatarCard: FunctionComponent<TeamAvatarCardProps> = ({ team }) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <SettingsCard
      title="Team avatar"
      description="Shown next to the team name across Opsway."
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={team.avatarUrl}
          name={team.displayName || team.name}
          sx={{ width: 72, height: 72, borderRadius: "lg", fontSize: "xl" }}
        />
        <Stack spacing={1} alignItems="flex-start">
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<IoCloudUploadOutline />}
            onClick={() => setOpenDialog(true)}
          >
            Upload new avatar
          </Button>
          <Typography level="body-xs" textColor="text.tertiary">
            PNG or JPEG, up to 2 MB.
          </Typography>
        </Stack>
      </Stack>

      <ChangeAvatarDialog
        title="Change team avatar"
        open={openDialog}
        onUpload={(image) => TeamsAPI.updateAvatar(team.id, image)}
        onClose={(ok) => {
          setOpenDialog(false);
          if (ok) window.location.reload();
        }}
      />
    </SettingsCard>
  );
};

export default TeamAvatarCard;
