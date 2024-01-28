import { FunctionComponent } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import LocationSettings from "./LocationSettings";
import FrequencySettings from "./FrequencySettings";

const FrequencyAndLocationSettings: FunctionComponent = () => {
  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        <Stack>
          <Typography variant="subtitle1">Check frequency</Typography>
          <Typography variant="body1" color="textSecondary">
            Select how often we should check your endpoint.
          </Typography>
        </Stack>

        <FrequencySettings />

        <Divider />

        <Stack>
          <Typography variant="subtitle1">Locations</Typography>
          <Typography variant="body1" color="textSecondary">
            Select from which locations you want to check your endpoint.
          </Typography>
        </Stack>

        <LocationSettings />
      </Stack>
    </Stack>
  );
};

export default FrequencyAndLocationSettings;
