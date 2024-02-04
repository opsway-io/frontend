import { LoadingButton } from "@mui/lab";
import { Alert, Stack, TextField, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { Monitor } from "../../../../api/endpoints/monitors";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "../../../../components/Dialog";
import { useDeleteMonitor } from "../../../../hooks/monitors.query";

interface DeleteMonitorDialogProps extends Omit<DialogProps, "onClose"> {
  monitor: Monitor;
  onClose: (ok?: boolean) => void;
}

const DeleteMonitorDialog: FunctionComponent<DeleteMonitorDialogProps> = (
  props,
) => {
  const [textFieldValue, setTextFieldValue] = useState<string>("");

  const { error, isLoading, mutate } = useDeleteMonitor();

  useEffect(() => {
    setTextFieldValue("");
  }, [props.open]);

  const handleDelete = () => {
    if (!props.monitor) {
      return;
    }

    mutate(props.monitor.id, {
      onSuccess: () => {
        props.onClose?.(true);
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
            This will permanently delete the monitor including all related data
            such as metrics, checks and incidents.
          </Typography>

          <Typography>
            Please type <strong>{props.monitor?.name}</strong> to confirm.
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
          disabled={textFieldValue !== props.monitor?.name}
          loading={isLoading}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMonitorDialog;
