import { Box, Chip, Option, Select } from "@mui/joy";
import { FunctionComponent } from "react";

export interface MonitorOption {
  id: number;
  name: string;
}

interface MonitorMultiSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
  onBlur?: () => void;
  monitors: MonitorOption[];
  placeholder: string;
}

/** Multi-select of monitors that renders the selection as chips. */
const MonitorMultiSelect: FunctionComponent<MonitorMultiSelectProps> = ({
  value,
  onChange,
  onBlur,
  monitors,
  placeholder,
}) => (
  <Select
    multiple
    value={value ?? []}
    onChange={(_, selected) => onChange(selected)}
    onBlur={onBlur}
    placeholder={placeholder}
    renderValue={(selected) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {selected.map((option) => (
          <Chip key={String(option.value)} variant="soft" color="neutral">
            {option.label}
          </Chip>
        ))}
      </Box>
    )}
    slotProps={{ listbox: { sx: { maxHeight: 320, overflow: "auto" } } }}
  >
    {monitors.map((monitor) => (
      <Option key={monitor.id} value={monitor.id}>
        {monitor.name}
      </Option>
    ))}
  </Select>
);

export default MonitorMultiSelect;
