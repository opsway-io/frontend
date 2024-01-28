import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import {
  CategoryList,
  CategoryListItem,
} from "../../../../components/CategoryList";
import EditableInput from "../../../../components/EditableInput";
import { Restrict, Role } from "../../../../components/Restrict";
import {
  useCurrentTeam,
  useMutateCurrentTeam,
} from "../../../../hooks/team.query";
import DeleteTeamDialog from "../components/DeleteTeamDialog";

const TeamSettingsTabView: FunctionComponent = () => {
  const { data: team, isLoading } = useCurrentTeam();
  const { mutate } = useMutateCurrentTeam();

  const [displayName, setDisplayName] = useState<string>("");

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    setDisplayName(team?.displayName ?? "");
  }, [team]);

  const handleSave = () => {
    if (displayName == null) {
      return;
    }

    mutate({
      displayName: displayName,
    });
  };

  return (
    <>
      <Card>
        <CardContent>
          <CategoryList>
            <CategoryListItem
              title="Team name"
              description="The team slug cannot be changed and is used in URL's. The team display name is the actual name of the team visible to users."
            >
              <TextField label="Team slug" value={team?.name} disabled />

              <EditableInput
                label="Display name"
                value={displayName}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </CategoryListItem>
          </CategoryList>
        </CardContent>
      </Card>

      <Restrict specific={Role.OWNER}>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }} color="text.secondary">
          Danger zone
        </Typography>

        <Card>
          <CardContent>
            <CategoryList>
              <CategoryListItem
                title="Delete team"
                description="This action cannot be undone. All data will be lost."
              >
                <Typography variant="body2" color="textSecondary">
                  Deleting a team will remove all data associated with it. This
                  action cannot be undone. All data associated with this team
                  will be lost.
                </Typography>

                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete team
                  </Button>
                </Box>
              </CategoryListItem>
            </CategoryList>
          </CardContent>
        </Card>
      </Restrict>

      {team && (
        <DeleteTeamDialog
          team={team}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
};

export default TeamSettingsTabView;
