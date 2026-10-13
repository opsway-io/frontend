import { Box } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

/** Grid cell wrapper (keeps inputs from overflowing their column). */
const AssertionCell: FunctionComponent<{ children?: ReactNode }> = ({
  children,
}) => <Box sx={{ minWidth: 0 }}>{children}</Box>;

export default AssertionCell;
