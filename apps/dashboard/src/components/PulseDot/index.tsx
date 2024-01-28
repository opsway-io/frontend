import { styled } from "@mui/material";
import { FunctionComponent } from "react";

const StyledPulseDot = styled("span", {
  shouldForwardProp: (prop) => prop !== "color",
})(({ color }) => ({
  width: 48,
  height: 48,
  display: "inline-block",
  position: "relative",
  "&::after, &::before": {
    content: "''",
    boxSizing: "border-box",
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: color || "#FFF",
    position: "absolute",
    left: 0,
    top: 0,
    animation: "animloader 4s linear infinite",
  },
  "&::after": {
    animationDelay: "-2s",
  },
  "@keyframes animloader": {
    "0%": {
      transform: "scale(0)",
      opacity: 0,
    },
    "25%": {
      transform: "scale(0.5)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 0,
    },
  },
}));

interface PulseDotProps {
  color: string;
}

const PulseDot: FunctionComponent<PulseDotProps> = ({ color }) => {
  return <StyledPulseDot color={color} />;
};

export default PulseDot;
