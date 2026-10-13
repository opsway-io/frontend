import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  assertionHeadersOperators,
  textOperatorsWithoutTarget,
} from "../../../models/assertionOptions";
import { MonitorFormData } from "../../../models/monitorFormData";
import HeaderNameAutocomplete from "../HeaderNameAutocomplete";
import { assertionFieldPath } from "./assertionHelpers";
import AssertionCell from "./AssertionCell";
import OperatorTargetFields from "./OperatorTargetFields";

interface HeadersAssertionFieldsProps {
  stepIndex: number;
  index: number;
}

const HeadersAssertionFields: FunctionComponent<HeadersAssertionFieldsProps> = (
  props,
) => {
  const { control } = useFormContext<MonitorFormData>();

  return (
    <>
      <AssertionCell>
        <Controller
          name={assertionFieldPath(props.stepIndex, props.index, "property")}
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
      </AssertionCell>

      <OperatorTargetFields
        {...props}
        operators={assertionHeadersOperators}
        operatorsWithoutTarget={textOperatorsWithoutTarget}
        targetRequired
      />
    </>
  );
};

export default HeadersAssertionFields;
