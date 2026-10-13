import { Button, Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoCheckmark } from "react-icons/io5";
import ImportOptionsSection from "./ImportOptionsSection";

interface ImportLocationPickerProps {
  locations: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const ImportLocationPicker: FunctionComponent<ImportLocationPickerProps> = (
  props,
) => {
  const toggle = (location: string) =>
    props.onChange(
      props.selected.includes(location)
        ? props.selected.filter((l) => l !== location)
        : [...props.selected, location],
    );

  return (
    <ImportOptionsSection
      title="Locations"
      description="Select the locations to run these monitors from."
    >
      <Stack direction="row" gap={1} flexWrap="wrap">
        {props.locations.map((location) => {
          const selected = props.selected.includes(location);

          return (
            <Button
              key={location}
              variant={selected ? "solid" : "outlined"}
              color={selected ? "primary" : "neutral"}
              startDecorator={selected ? <IoCheckmark /> : undefined}
              aria-pressed={selected}
              onClick={() => toggle(location)}
            >
              {location}
            </Button>
          );
        })}
      </Stack>
    </ImportOptionsSection>
  );
};

export default ImportLocationPicker;
