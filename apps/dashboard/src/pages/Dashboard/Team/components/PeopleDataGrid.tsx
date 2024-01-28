import { Chip, Stack, Typography } from "@mui/material";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";
import { FunctionComponent } from "react";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import Avatar from "../../../../components/Avatar";
import DataGrid from "../../../../components/DataGrid";
import { Role } from "../../../../components/Restrict";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import ItemMenu from "./ItemMenu";

interface PeopleDataGridProps extends Omit<DataGridProps, "columns" | "rows"> {
  users?: IGetTeamUserResponse[];
  team?: IGetTeamResponse;
}

const PeopleDataGrid: FunctionComponent<PeopleDataGridProps> = (props) => {
  const currentRole = useCurrentUserRole();

  const columns: GridColDef<IGetTeamUserResponse>[] = [
    {
      field: "avatarUrl",
      headerName: "",
      width: 70,
      align: "right",
      sortable: false,
      renderCell: (col) => <Avatar src={col.value} name={col.row.name} />,
    },
    {
      field: "name",
      headerName: "Name",
      width: 300,
      sortable: false,
      renderCell: (col) => (
        <Stack>
          <Typography variant="body2">{col.value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {col.row.displayName}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      align: "right",
      headerAlign: "right",
      flex: 1,
      sortable: false,
      renderCell: (col) => (
        <>
          <Typography sx={{ marginLeft: 1 }}>{col.value}</Typography>
        </>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      align: "right",
      headerAlign: "right",
      flex: 0,
      minWidth: 150,
      sortable: false,
      renderCell: (col) => (
        <Chip
          label={col.value}
          color={RoleToColor(col.value)}
          sx={{
            minWidth: 100,
          }}
        />
      ),
    },
  ];

  if (Role.ADMIN.equalOrHigher(currentRole)) {
    columns.push({
      field: "actions",
      headerName: "",
      align: "right",
      sortable: false,
      width: 50,
      renderCell: (col) => {
        if (Role.OWNER.equalOrHigher(col.row.role)) {
          return null;
        }

        return <ItemMenu user={col.row} team={props.team} />;
      },
    });
  }

  return (
    <DataGrid
      {...props}
      columns={columns}
      rows={props.users || []}
      disableCursorOnHover={true}
      disableSelectionOnClick={true}
    />
  );
};

function RoleToColor(role: string) {
  switch (role) {
    case "OWNER":
      return "error";
    case "ADMIN":
      return "warning";
    case "MEMBER":
      return "info";
    default:
      return "info";
  }
}

export default PeopleDataGrid;
