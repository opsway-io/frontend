import { Button, ToggleButtonGroup } from "@mui/joy";
import { FunctionComponent } from "react";

const DAY_MS = 86400000;

const timeRanges = [
  { label: "Day", value: DAY_MS },
  { label: "Week", value: DAY_MS * 7 },
  { label: "Month", value: DAY_MS * 30 },
  { label: "Year", value: DAY_MS * 365 },
];

interface TimeRangeToggleProps {
  /** Selected interval in ms, or null when a custom range is shown. */
  value: number | null;
  onChange: (interval: number) => void;
}

const TimeRangeToggle: FunctionComponent<TimeRangeToggleProps> = (props) => {
  return (
    <ToggleButtonGroup
      variant="outlined"
      color="neutral"
      size="sm"
      value={props.value === null ? null : String(props.value)}
      onChange={(_, value) => {
        if (value != null) {
          props.onChange(Number(value));
        }
      }}
      sx={{
        '& [aria-pressed="true"]': {
          bgcolor: "background.level3",
          color: "text.primary",
        },
      }}
    >
      {timeRanges.map((range) => (
        <Button key={range.label} value={String(range.value)}>
          {range.label}
        </Button>
      ))}
    </ToggleButtonGroup>
  );
};

export default TimeRangeToggle;
