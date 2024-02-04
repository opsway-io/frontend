import { FunctionComponent } from "react";
import {
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FormData } from "../models/formData";
import { Controller, useFormContext } from "react-hook-form";

const TLSVerificationSettings: FunctionComponent = () => {
  const { register, control, setValue } = useFormContext<FormData>();

  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        <Stack>
          <Typography variant="subtitle1">SSL/TLS enabled</Typography>
          <Typography variant="body1" color="textSecondary">
            Require that the server presents a valid certificate.
          </Typography>
        </Stack>

        <Controller
          control={control}
          name="settings.tls.enabled"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label=""
            />
          )}
        />

        <Divider />

        <Stack>
          <Typography variant="subtitle1">Host verification</Typography>
          <Typography variant="body1" color="textSecondary">
            Verify the hostname on the certificate matches the URL.
          </Typography>
        </Stack>

        <Controller
          control={control}
          name="settings.tls.verifyHostname"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label=""
            />
          )}
        />

        <Divider />

        <Controller
          control={control}
          name="settings.tls.checkExpiration"
          render={({ field: enabledField }) => (
            <>
              <Stack>
                <Typography variant="subtitle1">Expiration</Typography>
                <Typography variant="body1" color="textSecondary">
                  Check if the certificate is about to expire.
                </Typography>
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    {...enabledField}
                    checked={enabledField.value}
                    onChange={(e) => {
                      enabledField.onChange(e.target.checked);
                    }}
                    title="Enable expiration alerting"
                  />
                }
                label=""
              />

              <Typography variant="body1" color="textSecondary">
                Number of days left before the certificate expires.
              </Typography>

              <TextField
                {...register("settings.tls.expirationThresholdDays", {
                  valueAsNumber: true,
                  min: 1,
                  max: 365,
                })}
                disabled={!enabledField.value}
                type="number"
                InputProps={{
                  endAdornment: "days",
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  min: 1,
                  max: 365,
                }}
              />
            </>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default TLSVerificationSettings;
