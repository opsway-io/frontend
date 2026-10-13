import { FunctionComponent } from "react";
import { useLatestMonitorCheck } from "../../../../../hooks/monitors.query";
import { millisecondsHumanize } from "../../../../../utilities/time";
import useNow from "../hooks/useNow";
import StatCard from "./StatCard";

interface LastCheckCardProps {
  monitorId: number;
}

const LastCheckCard: FunctionComponent<LastCheckCardProps> = ({
  monitorId,
}) => {
  const { data, isPending } = useLatestMonitorCheck(monitorId);
  const now = useNow(1000);

  const lastCheck = data?.createdAt
    ? `${millisecondsHumanize(now - new Date(data.createdAt).getTime())} ago`
    : "Never";

  return (
    <StatCard label="Last checked" value={lastCheck} loading={isPending} />
  );
};

export default LastCheckCard;
