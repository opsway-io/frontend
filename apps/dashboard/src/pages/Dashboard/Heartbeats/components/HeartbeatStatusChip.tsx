import { Chip, ColorPaletteProp } from "@mui/joy";
import { FunctionComponent } from "react";
import { IHeartbeat } from "../../../../api/endpoints/heartbeats";

const statusColors: Record<IHeartbeat["status"], ColorPaletteProp> = {
  UP: "success",
  DOWN: "danger",
  PAUSED: "neutral",
};

interface HeartbeatStatusChipProps {
  status: IHeartbeat["status"];
}

const HeartbeatStatusChip: FunctionComponent<HeartbeatStatusChipProps> = ({
  status,
}) => (
  <Chip variant="soft" color={statusColors[status] ?? "neutral"}>
    {status}
  </Chip>
);

export default HeartbeatStatusChip;
