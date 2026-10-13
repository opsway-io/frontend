import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

interface DateTimeFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * Flatpickr date/time picker rendered through a Joy Input so it matches the
 * rest of the form controls.
 */
const DateTimeField: FunctionComponent<DateTimeFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  return (
    <FormControl error={!!error}>
      <FormLabel>{label}</FormLabel>
      <Flatpickr
        options={{ enableTime: true, time_24hr: true }}
        value={value}
        onChange={([date]) => date && onChange(date.toISOString())}
        render={(
          { defaultValue: _defaultValue, value: _value, ...props },
          ref,
        ) => (
          <Input
            startDecorator={<IoCalendarOutline />}
            slotProps={{
              input: {
                ...(props as object),
                ref,
                readOnly: true,
                style: { cursor: "pointer" },
              },
            }}
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default DateTimeField;
