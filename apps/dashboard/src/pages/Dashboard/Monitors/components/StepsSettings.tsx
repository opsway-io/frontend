import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { VscAdd, VscClose, VscChevronDown } from "react-icons/vsc";
import { v4 as uuidv4 } from "uuid";
import RequestSettings from "./RequestSettings";
import ResponseAssertionSettings from "./ResponseAssertionSettings";
import VariablesSettings from "./VariablesSettings";
import { SettingsFormData } from "../models/settingsFormData";

const StepsSettings: FunctionComponent = () => {
  const { control } = useFormContext<SettingsFormData>();
  const { fields, append, remove } = useFieldArray<SettingsFormData>({
    name: "steps",
  });

  const [expanded, setExpanded] = useState<number | false>(0);

  const handleAccordionChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="subtitle1">Steps</Typography>
        <Typography variant="body1" color="textSecondary">
          Define multiple steps for your monitor. Each step represents a distinct HTTP request.
        </Typography>
      </Stack>

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Controller
                name={`steps.${index}.name` as const}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    placeholder="Step Name"
                    fullWidth
                  />
                )}
              />
              <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                <VscClose />
              </IconButton>
            </Stack>

            <Accordion
              expanded={expanded === index}
              onChange={handleAccordionChange(index)}
              disableGutters
            >
              <AccordionSummary expandIcon={<VscChevronDown />}>
                <Typography>Request</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RequestSettings stepIndex={index} />
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
              <AccordionSummary expandIcon={<VscChevronDown />}>
                <Typography>Variables</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <VariablesSettings stepIndex={index} />
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
              <AccordionSummary expandIcon={<VscChevronDown />}>
                <Typography>Assertions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ResponseAssertionSettings stepIndex={index} />
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <Box>
        <Button
          variant="outlined"
          startIcon={<VscAdd />}
          onClick={() =>
            append({
              name: `Step ${fields.length + 1}`,
              method: "GET",
              url: "",
              headers: [],
              body: { type: "NONE", content: null },
              assertions: [
                {
                  source: "STATUS_CODE",
                  operator: "EQUAL",
                  target: "200",
                },
              ],
              variables: [],
            })
          }
        >
          Add Step
        </Button>
      </Box>
    </Stack>
  );
};

export default StepsSettings;
