import { FunctionComponent } from "react";
import { useMonitor } from "../../../../../hooks/monitors.query";
import StatCard from "./StatCard";

interface UptimeCardProps {
  monitorId: number;
}

const UptimeCard: FunctionComponent<UptimeCardProps> = ({ monitorId }) => {
  const { data, isPending } = useMonitor(monitorId);
  const uptime = data?.stats.uptimePercentage;

  return (
    <StatCard
      label="Uptime (30-day)"
      value={uptime ? `${Number(uptime).toFixed(2)}%` : "None"}
      loading={isPending}
    />
  );
};

export default UptimeCard;
