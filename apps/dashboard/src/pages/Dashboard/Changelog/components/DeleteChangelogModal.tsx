import { LoadingButton } from "@mui/lab";
import { Alert, Stack, TextField, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "../../../../components/Dialog";
import { useDeleteChangelog } from "../../../../hooks/changelogs.query";
import { IChangelog } from "../../../../api/endpoints/changelogs";
import { enqueueSnackbar } from "notistack";

interface DeleteChangelogDialogProps extends Omit<DialogProps, "onClose"> {
  changelog: IChangelog;
  onClose: (ok?: boolean) => void;
}

const DeleteChangelogDialog: FunctionComponent<DeleteChangelogDialogProps> = (
  props
) => {
  const [textFieldValue, setTextFieldValue] = useState<string>("");

  const { error, isLoading, mutate } = useDeleteChangelog();

  useEffect(() => {
    setTextFieldValue("");
  }, [props.open]);

  const handleDelete = () => {
    if (!props.changelog) {
      return;
    }

    mutate(props.changelog.id, {
      onSuccess: () => {
        props.onClose?.(true);
      },
      onError: () => {
        enqueueSnackbar("Failed to delete changelog", { variant: "error" });
      },
    });
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
            This will permanently delete the changelog including all related
            data such as entries and comments.
          </Typography>

          <Typography>
            Please type <strong>{props.changelog?.name}</strong> to confirm.
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
          disabled={textFieldValue !== props.changelog?.name}
          loading={isLoading}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteChangelogDialog;
