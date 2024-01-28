import { DataGridProps, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack, Typography } from "@mui/material";
import { VscEdit, VscRemove } from "react-icons/vsc";
import { IMonitorResponse } from "../../../../../api/endpoints/monitors";
import { Role } from "../../../../../components/Restrict";
import { useCurrentUserRole } from "../../../../../hooks/user.query";
import DataGrid from "../../../../../components/DataGrid";

interface ChangelogEntriesDataGridProps
  extends Omit<DataGridProps, "columns" | "rows"> {
  monitors?: IMonitorResponse[];
}

const ChangelogEntriesDataGrid: FunctionComponent<
  ChangelogEntriesDataGridProps
> = (props) => {
  const navigate = useNavigate();
  const currentRole = useCurrentUserRole();

  const rows: GridRowsProp =
    props.monitors ||
    [
      // ...new Array(10).fill(0).map((_, i) => ({
      //   id: i + 2,
      //   version: "1.0.0",
      //   title: "Some title description",
      //   createdAt: new Date().toISOString(),
      // })),
    ];

  const columns: GridColDef<IMonitorResponse>[] = [
    {
      field: "version",
      headerName: "Version",
      width: 128,
      sortable: false,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      sortable: false,
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (row) => (
        <Typography variant="body2" color="textSecondary">
          {row.value}
        </Typography>
      ),
    },
  ];

  if (Role.ADMIN.equalOrHigher(currentRole)) {
    columns.push({
      field: "actions",
      headerName: "",
      align: "right",
      sortable: false,
      renderCell: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton>
            <VscEdit />
          </IconButton>

          <IconButton>
            <VscRemove />
          </IconButton>
        </Stack>
      ),
    });
  }

  return (
    <DataGrid
      {...props}
      columns={columns}
      rows={rows}
      rowHeight={42}
      onRowClick={(r) => {
        navigate(`/monitors/${r.id}`);
      }}
      noRowsContent="No changelog entries"
    />
  );
};

export default ChangelogEntriesDataGrid;
