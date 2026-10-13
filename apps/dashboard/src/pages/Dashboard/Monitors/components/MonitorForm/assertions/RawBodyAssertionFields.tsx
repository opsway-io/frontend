import { FunctionComponent } from "react";
import {
  assertionRawBodyOperators,
  textOperatorsWithoutTarget,
} from "../../../models/assertionOptions";
import EmptyAssertionCell from "./EmptyAssertionCell";
import OperatorTargetFields from "./OperatorTargetFields";

interface RawBodyAssertionFieldsProps {
  stepIndex: number;
  index: number;
}

const RawBodyAssertionFields: FunctionComponent<RawBodyAssertionFieldsProps> = (
  props,
) => (
  <>
    <EmptyAssertionCell />
    <OperatorTargetFields
      {...props}
      operators={assertionRawBodyOperators}
      operatorsWithoutTarget={textOperatorsWithoutTarget}
      targetRequired
    />
  </>
);

export default RawBodyAssertionFields;
