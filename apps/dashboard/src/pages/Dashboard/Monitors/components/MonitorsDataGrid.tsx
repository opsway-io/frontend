import { Chip, Sheet, Stack, Tooltip, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoCheckmark, IoConstructOutline, IoPause } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MonitorWithStats } from "../../../../api/endpoints/monitors";
import DataGrid, {
  DataGridProps,
  GridColDef,
  GridRowsProp,
} from "../../../../components/DataGrid/DataGrid";
import { Role } from "../../../../components/Restrict";
import ResultThumbGraph from "../../../../components/ResultThumbGraph/ResultThumbGraph";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import { secondsHumanize } from "../../../../utilities/time";
import { stripProtocolAndPath } from "../../../../utilities/url";
import { useMonitorsIncidents } from "../../../../hooks/monitors.query";
import MonitorActionsMenu from "./MonitorActionsMenu";

interface MonitorsDataGridProps extends Omit<
  DataGridProps,
  "columns" | "rows"
> {
  monitors?: MonitorWithStats[];
}

const statusIndicator = (state: MonitorWithStats["state"]) => {
  if (state === "ACTIVE") {
    return {
      color: "success" as const,
      label: "Active",
      icon: <IoCheckmark />,
    };
  }

  if (state === "MAINTENANCE") {
    return {
      color: "warning" as const,
      label: "Maintenance",
      icon: <IoConstructOutline />,
    };
  }

  return { color: "neutral" as const, label: "Paused", icon: <IoPause /> };
};

const MonitorsDataGrid: FunctionComponent<MonitorsDataGridProps> = (props) => {
  const navigate = useNavigate();
  const currentRole = useCurrentUserRole();
  const { data: monitorsIncidents } = useMonitorsIncidents();

  const rows: GridRowsProp = props.monitors || [];

  const columns: GridColDef<MonitorWithStats>[] = [
    {
      field: "status",
      headerName: "",
      width: 56,
      align: "center",
      sortable: false,
      renderCell: (p) => {
        const status = statusIndicator(p.row.state);

        return (
          <Tooltip title={status.label} placement="right">
            <Sheet
              variant="soft"
              color={status.color}
              aria-label={status.label}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "sm",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "md",
                color: `${status.color}.400`,
              }}
            >
              {status.icon}
            </Sheet>
          </Tooltip>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (col) => {
        const hasIncident = monitorsIncidents?.monitors?.some(
          (m) => m.id === col.row.id && m.incidents?.length > 0,
        );

        return (
          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            <Stack minWidth={0}>
              <Typography level="title-sm" noWrap>
                {col.row.name}
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary" noWrap>
                {stripProtocolAndPath(col.row.steps?.[0]?.url || "")}
              </Typography>
            </Stack>
            {hasIncident && (
              <Chip size="sm" color="danger" variant="soft">
                Incident
              </Chip>
            )}
          </Stack>
        );
      },
    },
    {
      field: "stats",
      headerName: "Latest results",
      width: 320,
      sortable: false,
      renderCell: (col) => (
        <ResultThumbGraph
          stats={col.row.stats.averageResponseTimes || []}
          onClick={() => {
            navigate(`/monitors/${col.row.id}`);
          }}
        />
      ),
    },
    {
      field: "30d",
      headerName: "30D",
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (col) =>
        `${col.row.stats?.uptimePercentage?.toFixed(2) || 0}%`,
    },
    {
      field: "p99",
      headerName: "P99",
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (col) => `${col.row.stats.p99}ms`,
    },
    {
      field: "p95",
      headerName: "P95",
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (col) => `${col.row.stats.p95}ms`,
    },
    {
      field: "frequency",
      headerName: "Frequency",
      sortable: false,
      width: 150,
      align: "right",
      headerAlign: "right",
      valueGetter: (col) =>
        `${secondsHumanize(col.row.settings.frequencySeconds)}`,
    },
  ];

  if (Role.ADMIN.equalOrHigher(currentRole)) {
    columns.push({
      field: "actions",
      headerName: "",
      width: 56,
      align: "right",
      sortable: false,
      renderCell: (col) => <MonitorActionsMenu monitor={col.row} />,
    });
  }

  return (
    <DataGrid
      {...props}
      columns={columns}
      rows={rows}
      onRowClick={(r) => {
        navigate(`/monitors/${r.id}`);
      }}
      noRowsContent="No monitors"
    />
  );
};

export default MonitorsDataGrid;
