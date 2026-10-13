import { IconButton, Tooltip, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { VscRemove } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { Changelog } from "../../../../api/endpoints/changelogs";
import DataGrid, {
  DataGridProps,
  GridColDef,
} from "../../../../components/DataGrid/DataGrid";
import { Role } from "../../../../components/Restrict";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import DeleteChangelogDialog from "./DeleteChangelogDialog";

interface ChangelogsDataGridProps extends Omit<
  DataGridProps<Changelog>,
  "columns" | "rows"
> {
  changelogs?: Changelog[];
}

const ChangelogsDataGrid: FunctionComponent<ChangelogsDataGridProps> = ({
  changelogs,
  ...rest
}) => {
  const navigate = useNavigate();
  const currentRole = useCurrentUserRole();
  const [changelogToDelete, setChangelogToDelete] = useState<Changelog>();

  const columns: GridColDef<Changelog>[] = [
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
      renderCell: ({ value }) => (
        <Typography level="body-sm" textColor="text.secondary">
          {new Date(value).toLocaleString()}
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
      renderCell: ({ row }) => (
        <Tooltip title="Delete changelog" placement="top">
          <IconButton
            variant="plain"
            color="danger"
            aria-label="Delete changelog"
            onClick={(e) => {
              e.stopPropagation();
              setChangelogToDelete(row);
            }}
          >
            <VscRemove />
          </IconButton>
        </Tooltip>
      ),
    });
  }

  return (
    <>
      <DataGrid<Changelog>
        {...rest}
        columns={columns}
        rows={changelogs ?? []}
        rowHeight={42}
        onRowClick={({ id }) => navigate(`/changelogs/${id}`)}
        noRowsContent="No changelogs"
      />

      {changelogToDelete && (
        <DeleteChangelogDialog
          changelog={changelogToDelete}
          onClose={() => setChangelogToDelete(undefined)}
        />
      )}
    </>
  );
};

export default ChangelogsDataGrid;
