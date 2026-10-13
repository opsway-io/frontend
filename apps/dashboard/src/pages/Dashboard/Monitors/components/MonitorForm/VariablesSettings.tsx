import {
  Box,
  Button,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { VscAdd, VscClose } from "react-icons/vsc";
import { MonitorFormData } from "../../models/monitorFormData";
import SettingsSubheader from "./SettingsSubheader";

const rowSx = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr)) 32px",
  gap: 1,
  alignItems: "center",
};

const columnLabels = ["Name", "Source", "Property"];

interface VariablesSettingsProps {
  stepIndex: number;
}

const VariablesSettings: FunctionComponent<VariablesSettingsProps> = ({
  stepIndex,
}) => {
  const { control, register } = useFormContext<MonitorFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `steps.${stepIndex}.variables`,
  });

  return (
    <Stack spacing={2}>
      <SettingsSubheader
        title="Variables"
        description={
          <>
            Extract variables from this step&apos;s response. They can be used
            in the URL, headers and body of any later step using{" "}
            {"{{VAR_NAME}}"}.
          </>
        }
      />

      {fields.length > 0 && (
        <Box sx={{ overflowX: "auto" }}>
          <Stack spacing={1} sx={{ minWidth: 520 }}>
            <Box sx={rowSx}>
              {columnLabels.map((label) => (
                <Typography
                  key={label}
                  level="body-xs"
                  textColor="text.tertiary"
                >
                  {label}
                </Typography>
              ))}
              <span />
            </Box>

            {fields.map((variable, index) => (
              <Box sx={rowSx} key={variable.id}>
                <Input
                  placeholder="MY_VAR"
                  slotProps={{
                    input: register(
                      `steps.${stepIndex}.variables.${index}.name`,
                      { required: true },
                    ),
                  }}
                />

                <Controller
                  name={`steps.${stepIndex}.variables.${index}.source`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      value={field.value || "JSON_BODY"}
                      onChange={(_, value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    >
                      <Option value="JSON_BODY">JSON Body</Option>
                      <Option value="HEADER">Header</Option>
                    </Select>
                  )}
                />

                <Input
                  placeholder="$.id or X-Request-ID"
                  slotProps={{
                    input: register(
                      `steps.${stepIndex}.variables.${index}.property`,
                      { required: true },
                    ),
                  }}
                />

                <IconButton
                  variant="plain"
                  color="neutral"
                  aria-label="Remove variable"
                  onClick={() => remove(index)}
                >
                  <VscClose />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Box>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() =>
            append({ name: "", source: "JSON_BODY", property: "" })
          }
          startDecorator={<VscAdd />}
        >
          Add variable
        </Button>
      </Box>
    </Stack>
  );
};

export default VariablesSettings;
