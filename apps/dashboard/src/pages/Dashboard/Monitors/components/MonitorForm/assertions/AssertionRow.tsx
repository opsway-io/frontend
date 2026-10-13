import { Box, IconButton, Option, Select } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { VscClose } from "react-icons/vsc";
import {
  assertionSources,
  getAssertionOptionLabel,
} from "../../../models/assertionOptions";
import { MonitorFormData } from "../../../models/monitorFormData";
import { assertionFieldPath } from "./assertionHelpers";
import AssertionCell from "./AssertionCell";
import EmptyAssertionCell from "./EmptyAssertionCell";
import HeadersAssertionFields from "./HeadersAssertionFields";
import JSONBodyAssertionFields from "./JSONBodyAssertionFields";
import RawBodyAssertionFields from "./RawBodyAssertionFields";
import ResponseTimeAssertionFields from "./ResponseTimeAssertionFields";
import StatusCodeAssertionFields from "./StatusCodeAssertionFields";

interface SourceFieldsProps {
  stepIndex: number;
  index: number;
}

const fieldsBySource: Record<string, FunctionComponent<SourceFieldsProps>> = {
  STATUS_CODE: StatusCodeAssertionFields,
  RESPONSE_TIME: ResponseTimeAssertionFields,
  HEADERS: HeadersAssertionFields,
  RAW_BODY: RawBodyAssertionFields,
  JSON_BODY: JSONBodyAssertionFields,
};

const NoSourceFields: FunctionComponent<SourceFieldsProps> = () => (
  <>
    <EmptyAssertionCell />
    <EmptyAssertionCell />
    <EmptyAssertionCell />
  </>
);

interface AssertionRowProps {
  stepIndex: number;
  index: number;
  sx: object;
  onSourceChange: (source: string) => void;
  onRemove: () => void;
}

/** One assertion: source select, source specific fields and remove button. */
const AssertionRow: FunctionComponent<AssertionRowProps> = (props) => {
  const { control } = useFormContext<MonitorFormData>();
  const sourcePath = assertionFieldPath(props.stepIndex, props.index, "source");
  const source = useWatch({ control, name: sourcePath });

  const SourceFields = fieldsBySource[source] ?? NoSourceFields;

  return (
    <Box sx={props.sx}>
      <AssertionCell>
        <Controller
          name={sourcePath}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value || null}
              onBlur={field.onBlur}
              placeholder="Source"
              onChange={(_, value) => {
                field.onChange(value);
                props.onSourceChange(value as string);
              }}
            >
              {assertionSources.map((option) => (
                <Option key={option} value={option}>
                  {getAssertionOptionLabel(option)}
                </Option>
              ))}
            </Select>
          )}
        />
      </AssertionCell>

      <SourceFields stepIndex={props.stepIndex} index={props.index} />

      <IconButton
        variant="plain"
        color="neutral"
        aria-label="Remove assertion"
        onClick={props.onRemove}
      >
        <VscClose />
      </IconButton>
    </Box>
  );
};

export default AssertionRow;
