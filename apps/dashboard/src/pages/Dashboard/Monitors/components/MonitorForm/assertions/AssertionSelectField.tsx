import { Option, Select } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getAssertionOptionLabel } from "../../../models/assertionOptions";
import { MonitorFormData } from "../../../models/monitorFormData";
import { assertionFieldPath } from "./assertionHelpers";
import AssertionCell from "./AssertionCell";

interface AssertionSelectFieldProps {
  stepIndex: number;
  index: number;
  field: "property" | "operator";
  options: string[];
}

/** Required select for an assertion's property or operator. */
const AssertionSelectField: FunctionComponent<AssertionSelectFieldProps> = (
  props,
) => {
  const { control } = useFormContext<MonitorFormData>();

  return (
    <AssertionCell>
      <Controller
        name={assertionFieldPath(props.stepIndex, props.index, props.field)}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            name={field.name}
            value={field.value || null}
            onChange={(_, value) => field.onChange(value)}
            onBlur={field.onBlur}
          >
            {props.options.map((option) => (
              <Option key={option} value={option}>
                {getAssertionOptionLabel(option)}
              </Option>
            ))}
          </Select>
        )}
      />
    </AssertionCell>
  );
};

export default AssertionSelectField;
