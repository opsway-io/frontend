import { Autocomplete } from "@mui/joy";
import { FunctionComponent } from "react";
import { CONDITION_OPTIONS } from "../alertRules";

interface ConditionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const labelForValue = (value: string) =>
  CONDITION_OPTIONS.find((option) => option.value === value)?.label ?? value;

/** Pick a predefined condition or type a custom match string. */
const ConditionAutocomplete: FunctionComponent<ConditionAutocompleteProps> = ({
  value,
  onChange,
  onBlur,
}) => (
  <Autocomplete
    freeSolo
    options={CONDITION_OPTIONS}
    getOptionLabel={(option) =>
      typeof option === "string" ? labelForValue(option) : option.label
    }
    value={CONDITION_OPTIONS.find((option) => option.value === value) ?? value}
    onChange={(_, newValue) => {
      if (typeof newValue === "string") onChange(newValue);
      else onChange(newValue?.value ?? "");
    }}
    onInputChange={(_, input) => {
      const option = CONDITION_OPTIONS.find((o) => o.label === input);
      onChange(option ? option.value : input);
    }}
    onBlur={onBlur}
  />
);

export default ConditionAutocomplete;
