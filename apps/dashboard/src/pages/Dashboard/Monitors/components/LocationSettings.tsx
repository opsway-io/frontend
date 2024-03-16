import {
  Box,
  Card,
  Divider,
  Grid,
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { GiWorld } from "react-icons/gi";

interface LocationSettingsProps {}

const LocationSettings: FunctionComponent<LocationSettingsProps> = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <LocationItem
            selected={true}
            value="random"
            name="Random"
            description="Randomly selected locations for each check"
            countryCode="random"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container>
        <Grid item xs={4}>
          <LocationItem
            value="eu-central-1"
            name="Germany"
            description="eu-central-1"
            countryCode="de"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="eu-west-1"
            name="Ireland"
            description="eu-west-1"
            countryCode="ie"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="eu-north-1"
            name="Denmark"
            description="eu-north-1"
            countryCode="dk"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="eu-west-2"
            name="Great Britain"
            description="eu-west-2"
            countryCode="gb"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="eu-west-3"
            name="France"
            description="eu-west-3"
            countryCode="fr"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="eu-south-1"
            name="Italy"
            description="eu-south-1"
            countryCode="it"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="eu-central-2"
            name="Poland"
            description="eu-central-2"
            countryCode="pl"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="eu-central-3"
            name="Spain"
            description="eu-central-3"
            countryCode="es"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="us-west-1"
            name="California"
            description="us-west-1"
            countryCode="us"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="us-east-1"
            name="New York"
            description="us-east-1"
            countryCode="us"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="asia-south-1"
            name="India"
            description="asia-south-1"
            countryCode="in"
            disabled={true}
          />
        </Grid>
        <Grid item xs={4}>
          <LocationItem
            value="asia-east-1"
            name="Japan"
            description="asia-east-1"
            countryCode="jp"
            disabled={true}
          />
        </Grid>
      </Grid>
    </>
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
        display: "xs",
        justifyContent: "left",
        gap: 2,
        overflow: "hidden",
        opacity: props.disabled ? 0.5 : 1,
        border: (t) =>
          props.selected ? `1px solid ${t.palette.primary.main}` : "none",
      }}
      fullWidth
    >
      {props.countryCode === "random" ? (
        <Box
          sx={{
            width: 50,
            height: 40,
          }}
        >
          <GiWorld size={40} />
        </Box>
      ) : (
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
      )}
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
