import { Alert, Button, Input, Stack, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { Changelog } from "../../../../api/endpoints/changelogs";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import { useDeleteChangelog } from "../../../../hooks/changelogs.query";

interface DeleteChangelogDialogProps {
  changelog: Changelog;
  onClose: () => void;
}

/**
 * Asks the user to type the changelog name before deleting it. Mount it only
 * while open so the confirmation input starts empty every time.
 */
const DeleteChangelogDialog: FunctionComponent<DeleteChangelogDialogProps> = ({
  changelog,
  onClose,
}) => {
  const [confirmation, setConfirmation] = useState("");
  const { isPending, mutate } = useDeleteChangelog();

  const handleDelete = () => {
    mutate(changelog.id, {
      onSuccess: onClose,
      onError: () => {
        enqueueSnackbar("Failed to delete changelog", { variant: "error" });
      },
    });
  };

  return (
    <Dialog title="Are you absolutely sure?" open onClose={onClose}>
      <DialogContent>
        <Stack spacing={2}>
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoWarningOutline size={18} />}
          >
            This action cannot be undone.
          </Alert>

          <Typography level="body-sm" textColor="text.secondary">
            This will permanently delete the changelog including all related
            data such as entries and comments.
          </Typography>

          <Typography level="body-sm" textColor="text.secondary">
            Please type{" "}
            <Typography textColor="text.primary" fontWeight={600}>
              {changelog.name}
            </Typography>{" "}
            to confirm.
          </Typography>

          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            aria-label="Changelog name"
            // oxlint-disable-next-line jsx-a11y/no-autofocus -- only field of the dialog
            autoFocus
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="danger"
          disabled={confirmation !== changelog.name}
          loading={isPending}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteChangelogDialog;
