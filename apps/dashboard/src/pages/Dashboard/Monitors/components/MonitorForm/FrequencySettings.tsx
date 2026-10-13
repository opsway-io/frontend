import { Box, Button, ToggleButtonGroup } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MonitorFormData } from "../../models/monitorFormData";

const frequencyOptions = [
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
  const { control } = useFormContext<MonitorFormData>();

  return (
    <Controller
      name="settings.frequencySeconds"
      control={control}
      render={({ field }) => (
        <Box sx={{ overflowX: "auto", scrollbarWidth: "none" }}>
          <ToggleButtonGroup
            variant="outlined"
            color="neutral"
            value={
              field.value !== undefined && field.value !== null
                ? String(field.value)
                : null
            }
            onChange={(_, value) => {
              if (!value) {
                return;
              }

              field.onChange(Number(value));
            }}
            sx={{
              width: "100%",
              minWidth: "fit-content",
              "& > button": {
                flex: 1,
                whiteSpace: "nowrap",
              },
              '& > button[aria-pressed="true"]': {
                bgcolor: "neutral.softActiveBg",
                color: "text.primary",
              },
            }}
          >
            {frequencyOptions.map((option) => (
              <Button key={option.value} value={String(option.value)}>
                {option.label}
              </Button>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}
    />
  );
};

export default FrequencySettings;
