import { Stack, TextField, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog";
import { IoAdd } from "react-icons/io5";
import { useCreateChangelog } from "../../../../hooks/changelogs.query";
import { enqueueSnackbar } from "notistack";
interface CreateChangelogModalProps {
  open: boolean;
  onClose?: () => void;
}

const CreateChangelogModal: FunctionComponent<CreateChangelogModalProps> = (
  props,
) => {
  const { mutate, isLoading } = useCreateChangelog();

  const {
    register,
    formState: { isValid },
    reset,
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const onClose = () => {
    props.onClose?.();
    reset();
  };

  const onSubmit = (data: { name: string }) => {
    mutate(data.name, {
      onSuccess: () => {
        onClose();
        enqueueSnackbar(`Changelog "${data.name}" created`, {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar("Failed to create changelog", { variant: "error" });
      },
    });
  };

  return (
    <Dialog open={props.open} onClose={onClose} title="New changelog">
      <DialogContent sx={{ minWidth: 400 }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="textPrimary">
            Changelog name
          </Typography>

          <TextField
            fullWidth
            disabled={isLoading}
            autoFocus
            {...register("name", {
              required: true,
              minLength: 3,
              maxLength: 255,
              // must only contain letters, numbers, spaces, underscores and dashes.
              // It may not start or end with a space.
              pattern: /^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$/,
            })}
          />

          <Typography variant="body1" color="textSecondary">
            Changelog must be be between 3 and 255 characters long and may only
            contain letters, numbers, spaces, underscores and dashes.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          color="success"
          disabled={!isValid}
          onClick={handleSubmit((data) => {
            onSubmit(data);
          })}
          loading={isLoading}
          startIcon={<IoAdd />}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateChangelogModal;
