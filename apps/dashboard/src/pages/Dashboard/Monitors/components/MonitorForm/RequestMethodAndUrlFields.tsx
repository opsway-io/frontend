import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { MonitorFormData } from "../../models/monitorFormData";
import {
  getUrlPlaceholder,
  nonHttpMethods,
  requestMethodOptions,
} from "../../models/requestOptions";

const httpUrlPattern = /^https?:\/\/.+/;

interface RequestMethodAndUrlFieldsProps {
  stepIndex: number;
}

const RequestMethodAndUrlFields: FunctionComponent<
  RequestMethodAndUrlFieldsProps
> = ({ stepIndex }) => {
  const { control, getValues, setValue } = useFormContext<MonitorFormData>();
  const method = useWatch({ control, name: `steps.${stepIndex}.method` });

  const validateUrl = (value: string) => {
    const currentMethod = getValues(`steps.${stepIndex}.method`) || "GET";
    if (nonHttpMethods.includes(currentMethod)) {
      return true;
    }

    return (
      httpUrlPattern.test(value || "") ||
      "URL must start with http:// or https://"
    );
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "flex-start" }}
    >
      <Box sx={{ width: { xs: "100%", sm: 150 }, flexShrink: 0 }}>
        <Controller
          name={`steps.${stepIndex}.method`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value || null}
              onChange={(_, value) => {
                field.onChange(value);
                // The browser script is always sent as a JSON body.
                if ((value as string) === "BROWSER") {
                  setValue(`steps.${stepIndex}.body.type`, "JSON");
                }
              }}
              onBlur={field.onBlur}
              placeholder="Method"
            >
              {requestMethodOptions.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                  {option.disabled && (
                    <Typography
                      level="body-xs"
                      textColor="text.tertiary"
                      sx={{ ml: "auto", pl: 2 }}
                    >
                      Coming soon
                    </Typography>
                  )}
                </Option>
              ))}
            </Select>
          )}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Controller
          name={`steps.${stepIndex}.url`}
          control={control}
          rules={{ required: true, validate: validateUrl }}
          render={({ field: { ref, ...field }, fieldState }) => (
            <FormControl error={!!fieldState.error}>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={getUrlPlaceholder(method || "GET")}
                slotProps={{ input: { ref } }}
              />
              {fieldState.error?.message && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Box>
    </Stack>
  );
};

export default RequestMethodAndUrlFields;
