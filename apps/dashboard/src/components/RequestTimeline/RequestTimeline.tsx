import { Box, Table, Tooltip } from "@mui/joy";
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

const Bar: FunctionComponent<{
  width: string;
  offset?: string;
  color: string;
}> = ({ width, offset, color }) => (
  <Box
    sx={{
      width,
      marginLeft: offset,
      minWidth: 2,
      height: 8,
      bgcolor: color,
      borderRadius: "xs",
    }}
  />
);

const RequestTimeline: FunctionComponent<RequestTimelineProps> = (props) => {
  const { phases } = props;

  const ttfb = phases.dnsLookup + phases.tcpConnection + phases.tlsHandshake;
  const total = ttfb + phases.serverProcessing + phases.contentTransfer;

  const rows = [
    {
      label: "DNS lookup",
      value: phases.dnsLookup,
      offset: 0,
      color: "info.500",
    },
    {
      label: "TCP connect",
      value: phases.tcpConnection,
      offset: phases.dnsLookup,
      color: "success.500",
    },
    {
      label: "TLS handshake",
      value: phases.tlsHandshake,
      offset: phases.dnsLookup + phases.tcpConnection,
      color: "warning.500",
    },
    {
      label: "Server processing",
      value: phases.serverProcessing,
      offset: phases.dnsLookup + phases.tcpConnection + phases.tlsHandshake,
      color: "neutral.300",
    },
    {
      label: "Content transfer",
      value: phases.contentTransfer,
      offset:
        phases.dnsLookup +
        phases.tcpConnection +
        phases.tlsHandshake +
        phases.serverProcessing,
      color: "danger.500",
    },
  ];

  return (
    <Table
      size="sm"
      borderAxis="none"
      sx={{
        "& tr > *:last-child": { textAlign: "right" },
        "& thead tr": {
          borderBottom: "1px solid",
          borderColor: "divider",
        },
        "& tbody tr.summary": {
          borderTop: "1px solid",
          borderColor: "divider",
        },
        "& td": { verticalAlign: "middle" },
      }}
    >
      <thead>
        <tr>
          <th style={{ width: 160 }}>Phase</th>
          <th aria-label="Timeline" />
          <th style={{ width: 100 }}>Timing</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td>{row.label}</td>
            <td>
              <Bar
                width={getRowWidth(row.value, total)}
                offset={getRowWidth(row.offset, total)}
                color={row.color}
              />
            </td>
            <td>{row.value} ms</td>
          </tr>
        ))}

        <tr className="summary">
          <Tooltip
            title="Sum of phases up until server processing"
            placement="right"
          >
            <td>Time to first byte</td>
          </Tooltip>
          <td aria-hidden="true" />
          <td>{ttfb} ms</td>
        </tr>
        <tr>
          <Tooltip title="Sum of all phases" placement="right">
            <td>
              <Box component="span" sx={{ fontWeight: 600 }}>
                Total
              </Box>
            </td>
          </Tooltip>
          <td aria-hidden="true" />
          <td>
            <Box component="span" sx={{ fontWeight: 600 }}>
              {total} ms
            </Box>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default RequestTimeline;
