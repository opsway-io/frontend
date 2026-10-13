import {
  Autocomplete,
  Box,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller } from "react-hook-form";
import { useMonitors } from "../../../../hooks/monitors.query";
import { MaintenanceFormValues } from "../maintenanceForm";
import DateTimeField from "./DateTimeField";

interface MaintenanceWindowFieldsProps {
  control: Control<MaintenanceFormValues>;
}

/** Title, description, time range and target monitors of a window. */
const MaintenanceWindowFields: FunctionComponent<
  MaintenanceWindowFieldsProps
> = ({ control }) => {
  const { data: monitorsResponse } = useMonitors();
  const monitors = monitorsResponse?.monitors ?? [];

  return (
    <Card>
      <Stack spacing={2}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl error={!!error}>
              <FormLabel>Title</FormLabel>
              <Input {...field} />
              {error?.message && (
                <FormHelperText>{error.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea {...field} minRows={3} />
            </FormControl>
          )}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="startAt"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field, fieldState: { error } }) => (
                <DateTimeField
                  label="Start Time"
                  value={field.value}
                  onChange={field.onChange}
                  error={error?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="endAt"
              control={control}
              rules={{
                required: "End time is required",
                validate: (endAt, { startAt }) =>
                  new Date(endAt) > new Date(startAt) ||
                  "End time must be after the start time",
              }}
              render={({ field, fieldState: { error } }) => (
                <DateTimeField
                  label="End Time"
                  value={field.value}
                  onChange={field.onChange}
                  error={error?.message}
                />
              )}
            />
          </Box>
        </Stack>
        <Controller
          name="monitorIds"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Target Monitors</FormLabel>
              <Autocomplete
                multiple
                options={monitors}
                getOptionLabel={(monitor) => monitor.name}
                value={monitors.filter((monitor) =>
                  field.value.includes(monitor.id),
                )}
                onChange={(_, selected) =>
                  field.onChange(selected.map((monitor) => monitor.id))
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                placeholder="Leave empty to target all monitors"
              />
            </FormControl>
          )}
        />
      </Stack>
    </Card>
  );
};

export default MaintenanceWindowFields;
