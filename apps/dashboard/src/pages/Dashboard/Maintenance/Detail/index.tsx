import { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  useMaintenanceWindow,
  useUpdateMaintenanceWindow,
  useDeleteMaintenanceWindow,
} from "../../../../hooks/maintenance.query";
import { useMonitors } from "../../../../hooks/monitors.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";
import { Restrict, Role } from "../../../../components/Restrict";

interface IFormInput {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  monitorIds: number[];
}

interface MaintenanceWindowDetailViewProps {}

const MaintenanceWindowDetailView: FunctionComponent<
  MaintenanceWindowDetailViewProps
> = () => {
  const { id: idStr } = useParams();
  const id = Number(idStr);
  const navigate = useNavigate();

  const [openDelete, setOpenDelete] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);

  const { data: window, isLoading } = useMaintenanceWindow(id);
  const { mutateAsync: updateMaintenance, isLoading: isUpdating } =
    useUpdateMaintenanceWindow(id);
  const { mutateAsync: deleteMaintenance, isLoading: isDeleting } =
    useDeleteMaintenanceWindow();

  const { data: monitorsResponse } = useMonitors();
  const monitorsList = monitorsResponse?.monitors || [];

  const isActive = useMemo(() => {
    if (!window?.settings) return false;
    const now = new Date().getTime();
    const start = new Date(window.settings.startAt).getTime();
    const end = new Date(window.settings.endAt).getTime();
    return now >= start && now <= end;
  }, [window]);

  const { control, handleSubmit, reset, getValues } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      description: "",
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 3600000).toISOString(),
      monitorIds: [],
    },
  });

  useEffect(() => {
    if (window) {
      reset({
        title: window.title,
        description: window.description || "",
        startAt: window.settings?.startAt
          ? new Date(window.settings.startAt).toISOString()
          : new Date().toISOString(),
        endAt: window.settings?.endAt
          ? new Date(window.settings.endAt).toISOString()
          : new Date(Date.now() + 3600000).toISOString(),
        monitorIds: window.monitors
          ? window.monitors.map((m: any) => m.id)
          : [],
      });
    }
  }, [window, reset]);

  const onSubmit = async (data: IFormInput) => {
    try {
      await updateMaintenance(data);
      enqueueSnackbar("Maintenance window updated successfully", {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to update window", {
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMaintenance(id);
      enqueueSnackbar("Maintenance window deleted", { variant: "success" });
      navigate("..");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to delete", { variant: "error" });
    }
  };

  const handleCompleteEarly = async () => {
    try {
      if (!window) return;

      const start = new Date(window.settings.startAt);
      let end = new Date();

      // Guarantee end time is after start time to pass backend validation
      if (end <= start) {
        end = new Date(start.getTime() + 1000);
      }

      const data: IFormInput = {
        title: window.title,
        description: window.description || "",
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        monitorIds: window.monitors
          ? window.monitors.map((m: any) => m.id)
          : [],
      };

      await updateMaintenance(data);
      enqueueSnackbar(
        "Maintenance window completed. Monitors will resume within 1 minute.",
        { variant: "success", autoHideDuration: 6000 },
      );
      navigate("/maintenance");
    } catch (err: any) {
      console.error("Complete early error:", err);
      enqueueSnackbar(
        err?.response?.data?.message ||
          err.message ||
          "Failed to complete early",
        { variant: "error" },
      );
    } finally {
      setOpenComplete(false);
    }
  };

  if (isLoading)
    return (
      <Container header="Loading...">
        <Placeholder />
      </Container>
    );

  if (!window)
    return (
      <Container header="Not Found">
        <div>Maintenance window not found</div>
      </Container>
    );

  return (
    <>
      <Container
        header={window.title}
        breadcrumbs={[
          <Link to="/maintenance" key="maintenance">
            Maintenance
          </Link>,
          <span key="detail">{window.title}</span>,
        ]}
        primaryActions={[
          isActive ? (
            <Restrict min={Role.ADMIN} key="complete">
              <Button
                color="warning"
                variant="outlined"
                onClick={() => setOpenComplete(true)}
              >
                Complete Early
              </Button>
            </Restrict>
          ) : null,
          <Restrict min={Role.ADMIN} key="delete">
            <Button
              color="error"
              variant="outlined"
              onClick={() => setOpenDelete(true)}
            >
              Delete
            </Button>
          </Restrict>,
        ].filter(Boolean)}
      >
        <Stack spacing={2} sx={{ mt: 2 }}>
          {isActive ? (
            <Alert severity="warning">
              This maintenance window is currently active. Target monitors will
              not trigger incident alerts until it is over.
            </Alert>
          ) : (
            <Alert severity="info">
              This maintenance window is scheduled for the future.
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
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
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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

              <div>
                <Button type="submit" variant="contained" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Stack>
          </form>
        </Stack>
      </Container>
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Maintenance Window?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this maintenance window? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={isDeleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openComplete} onClose={() => setOpenComplete(false)}>
        <DialogTitle>Complete Maintenance Early?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this maintenance window right now? All
            associated monitors will resume checks.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenComplete(false)}>Cancel</Button>
          <Button
            color="warning"
            onClick={handleCompleteEarly}
            disabled={isUpdating}
          >
            Complete Early
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MaintenanceWindowDetailView;
