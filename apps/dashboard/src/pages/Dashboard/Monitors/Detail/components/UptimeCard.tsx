import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useMonitor } from "../../../../../hooks/monitors.query";
import Conditional from "../../../../../components/Conditional";

interface UptimeCardProps {
  monitorId: number;
}

const UptimeCard: FunctionComponent<UptimeCardProps> = ({ monitorId }) => {
  const { data, isLoading } = useMonitor(monitorId);
  const [uptime, setUptime] = useState<string>("None");

  useEffect(() => {
    if (!data?.stats.uptimePercentage) {
      return;
    }

    setUptime(`${data.stats.uptimePercentage}%`);
  }, [monitorId, data]);

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography sx={{ opacity: 0.5 }}>Uptime</Typography>
        <Conditional value={isLoading}>
          <Skeleton variant="text" width={100} height={28} />
        </Conditional>

        <Conditional value={!isLoading}>
          <Typography fontSize="1.25rem">{uptime}</Typography>
        </Conditional>
      </CardContent>
    </Card>
  );
};

export default UptimeCard;
