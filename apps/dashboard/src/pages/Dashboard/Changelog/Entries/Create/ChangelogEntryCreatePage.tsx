import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Skeleton,
  Stack,
  Textarea,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../../../../components/Container/Container";
import {
  useChangelog,
  useCreateChangelogEntry,
} from "../../../../../hooks/changelogs.query";
import { getErrorMessage } from "../../../../../utilities/errors";

interface ChangelogEntryFormValues {
  title: string;
  content: string;
}

const ChangelogEntryCreatePage: FunctionComponent = () => {
  const params = useParams();
  const changelogId = Number(params.id) || 0;
  const navigate = useNavigate();

  const { data: changelog, isPending } = useChangelog(changelogId);
  const { mutateAsync: createEntry, isPending: isCreating } =
    useCreateChangelogEntry(changelogId);

  const { control, handleSubmit } = useForm<ChangelogEntryFormValues>({
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = async (values: ChangelogEntryFormValues) => {
    try {
      await createEntry(values);
      enqueueSnackbar("Entry created successfully", { variant: "success" });
      navigate("..");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to create entry"), {
        variant: "error",
      });
    }
  };

  if (isPending) {
    return (
      <Container>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: "lg" }}
        />
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Changelog | {changelog?.name} | Entries | Create</title>
      </Helmet>

      <Container header="New Entry">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={!!error}>
                  <FormLabel>Title</FormLabel>
                  <Input {...field} />
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={!!error}>
                  <FormLabel>Content</FormLabel>
                  <Textarea {...field} minRows={4} />
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Card>
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button type="submit" loading={isCreating}>
              Create Entry
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default ChangelogEntryCreatePage;
