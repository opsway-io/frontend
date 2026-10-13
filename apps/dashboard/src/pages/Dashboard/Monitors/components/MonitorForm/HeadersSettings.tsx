import { Box, Button, IconButton, Input, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { VscAdd, VscClose } from "react-icons/vsc";
import { MonitorFormData } from "../../models/monitorFormData";
import HeaderNameAutocomplete from "./HeaderNameAutocomplete";

const rowSx = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 32px",
  gap: 1,
  alignItems: "center",
};

interface HeadersSettingsProps {
  stepIndex: number;
}

const HeadersSettings: FunctionComponent<HeadersSettingsProps> = ({
  stepIndex,
}) => {
  const { control, register } = useFormContext<MonitorFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `steps.${stepIndex}.headers`,
  });

  return (
    <Stack spacing={1.5}>
      {fields.length > 0 && (
        <Stack spacing={1}>
          <Box sx={rowSx}>
            <Typography level="body-xs" textColor="text.tertiary">
              Key
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              Value
            </Typography>
            <span />
          </Box>

          {fields.map((header, index) => (
            <Box sx={rowSx} key={header.id}>
              <Controller
                name={`steps.${stepIndex}.headers.${index}.key`}
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <HeaderNameAutocomplete
                    name={field.name}
                    value={field.value}
                    error={fieldState.invalid}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Input
                placeholder="Value"
                slotProps={{
                  input: register(`steps.${stepIndex}.headers.${index}.value`),
                }}
              />

              <IconButton
                variant="plain"
                color="neutral"
                aria-label="Remove header"
                onClick={() => remove(index)}
              >
                <VscClose />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}

      <Box>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => append({ key: "", value: "" }, { shouldFocus: false })}
          startDecorator={<VscAdd />}
        >
          Add header
        </Button>
      </Box>
    </Stack>
  );
};

export default HeadersSettings;
