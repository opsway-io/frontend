import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import { useCreateChangelog } from "../../../../hooks/changelogs.query";

/** Letters, numbers, spaces, underscores and dashes; no leading/trailing space. */
const CHANGELOG_NAME_PATTERN = /^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$/;

interface CreateChangelogFormValues {
  name: string;
}

interface CreateChangelogDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateChangelogDialog: FunctionComponent<CreateChangelogDialogProps> = ({
  open,
  onClose,
}) => {
  const { mutate, isPending } = useCreateChangelog();

  const {
    register,
    formState: { isValid },
    reset,
    handleSubmit,
  } = useForm<CreateChangelogFormValues>({
    defaultValues: { name: "" },
  });

  const close = () => {
    onClose();
    reset();
  };

  const onSubmit = ({ name }: CreateChangelogFormValues) => {
    mutate(name, {
      onSuccess: () => {
        close();
        enqueueSnackbar(`Changelog "${name}" created`, { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Failed to create changelog", { variant: "error" });
      },
    });
  };

  return (
    <Dialog open={open} onClose={close} title="New changelog">
      <DialogContent>
        <FormControl>
          <FormLabel>Changelog name</FormLabel>
          <Input
            disabled={isPending}
            // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of the dialog
            autoFocus
            slotProps={{
              input: {
                ...register("name", {
                  required: true,
                  minLength: 3,
                  maxLength: 255,
                  pattern: CHANGELOG_NAME_PATTERN,
                }),
              },
            }}
          />
          <FormHelperText>
            Must be between 3 and 255 characters long and may only contain
            letters, numbers, spaces, underscores and dashes.
          </FormHelperText>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="neutral" onClick={close}>
          Cancel
        </Button>
        <Button
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
          loading={isPending}
          startDecorator={<IoAdd />}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateChangelogDialog;
