import { Box, FormControl, FormLabel, Option, Select } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import { MonitorFormData } from "../../models/monitorFormData";
import AuthTextField from "./AuthTextField";

const twoColumnsSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 2,
};

const AuthSettings: FunctionComponent = () => {
  const { control } = useFormContext<MonitorFormData>();
  const authMethod = useWatch({ control, name: "settings.auth.method" });

  return (
    <SettingsCard
      title="Authentication"
      description="Configure dynamic authentication for this monitor. If configured, Opsway will automatically authenticate before pinging the target."
    >
      <Controller
        name="settings.auth.method"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel>Authentication method</FormLabel>
            <Select
              name={field.name}
              value={field.value ?? "NONE"}
              onChange={(_, value) => field.onChange(value)}
              onBlur={field.onBlur}
            >
              <Option value="NONE">None</Option>
              <Option value="BASIC">Basic Auth</Option>
              <Option value="OAUTH2_CLIENT_CREDENTIALS">
                OAuth2 Client Credentials
              </Option>
            </Select>
          </FormControl>
        )}
      />

      {authMethod === "BASIC" && (
        <Box sx={twoColumnsSx}>
          <AuthTextField field="username" label="Username" />
          <AuthTextField field="password" label="Password" type="password" />
        </Box>
      )}

      {authMethod === "OAUTH2_CLIENT_CREDENTIALS" && (
        <>
          <AuthTextField
            field="tokenUrl"
            label="Token endpoint URL"
            placeholder="https://auth.example.com/oauth/token"
            requiredMessage="Token URL is required"
          />
          <Box sx={twoColumnsSx}>
            <AuthTextField
              field="clientId"
              label="Client ID"
              requiredMessage="Client ID is required"
            />
            <AuthTextField
              field="clientSecret"
              label="Client secret"
              type="password"
              requiredMessage="Client Secret is required"
            />
          </Box>
        </>
      )}
    </SettingsCard>
  );
};

export default AuthSettings;
