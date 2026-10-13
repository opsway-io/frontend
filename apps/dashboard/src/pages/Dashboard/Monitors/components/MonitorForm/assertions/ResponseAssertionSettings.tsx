import { Box, Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { VscAdd } from "react-icons/vsc";
import { MonitorFormData } from "../../../models/monitorFormData";
import AssertionRow from "./AssertionRow";
import { getDefaultsForSource } from "./assertionHelpers";

const rowSx = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr)) 32px",
  gap: 1,
  alignItems: "center",
};

const columnLabels = ["Source", "Property", "Operator", "Target"];

interface ResponseAssertionSettingsProps {
  stepIndex: number;
}

const ResponseAssertionSettings: FunctionComponent<
  ResponseAssertionSettingsProps
> = ({ stepIndex }) => {
  const { control, getValues } = useFormContext<MonitorFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `steps.${stepIndex}.assertions`,
  });

  return (
    <Stack spacing={2}>
      <Typography level="body-sm" textColor="text.secondary">
        Assertions are statements you craft to verify a specific aspect of the
        HTTP response. These statements enable you to assess the accuracy and
        timeliness of the response data by combining predefined modifiers with
        customizable values, ensuring they cater to a wide range of scenarios.
        If one or more assertions fail, an incident will be triggered.
      </Typography>

      {fields.length > 0 && (
        <Box sx={{ overflowX: "auto" }}>
          <Stack spacing={1} sx={{ minWidth: 640 }}>
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

            {fields.map((assertion, index) => (
              <AssertionRow
                key={assertion.id}
                sx={rowSx}
                stepIndex={stepIndex}
                index={index}
                onRemove={() => remove(index)}
                onSourceChange={(source) =>
                  update(index, {
                    ...getValues(`steps.${stepIndex}.assertions.${index}`),
                    ...getDefaultsForSource(source),
                    source,
                  })
                }
              />
            ))}
          </Stack>
        </Box>
      )}

      <Box>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() =>
            append(
              { source: "STATUS_CODE", ...getDefaultsForSource("STATUS_CODE") },
              { shouldFocus: false },
            )
          }
          startDecorator={<VscAdd />}
        >
          Add assertion
        </Button>
      </Box>
    </Stack>
  );
};

export default ResponseAssertionSettings;
