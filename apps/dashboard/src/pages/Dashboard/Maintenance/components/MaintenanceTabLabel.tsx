import { Chip, ColorPaletteProp, Stack } from "@mui/joy";
import { FunctionComponent } from "react";

interface MaintenanceTabLabelProps {
  label: string;
  count: number;
  color: ColorPaletteProp;
}

const MaintenanceTabLabel: FunctionComponent<MaintenanceTabLabelProps> = ({
  label,
  count,
  color,
}) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <span>{label}</span>
    <Chip size="sm" variant="soft" color={color}>
      {count}
    </Chip>
  </Stack>
);

export default MaintenanceTabLabel;
