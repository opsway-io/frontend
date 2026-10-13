import { Box, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface SwitchRowProps {
  label: ReactNode;
  description: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

/** Label + description on the left, a switch (children) on the right. */
const SwitchRow: FunctionComponent<SwitchRowProps> = (props) => (
  <FormControl
    orientation="horizontal"
    disabled={props.disabled}
    sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}
  >
    <Box>
      <FormLabel sx={{ mb: 0.25 }}>{props.label}</FormLabel>
      <FormHelperText sx={{ mt: 0 }}>{props.description}</FormHelperText>
    </Box>
    {props.children}
  </FormControl>
);

export default SwitchRow;
