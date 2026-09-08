import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SettingsFormData } from "../models/settingsFormData";
import Conditional from "../../../../components/Conditional";

const AuthSettings: FunctionComponent = () => {
  const { control, watch } = useFormContext<SettingsFormData>();

  const authMethod = watch("settings.auth.method");

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Authentication</Typography>
      <Typography variant="body2" color="text.secondary">
        Configure dynamic authentication for this monitor. If configured, Opsway
        will automatically authenticate before pinging the target.
      </Typography>

      <Controller
        name="settings.auth.method"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="Authentication Method"
            variant="outlined"
            size="small"
            fullWidth
            {...field}
          >
            <MenuItem value="NONE">None</MenuItem>
            <MenuItem value="BASIC">Basic Auth</MenuItem>
            <MenuItem value="OAUTH2_CLIENT_CREDENTIALS">
              OAuth2 Client Credentials
            </MenuItem>
          </TextField>
        )}
      />

      <Conditional value={authMethod === "BASIC"}>
        <Stack spacing={2} direction="row">
          <Controller
            name="settings.auth.username"
            control={control}
            render={({ field }) => (
              <TextField
                label="Username"
                variant="outlined"
                size="small"
                fullWidth
                {...field}
                value={field.value || ""}
              />
            )}
          />
          <Controller
            name="settings.auth.password"
            control={control}
            render={({ field }) => (
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                size="small"
                fullWidth
                {...field}
                value={field.value || ""}
              />
            )}
          />
        </Stack>
      </Conditional>

      <Conditional value={authMethod === "OAUTH2_CLIENT_CREDENTIALS"}>
        <Stack spacing={2}>
          <Controller
            name="settings.auth.tokenUrl"
            control={control}
            rules={{ required: authMethod === "OAUTH2_CLIENT_CREDENTIALS" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Token Endpoint URL"
                placeholder="https://auth.example.com/oauth/token"
                variant="outlined"
                size="small"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.invalid && "Token URL is required"}
                {...field}
                value={field.value || ""}
              />
            )}
          />
          <Stack spacing={2} direction="row">
            <Controller
              name="settings.auth.clientId"
              control={control}
              rules={{ required: authMethod === "OAUTH2_CLIENT_CREDENTIALS" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Client ID"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={fieldState.invalid}
                  helperText={fieldState.invalid && "Client ID is required"}
                  {...field}
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="settings.auth.clientSecret"
              control={control}
              rules={{ required: authMethod === "OAUTH2_CLIENT_CREDENTIALS" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Client Secret"
                  type="password"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={fieldState.invalid}
                  helperText={fieldState.invalid && "Client Secret is required"}
                  {...field}
                  value={field.value || ""}
                />
              )}
            />
          </Stack>
        </Stack>
      </Conditional>
    </Stack>
  );
};

export default AuthSettings;
