import { Box } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoAlertCircle, IoLockClosed } from "react-icons/io5";
import { useLatestMonitorCheck } from "../../../../../hooks/monitors.query";
import { certDaysUntilExpiry } from "../../../../../utilities/tls";
import StatCard from "./StatCard";

interface TLSCardProps {
  monitorId: number;
}

const formatExpiry = (days: number) =>
  `Expires in ${days}${days === 1 ? " day" : " days"}`;

const TLSCard: FunctionComponent<TLSCardProps> = ({ monitorId }) => {
  const { data, isPending } = useLatestMonitorCheck(monitorId);

  const unknown = data === null;
  const tlsEnabled = !!data?.tls;
  const daysUntilExpiry = data?.tls?.notAfter
    ? certDaysUntilExpiry(data.tls.notAfter)
    : 0;
  const expired = !!data?.tls?.notAfter && daysUntilExpiry <= 0;

  const getIndicator = () => {
    if (isPending || unknown) {
      return undefined;
    }

    const healthy = tlsEnabled && !expired;
    return (
      <Box
        component={tlsEnabled && expired ? IoAlertCircle : IoLockClosed}
        sx={{ color: healthy ? "success.400" : "danger.400", flexShrink: 0 }}
      />
    );
  };

  const getValue = () => {
    if (unknown) {
      return "Unknown";
    }
    if (!tlsEnabled) {
      return "Not enabled";
    }
    return daysUntilExpiry <= 0 ? "Expired" : formatExpiry(daysUntilExpiry);
  };

  const showsIssuer = !unknown && tlsEnabled && !expired && data?.tls?.issuer;

  return (
    <StatCard
      label="TLS"
      indicator={getIndicator()}
      loading={isPending}
      value={getValue()}
      valueColor={
        !unknown && tlsEnabled && daysUntilExpiry <= 0
          ? "danger.400"
          : undefined
      }
      caption={showsIssuer ? data?.tls?.issuer : undefined}
    />
  );
};

export default TLSCard;
