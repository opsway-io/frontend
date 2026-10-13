import { Box } from "@mui/joy";
import { FunctionComponent, useMemo } from "react";
import zxcvbn from "zxcvbn";

interface PasswordStrengthProps {
  value?: string;
}

const colorForScore = (score: number) => {
  switch (score) {
    case 1:
      return "danger.500";
    case 2:
      return "warning.500";
    case 3:
    case 4:
      return "success.500";
    default:
      return "neutral.700";
  }
};

const PasswordStrength: FunctionComponent<PasswordStrengthProps> = (props) => {
  const score = useMemo(() => zxcvbn(props.value || "").score, [props.value]);
  const color = colorForScore(score);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 0.75 }}>
      {[1, 2, 3, 4].map((step) => (
        <Box
          key={step}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: "xs",
            bgcolor: score >= step ? color : "neutral.700",
            transition: "background-color 200ms",
          }}
        />
      ))}
    </Box>
  );
};

export default PasswordStrength;
