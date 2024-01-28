import { Box, styled, useTheme } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import zxcvbn from "zxcvbn";

const Item = styled("div")(({ theme, color }) => ({
  flex: 1,
  height: "4px",
  backgroundColor: color ? color : theme.palette.grey[300],
  opacity: 0.5,
  borderRadius: theme.shape.borderRadius,
}));

interface PasswordStrengthProps {
  value?: string;
}

const PasswordStrength: FunctionComponent<PasswordStrengthProps> = (props) => {
  const theme = useTheme();

  const defaultColor = theme.palette.grey[300];

  const [score, setScore] = useState(0);
  const [color, setColor] = useState(defaultColor);

  useEffect(() => {
    const result = zxcvbn(props.value || "");

    switch (result.score) {
      case 1:
        setColor(theme.palette.error.main);
        break;
      case 2:
        setColor(theme.palette.warning.main);
        break;
      case 3:
        setColor(theme.palette.success.main);
        break;
      case 4:
        setColor(theme.palette.success.main);
        break;
      default:
        setColor(defaultColor);
        break;
    }

    setScore(result.score);
  }, [props.value]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      <Item color={score > 0 ? color : undefined} />
      <Item color={score > 1 ? color : undefined} />
      <Item color={score > 2 ? color : undefined} />
      <Item color={score > 3 ? color : undefined} />
    </Box>
  );
};

export default PasswordStrength;
