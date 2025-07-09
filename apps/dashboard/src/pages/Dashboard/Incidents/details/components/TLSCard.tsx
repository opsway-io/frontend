import {
  Card,
  CardContent,
  Typography,
  Skeleton,
  useTheme,
} from "@mui/material";
import { FunctionComponent, useMemo } from "react";
import {
  IoAlert,
  IoAlertCircle,
  IoLockClosed,
  IoLockOpen,
} from "react-icons/io5";
import { useLatestMonitorCheck } from "../../../../../hooks/monitors.query";
import { certDaysUntilExpiry } from "../../../../../utilities/tls";
import Conditional from "../../../../../components/Conditional";

interface TLSCardProps {
  monitorId?: number;
}

const TLSCard: FunctionComponent<TLSCardProps> = ({ monitorId }) => {
  const theme = useTheme();

  const { data, isLoading } = useLatestMonitorCheck(monitorId);

  const tlsEnabled = useMemo(() => {
    return !!data?.tls;
  }, [data?.tls]);

  const expired = useMemo(() => {
    if (!data?.tls?.notAfter) {
      return false;
    }
    return certDaysUntilExpiry(data.tls.notAfter) <= 0;
  }, [data?.tls?.notAfter]);

  const daysUntilCertExpires = useMemo(() => {
    if (!data?.tls?.notAfter) {
      return 0;
    }
    return certDaysUntilExpiry(data.tls.notAfter);
  }, [data?.tls?.notAfter]);

  const unknown = useMemo(() => {
    return data === null;
  }, [data]);

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography
          sx={{ opacity: 0.5, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Conditional value={isLoading}>
            <Skeleton variant="text" width={100} />
          </Conditional>

          <Conditional value={!isLoading}>
            <Conditional value={unknown}>TLS</Conditional>

            <Conditional value={!unknown}>
              <Conditional value={!tlsEnabled}>
                TLS
                <IoLockClosed color={theme.palette.error.main} />
              </Conditional>

              <Conditional value={tlsEnabled}>
                <Conditional value={unknown}>TLS</Conditional>

                <Conditional value={!expired}>
                  TLS
                  <IoLockClosed color={theme.palette.success.main} />
                  {data?.tls?.issuer}
                </Conditional>

                <Conditional value={expired}>
                  TLS
                  <IoAlertCircle color={theme.palette.error.main} />
                </Conditional>
              </Conditional>
            </Conditional>
          </Conditional>
        </Typography>

        <Conditional value={isLoading}>
          <Skeleton variant="text" width={200} height={28} />
        </Conditional>

        <Conditional value={!isLoading}>
          <Conditional value={unknown}>
            <Typography fontSize="1.25rem">Unknown</Typography>
          </Conditional>

          <Conditional value={!unknown}>
            <Conditional value={!tlsEnabled}>
              <Typography fontSize="1.25rem">Not enabled</Typography>
            </Conditional>

            <Conditional value={tlsEnabled}>
              <Conditional value={daysUntilCertExpires <= 0}>
                <Typography fontSize="1.25rem" color={theme.palette.error.main}>
                  Expired
                </Typography>
              </Conditional>

              <Conditional value={daysUntilCertExpires > 0}>
                <Typography fontSize="1.25rem">
                  {`Expires in ${daysUntilCertExpires}`}
                  {daysUntilCertExpires == 1 ? " day" : " days"}
                </Typography>
              </Conditional>
            </Conditional>
          </Conditional>
        </Conditional>
      </CardContent>
    </Card>
  );
};

export default TLSCard;
