import { DataGridProps, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { FunctionComponent } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Chip, Button } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
import { Incident } from "../../../../api/endpoints/incidents";
import { useMonitors } from "../../../../hooks/monitors.query";

interface IncidentsDataGridProps
  extends Omit<DataGridProps, "columns" | "rows"> {
  incidents?: Incident[];
  onViewClick?: (incidentId: number) => void;
}

const IncidentsDataGrid: FunctionComponent<IncidentsDataGridProps> = ({
  incidents,
  onViewClick,
  ...rest
}) => {
  const { data: monitorsData } = useMonitors();
  const monitors = monitorsData?.monitors || [];

  const columns: GridColDef[] = [
    {
      field: "monitor",
      headerName: "Monitor",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const monitorId = params.row.monitorId;
        const monitor = monitors.find((m) => m.id === monitorId);
        return monitor ? monitor.name : "Unknown Monitor";
      },
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 200,
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      renderCell: (params) => {
        const resolved = params.row.resolved;
        return (
          <Chip
            label={resolved ? "Resolved" : "Active"}
            color={resolved ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Started",
      minWidth: 180,
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("LLL"),
    },
    {
      field: "duration",
      headerName: "Duration",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => {
        if (!params.row.resolved) return "Ongoing";
        const start = moment(params.row.createdAt);
        const end = moment(params.row.updatedAt); // assuming updatedAt is roughly resolved time if resolved
        return moment.duration(end.diff(start)).humanize();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        if (onViewClick) {
          return (
            <Button size="small" onClick={() => onViewClick(params.row.id)}>
              View Details
            </Button>
          );
        }

        return (
          <Button
            size="small"
            component={Link}
            to={`/incidents/incident/${params.row.id}`}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  const rows: GridRowsProp =
    incidents?.map((incident) => ({
      id: incident.id,
      monitorId: incident.monitorId,
      title: incident.title,
      resolved: incident.resolved,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
    })) || [];

  return (
    <DataGrid
      autoHeight
      columns={columns}
      rows={rows}
      disableRowSelectionOnClick
      initialState={{
        sorting: {
          sortModel: [{ field: "createdAt", sort: "desc" }],
        },
      }}
      {...rest}
    />
  );
};

export default IncidentsDataGrid;
