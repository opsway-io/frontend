import { Box } from "@mui/joy";
import { FunctionComponent, memo } from "react";

interface ResultThumbGraphProps {
  onClick?: (key: number) => void;
  stats: number[];
}

const ResultThumbGraph: FunctionComponent<ResultThumbGraphProps> = (props) => {
  const ratio = Math.max(...props.stats) / 100;
  const computedStats = props.stats.map((val) => Math.round(val / ratio));

  return (
    <Box
      sx={{
        display: "flex",
        height: 40,
        justifyContent: "space-between",
        gap: "4px",
        flexGrow: 0,
      }}
    >
      {Array.from({ length: 24 }, (_, i) => (
        <Box
          key={i}
          sx={{
            cursor: "pointer",
            height: "100%",
            alignItems: "flex-end",
            display: "flex",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translate(0, -4px)",
            },
          }}
        >
          <Box
            onClick={() => props.onClick?.(i)}
            sx={{
              height: `${computedStats[i] || 0}%`,
              width: 8,
              borderRadius: "2px",
              bgcolor: "success.500",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default memo(ResultThumbGraph);
