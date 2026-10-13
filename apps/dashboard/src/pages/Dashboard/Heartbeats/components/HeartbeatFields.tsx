import { FormControl, FormHelperText, FormLabel, Input, Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller } from "react-hook-form";
import { HeartbeatFormValues } from "../heartbeatForm";

const minuteFields: {
  name: "interval" | "grace";
  label: string;
  helperText: string;
  rules: { required: string; min: number };
}[] = [
  {
    name: "interval",
    label: "Expected Interval (minutes)",
    helperText: "How often should we expect a ping?",
    rules: { required: "Interval is required", min: 1 },
  },
  {
    name: "grace",
    label: "Grace Period (minutes)",
    helperText: "How long to wait before marking as DOWN",
    rules: { required: "Grace period is required", min: 0 },
  },
];

interface HeartbeatFieldsProps {
  control: Control<HeartbeatFormValues>;
}

/** Name, interval and grace period inputs of a heartbeat. */
const HeartbeatFields: FunctionComponent<HeartbeatFieldsProps> = ({
  control,
}) => (
  <>
    <Controller
      name="name"
      control={control}
      rules={{ required: "Name is required" }}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormLabel>Name</FormLabel>
          <Input {...field} />
          {error?.message && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      {minuteFields.map(({ name, label, helperText, rules }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <FormControl error={!!error} sx={{ flex: 1 }}>
              <FormLabel>{label}</FormLabel>
              <Input
                {...field}
                type="number"
                endDecorator="min"
                // Keep the form value a number (the API expects integers).
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                value={Number.isNaN(field.value) ? "" : field.value}
              />
              <FormHelperText>{error?.message || helperText}</FormHelperText>
            </FormControl>
          )}
        />
      ))}
    </Stack>
  </>
);

export default HeartbeatFields;
