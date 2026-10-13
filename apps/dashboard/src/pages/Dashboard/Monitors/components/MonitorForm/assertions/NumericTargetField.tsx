import { Input } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MonitorFormData } from "../../../models/monitorFormData";
import { assertionFieldPath, sanitizeNumber } from "./assertionHelpers";
import AssertionCell from "./AssertionCell";

interface NumericTargetFieldProps {
  stepIndex: number;
  index: number;
  placeholder: string;
  endDecorator?: ReactNode;
}

/** Required target input that only accepts digits. */
const NumericTargetField: FunctionComponent<NumericTargetFieldProps> = (
  props,
) => {
  const { control } = useFormContext<MonitorFormData>();

  return (
    <AssertionCell>
      <Controller
        name={assertionFieldPath(props.stepIndex, props.index, "target")}
        control={control}
        rules={{ required: true }}
        render={({ field: { ref, ...field }, fieldState }) => (
          <Input
            {...field}
            value={field.value ?? ""}
            error={fieldState.invalid}
            placeholder={props.placeholder}
            endDecorator={props.endDecorator}
            slotProps={{ input: { ref, inputMode: "numeric" } }}
            onChange={(e) => {
              e.target.value = sanitizeNumber(e.target.value);
              field.onChange(e.target.value);
            }}
          />
        )}
      />
    </AssertionCell>
  );
};

export default NumericTargetField;
