import { FunctionComponent, useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useHeartbeat,
  useUpdateHeartbeat,
  useDeleteHeartbeat,
} from "../../../../hooks/heartbeats.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";
import { Restrict, Role } from "../../../../components/Restrict";
import useAuthenticationStore from "../../../../hooks/authentication.store";

interface IFormInput {
  name: string;
  interval: number;
  grace: number;
}

const HeartbeatDetailView: FunctionComponent = () => {
  const navigate = useNavigate();
  const { heartbeatId } = useParams();
  const id = parseInt(heartbeatId || "0", 10);
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  const { data: hb, isLoading } = useHeartbeat(id);
  const { mutateAsync: updateHeartbeat, isLoading: isUpdating } =
    useUpdateHeartbeat(id);
  const { mutateAsync: deleteHeartbeat, isLoading: isDeleting } =
    useDeleteHeartbeat();

  const [openDelete, setOpenDelete] = useState(false);

  const { control, handleSubmit, reset } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      interval: 5,
      grace: 1,
    },
  });

  useEffect(() => {
    if (hb) {
      reset({
        name: hb.name,
        interval: hb.interval,
        grace: hb.grace,
      });
    }
  }, [hb, reset]);

  const onSubmit = async (data: IFormInput) => {
    try {
      await updateHeartbeat(data);
      enqueueSnackbar("Heartbeat updated", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to update", { variant: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHeartbeat(id);
      enqueueSnackbar("Heartbeat deleted", { variant: "success" });
      navigate("..");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to delete", { variant: "error" });
    }
  };

  if (isLoading)
    return (
      <Container header="Loading...">
        <Placeholder />
      </Container>
    );
  if (!hb)
    return (
      <Container header="Not Found">
        <div>Heartbeat not found</div>
      </Container>
    );

  const curlCommand = `curl -X POST https://api.opsway.io/v1/teams/${teamId}/heartbeats/${id}/ping -H "Authorization: Bearer YOUR_TOKEN"`;

  return (
    <>
      <Container
        header={hb.name}
        breadcrumbs={[
          <Link to="/heartbeats" key="heartbeats">
            Heartbeats
          </Link>,
          <span key="detail">{hb.name}</span>,
        ]}
        primaryActions={[
          <Restrict min={Role.ADMIN} key="delete">
            <Button
              color="error"
              variant="outlined"
              onClick={() => setOpenDelete(true)}
            >
              Delete
            </Button>
          </Restrict>,
        ]}
      >
        <Stack spacing={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How to use
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Send a POST request to this endpoint every {hb.interval} minutes
                to keep the heartbeat UP.
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  fontFamily: "monospace",
                }}
              >
                {curlCommand}
              </Box>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Typography variant="h6">Settings</Typography>
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
                      error?.message ||
                      "How long to wait before marking as DOWN"
                    }
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
        <DialogTitle>Delete Heartbeat?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this heartbeat? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={isDeleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HeartbeatDetailView;
