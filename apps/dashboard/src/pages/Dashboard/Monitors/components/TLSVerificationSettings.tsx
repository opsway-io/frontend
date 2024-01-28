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
          <Typography variant="subtitle1">Certificate validation</Typography>
          <Typography variant="body1" color="textSecondary">
            Verify that the certificate used by the server is valid, globally
            trusted and matches the host.
          </Typography>
        </Stack>

        <Controller
          control={control}
          name="tls.validate.enabled"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Enable validation"
            />
          )}
        />

        <Divider />

        <Controller
          control={control}
          name="tls.expiration.enabled"
          render={({ field: enabledField }) => (
            <>
              <Stack>
                <Typography variant="subtitle1">Expiration</Typography>
                <Typography variant="body1" color="textSecondary">
                  Trigger an alert if the certificate is about to expire.
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
                label="Enable expiration alerting"
              />

              <Typography variant="body1" color="textSecondary">
                Days before expiration to trigger an alert.
              </Typography>

              <TextField
                {...register("tls.expiration.thresholdDays", {
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
