import { Alert, Button, Input, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { Monitor } from "../../../../api/endpoints/monitors";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import { useDeleteMonitor } from "../../../../hooks/monitors.query";

interface DeleteMonitorDialogProps {
  open: boolean;
  monitor: Monitor;
  onClose: (deleted: boolean) => void;
}

/** Asks the user to type the monitor name before deleting it. */
const DeleteMonitorDialog: FunctionComponent<DeleteMonitorDialogProps> = (
  props,
) => {
  const [confirmation, setConfirmation] = useState("");
  const { isPending, mutate } = useDeleteMonitor();

  const close = (deleted: boolean) => {
    setConfirmation("");
    props.onClose(deleted);
  };

  const handleDelete = () => {
    mutate(props.monitor.id, { onSuccess: () => close(true) });
  };

  return (
    <Dialog
      title="Are you absolutely sure?"
      maxWidth="xs"
      open={props.open}
      onClose={() => close(false)}
    >
      <DialogContent>
        <Stack spacing={2}>
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoWarningOutline />}
          >
            This action cannot be undone.
          </Alert>

          <Typography level="body-sm" textColor="text.secondary">
            This will permanently delete the monitor including all related data
            such as metrics, checks and incidents.
          </Typography>

          <Typography level="body-sm" textColor="text.secondary">
            Please type{" "}
            <Typography fontWeight="lg" textColor="text.primary">
              {props.monitor.name}
            </Typography>{" "}
            to confirm.
          </Typography>

          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            aria-label="Monitor name"
            // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of a dialog
            autoFocus
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="neutral" onClick={() => close(false)}>
          Cancel
        </Button>
        <Button
          color="danger"
          disabled={confirmation !== props.monitor.name}
          loading={isPending}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMonitorDialog;
