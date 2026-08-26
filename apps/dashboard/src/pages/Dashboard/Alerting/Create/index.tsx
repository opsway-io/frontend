import { FunctionComponent } from "react";
import {
  Button,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Autocomplete,
  Paper,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useCreateAlertRule } from "../../../../hooks/alerting.query";
import { useForm, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Container from "../../../../components/Container";

const CHANNEL_OPTIONS = [
  "email",
  "slack",
  "microsoft_teams",
  "webhook",
  "discord",
  "telegram",
  "sms",
  "voice",
  "datadog",
  "new_relic",
];
const CONDITION_OPTIONS = ["monitor_down", "*", "ssl_expiry"];

interface IFormInput {
  name: string;
  condition: string;
  channels: string[];
  enabled: boolean;
}

const AlertRuleCreateView: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createAlertRule, isLoading } = useCreateAlertRule();

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      name: "",
      condition: "monitor_down",
      channels: ["email"],
      enabled: true,
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      const payload = {
        ...data,
        channels: JSON.stringify(data.channels),
      };
      await createAlertRule(payload);
      enqueueSnackbar("Alert rule created successfully", {
        variant: "success",
      });
      navigate("..");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to create alert rule", {
        variant: "error",
      });
    }
  };

  return (
    <Container
      header="Create Alert Rule"
      breadcrumbs={[
        <Link to="/alerting" key="alerting">
          Alerting
        </Link>,
        <span key="create">Create</span>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ mt: 2 }}>
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
                    onInputChange={(_, newInputValue) =>
                      field.onChange(newInputValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Trigger Condition"
                        fullWidth
                        error={!!error}
                        helperText={
                          error?.message ||
                          "Select a default or type a custom match string"
                        }
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
                    value={field.value}
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
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              size="large"
            >
              {isLoading ? "Creating..." : "Create Rule"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Container>
  );
};

export default AlertRuleCreateView;
