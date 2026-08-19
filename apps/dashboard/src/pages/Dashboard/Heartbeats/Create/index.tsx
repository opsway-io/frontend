import { FunctionComponent } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useCreateHeartbeat } from "../../../../hooks/heartbeats.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Container from "../../../../components/Container";

interface IFormInput {
  name: string;
  interval: number;
  grace: number;
}

const HeartbeatCreateView: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createHeartbeat, isLoading } = useCreateHeartbeat();

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      interval: 5,
      grace: 1,
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      await createHeartbeat(data);
      enqueueSnackbar("Heartbeat created successfully", { variant: "success" });
      navigate("..");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to create heartbeat", {
        variant: "error",
      });
    }
  };

  return (
    <Container
      header="Create Heartbeat"
      breadcrumbs={[
        <Link to="/heartbeats" key="heartbeats">
          Heartbeats
        </Link>,
        <span key="create">Create</span>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="interval"
            control={control}
            rules={{ required: "Interval is required", min: 1 }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Expected Interval (minutes)"
                type="number"
                fullWidth
                error={!!error}
                helperText={
                  error?.message || "How often should we expect a ping?"
                }
              />
            )}
          />

          <Controller
            name="grace"
            control={control}
            rules={{ required: "Grace period is required", min: 0 }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Grace Period (minutes)"
                type="number"
                fullWidth
                error={!!error}
                helperText={
                  error?.message || "How long to wait before marking as DOWN"
                }
              />
            )}
          />

          <div>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </Stack>
      </form>
    </Container>
  );
};

export default HeartbeatCreateView;
