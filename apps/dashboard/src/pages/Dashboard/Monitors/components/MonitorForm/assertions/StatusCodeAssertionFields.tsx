import { FunctionComponent } from "react";
import { assertionStatusCodeOperators } from "../../../models/assertionOptions";
import AssertionSelectField from "./AssertionSelectField";
import EmptyAssertionCell from "./EmptyAssertionCell";
import NumericTargetField from "./NumericTargetField";

interface StatusCodeAssertionFieldsProps {
  stepIndex: number;
  index: number;
}

const StatusCodeAssertionFields: FunctionComponent<
  StatusCodeAssertionFieldsProps
> = (props) => (
  <>
    <EmptyAssertionCell />
    <AssertionSelectField
      {...props}
      field="operator"
      options={assertionStatusCodeOperators}
    />
    <NumericTargetField {...props} placeholder="200" />
  </>
);

export default StatusCodeAssertionFields;
