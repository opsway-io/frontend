import { LoadingButton } from "@mui/lab";
import { Alert, Stack, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { FunctionComponent, useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "../../../../components/Dialog";
import { IGetTeamResponse } from "../../../../api/endpoints/teams";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import { useDeleteTeam } from "../../../../hooks/team.query";

interface DeleteTeamDialogProps extends Omit<DialogProps, "onClose"> {
  team: IGetTeamResponse;
  onClose: (ok?: boolean) => void;
}

const DeleteTeamDialog: FunctionComponent<DeleteTeamDialogProps> = (props) => {
  const [textFieldValue, setTextFieldValue] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentTeamID = useAuthenticationStore(
    (state) => state.setCurrentTeamID
  );

  const { mutate: deleteTeam, isLoading } = useDeleteTeam(props.team.id);

  useEffect(() => {
    setTextFieldValue("");
  }, [props.open]);

  const handleDelete = async () => {
    try {
      await deleteTeam();

      setCurrentTeamID(undefined);

      props.onClose?.(true);
    } catch (e) {
      enqueueSnackbar("Failed to delete team.", {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      title="Are you absolutely sure?"
      {...props}
      onClose={() => {
        props.onClose?.(false);
      }}
    >
      <DialogContent
        sx={{
          maxWidth: 500,
        }}
      >
        <Stack spacing={2}>
          <Alert severity="error">This action cannot be undone.</Alert>

          <Typography>
            This will permanently delete the team including all related data
            such as monitors, incidents, status pages etc.
          </Typography>

          <Typography>
            Please type <strong>{props.team.name}</strong> to confirm.
          </Typography>

          <TextField
            fullWidth
            value={textFieldValue}
            onChange={(e) => setTextFieldValue(e.target.value)}
            autoFocus={true}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          color="error"
          disabled={textFieldValue !== props.team.name}
          onClick={handleDelete}
          loading={isLoading}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTeamDialog;
