import { Stack, Typography } from "@mui/material";
import { DataGridProps, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { FunctionComponent } from "react";
import { AiOutlinePause } from "react-icons/ai";
import { IoCheckmark } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IMonitorResponse } from "../../../../api/endpoints/monitors";
import Avatar from "../../../../components/Avatar";
import DataGrid from "../../../../components/DataGrid";
import { Role } from "../../../../components/Restrict";
import ResultThumbGraph from "../../../../components/ResultThumbGraph";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import { secondsHumanize } from "../../../../utilities/time";
import { stripProtocolAndPath } from "../../../../utilities/url";
import ItemMenu from "./ItemMenu";

interface MonitorsDataGridProps
  extends Omit<DataGridProps, "columns" | "rows"> {
  monitors?: IMonitorResponse[];
}

const MonitorsDataGrid: FunctionComponent<MonitorsDataGridProps> = (props) => {
  const navigate = useNavigate();
  const currentRole = useCurrentUserRole();

  const rows: GridRowsProp = props.monitors || [];

  const columns: GridColDef<IMonitorResponse>[] = [
    {
      field: "status",
      headerName: "",
      width: 70,
      align: "right",
      sortable: false,
      renderCell: (p) => (
        <Avatar
          sx={{
            backgroundColor: (t) =>
              p.row.state === "ACTIVE"
                ? t.palette.success.main
                : t.palette.grey[500],
            color: (t) => t.palette.success.contrastText,
          }}
        >
          {(p.row.state === "ACTIVE" && <IoCheckmark />) || <AiOutlinePause />}
        </Avatar>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: false,
      renderCell: (col) => (
        <Stack>
          <Typography
            variant="subtitle1"
            sx={{
              lineHeight: 1,
            }}
          >
            {col.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {stripProtocolAndPath(col.row.settings.url)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "stats",
      headerName: "Latest results",
      width: 320,
      sortable: false,
      renderCell: (col) => (
        <ResultThumbGraph
          stats={col.row.stats ? col.row.stats : []}
          onClick={() => {
            navigate(`/monitors/1/checks/1`);
          }}
        />
      ),
    },
    {
      field: "24h",
      headerName: "24H",
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: () => "100%",
    },
    {
      field: "p99",
      headerName: "P99",
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (col) => `${col.row.p99}ms`,
    },
    {
      field: "p95",
      headerName: "P95",
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (col) => `${col.row.p95}ms`,
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
      align: "right",
      sortable: false,
      renderCell: (col) => <ItemMenu monitor={col.row} />,
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
