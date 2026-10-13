import { Box, Chip, Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { checkPhases } from "../../models/checkPhases";

/** Color legend for the check phases bar. */
const CheckPhaseLegend: FunctionComponent = () => (
  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
    {checkPhases.map((phase) => (
      <Chip
        key={phase.label}
        variant="outlined"
        color="neutral"
        startDecorator={
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: phase.color,
            }}
          />
        }
      >
        {phase.label}
      </Chip>
    ))}
  </Stack>
);

export default CheckPhaseLegend;
