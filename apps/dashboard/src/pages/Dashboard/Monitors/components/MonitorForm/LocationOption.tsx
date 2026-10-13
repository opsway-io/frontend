import { Box, Card, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { GiWorld } from "react-icons/gi";
import { IoCheckmarkCircle } from "react-icons/io5";

interface LocationOptionProps {
  name: string;
  description: string;
  /** Two letter country code, or "random" for the global location. */
  countryCode: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const flagSx = {
  width: 40,
  height: 30,
  flexShrink: 0,
};

/** Selectable probe location card (toggle button). */
const LocationOption: FunctionComponent<LocationOptionProps> = (props) => {
  return (
    <Card
      component="button"
      type="button"
      variant="outlined"
      orientation="horizontal"
      aria-pressed={!!props.selected}
      disabled={props.disabled}
      onClick={props.onClick}
      sx={{
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        width: "100%",
        font: "inherit",
        textAlign: "left",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
        userSelect: "none",
        transition: "border-color 120ms, background-color 120ms",
        ...(props.selected && {
          borderColor: "neutral.outlinedColor",
          bgcolor: "background.level1",
        }),
        "&:hover": {
          borderColor: props.selected
            ? "neutral.outlinedColor"
            : "neutral.outlinedBorder",
          bgcolor: "background.level1",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "focusVisible",
          outlineOffset: 2,
        },
      }}
    >
      {props.countryCode === "random" ? (
        <Box
          sx={{
            ...flagSx,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
          }}
        >
          <GiWorld size={28} />
        </Box>
      ) : (
        <Box
          sx={{
            ...flagSx,
            backgroundImage: `url(/img/flags/${props.countryCode.toLowerCase()}.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "xs",
          }}
        />
      )}

      <Stack sx={{ minWidth: 0, flex: 1 }}>
        <Typography level="title-sm" noWrap>
          {props.name}
        </Typography>
        <Typography level="body-xs" textColor="text.tertiary" noWrap>
          {props.description}
        </Typography>
      </Stack>

      <Box
        component={IoCheckmarkCircle}
        sx={{
          flexShrink: 0,
          fontSize: "lg",
          color: "text.primary",
          visibility: props.selected ? "visible" : "hidden",
        }}
      />
    </Card>
  );
};

export default LocationOption;
