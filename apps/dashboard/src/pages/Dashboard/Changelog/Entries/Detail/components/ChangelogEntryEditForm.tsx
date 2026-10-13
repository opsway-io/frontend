import { Button, Card, FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IChangelogEntry } from "../../../../../../api/endpoints/changelogs";
import {
  useDeleteChangelogEntry,
  useUpdateChangelogEntry,
} from "../../../../../../hooks/changelogs.query";
import { getErrorMessage } from "../../../../../../utilities/errors";

interface ChangelogEntryEditFormProps {
  changelogId: number;
  entry: IChangelogEntry;
}

interface ChangelogEntryEditFormValues {
  title: string;
}

const ChangelogEntryEditForm: FunctionComponent<
  ChangelogEntryEditFormProps
> = ({ changelogId, entry }) => {
  const navigate = useNavigate();
  const { mutateAsync: updateEntry, isPending: isUpdating } =
    useUpdateChangelogEntry(changelogId, entry.id);
  const { mutateAsync: deleteEntry, isPending: isDeleting } =
    useDeleteChangelogEntry(changelogId);

  const { control, handleSubmit } = useForm<ChangelogEntryEditFormValues>({
    defaultValues: { title: entry.title },
  });

  const onSubmit = async (values: ChangelogEntryEditFormValues) => {
    try {
      await updateEntry(values);
      enqueueSnackbar("Entry updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to update entry"), {
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntry(entry.id);
      enqueueSnackbar("Entry deleted successfully", { variant: "success" });
      navigate(`/changelogs/${changelogId}`);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to delete entry"), {
        variant: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input {...field} />
            </FormControl>
          )}
        />
      </Card>
      <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
        <Button
          variant="outlined"
          color="danger"
          onClick={handleDelete}
          loading={isDeleting}
        >
          Delete
        </Button>
        <Button type="submit" loading={isUpdating}>
          Save
        </Button>
      </Stack>
    </form>
  );
};

export default ChangelogEntryEditForm;
