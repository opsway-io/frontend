import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SettingsFormData } from "../models/settingsFormData";

const options = [
  { value: 30, label: "30 secs" },
  { value: 60, label: "1 min" },
  { value: 300, label: "5 mins" },
  { value: 600, label: "10 mins" },
  { value: 900, label: "15 mins" },
  { value: 1800, label: "30 mins" },
  { value: 3600, label: "1 hour" },
  { value: 43200, label: "12 hours" },
  { value: 86400, label: "24 hours" },
];

const FrequencySettings: FunctionComponent = () => {
  const { control } = useFormContext<SettingsFormData>();

  return (
    <Controller
      name="settings.frequencySeconds"
      control={control}
      render={(props) => (
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={props.field.value}
          onChange={(_, value) => {
            if (!value) {
              return;
            }

            props.field.onChange(value);
          }}
        >
          {options.map((option) => (
            <ToggleButton
              key={option.value}
              value={option.value}
              selected={props.field.value === option.value}
            >
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
};

FrequencySettings.defaultProps = {};

export default FrequencySettings;
