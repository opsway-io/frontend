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
  Switch,
  FormControlLabel,
  Typography,
  Autocomplete,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAlertRule,
  useUpdateAlertRule,
  useDeleteAlertRule,
} from "../../../../hooks/alerting.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";
import { Restrict, Role } from "../../../../components/Restrict";

const CHANNEL_OPTIONS = ["email", "discord", "telegram", "sms", "voice", "datadog", "new_relic"];
const CONDITION_OPTIONS = ["monitor_down", "*", "ssl_expiry"];

interface IFormInput {
  name: string;
  condition: string;
  channels: string[];
  enabled: boolean;
}

const AlertRuleDetailView: FunctionComponent = () => {
  const navigate = useNavigate();
  const { ruleId } = useParams();
  const id = parseInt(ruleId || "0", 10);

  const { data: rule, isLoading } = useAlertRule(id);
  const { mutateAsync: updateAlertRule, isLoading: isUpdating } =
    useUpdateAlertRule(id);
  const { mutateAsync: deleteAlertRule, isLoading: isDeleting } =
    useDeleteAlertRule();

  const [openDelete, setOpenDelete] = useState(false);

  const { control, handleSubmit, reset } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      condition: "",
      channels: [],
      enabled: true,
    },
  });

  useEffect(() => {
    if (rule) {
      let channelsArr: string[] = [];
      try {
        const parsed = JSON.parse(rule.channels);
        if (Array.isArray(parsed)) {
          channelsArr = parsed;
        }
      } catch (e) {
        channelsArr = rule.channels.split(",").map((c: string) => c.trim()).filter((c: string) => c);
      }
      reset({
        name: rule.name,
        condition: rule.condition,
        channels: channelsArr,
        enabled: rule.enabled,
      });
    }
  }, [rule, reset]);

  const onSubmit = async (data: IFormInput) => {
    try {
      const payload = {
        ...data,
        channels: JSON.stringify(data.channels),
      };
      await updateAlertRule(payload);
      enqueueSnackbar("Alert rule updated", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to update", { variant: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAlertRule(id);
      enqueueSnackbar("Alert rule deleted", { variant: "success" });
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
  if (!rule)
    return (
      <Container header="Not Found">
        <div>Alert rule not found</div>
      </Container>
    );

  return (
    <>
      <Container
        header={rule.name}
        breadcrumbs={[
          <Link to="/alerting" key="alerting">
            Alerting
          </Link>,
          <span key="detail">{rule.name}</span>,
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Rule Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={2}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Rule Name"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Condition is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        freeSolo
                        options={CONDITION_OPTIONS}
                        value={field.value}
                        onChange={(_, newValue) => field.onChange(newValue || "")}
                        onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Trigger Condition"
                            fullWidth
                            error={!!error}
                            helperText={error?.message || "Select a default or type a custom match string"}
                          />
                        )}
                      />
                    )}
                  />
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={2}>
                  <Controller
                    name="channels"
                    control={control}
                    rules={{ required: "At least one channel is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        multiple
                        options={CHANNEL_OPTIONS}
                        value={field.value || []}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Notification Channels"
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="enabled"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Enable this rule"
                      />
                    )}
                  />
                </Stack>
              </Paper>

              <Box>
                <Button type="submit" variant="contained" disabled={isUpdating} size="large">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Container>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Alert Rule?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this alert rule? You will no longer
            receive notifications for it.
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

export default AlertRuleDetailView;
