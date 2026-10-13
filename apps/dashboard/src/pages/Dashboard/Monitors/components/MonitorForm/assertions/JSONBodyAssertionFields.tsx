import { Input } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  assertionJSONBodyOperators,
  jsonOperatorsWithoutTarget,
} from "../../../models/assertionOptions";
import { MonitorFormData } from "../../../models/monitorFormData";
import { assertionFieldPath, isValidJSONPath } from "./assertionHelpers";
import AssertionCell from "./AssertionCell";
import OperatorTargetFields from "./OperatorTargetFields";

interface JSONBodyAssertionFieldsProps {
  stepIndex: number;
  index: number;
}

const JSONBodyAssertionFields: FunctionComponent<
  JSONBodyAssertionFieldsProps
> = (props) => {
  const { control } = useFormContext<MonitorFormData>();

  return (
    <>
      <AssertionCell>
        <Controller
          name={assertionFieldPath(props.stepIndex, props.index, "property")}
          control={control}
          rules={{ required: true, validate: isValidJSONPath }}
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              value={field.value ?? ""}
              error={fieldState.invalid}
              placeholder="$.data.id"
              slotProps={{ input: { ref } }}
            />
          )}
        />
      </AssertionCell>

      <OperatorTargetFields
        {...props}
        operators={assertionJSONBodyOperators}
        operatorsWithoutTarget={jsonOperatorsWithoutTarget}
        targetRequired={false}
      />
    </>
  );
};

export default JSONBodyAssertionFields;
