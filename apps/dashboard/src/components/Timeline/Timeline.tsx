import { Box } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface TimelineProps {
  children: ReactNode;
}

/**
 * Simple vertical timeline: a left rail with a small colored dot per
 * `TimelineItem`.
 */
const Timeline: FunctionComponent<TimelineProps> = ({ children }) => {
  return (
    <Box
      component="ol"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        position: "relative",
        "& > li:last-of-type": {
          pb: 0,
        },
        "& > li:last-of-type::before": {
          display: "none",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default Timeline;
