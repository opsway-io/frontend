import {
  Box,
  Card,
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";

const RadioCardGroup: FunctionComponent<RadioGroupProps> = (props) => {
  return (
    <RadioGroup
      {...props}
      sx={{
        "& .MuiFormControlLabel-root": {
          marginLeft: 0,
          marginRight: 0,
        },
        ...props.sx,
      }}
    >
      <Stack spacing={1}>{props.children}</Stack>
    </RadioGroup>
  );
};

interface RadioCardProps {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
}

const RadioCard: FunctionComponent<RadioCardProps> = (props) => {
  return (
    <Card
      component={FormControlLabel}
      disabled={props.disabled}
      sx={{
        backgroundColor: "transparent",
        padding: 1,

        "&:hover": {
          opacity: props.disabled ? "" : 0.8,
        },
        opacity: props.disabled ? 0.5 : 1,

        "& .MuiTypography-root": {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }}
      label={
        <>
          <Stack>
            <Typography>{props.label}</Typography>
            {props.description && (
              <Typography color="text.secondary">
                {props.description}
              </Typography>
            )}
          </Stack>
          <Box>{props.endAdornment}</Box>
        </>
      }
      control={<Radio value={props.value} />}
    ></Card>
  );
};

export { RadioCardGroup, RadioCard };
