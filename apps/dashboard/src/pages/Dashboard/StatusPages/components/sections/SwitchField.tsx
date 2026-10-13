import { FormControl, FormLabel, Switch } from "@mui/joy";
import { Control, Controller } from "react-hook-form";
import { StatusPageFormValues } from "../../statusPageForm";

interface SwitchFieldProps {
  control: Control<StatusPageFormValues>;
  name: "showBranding" | "isPrivate";
  label: string;
}

/** A horizontal label + switch bound to a boolean form field. */
const SwitchField = ({ control, name, label }: SwitchFieldProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl
        orientation="horizontal"
        sx={{ justifyContent: "space-between", gap: 2 }}
      >
        <FormLabel>{label}</FormLabel>
        <Switch
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      </FormControl>
    )}
  />
);

export default SwitchField;
