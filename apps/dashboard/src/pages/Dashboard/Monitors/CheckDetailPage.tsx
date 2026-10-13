import { Card, Skeleton, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../../components/Container/Container";
import RequestTimeline from "../../../components/RequestTimeline/RequestTimeline";
import { useMonitor, useMonitorCheck } from "../../../hooks/monitors.query";
import CheckSummaryCard from "./components/CheckDetail/CheckSummaryCard";
import CheckTLSCard from "./components/CheckDetail/CheckTLSCard";
import { nanosecondsToMilliseconds } from "./models/checkPhases";

const CheckDetailPage: FunctionComponent = () => {
  const params = useParams();
  const monitorId = Number(params.monitorId) || 0;
  const checkId = Number(params.checkId) || 0;

  const {
    data: check,
    error: checkError,
    isPending: checkIsLoading,
  } = useMonitorCheck(monitorId, checkId);
  const {
    data: monitor,
    error: monitorError,
    isPending: monitorIsLoading,
  } = useMonitor(monitorId);

  const timing = check?.timing;
  const firstStep = monitor?.steps?.[0];

  return (
    <Container
      loading={checkIsLoading || monitorIsLoading}
      error={(checkError || monitorError) && "Failed to load monitor check"}
      breadcrumbs={[
        <Link key="monitors" to="/monitors">
          Monitors
        </Link>,
        monitorIsLoading ? (
          <Skeleton key="monitor" variant="text" width={150} />
        ) : (
          <Link key="monitor" to={`/monitors/${monitorId}`}>
            {monitor?.name}
          </Link>
        ),
        <span key="check">check #{checkId.toString().slice(0, 7)}</span>,
      ]}
      skeleton={
        <>
          {[150, 350, 300].map((height) => (
            <Skeleton
              key={height}
              variant="rectangular"
              height={height}
              sx={{ borderRadius: "lg" }}
            />
          ))}
        </>
      }
    >
      <CheckSummaryCard
        check={check}
        method={firstStep?.method}
        url={firstStep?.url}
      />

      <Card>
        <Typography level="title-md">Phases</Typography>
        <RequestTimeline
          phases={{
            dnsLookup: nanosecondsToMilliseconds(timing?.dnsLookup || 0),
            tcpConnection: nanosecondsToMilliseconds(
              timing?.tcpConnection || 0,
            ),
            tlsHandshake: nanosecondsToMilliseconds(timing?.tlsHandshake || 0),
            serverProcessing: nanosecondsToMilliseconds(
              timing?.serverProcessing || 0,
            ),
            contentTransfer: nanosecondsToMilliseconds(
              timing?.contentTransfer || 0,
            ),
          }}
        />
      </Card>

      <CheckTLSCard tls={check?.tls} />
    </Container>
  );
};

export default CheckDetailPage;
