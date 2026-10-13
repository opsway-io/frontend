import { Chip, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import Avatar from "../../../../components/Avatar/Avatar";
import DataGrid, {
  DataGridProps,
  GridColDef,
} from "../../../../components/DataGrid/DataGrid";
import { Role } from "../../../../components/Restrict";
import { useCurrentUserRole } from "../../../../hooks/user.query";
import { formatRole, roleColor } from "../teamRoles";
import MemberActionsMenu from "./MemberActionsMenu";

interface PeopleDataGridProps extends Omit<
  DataGridProps<IGetTeamUserResponse>,
  "columns" | "rows"
> {
  users?: IGetTeamUserResponse[];
  team?: IGetTeamResponse;
}

const baseColumns: GridColDef<IGetTeamUserResponse>[] = [
  {
    field: "avatarUrl",
    headerName: "",
    width: 64,
    align: "center",
    sortable: false,
    renderCell: (col) => (
      <Avatar
        src={col.value}
        name={col.row.displayName || col.row.name}
        size="md"
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 220,
    flex: 1,
    sortable: false,
    renderCell: (col) => (
      <Stack sx={{ minWidth: 0 }}>
        <Typography level="title-sm" noWrap>
          {col.value}
        </Typography>
        {col.row.displayName && (
          <Typography level="body-xs" textColor="text.tertiary" noWrap>
            {col.row.displayName}
          </Typography>
        )}
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
      <Typography level="body-sm" textColor="text.secondary" noWrap>
        {col.value}
      </Typography>
    ),
  },
  {
    field: "role",
    headerName: "Role",
    align: "right",
    headerAlign: "right",
    minWidth: 120,
    sortable: false,
    renderCell: (col) => (
      <Chip variant="soft" color={roleColor(col.value)}>
        {formatRole(col.value)}
      </Chip>
    ),
  },
];

const PeopleDataGrid: FunctionComponent<PeopleDataGridProps> = ({
  users,
  team,
  ...gridProps
}) => {
  const currentRole = useCurrentUserRole();

  const columns: GridColDef<IGetTeamUserResponse>[] = [...baseColumns];

  if (team && Role.ADMIN.equalOrHigher(currentRole)) {
    columns.push({
      field: "actions",
      headerName: "",
      align: "right",
      sortable: false,
      width: 56,
      renderCell: (col) =>
        Role.OWNER.equalOrHigher(col.row.role) ? null : (
          <MemberActionsMenu user={col.row} team={team} />
        ),
    });
  }

  return (
    <DataGrid
      {...gridProps}
      columns={columns}
      rows={users ?? []}
      disableCursorOnHover
      disableRowSelectionOnClick
    />
  );
};

export default PeopleDataGrid;
