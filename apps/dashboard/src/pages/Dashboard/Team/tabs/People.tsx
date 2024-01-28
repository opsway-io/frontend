import {
  Card,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import InvitationDialog from "../components/InvitationDialog";
import PeopleDataGrid from "../components/PeopleDataGrid";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import { useQuery } from "@tanstack/react-query";
import * as TeamsAPI from "../../../../api/endpoints/teams";
import { useDebounce } from "../../../../utilities/debounce";
import Conditional from "../../../../components/Conditional";
import { useCurrentTeam } from "../../../../hooks/team.query";

const PEOPLE_PER_PAGE = 10;

const TeamPeopleTabView: FunctionComponent = () => {
  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);

  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const { data: team, isLoading: isLoadingTeam } = useCurrentTeam();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [query]);

  const { data, isLoading, error } = useQuery(
    ["teams", teamId, "users", "offset", offset, "query", debouncedQuery],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return TeamsAPI.getUsers(
        teamId,
        offset,
        10,
        debouncedQuery ? debouncedQuery : undefined
      );
    },
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <Conditional value={!isLoading}>
        <Stack direction="row" spacing={1}>
          <Paper
            component="form"
            sx={{
              p: "0px 4px",
              display: "flex",
              alignItems: "center",
              flex: 1,
            }}
            variant="outlined"
          >
            <InputBase
              size="small"
              sx={{ marginLeft: 1, flex: 1, background: "transparent" }}
              placeholder="Search people"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />

            <IconButton type="submit" sx={{ p: "10px" }} size="small">
              <IoSearch />
            </IconButton>
          </Paper>
        </Stack>

        <Card sx={{ flex: 1 }}>
          <PeopleDataGrid
            users={data?.users || []}
            team={team || undefined}
            rowCount={data?.totalCount || 0}
            paginationMode="server"
            onPaginationModelChange={(model) => {
              setOffset(model.page * PEOPLE_PER_PAGE);
            }}
            loading={isLoadingTeam}
          />
        </Card>
      </Conditional>

      <InvitationDialog
        open={openInvitationDialog}
        onClose={() => setOpenInvitationDialog(false)}
      />
    </>
  );
};

export default TeamPeopleTabView;
