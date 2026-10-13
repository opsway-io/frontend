import { Input, Option, Select, Sheet, Stack } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../../../../components/Pagination/Pagination";
import { useCurrentTeam, useTeamUsersPage } from "../../../../hooks/team.query";
import { useDebounce } from "../../../../hooks/useDebounce";
import PeopleDataGrid from "../components/PeopleDataGrid";

const PEOPLE_PER_PAGE = 10;
const ALL_ROLES = "ALL";

const PeopleTab: FunctionComponent = () => {
  const { data: team, isPending: isLoadingTeam } = useCurrentTeam();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [roleFilter, setRoleFilter] = useState(ALL_ROLES);
  const [page, setPage] = useState(0);

  const { data, isPending: isLoadingUsers } = useTeamUsersPage({
    offset: page * PEOPLE_PER_PAGE,
    limit: PEOPLE_PER_PAGE,
    query: debouncedQuery || undefined,
    role: roleFilter !== ALL_ROLES ? roleFilter : undefined,
  });

  const totalCount = data?.totalCount ?? 0;

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Input
          sx={{ flex: 1 }}
          placeholder="Search people"
          aria-label="Search people"
          startDecorator={<IoSearchOutline />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
        />

        <Select
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(_, value) => {
            setRoleFilter(value ?? ALL_ROLES);
            setPage(0);
          }}
          sx={{ minWidth: 160 }}
        >
          <Option value={ALL_ROLES}>All roles</Option>
          <Option value="OWNER">Owner</Option>
          <Option value="ADMIN">Admin</Option>
          <Option value="MEMBER">Member</Option>
        </Select>
      </Stack>

      <Sheet
        variant="outlined"
        sx={{ borderRadius: "lg", overflow: "hidden", flex: 1 }}
      >
        <PeopleDataGrid
          users={data?.users}
          team={team ?? undefined}
          pageSize={0}
          loading={isLoadingTeam || isLoadingUsers}
          noRowsContent="No people found"
        />
      </Sheet>

      {totalCount > PEOPLE_PER_PAGE && (
        <Pagination
          count={totalCount}
          page={page}
          rowsPerPage={PEOPLE_PER_PAGE}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default PeopleTab;
