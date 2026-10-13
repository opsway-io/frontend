import { FunctionComponent } from "react";
import {
  assertionResponseTimeOperators,
  assertionResponseTimeProperties,
} from "../../../models/assertionOptions";
import AssertionSelectField from "./AssertionSelectField";
import NumericTargetField from "./NumericTargetField";

interface ResponseTimeAssertionFieldsProps {
  stepIndex: number;
  index: number;
}

const ResponseTimeAssertionFields: FunctionComponent<
  ResponseTimeAssertionFieldsProps
> = (props) => (
  <>
    <AssertionSelectField
      {...props}
      field="property"
      options={assertionResponseTimeProperties}
    />
    <AssertionSelectField
      {...props}
      field="operator"
      options={assertionResponseTimeOperators}
    />
    <NumericTargetField {...props} placeholder="2000" endDecorator="ms" />
  </>
);

export default ResponseTimeAssertionFields;
