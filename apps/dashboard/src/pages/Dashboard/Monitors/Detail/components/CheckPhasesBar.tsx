import { Box, Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { Check } from "../../../../../api/endpoints/monitors/checks";
import { checkPhases } from "../../models/checkPhases";

const BAR_HEIGHT = 12;

interface CheckPhasesBarProps {
  check: Check;
}

/** Stacked bar showing how long each request phase took relative to the total. */
const CheckPhasesBar: FunctionComponent<CheckPhasesBarProps> = ({ check }) => {
  const total = checkPhases.reduce(
    (sum, phase) => sum + check.timing[phase.timingKey],
    0,
  );

  return (
    <Stack
      direction="row"
      width="100%"
      height={BAR_HEIGHT}
      sx={{
        opacity: 0.7,
        borderRadius: "xs",
        minWidth: 80,
        overflow: "hidden",
      }}
    >
      {checkPhases.map((phase) => (
        <Box
          key={phase.timingKey}
          sx={{
            width: `${(check.timing[phase.timingKey] / total) * 100}%`,
            height: BAR_HEIGHT,
            bgcolor: phase.color,
          }}
        />
      ))}
    </Stack>
  );
};

export default CheckPhasesBar;
