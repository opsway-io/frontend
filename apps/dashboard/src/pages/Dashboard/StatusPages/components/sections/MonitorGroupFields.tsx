import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Sheet,
  Stack,
  Tooltip,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller } from "react-hook-form";
import { IoTrashOutline } from "react-icons/io5";
import { StatusPageFormValues } from "../../statusPageForm";
import MonitorMultiSelect, { MonitorOption } from "./MonitorMultiSelect";

interface MonitorGroupFieldsProps {
  control: Control<StatusPageFormValues>;
  index: number;
  monitors: MonitorOption[];
  onRemove: () => void;
}

/** Name + monitors of a single status page monitor group. */
const MonitorGroupFields: FunctionComponent<MonitorGroupFieldsProps> = ({
  control,
  index,
  monitors,
  onRemove,
}) => (
  <Sheet
    variant="outlined"
    sx={{
      borderRadius: "md",
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      bgcolor: "background.level1",
    }}
  >
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <Controller
        name={`groups.${index}.name`}
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <FormControl required error={!!fieldState.error} sx={{ flexGrow: 1 }}>
            <FormLabel>Group Name</FormLabel>
            <Input {...field} placeholder="e.g. API" />
          </FormControl>
        )}
      />
      <Tooltip title="Remove group">
        <IconButton
          variant="plain"
          color="danger"
          aria-label="Remove group"
          onClick={onRemove}
        >
          <IoTrashOutline />
        </IconButton>
      </Tooltip>
    </Stack>
    <Controller
      name={`groups.${index}.monitorIds`}
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormLabel>Monitors</FormLabel>
          <MonitorMultiSelect
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            monitors={monitors}
            placeholder="Select monitors for group"
          />
        </FormControl>
      )}
    />
  </Sheet>
);

export default MonitorGroupFields;
