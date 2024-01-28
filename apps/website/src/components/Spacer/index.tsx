import { Box } from "@mui/material";
import { FunctionComponent } from "react";

interface SpacerProps {}

const Spacer: FunctionComponent<SpacerProps> = () => {
  return (
    <Box
      sx={{
        marginTop: {
          xs: 8,
          md: 8,
        },
      }}
    />
  );
};

export default Spacer;
