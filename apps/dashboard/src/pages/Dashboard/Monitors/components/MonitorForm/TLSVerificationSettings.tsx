import {
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import { MonitorFormData } from "../../models/monitorFormData";
import TLSSwitchField from "./TLSSwitchField";

const TLSVerificationSettings: FunctionComponent = () => {
  const { control, register } = useFormContext<MonitorFormData>();
  const [tlsEnabled, checkExpiration] = useWatch({
    control,
    name: ["settings.tls.enabled", "settings.tls.checkExpiration"],
  });

  return (
    <SettingsCard
      title="SSL/TLS verification"
      description="Configure how the certificate presented by the server is validated."
    >
      <TLSSwitchField
        field="enabled"
        label="SSL/TLS enabled"
        description="Require that the server presents a valid certificate."
      />

      <Divider />

      <TLSSwitchField
        field="verifyHostname"
        label="Host verification"
        description="Verify the hostname on the certificate matches the URL."
        disabled={!tlsEnabled}
      />

      <Divider />

      <TLSSwitchField
        field="checkExpiration"
        label="Expiration"
        description="Check if the certificate is about to expire."
        disabled={!tlsEnabled}
      />

      <FormControl
        disabled={!checkExpiration || !tlsEnabled}
        sx={{ maxWidth: 240 }}
      >
        <FormLabel>Expiration threshold</FormLabel>
        <Input
          type="number"
          endDecorator="days"
          slotProps={{
            input: {
              ...register("settings.tls.expirationThresholdDays", {
                valueAsNumber: true,
                min: 1,
                max: 365,
              }),
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 1,
              max: 365,
            },
          }}
        />
        <FormHelperText>
          Number of days left before the certificate expires.
        </FormHelperText>
      </FormControl>
    </SettingsCard>
  );
};

export default TLSVerificationSettings;
