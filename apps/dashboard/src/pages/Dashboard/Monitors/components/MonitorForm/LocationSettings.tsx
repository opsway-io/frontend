import { Box, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useLocations } from "../../../../../hooks/prober.query";
import { MonitorFormData } from "../../models/monitorFormData";
import LocationOption from "./LocationOption";

/** Toggles a location, but never deselects the last selected one. */
const toggleLocation = (selected: string[], location: string) => {
  if (!selected.includes(location)) {
    return [...selected, location];
  }

  if (selected.length <= 1) {
    return selected;
  }

  return selected.filter((l) => l !== location);
};

const LocationSettings: FunctionComponent = () => {
  const { data, isPending: isLoading } = useLocations();
  const { control } = useFormContext<MonitorFormData>();

  const availableLocations = data?.locations || [];

  if (!isLoading && availableLocations.length === 0) {
    return (
      <Typography
        level="body-sm"
        textColor="text.tertiary"
        sx={{
          p: 2,
          textAlign: "center",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: "md",
        }}
      >
        No probe locations are available right now.
      </Typography>
    );
  }

  return (
    <Controller
      name="settings.locations"
      control={control}
      render={({ field }) => {
        const selected = field.value || [];

        return (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {availableLocations.map((location) => (
              <LocationOption
                key={location}
                name={location.toUpperCase()}
                description={location}
                countryCode={
                  location === "global" ? "random" : location.substring(0, 2)
                }
                selected={selected.includes(location)}
                onClick={() => {
                  const next = toggleLocation(selected, location);
                  if (next !== selected) {
                    field.onChange(next);
                  }
                }}
              />
            ))}
          </Box>
        );
      }}
    />
  );
};

export default LocationSettings;
