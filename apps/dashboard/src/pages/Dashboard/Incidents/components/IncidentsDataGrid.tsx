import { Button, Chip } from "@mui/joy";
import moment from "moment";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Incident } from "../../../../api/endpoints/incidents";
import DataGrid, {
  DataGridProps,
  GridColDef,
} from "../../../../components/DataGrid/DataGrid";
import { useMonitors } from "../../../../hooks/monitors.query";

interface IncidentsDataGridProps extends Omit<
  DataGridProps<Incident>,
  "columns" | "rows"
> {
  incidents?: Incident[];
  /** Called by "View details" instead of navigating to the incident page. */
  onViewClick?: (incidentId: number) => void;
}

const statusLabel = (incident: Incident) => {
  if (!incident.resolved) return "Active";
  return incident.resolvedBy
    ? `Resolved by ${incident.resolvedBy.displayName}`
    : "Autoresolved";
};

const acknowledgedLabel = (incident: Incident) => {
  if (!incident.acknowledged) return "No";
  if (incident.acknowledgedBy)
    return `By ${incident.acknowledgedBy.displayName}`;
  if (incident.acknowledgedByIntegration)
    return `By ${incident.acknowledgedByIntegration}`;
  return "Yes";
};

const durationLabel = (incident: Incident) => {
  if (!incident.resolved) return "Ongoing";
  const end = moment(incident.resolvedAt ?? incident.updatedAt);
  return moment.duration(end.diff(moment(incident.createdAt))).humanize();
};

const IncidentsDataGrid: FunctionComponent<IncidentsDataGridProps> = ({
  incidents,
  onViewClick,
  ...rest
}) => {
  const { data: monitorsData } = useMonitors();
  const monitors = monitorsData?.monitors ?? [];

  const columns: GridColDef<Incident>[] = [
    {
      field: "monitor",
      headerName: "Monitor",
      minWidth: 140,
      flex: 1,
      renderCell: ({ row }) =>
        monitors.find((monitor) => monitor.id === row.monitorId)?.name ??
        "Unknown Monitor",
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 180,
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 110,
      renderCell: ({ row }) => (
        <Chip variant="soft" color={row.resolved ? "success" : "danger"}>
          {statusLabel(row)}
        </Chip>
      ),
    },
    {
      field: "acknowledged",
      headerName: "Acknowledged",
      minWidth: 130,
      renderCell: ({ row }) => (
        <Chip variant="soft" color={row.acknowledged ? "warning" : "neutral"}>
          {acknowledgedLabel(row)}
        </Chip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Started",
      minWidth: 160,
      flex: 1,
      renderCell: ({ value }) => moment(value).format("LLL"),
    },
    {
      field: "duration",
      headerName: "Duration",
      minWidth: 110,
      flex: 1,
      valueGetter: ({ row }) => durationLabel(row),
    },
    {
      field: "actions",
      headerName: "",
      minWidth: 120,
      align: "right",
      sortable: false,
      renderCell: ({ row }) =>
        onViewClick ? (
          <Button
            variant="outlined"
            color="neutral"
            sx={{ whiteSpace: "nowrap" }}
            onClick={(e) => {
              e.stopPropagation();
              onViewClick(Number(row.id));
            }}
          >
            View details
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="neutral"
            sx={{ whiteSpace: "nowrap" }}
            onClick={(e) => e.stopPropagation()}
            component={Link}
            to={`/incidents/incident/${row.id}`}
          >
            View details
          </Button>
        ),
    },
  ];

  return (
    <DataGrid<Incident>
      autoHeight
      columns={columns}
      rows={incidents ?? []}
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
