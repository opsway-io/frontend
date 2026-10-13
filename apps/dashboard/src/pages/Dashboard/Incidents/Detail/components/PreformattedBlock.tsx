import { Box } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface PreformattedBlockProps {
  children: ReactNode;
  monospace?: boolean;
}

/** Keeps the line breaks of multi-line incident text (diagnostics, RCA). */
const PreformattedBlock: FunctionComponent<PreformattedBlockProps> = ({
  children,
  monospace = false,
}) => (
  <Box
    sx={{
      whiteSpace: "pre-wrap",
      fontFamily: monospace ? "code" : undefined,
      fontSize: monospace ? "xs" : "sm",
      lineHeight: monospace ? 1.6 : 1.5,
      color: "text.primary",
      my: 1.5,
      p: monospace ? 2 : 1.5,
      bgcolor: "background.level1",
      borderRadius: "sm",
      border: "1px solid",
      borderColor: "divider",
      overflowX: "auto",
    }}
  >
    {children}
  </Box>
);

export default PreformattedBlock;
