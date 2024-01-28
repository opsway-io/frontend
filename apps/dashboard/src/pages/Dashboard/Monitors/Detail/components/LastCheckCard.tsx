import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useLatestMonitorCheck } from "../../../../../hooks/monitors.query";
import Conditional from "../../../../../components/Conditional";
import { timeAgoHumanize } from "../../../../../utilities/time";

interface LastCheckCardProps {
  monitorId?: number;
}

const LastCheckCard: FunctionComponent<LastCheckCardProps> = ({
  monitorId,
}) => {
  const { data, isLoading } = useLatestMonitorCheck(monitorId);
  const [lastCheck, setLastCheck] = useState<string>("Never");

  useEffect(() => {
    updateLastCheck();

    const interval = setInterval(updateLastCheck, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [monitorId, data]);

  const updateLastCheck = () => {
    if (!data?.createdAt) {
      return;
    }

    setLastCheck(timeAgoHumanize(data.createdAt));
  };

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography sx={{ opacity: 0.5 }}>Last checked</Typography>

        <Conditional value={isLoading}>
          <Skeleton variant="text" width={100} height={28} />
        </Conditional>

        <Conditional value={!isLoading}>
          <Typography fontSize="1.25rem">{lastCheck}</Typography>
        </Conditional>
      </CardContent>
    </Card>
  );
};

export default LastCheckCard;
