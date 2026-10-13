import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Card,
  Chip,
  IconButton,
  Input,
  Stack,
  Tooltip,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IoTrashOutline } from "react-icons/io5";
import { MonitorFormData } from "../../models/monitorFormData";
import ResponseAssertionSettings from "./assertions/ResponseAssertionSettings";
import RequestSettings from "./RequestSettings";
import VariablesSettings from "./VariablesSettings";

const accordionGroupSx = {
  borderRadius: "md",
  overflow: "hidden",
  "& .MuiAccordionSummary-button": {
    py: 1.25,
    fontWeight: 500,
  },
  "& .MuiAccordionDetails-content.Mui-expanded": {
    pt: 1,
    pb: 2,
  },
};

interface StepCardProps {
  stepIndex: number;
  requestExpanded: boolean;
  onRequestExpandedChange: (expanded: boolean) => void;
  canRemove: boolean;
  onRemove: () => void;
}

/** A single monitor step: name, request, variables and assertions. */
const StepCard: FunctionComponent<StepCardProps> = (props) => {
  const { control } = useFormContext<MonitorFormData>();

  return (
    <Card sx={{ gap: 1.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip size="sm" variant="soft" color="neutral">
          {props.stepIndex + 1}
        </Chip>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Controller
            name={`steps.${props.stepIndex}.name`}
            control={control}
            rules={{ required: true }}
            render={({ field: { ref, ...field }, fieldState }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                error={fieldState.invalid}
                placeholder="Step name"
                slotProps={{ input: { ref } }}
              />
            )}
          />
        </Box>
        <Tooltip title="Remove step">
          <span>
            <IconButton
              variant="plain"
              color="danger"
              aria-label="Remove step"
              onClick={props.onRemove}
              disabled={!props.canRemove}
            >
              <IoTrashOutline />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <AccordionGroup
        variant="outlined"
        transition="0.2s"
        sx={accordionGroupSx}
      >
        <Accordion
          expanded={props.requestExpanded}
          onChange={(_, expanded) => props.onRequestExpandedChange(expanded)}
        >
          <AccordionSummary>Request</AccordionSummary>
          <AccordionDetails>
            <RequestSettings stepIndex={props.stepIndex} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>Variables</AccordionSummary>
          <AccordionDetails>
            <VariablesSettings stepIndex={props.stepIndex} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>Assertions</AccordionSummary>
          <AccordionDetails>
            <ResponseAssertionSettings stepIndex={props.stepIndex} />
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </Card>
  );
};

export default StepCard;
