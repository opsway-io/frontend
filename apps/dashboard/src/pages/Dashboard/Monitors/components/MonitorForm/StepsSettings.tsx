import { Box, Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { VscAdd } from "react-icons/vsc";
import {
  createDefaultStep,
  MonitorFormData,
} from "../../models/monitorFormData";
import StepCard from "./StepCard";

const StepsSettings: FunctionComponent = () => {
  const { control } = useFormContext<MonitorFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "steps" });

  // Only one step's request section is expanded at a time.
  const [expandedStep, setExpandedStep] = useState<number | false>(0);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography level="title-md">Steps</Typography>
        <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.5 }}>
          Define multiple steps for your monitor. Each step represents a
          distinct HTTP request.
        </Typography>
      </Box>

      {fields.map((step, index) => (
        <StepCard
          key={step.id}
          stepIndex={index}
          requestExpanded={expandedStep === index}
          onRequestExpandedChange={(expanded) =>
            setExpandedStep(expanded ? index : false)
          }
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        />
      ))}

      <Box>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<VscAdd />}
          onClick={() => append(createDefaultStep(fields.length + 1))}
        >
          Add step
        </Button>
      </Box>
    </Stack>
  );
};

export default StepsSettings;
