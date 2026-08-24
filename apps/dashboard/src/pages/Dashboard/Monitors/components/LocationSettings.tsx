import {
  Box,
  Card,
  Grid,
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { GiWorld } from "react-icons/gi";
import { useFormContext, Controller } from "react-hook-form";
import { SettingsFormData } from "../models/settingsFormData";
import { useLocations } from "../../../../hooks/prober.query";

const LocationSettings: FunctionComponent = () => {
  const { data } = useLocations();
  const { control } = useFormContext<SettingsFormData>();

  const availableLocations = data?.locations || [];

  return (
    <Controller
      name="settings.locations"
      control={control}
      render={({ field }) => (
        <Grid container spacing={2}>
          {availableLocations.map((loc) => {
            const currentValues = field.value || [];
            const isSelected = currentValues.includes(loc);

            const toggleLocation = () => {
              if (isSelected) {
                // If it's the last one, prevent unselecting
                if (currentValues.length > 1) {
                  field.onChange(
                    currentValues.filter((l: string) => l !== loc),
                  );
                }
              } else {
                field.onChange([...currentValues, loc]);
              }
            };

            return (
              <Grid item xs={12} sm={6} md={4} key={loc}>
                <LocationItem
                  value={loc}
                  name={loc.toUpperCase()}
                  description={loc}
                  countryCode={
                    loc === "global" ? "random" : loc.substring(0, 2)
                  }
                  selected={isSelected}
                  onClick={toggleLocation}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    />
  );
};

interface LocationItemProps {
  value: string;
  name: string;
  description: string;
  countryCode: string;
  disabled?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const LocationItem: FunctionComponent<LocationItemProps> = (props) => {
  return (
    <Card
      variant="outlined"
      component={ToggleButton}
      value={props.value}
      disabled={props.disabled}
      selected={props.selected}
      onChange={props.onClick}
      sx={{
        display: "flex",
        justifyContent: "left",
        gap: 2,
        overflow: "hidden",
        opacity: props.disabled ? 0.5 : 1,
        border: (t) =>
          props.selected ? `1px solid ${t.palette.primary.main}` : "none",
        "&.Mui-selected": {
          border: (t) => `1px solid ${t.palette.primary.main}`,
        },
      }}
      fullWidth
    >
      {props.countryCode === "random" ? (
        <Box
          sx={{
            width: 50,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GiWorld size={40} />
        </Box>
      ) : (
        <Box
          sx={{
            width: 50,
            height: 40,
            backgroundImage: `url(/img/flags/${props.countryCode.toLowerCase()}.svg)`,
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
