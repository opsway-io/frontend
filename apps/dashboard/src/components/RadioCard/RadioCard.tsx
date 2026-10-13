import {
  Box,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Sheet,
  Typography,
} from "@mui/joy";
import { FunctionComponent } from "react";

const RadioCardGroup: FunctionComponent<RadioGroupProps> = (props) => {
  return (
    <RadioGroup
      {...props}
      sx={{
        gap: 1,
        ...props.sx,
      }}
    >
      {props.children}
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
    <Sheet
      variant="outlined"
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        p: 1.5,
        borderRadius: "md",
        bgcolor: "transparent",
        opacity: props.disabled ? 0.5 : 1,
        transition: "background-color 120ms, border-color 120ms",
        "&:hover": props.disabled
          ? undefined
          : { bgcolor: "neutral.plainHoverBg" },
        "&:has(input:checked)": {
          borderColor: "neutral.400",
          bgcolor: "neutral.softBg",
        },
      }}
    >
      <Radio
        value={props.value}
        disabled={props.disabled}
        overlay
        sx={{ mt: 0.25 }}
        slotProps={{
          input: { "aria-label": props.label },
          action: {
            sx: {
              borderRadius: "md",
              "&:hover": { bgcolor: "transparent" },
            },
          },
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography level="title-sm">{props.label}</Typography>
        {props.description && (
          <Typography level="body-sm" textColor="text.secondary">
            {props.description}
          </Typography>
        )}
      </Box>
      {props.endAdornment && (
        <Box sx={{ position: "relative", zIndex: 1, alignSelf: "center" }}>
          {props.endAdornment}
        </Box>
      )}
    </Sheet>
  );
};

export { RadioCardGroup, RadioCard };
