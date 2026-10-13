import { Box, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface SettingsSubheaderProps {
  title: ReactNode;
  description?: ReactNode;
}

/** A small heading that separates groups of fields inside a `SettingsCard`. */
const SettingsSubheader: FunctionComponent<SettingsSubheaderProps> = ({
  title,
  description,
}) => (
  <Box>
    <Typography level="title-sm">{title}</Typography>
    {description && (
      <Typography level="body-sm" textColor="text.secondary">
        {description}
      </Typography>
    )}
  </Box>
);

export default SettingsSubheader;
