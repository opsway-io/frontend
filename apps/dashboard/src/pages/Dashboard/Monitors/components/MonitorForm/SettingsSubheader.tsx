import { Box, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface SettingsSubheaderProps {
  title: ReactNode;
  description?: ReactNode;
}

/** Small heading for a group of fields inside a step accordion. */
const SettingsSubheader: FunctionComponent<SettingsSubheaderProps> = (
  props,
) => {
  return (
    <Box>
      <Typography level="title-sm">{props.title}</Typography>
      {props.description && (
        <Typography
          level="body-sm"
          textColor="text.secondary"
          sx={{ mt: 0.25 }}
        >
          {props.description}
        </Typography>
      )}
    </Box>
  );
};

export default SettingsSubheader;
