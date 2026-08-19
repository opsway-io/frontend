import { FunctionComponent } from "react";
import { Button, Skeleton, Stack, TextField } from "@mui/material";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import {
  useChangelog,
  useCreateChangelogEntry,
} from "../../../../../hooks/changelogs.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Container from "../../../../../components/Container";

interface IFormInput {
  title: string;
  content: string;
}

const ChangelogEntryCreateView: FunctionComponent = () => {
  const params = useParams();
  const changelogId = Number(params.id) || 0;
  const navigate = useNavigate();

  const { data: changelog, isLoading } = useChangelog(changelogId);
  const { mutateAsync: createEntry, isLoading: isCreating } =
    useCreateChangelogEntry(changelogId);

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      await createEntry(data);
      enqueueSnackbar("Entry created successfully", { variant: "success" });
      navigate("..");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to create entry", {
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Skeleton variant="rectangular" height={200} />
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Changelog | {changelog?.name} | Entries | Create</title>
      </Helmet>

      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error ? "Title is required" : ""}
                />
              )}
            />
            <Controller
              name="content"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Content"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!fieldState.error}
                  helperText={fieldState.error ? "Content is required" : ""}
                />
              )}
            />
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Entry"}
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default ChangelogEntryCreateView;
