import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useMonitor } from "../../../../../hooks/monitors.query";
import Conditional from "../../../../../components/Conditional";

interface AverageResponseTimeCardProps {
  monitorId: number;
}

const AverageResponseTimeCard: FunctionComponent<
  AverageResponseTimeCardProps
> = ({ monitorId }) => {
  const { data, isLoading } = useMonitor(monitorId);
  const [Average, setAverage] = useState<string>("None");

  useEffect(() => {
    if (!data?.stats.averageResponseTime) {
      return;
    }

    setAverage(`${Math.floor(data.stats.averageResponseTime)} ms`);
  }, [monitorId, data]);

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography sx={{ opacity: 0.5 }}>Average response time (24-hour)</Typography>

        <Conditional value={isLoading}>
          <Skeleton variant="text" width={100} height={28} />
        </Conditional>

        <Conditional value={!isLoading}>
          <Typography fontSize="1.25rem">{Average}</Typography>
        </Conditional>
      </CardContent>
    </Card>
  );
};

export default AverageResponseTimeCard;
