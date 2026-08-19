import { FunctionComponent } from "react";
import { Button, Skeleton, Stack, TextField } from "@mui/material";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useChangelog,
  useChangelogEntry,
  useUpdateChangelogEntry,
  useDeleteChangelogEntry,
} from "../../../../../hooks/changelogs.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import Container from "../../../../../components/Container";

interface IFormInput {
  title: string;
}

const ChangelogEntriesDetailView: FunctionComponent = () => {
  const params = useParams();
  const changelogId = Number(params.id) || 0;
  const entryId = Number(params.entryId) || 0;
  const navigate = useNavigate();

  const { data: changelog, isLoading: isChangelogLoading } =
    useChangelog(changelogId);
  const { data: entry, isLoading: isEntryLoading } = useChangelogEntry(
    changelogId,
    entryId,
  );
  const { mutateAsync: updateEntry, isLoading: isUpdatePending } =
    useUpdateChangelogEntry(changelogId, entryId);
  const { mutateAsync: deleteEntry, isLoading: isDeletePending } =
    useDeleteChangelogEntry(changelogId);

  const { control, handleSubmit, reset } = useForm<IFormInput>({
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (entry) {
      reset({ title: entry.title });
    }
  }, [entry, reset]);

  const onSubmit = async (data: IFormInput) => {
    try {
      await updateEntry(data);
      enqueueSnackbar("Entry updated successfully", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to update entry", {
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntry(entryId);
      enqueueSnackbar("Entry deleted successfully", { variant: "success" });
      navigate("..");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to delete entry", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Changelog | {changelog?.name || "..."} | Edit Entry</title>
      </Helmet>

      <Container header="Changelog Entry">
        {isEntryLoading ? (
          <Skeleton height={100} />
        ) : (
          <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Title" fullWidth />
              )}
            />
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={isUpdatePending}
              >
                Save
              </Button>
              <Button
                color="error"
                onClick={handleDelete}
                disabled={isDeletePending}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default ChangelogEntriesDetailView;
