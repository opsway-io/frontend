import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import { StatusPageFormValues } from "../../statusPageForm";
import CustomDomainInstructions from "../CustomDomainInstructions";

const DOMAIN_PATTERN = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface DomainSectionProps {
  control: Control<StatusPageFormValues>;
}

const DomainSection: FunctionComponent<DomainSectionProps> = ({ control }) => {
  const domain = useWatch({ control, name: "domain" });

  return (
    <SettingsCard
      title="Custom domain"
      description="You can use a custom domain to host your status page instead of the default one."
    >
      <Controller
        name="domain"
        control={control}
        rules={{
          required: true,
          pattern: {
            value: DOMAIN_PATTERN,
            message:
              "Must be a valid fully-qualified domain name (e.g. status.example.com)",
          },
        }}
        render={({ field, fieldState }) => (
          <FormControl required error={!!fieldState.error}>
            <FormLabel>Domain</FormLabel>
            <Input {...field} placeholder="status.example.com" />
            <FormHelperText>
              {fieldState.error
                ? fieldState.error.message
                : "Enter your fully-qualified domain name (e.g. status.example.com). Do not enter just the subdomain."}
            </FormHelperText>
          </FormControl>
        )}
      />

      <CustomDomainInstructions domain={domain} />
    </SettingsCard>
  );
};

export default DomainSection;
