import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Tooltip,
  Box,
} from "@mui/material";
import { FunctionComponent } from "react";

interface RequestTimelineProps {
  phases: {
    dnsLookup: number;
    tcpConnection: number;
    tlsHandshake: number;
    serverProcessing: number;
    contentTransfer: number;
  };
}

function getRowWidth(time: number, total: number): string {
  return (time / total) * 100 + "%";
}

const RequestTimeline: FunctionComponent<RequestTimelineProps> = (props) => {
  const { phases } = props;

  const barHeight = 8;

  const ttfb = phases.dnsLookup + phases.tcpConnection + phases.tlsHandshake;
  const total = ttfb + phases.serverProcessing + phases.contentTransfer;

  const dnsLookupWidth = getRowWidth(phases.dnsLookup, total);

  const connectWidth = getRowWidth(phases.tcpConnection, total);
  const connectOffset = getRowWidth(phases.dnsLookup, total);

  const preTransferWidth = getRowWidth(phases.tlsHandshake, total);
  const preTransferOffset = getRowWidth(
    phases.dnsLookup + phases.tcpConnection,
    total,
  );

  const startTransferWidth = getRowWidth(phases.serverProcessing, total);
  const startTransferOffset = getRowWidth(
    phases.dnsLookup + phases.tcpConnection + phases.tlsHandshake,
    total,
  );

  const contentTransferWidth = getRowWidth(phases.contentTransfer, total);
  const contentTransferOffset = getRowWidth(
    phases.dnsLookup +
      phases.tcpConnection +
      phases.tlsHandshake +
      phases.serverProcessing,
    total,
  );

  return (
    <Table
      size="small"
      sx={{
        [`& .${tableCellClasses.root}`]: {
          borderBottom: "none",
        },
      }}
    >
      <TableHead>
        <TableRow
          sx={{
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <TableCell
            width={150}
            sx={{
              opacity: 0.75,
            }}
          >
            Start
          </TableCell>
          <TableCell></TableCell>
          <TableCell
            align="right"
            width={100}
            sx={{
              opacity: 0.75,
            }}
          >
            Timing
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>DNS lookup</TableCell>
          <TableCell>
            <Box
              sx={{
                width: dnsLookupWidth,
                height: barHeight,
                bgcolor: "info.main",
                borderRadius: (t) => t.shape.borderRadius,
              }}
            />
          </TableCell>
          <TableCell align="right">{phases.dnsLookup} ms</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>TCP Connect</TableCell>
          <TableCell>
            <Box
              sx={{
                width: connectWidth,
                marginLeft: connectOffset,
                height: barHeight,
                bgcolor: "success.main",
                borderRadius: (t) => t.shape.borderRadius,
              }}
            />
          </TableCell>
          <TableCell align="right">{phases.tcpConnection} ms</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>TLS Handshake</TableCell>
          <TableCell>
            <Box
              sx={{
                width: preTransferWidth,
                marginLeft: preTransferOffset,
                height: barHeight,
                bgcolor: "warning.main",
                borderRadius: (t) => t.shape.borderRadius,
              }}
            />
          </TableCell>
          <TableCell align="right">{phases.tlsHandshake} ms</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Server Processing</TableCell>
          <TableCell>
            <Box
              sx={{
                width: startTransferWidth,
                marginLeft: startTransferOffset,
                height: barHeight,
                bgcolor: "#9b59b6", // TODO: use theme color
                borderRadius: (t) => t.shape.borderRadius,
              }}
            />
          </TableCell>
          <TableCell align="right">{phases.serverProcessing} ms</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Content Transfer</TableCell>
          <TableCell>
            <Box
              sx={{
                width: contentTransferWidth,
                marginLeft: contentTransferOffset,
                height: barHeight,
                bgcolor: "error.main",
                borderRadius: (t) => t.shape.borderRadius,
              }}
            />
          </TableCell>
          <TableCell align="right">{phases.contentTransfer} ms</TableCell>
        </TableRow>

        <TableRow
          sx={{
            borderTop: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Tooltip
            title="Sum of phases up until server processing"
            placement="right"
          >
            <TableCell>Time to First Byte</TableCell>
          </Tooltip>
          <TableCell></TableCell>
          <TableCell align="right">{ttfb} ms</TableCell>
        </TableRow>
        <TableRow>
          <Tooltip title="Sum of all phases" placement="right">
            <TableCell>Total</TableCell>
          </Tooltip>
          <TableCell></TableCell>
          <TableCell align="right">{total} ms</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default RequestTimeline;

/*
	DNSLookup        time.Duration
	TCPConnection    time.Duration
	TLSHandshake     time.Duration
	ServerProcessing time.Duration
	ContentTransfer  time.Duration
*/
