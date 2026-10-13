import { FunctionComponent } from "react";
import { useMonitor } from "../../../../../hooks/monitors.query";
import StatCard from "./StatCard";

interface AverageResponseTimeCardProps {
  monitorId: number;
}

const AverageResponseTimeCard: FunctionComponent<
  AverageResponseTimeCardProps
> = ({ monitorId }) => {
  const { data, isPending } = useMonitor(monitorId);
  const average = data?.stats.averageResponseTime;

  return (
    <StatCard
      label="Average response time (24-hour)"
      value={average ? `${Math.floor(average)} ms` : "None"}
      loading={isPending}
    />
  );
};

export default AverageResponseTimeCard;
