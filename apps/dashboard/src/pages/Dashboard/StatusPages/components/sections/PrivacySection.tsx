import { FormControl, FormLabel, Input } from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import { StatusPageFormValues } from "../../statusPageForm";
import SwitchField from "./SwitchField";

interface PrivacySectionProps {
  control: Control<StatusPageFormValues>;
}

const PrivacySection: FunctionComponent<PrivacySectionProps> = ({
  control,
}) => {
  const isPrivate = useWatch({ control, name: "isPrivate" });

  return (
    <SettingsCard
      title="Privacy & protection"
      description="Restrict who can view your status page by enabling password protection."
    >
      <SwitchField
        control={control}
        name="isPrivate"
        label="Password Protection Enabled"
      />

      {isPrivate && (
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Status Page Password</FormLabel>
              <Input
                {...field}
                type="password"
                placeholder="Leave blank to keep existing password"
                autoComplete="new-password"
              />
            </FormControl>
          )}
        />
      )}
    </SettingsCard>
  );
};

export default PrivacySection;
