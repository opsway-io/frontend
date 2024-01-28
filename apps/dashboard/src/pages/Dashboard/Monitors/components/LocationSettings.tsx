import {
  Box,
  Card,
  Grid,
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";

interface LocationSettingsProps {}

const LocationSettings: FunctionComponent<LocationSettingsProps> = () => {
  return (
    <Grid container gap={1}>
      <Grid item flex={3}>
        <LocationItem
          selected={true}
          value="eu-central-1"
          name="Germany"
          description="eu-central-1"
          countryCode="de"
        />
      </Grid>
      <Grid item flex={3}>
        <LocationItem
          value="eu-west-1"
          name="Ireland"
          description="eu-west-1"
          countryCode="ie"
          disabled={true}
        />
      </Grid>
      <Grid item flex={3}>
        <LocationItem
          value="eu-north-1"
          name="Denmark"
          description="eu-north-1"
          countryCode="dk"
          disabled={true}
        />
      </Grid>
    </Grid>
  );
};

interface LocationItemProps {
  value: string;
  name: string;
  description: string;
  countryCode: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  selected?: boolean;
}

const LocationItem: FunctionComponent<LocationItemProps> = (props) => {
  return (
    <Card
      variant="outlined"
      component={ToggleButton}
      value={props.value}
      disabled={props.disabled}
      sx={{
        display: "flex",
        justifyContent: "left",
        gap: 2,
        overflow: "hidden",
        opacity: props.disabled ? 0.5 : 1,
        border: (t) =>
          props.selected ? `1px solid ${t.palette.primary.main}` : "none",
      }}
      fullWidth
    >
      <Box
        sx={{
          width: 50,
          height: 40,
          backgroundImage: `url(/img/flags/${props.countryCode}.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: (t) => `${t.shape.borderRadius}px`,
        }}
      />
      <Stack>
        <Typography variant="body1" textAlign="left">
          {props.name}
        </Typography>

        <Typography variant="caption" textAlign="left" color="text.secondary">
          {props.description}
        </Typography>
      </Stack>
    </Card>
  );
};

export default LocationSettings;
