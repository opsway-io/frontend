import { Input } from "@mui/joy";
import { FunctionComponent } from "react";
import AssertionCell from "./AssertionCell";

/** Placeholder for columns that don't apply to the selected source. */
const EmptyAssertionCell: FunctionComponent = () => (
  <AssertionCell>
    <Input disabled placeholder="—" />
  </AssertionCell>
);

export default EmptyAssertionCell;
