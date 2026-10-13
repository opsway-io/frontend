import { Box } from "@mui/joy";
import { FunctionComponent } from "react";
import AverageResponseTimeCard from "./AverageResponseTimeCard";
import LastCheckCard from "./LastCheckCard";
import TLSCard from "./TLSCard";
import UptimeCard from "./UptimeCard";

interface MonitorStatCardsProps {
  monitorId: number;
}

const MonitorStatCards: FunctionComponent<MonitorStatCardsProps> = ({
  monitorId,
}) => (
  <Box
    sx={{
      display: "grid",
      gap: 2,
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(4, minmax(0, 1fr))",
      },
    }}
  >
    <UptimeCard monitorId={monitorId} />
    <AverageResponseTimeCard monitorId={monitorId} />
    <LastCheckCard monitorId={monitorId} />
    <TLSCard monitorId={monitorId} />
  </Box>
);

export default MonitorStatCards;
