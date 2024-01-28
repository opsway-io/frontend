import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { FunctionComponent } from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container";
import RequestTimeline from "../../../../components/RequestTimeline";
import { useMonitor, useMonitorCheck } from "../../../../hooks/monitors.query";

const MonitorCheckView: FunctionComponent = () => {
  let params = useParams();

  const monitorId = (params.monitorId as number | undefined) || 0;
  const checkId = (params.checkId as number | undefined) || 0;

  const {
    data: check,
    error: checkError,
    isLoading: checkIsLoading,
  } = useMonitorCheck(monitorId, checkId);
  const {
    data: monitor,
    error: monitorError,
    isLoading: monitorIsLoading,
  } = useMonitor(monitorId);

  const formatResponseTime = (time: number) => {
    return Math.floor(time / 1000000) + " ms";
  };

  return (
    <Container
      loading={checkIsLoading || monitorIsLoading}
      error={(checkError || monitorError) && "Failed to load monitor check"}
      breadcrumbs={[
        <Link to="/monitors">Monitors</Link>,
        monitorIsLoading ? (
          <Skeleton variant="text" width={150} />
        ) : (
          <Link to={`/monitors/${monitorId}`}>{monitor?.name}</Link>
        ),
        <span>
          {/* # and first 7 letters */}
          check #{checkId.toString().substr(0, 7)}
        </span>,
      ]}
      skeleton={
        <>
          <Skeleton variant="rectangular" height={150} />
          <Skeleton variant="rectangular" height={350} />
          <Skeleton variant="rectangular" height={300} />
        </>
      }
    >
      <Card>
        <CardHeader
          title="Summary"
          subheader={
            "Result from " + new Date(check?.createdAt || 0).toLocaleString()
          }
        />
        <CardContent>
          <Card
            elevation={2}
            sx={{ padding: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Chip label={monitor?.settings.method} />
            <span style={{ marginRight: "auto" }}>{monitor?.settings.url}</span>
            <Chip
              label={check?.statusCode}
              color={
                check
                  ? check?.statusCode >= 200 && check?.statusCode < 300
                    ? "success"
                    : "error"
                  : undefined
              }
            />
            <Chip
              label="TLS"
              color={check ? (check?.tls ? "success" : "error") : undefined}
            />
            <Chip
              label={
                check ? formatResponseTime(check?.timing.total) : undefined
              }
              color="info"
            />
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Phases" />
        <CardContent>
          <RequestTimeline
            phases={{
              dnsLookup: Math.floor((check?.timing.dnsLookup || 0) / 1000000),
              tcpConnection: Math.floor(
                (check?.timing.tcpConnection || 0) / 1000000
              ),
              tlsHandshake: Math.floor(
                (check?.timing.tlsHandshake || 0) / 1000000
              ),
              serverProcessing: Math.floor(
                (check?.timing.serverProcessing || 0) / 1000000
              ),
              contentTransfer: Math.floor(
                (check?.timing.contentTransfer || 0) / 1000000
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="TLS certificate" />
        <CardContent>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell width={150}>Version</TableCell>
                <TableCell>{check?.tls?.version || "Unknown"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cipher</TableCell>
                <TableCell>{check?.tls?.cipher || "Unknown"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Issuer</TableCell>
                <TableCell>{check?.tls?.issuer || "Unknown"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>{check?.tls?.subject || "Unknown"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Not before</TableCell>
                <TableCell>
                  {check?.tls?.notBefore.toLocaleString() || "Unknown"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Not after</TableCell>
                <TableCell>
                  {check?.tls?.notAfter.toLocaleString() || "Unknown"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MonitorCheckView;
