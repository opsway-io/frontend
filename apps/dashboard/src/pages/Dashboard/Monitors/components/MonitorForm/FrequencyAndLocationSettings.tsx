import { Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import FrequencySettings from "./FrequencySettings";
import LocationSettings from "./LocationSettings";

const FrequencyAndLocationSettings: FunctionComponent = () => {
  return (
    <Stack spacing={2}>
      <SettingsCard
        title="Check frequency"
        description="Select how often we should check your endpoint."
      >
        <FrequencySettings />
      </SettingsCard>

      <SettingsCard
        title="Locations"
        description="Select from which locations you want to check your endpoint."
      >
        <LocationSettings />
      </SettingsCard>
    </Stack>
  );
};

export default FrequencyAndLocationSettings;
