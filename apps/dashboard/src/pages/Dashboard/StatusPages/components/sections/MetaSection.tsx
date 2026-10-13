import { FormControl, FormLabel, Input } from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller } from "react-hook-form";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import { StatusPageFormValues } from "../../statusPageForm";

interface MetaSectionProps {
  control: Control<StatusPageFormValues>;
}

const MetaSection: FunctionComponent<MetaSectionProps> = ({ control }) => (
  <SettingsCard
    title="Meta"
    description="Meta about the status page only visible to your team not on the page itself."
  >
    <Controller
      name="name"
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState }) => (
        <FormControl required error={!!fieldState.error}>
          <FormLabel>Name</FormLabel>
          <Input {...field} placeholder="My status page" />
        </FormControl>
      )}
    />
  </SettingsCard>
);

export default MetaSection;
