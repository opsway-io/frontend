import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { IGetTeamResponse } from "../../../../api/endpoints/teams";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import { useDeleteTeam } from "../../../../hooks/team.query";

interface DeleteTeamDialogProps {
  team: IGetTeamResponse;
  onClose: () => void;
}

/** Mount only while open so the confirmation input starts empty. */
const DeleteTeamDialog: FunctionComponent<DeleteTeamDialogProps> = ({
  team,
  onClose,
}) => {
  const [confirmation, setConfirmation] = useState("");
  const setCurrentTeamID = useAuthenticationStore(
    (state) => state.setCurrentTeamID,
  );
  const { mutateAsync: deleteTeam, isPending } = useDeleteTeam(team.id);

  const handleDelete = async () => {
    try {
      await deleteTeam();
      setCurrentTeamID(undefined);
      onClose();
    } catch {
      enqueueSnackbar("Failed to delete team.", { variant: "error" });
    }
  };

  return (
    <Dialog
      title="Are you absolutely sure?"
      open
      maxWidth="sm"
      onClose={onClose}
    >
      <DialogContent>
        <Stack spacing={2}>
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoWarningOutline size={18} />}
          >
            This action cannot be undone.
          </Alert>

          <Typography level="body-md" textColor="text.secondary">
            This will permanently delete the team including all related data
            such as monitors, incidents, status pages etc.
          </Typography>

          <FormControl>
            <FormLabel>
              <span>
                Please type{" "}
                <Typography fontWeight={600} textColor="text.primary">
                  {team.name}
                </Typography>{" "}
                to confirm.
              </span>
            </FormLabel>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of a dialog the user just opened
              autoFocus
              placeholder={team.name}
            />
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="plain" color="neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="danger"
          disabled={confirmation !== team.name}
          onClick={handleDelete}
          loading={isPending}
        >
          Delete team
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTeamDialog;
