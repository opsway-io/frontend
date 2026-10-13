import { Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";

interface MonitorCellProps {
  name: string;
  id: number;
}

const MonitorCell: FunctionComponent<MonitorCellProps> = ({ name, id }) => (
  <Stack>
    <Typography level="title-sm">{name}</Typography>
    <Typography level="body-xs" textColor="text.tertiary">
      ID: {id}
    </Typography>
  </Stack>
);

export default MonitorCell;
