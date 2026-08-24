import { FunctionComponent } from "react";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useCreateMaintenanceWindow } from "../../../../hooks/maintenance.query";
import { useMonitors } from "../../../../hooks/monitors.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import Container from "../../../../components/Container";

interface IFormInput {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  monitorIds: number[];
}

interface MaintenanceWindowCreateViewProps {}

const MaintenanceWindowCreateView: FunctionComponent<
  MaintenanceWindowCreateViewProps
> = () => {
  const navigate = useNavigate();
  const { mutateAsync: createMaintenance, isLoading } =
    useCreateMaintenanceWindow();

  const { control, handleSubmit, getValues } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      description: "",
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 3600000).toISOString(),
      monitorIds: [],
    },
  });

  const { data: monitorsResponse } = useMonitors();
  const monitorsList = monitorsResponse?.monitors || [];

  const onSubmit = async (data: IFormInput) => {
    try {
      await createMaintenance(data);
      enqueueSnackbar("Maintenance window scheduled successfully", {
        variant: "success",
      });
      navigate("..");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to schedule window", {
        variant: "error",
      });
    }
  };

  return (
    <Container
      header="Create Maintenance Window"
      breadcrumbs={[
        <Link to="/maintenance" key="maintenance">
          Maintenance
        </Link>,
        <span key="create">Create</span>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={3}
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="startAt"
            control={control}
            rules={{ required: "Start time is required" }}
            render={({ field, fieldState: { error } }) => (
              <Flatpickr
                options={{ enableTime: true, time_24hr: true }}
                value={field.value ? new Date(field.value) : new Date()}
                onChange={([date]) => field.onChange(date.toISOString())}
                render={({ defaultValue, value, ...props }, ref) => (
                  <TextField
                    {...props}
                    inputRef={ref}
                    label="Start Time"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}
          />
          <Controller
            name="endAt"
            control={control}
            rules={{
              required: "End time is required",
              validate: (value) => {
                const start = getValues("startAt");
                if (new Date(value) <= new Date(start)) {
                  return "End time must be after the start time";
                }
                return true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Flatpickr
                options={{ enableTime: true, time_24hr: true }}
                value={field.value ? new Date(field.value) : new Date()}
                onChange={([date]) => field.onChange(date.toISOString())}
                render={({ defaultValue, value, ...props }, ref) => (
                  <TextField
                    {...props}
                    inputRef={ref}
                    label="End Time"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}
          />
          <Controller
            name="monitorIds"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={monitorsList}
                getOptionLabel={(option) => option.name}
                value={monitorsList.filter((m: any) =>
                  field.value.includes(m.id),
                )}
                onChange={(_, newValue) =>
                  field.onChange(newValue.map((v) => v.id))
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Target Monitors"
                    placeholder="Leave empty to target all monitors"
                  />
                )}
              />
            )}
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default MaintenanceWindowCreateView;
