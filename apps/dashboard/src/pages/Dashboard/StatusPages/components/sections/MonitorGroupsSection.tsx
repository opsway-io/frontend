import { Box, Button, Divider, FormControl, FormLabel } from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import SettingsSubheader from "../../../../../components/SettingsCard/SettingsSubheader";
import { useMonitors } from "../../../../../hooks/monitors.query";
import { StatusPageFormValues } from "../../statusPageForm";
import MonitorGroupFields from "./MonitorGroupFields";
import MonitorMultiSelect from "./MonitorMultiSelect";

interface MonitorGroupsSectionProps {
  control: Control<StatusPageFormValues>;
}

const MonitorGroupsSection: FunctionComponent<MonitorGroupsSectionProps> = ({
  control,
}) => {
  const { data: monitorsData } = useMonitors();
  const monitors = monitorsData?.monitors ?? [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups",
  });

  return (
    <SettingsCard
      title="Monitors & Groups"
      description="Organize the monitors displayed on the status page. You can group them by service or capability."
    >
      <Controller
        name="monitorIds"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel>Ungrouped Monitors</FormLabel>
            <MonitorMultiSelect
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              monitors={monitors}
              placeholder="Select ungrouped monitors"
            />
          </FormControl>
        )}
      />

      <Divider />

      <SettingsSubheader title="Monitor Groups" />

      {fields.map((group, index) => (
        <MonitorGroupFields
          key={group.id}
          control={control}
          index={index}
          monitors={monitors}
          onRemove={() => remove(index)}
        />
      ))}

      <Box>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<IoAdd />}
          onClick={() =>
            append({
              name: "",
              container: "",
              order: fields.length,
              monitorIds: [],
            })
          }
        >
          Add Group
        </Button>
      </Box>
    </SettingsCard>
  );
};

export default MonitorGroupsSection;
