import { Box, Sheet, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface ImportOptionsSectionProps {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}

/** Muted panel grouping extra import options inside the modal. */
const ImportOptionsSection: FunctionComponent<ImportOptionsSectionProps> = (
  props,
) => {
  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: "lg",
        p: 2,
        bgcolor: "background.level1",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Typography level="title-sm">{props.title}</Typography>
        <Typography level="body-xs" textColor="text.secondary">
          {props.description}
        </Typography>
      </Box>
      {props.children}
    </Sheet>
  );
};

export default ImportOptionsSection;
