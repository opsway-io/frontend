import { Input, Option, Select } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  getAssertionOptionLabel,
  numericOperators,
} from "../../../models/assertionOptions";
import { MonitorFormData } from "../../../models/monitorFormData";
import {
  assertionFieldPath,
  isNumber,
  sanitizeNumber,
} from "./assertionHelpers";
import AssertionCell from "./AssertionCell";

interface OperatorTargetFieldsProps {
  stepIndex: number;
  index: number;
  operators: string[];
  /** Operators that don't take a target; the target is cleared and disabled. */
  operatorsWithoutTarget: string[];
  /** Whether a target is required for operators that take one. */
  targetRequired: boolean;
}

/**
 * Operator select + free text target used by the header and body assertions.
 * Numeric operators restrict the target to digits.
 */
const OperatorTargetFields: FunctionComponent<OperatorTargetFieldsProps> = (
  props,
) => {
  const { control, getValues, setValue, trigger } =
    useFormContext<MonitorFormData>();

  const operatorPath = assertionFieldPath(
    props.stepIndex,
    props.index,
    "operator",
  );
  const targetPath = assertionFieldPath(props.stepIndex, props.index, "target");

  const operator = useWatch({ control, name: operatorPath });
  const hasTarget = !props.operatorsWithoutTarget.includes(operator);

  /** Clears a target that doesn't fit the newly selected operator. */
  const resetIncompatibleTarget = (newOperator: string) => {
    const target = getValues(targetPath);

    if (props.operatorsWithoutTarget.includes(newOperator)) {
      setValue(targetPath, "");
    } else if (
      numericOperators.includes(newOperator) &&
      target &&
      !isNumber(target)
    ) {
      setValue(targetPath, "");
    }
  };

  const validateTarget = (value?: string) =>
    !props.targetRequired ||
    props.operatorsWithoutTarget.includes(getValues(operatorPath)) ||
    !!value;

  return (
    <>
      <AssertionCell>
        <Controller
          name={operatorPath}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value || null}
              onBlur={field.onBlur}
              onChange={(_, value) => {
                resetIncompatibleTarget(value as string);
                field.onChange(value);
                trigger(targetPath);
              }}
            >
              {props.operators.map((option) => (
                <Option key={option} value={option}>
                  {getAssertionOptionLabel(option)}
                </Option>
              ))}
            </Select>
          )}
        />
      </AssertionCell>

      <AssertionCell>
        <Controller
          name={targetPath}
          control={control}
          rules={{ validate: validateTarget }}
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              value={field.value ?? ""}
              error={fieldState.invalid}
              slotProps={{ input: { ref } }}
              disabled={!hasTarget}
              onChange={(e) => {
                if (numericOperators.includes(operator)) {
                  e.target.value = sanitizeNumber(e.target.value);
                }
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </AssertionCell>
    </>
  );
};

export default OperatorTargetFields;
