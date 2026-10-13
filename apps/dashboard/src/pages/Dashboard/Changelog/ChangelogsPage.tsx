import { Button, Card, Input } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd, IoSearch } from "react-icons/io5";
import Container from "../../../components/Container/Container";
import Pagination from "../../../components/Pagination/Pagination";
import { Restrict, Role } from "../../../components/Restrict";
import { useChangelogs } from "../../../hooks/changelogs.query";
import { useDebounce } from "../../../hooks/useDebounce";
import ChangelogsDataGrid from "./components/ChangelogsDataGrid";
import CreateChangelogDialog from "./components/CreateChangelogDialog";

const CHANGELOGS_PER_PAGE = 10;

const ChangelogsPage: FunctionComponent = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const debouncedQuery = useDebounce(query, 250);

  const { data, isPending } = useChangelogs(
    page * CHANGELOGS_PER_PAGE,
    CHANGELOGS_PER_PAGE,
    debouncedQuery || undefined,
  );

  return (
    <>
      <Helmet>
        <title>Changelogs</title>
      </Helmet>

      <Container
        header="Changelog"
        description="Central hub for managing your changelogs and release notes. You can manage your changelogs and release notes here or use our API to automate the process."
        secondaryActions={[
          <Restrict min={Role.ADMIN} key="create">
            <Button
              startDecorator={<IoAdd />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create changelog
            </Button>
          </Restrict>,
        ]}
        loading={isPending}
      >
        <Input
          placeholder="Search changelogs"
          aria-label="Search changelogs"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          startDecorator={<IoSearch />}
        />

        <Card sx={{ p: 0, overflow: "hidden" }}>
          <ChangelogsDataGrid changelogs={data?.changelogs} />
        </Card>

        {data && data.totalCount > CHANGELOGS_PER_PAGE && (
          <Pagination
            count={data.totalCount}
            page={page}
            rowsPerPage={CHANGELOGS_PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </Container>

      <CreateChangelogDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </>
  );
};

export default ChangelogsPage;
