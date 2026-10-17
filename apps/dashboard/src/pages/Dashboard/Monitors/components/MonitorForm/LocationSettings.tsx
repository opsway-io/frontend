import { Box, Typography } from "@mui/joy";
import { FunctionComponent, useEffect, useMemo } from "react";
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
  const { control, getValues, setValue } = useFormContext<MonitorFormData>();

  const details = data?.details;
  const availableLocations = useMemo(
    () => data?.locations || [],
    [data?.locations],
  );

  // Automatically select the first available location if current selection has no valid location
  useEffect(() => {
    if (availableLocations.length > 0) {
      const current = getValues("settings.locations") || [];
      const hasValid = current.some((loc) => availableLocations.includes(loc));
      if (!hasValid) {
        setValue("settings.locations", [availableLocations[0]]);
      }
    }
  }, [availableLocations, getValues, setValue]);

  const getLocationInfo = (locId: string) => {
    const detail = details?.find((d) => d.id === locId);
    if (detail) {
      return {
        id: detail.id,
        name: detail.name || detail.id.toUpperCase(),
        description: detail.id,
        countryCode: detail.countryCode || "random",
      };
    }

    let countryCode = "random";
    if (locId !== "global") {
      const parts = locId.toLowerCase().split("-");
      if (parts[parts.length - 1].length === 2) {
        countryCode = parts[parts.length - 1];
      } else if (parts[0].length === 2) {
        countryCode = parts[0];
      } else {
        countryCode = locId.substring(0, 2);
      }
    }

    return {
      id: locId,
      name: locId.toUpperCase(),
      description: locId,
      countryCode,
    };
  };

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
            {availableLocations.map((location) => {
              const info = getLocationInfo(location);

              return (
                <LocationOption
                  key={location}
                  name={info.name}
                  description={info.description}
                  countryCode={info.countryCode}
                  selected={selected.includes(location)}
                  onClick={() => {
                    const next = toggleLocation(selected, location);
                    if (next !== selected) {
                      field.onChange(next);
                    }
                  }}
                />
              );
            })}
          </Box>
        );
      }}
    />
  );
};

export default LocationSettings;
