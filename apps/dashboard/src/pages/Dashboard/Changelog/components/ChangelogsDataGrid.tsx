import { DataGridProps, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { VscEdit, VscRemove } from "react-icons/vsc";
import { useChangelogs } from "../../../../hooks/changelogs.query";
import { IChangelog } from "../../../../api/endpoints/changelogs";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import { Role } from "../../../../components/Restrict";
import DataGrid from "../../../../components/DataGrid";
import DeleteChangelogDialog from "./DeleteChangelogModal";

interface ChangelogsDataGridProps
  extends Omit<DataGridProps, "columns" | "rows"> {
  changelogs?: IChangelog[];
}

const ChangelogsDataGrid: FunctionComponent<ChangelogsDataGridProps> = (
  props
) => {
  const navigate = useNavigate();
  const currentRole = useCurrentUserRole();

  const rows: GridRowsProp<IChangelog> = props.changelogs || [];

  const columns: GridColDef<any>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: false,
    },
    {
      field: "publishedEntries",
      headerName: "Published",
      width: 200,
      align: "right",
      headerAlign: "right",
      sortable: false,
    },
    {
      field: "unpublishedEntries",
      headerName: "Unpublished",
      width: 200,
      align: "right",
      headerAlign: "right",
      sortable: false,
    },
    {
      field: "createdAt",
      headerName: "Created",
      headerAlign: "right",
      width: 250,
      align: "right",
      sortable: false,
      renderCell: (cell) => (
        <Typography variant="body2" color="textSecondary">
          {new Date(cell.value).toLocaleString()}
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
      renderCell: (cell) => {
        const [open, setOpen] = useState(false);

        return (
          <>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit changelog" placement="top">
                <IconButton>
                  <VscEdit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete changelog" placement="top">
                <IconButton
                  onClick={(e) => {
                    setOpen(true);
                    e.stopPropagation();
                  }}
                >
                  <VscRemove />
                </IconButton>
              </Tooltip>
            </Stack>

            <DeleteChangelogDialog
              changelog={cell.row}
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            />
          </>
        );
      },
    });
  }

  return (
    <DataGrid
      {...props}
      columns={columns}
      rows={rows}
      rowHeight={42}
      onRowClick={(r) => {
        navigate(`/changelogs/${r.id}`);
      }}
      noRowsContent="No changelogs"
    />
  );
};

export default ChangelogsDataGrid;
