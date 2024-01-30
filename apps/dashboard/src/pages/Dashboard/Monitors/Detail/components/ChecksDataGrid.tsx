import { Box, Button, Chip, Stack, useTheme } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataGrid from "../../../../../components/DataGrid";
import { Check } from "../../../../../api/models/checks";
import { IoLockClosed, IoWarning } from "react-icons/io5";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useMonitorChecks } from "../../../../../hooks/monitors.query";
import { isCertValid } from "../../../../../utilities/tls";

const CHECKS_PER_PAGE = 5;
interface MonitorChecksDataGridProps {
  teamId?: number;
  monitorId: number;
}

const ChecksDataGrid: FunctionComponent<MonitorChecksDataGridProps> = (
  props,
) => {
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useMonitorChecks(
    props.monitorId,
    offset,
    CHECKS_PER_PAGE,
  );

  const formatTime = (time: number) => {
    return Math.floor(time / 1000000) + " ms";
  };

  const columns: GridColDef<Check>[] = [
    {
      field: "statusCode",
      headerName: "Status",
      width: 72,
      align: "left",
      headerAlign: "left",
      sortable: false,
      renderCell: (row) => <Chip label={row.value} color="success" />,
    },
    {
      field: "tls",
      headerName: "TLS",
      width: 64,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (col) => {
        if (isCertValid(col.row.tls.notAfter)) {
          return <Chip label={<IoLockClosed />} color="success" />;
        } else {
          return <Chip label={<IoWarning size={18} />} color="error" />;
        }
      },
    },
    {
      field: "timing",
      headerName: "Time",
      width: 150,
      align: "left",
      headerAlign: "left",
      sortable: false,
      renderCell: (col) => <>{formatTime(col.row.timing.total)}</>,
    },
    {
      field: "phases",
      headerName: "Phases",
      align: "left",
      headerAlign: "left",
      flex: 1,
      sortable: false,
      renderCell: (col) => <PhasesThumb check={col.row} />,
    },
    {
      field: "createdAt",
      headerName: "Timestamp",
      width: 300,
      align: "right",
      headerAlign: "right",
      sortable: false,
      renderCell: (col) => <>{new Date(col.value).toLocaleString()}</>,
    },
  ];

  return (
    <>
      <DataGrid
        columns={columns}
        rows={data?.checks || []}
        rowHeight={42}
        autoHeight
        loading={isLoading}
        onPaginationModelChange={(model) => {
          setOffset(model.page * CHECKS_PER_PAGE);
        }}
        onRowClick={(row) => {
          navigate(`/monitors/${props.monitorId}/checks/${row.id}`);
        }}
      />
      <Stack direction="row" justifyContent="center" spacing={2}>
        <Button
          onClick={() => setOffset(offset - CHECKS_PER_PAGE)}
          disabled={offset === 0}
        >
          <AiOutlineLeft size={18} />
        </Button>
        <Button
          onClick={() => setOffset(offset + CHECKS_PER_PAGE)}
          disabled={(data?.checks.length || 0) < CHECKS_PER_PAGE}
        >
          <AiOutlineRight size={18} />
        </Button>
      </Stack>
    </>
  );
};

function getRowWidth(time: number, total: number): string {
  return (time / total) * 100 + "%";
}

interface PhasesThumbProps {
  check: Check;
}

const PhasesThumb: FunctionComponent<PhasesThumbProps> = (props) => {
  const theme = useTheme();

  const { check } = props;

  const barHeight = 12;

  const total =
    check.timing.dnsLookup +
    check.timing.tcpConnection +
    check.timing.tlsHandshake +
    check.timing.serverProcessing +
    check.timing.contentTransfer;

  const dnsLookupWidth = getRowWidth(check.timing.dnsLookup, total);
  const connectWidth = getRowWidth(check.timing.tcpConnection, total);
  const preTransferWidth = getRowWidth(check.timing.tlsHandshake, total);
  const startTransferWidth = getRowWidth(check.timing.serverProcessing, total);
  const contentTransferWidth = getRowWidth(check.timing.contentTransfer, total);

  return (
    <Stack
      direction="row"
      width="100%"
      height={barHeight}
      sx={{
        opacity: 0.5,
      }}
    >
      <Box
        sx={{
          width: dnsLookupWidth,
          height: barHeight,
          bgcolor: "info.main",
          borderTopLeftRadius: (t) => t.shape.borderRadius,
          borderBottomLeftRadius: (t) => t.shape.borderRadius,
        }}
      />
      <Box
        sx={{
          width: connectWidth,
          height: barHeight,
          bgcolor: "success.main",
        }}
      />
      <Box
        sx={{
          width: preTransferWidth,
          height: barHeight,
          bgcolor: "warning.main",
        }}
      />
      <Box
        sx={{
          width: startTransferWidth,
          height: barHeight,
          bgcolor: "#9b59b6", // TODO: use theme color
        }}
      />
      <Box
        sx={{
          width: contentTransferWidth,
          height: barHeight,
          bgcolor: "error.main",
          borderTopRightRadius: (t) => t.shape.borderRadius,
          borderBottomRightRadius: (t) => t.shape.borderRadius,
        }}
      />
    </Stack>
  );
};

export { PhasesThumb, ChecksDataGrid };
