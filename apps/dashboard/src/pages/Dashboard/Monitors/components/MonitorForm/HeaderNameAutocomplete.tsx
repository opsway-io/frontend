import { Autocomplete } from "@mui/joy";
import { FunctionComponent } from "react";
import { requestHeaders } from "../../models/requestOptions";

interface HeaderNameAutocompleteProps {
  name: string;
  value?: string;
  error?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

/** Free text input suggesting well-known HTTP header names. */
const HeaderNameAutocomplete: FunctionComponent<HeaderNameAutocompleteProps> = (
  props,
) => {
  return (
    <Autocomplete
      freeSolo
      placeholder="Header name"
      options={requestHeaders}
      name={props.name}
      error={props.error}
      value={props.value ?? null}
      inputValue={props.value ?? ""}
      onChange={(_, value) => props.onChange(value ?? "")}
      onInputChange={(_, value) => props.onChange(value)}
      onBlur={props.onBlur}
    />
  );
};

export default HeaderNameAutocomplete;
