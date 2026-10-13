import { Box, ColorPaletteProp, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface TimelineItemProps {
  title: ReactNode;
  timestamp?: ReactNode;
  color?: ColorPaletteProp;
  children?: ReactNode;
}

const TimelineItem: FunctionComponent<TimelineItemProps> = ({
  title,
  timestamp,
  color = "neutral",
  children,
}) => {
  return (
    <Box
      component="li"
      sx={{
        position: "relative",
        pl: 3,
        pb: 2.5,
        // Rail connecting this dot to the next one
        "&::before": {
          content: '""',
          position: "absolute",
          left: "4px",
          top: "16px",
          bottom: "-2px",
          width: "1px",
          bgcolor: "divider",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: "5px",
          width: 9,
          height: 9,
          borderRadius: "50%",
          bgcolor: `${color}.500`,
          boxShadow: (theme) =>
            `0 0 0 3px rgba(${theme.vars.palette[color].mainChannel} / 0.2)`,
        }}
      />
      <Stack spacing={0.25}>
        <Typography level="title-sm">{title}</Typography>
        {timestamp && (
          <Typography level="body-xs" textColor="text.tertiary">
            {timestamp}
          </Typography>
        )}
        {children && <Box sx={{ pt: 0.75 }}>{children}</Box>}
      </Stack>
    </Box>
  );
};

export default TimelineItem;
