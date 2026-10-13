import { Button, Sheet, Skeleton, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import Pagination from "../../../../components/Pagination/Pagination";
import { Restrict, Role } from "../../../../components/Restrict";
import {
  useChangelog,
  useChangelogEntries,
} from "../../../../hooks/changelogs.query";
import ChangelogEntryListItem from "./components/ChangelogEntryListItem";

const ENTRIES_PER_PAGE = 10;

const ChangelogEntriesPage: FunctionComponent = () => {
  const params = useParams();
  const changelogId = Number(params.id) || 0;
  const [page, setPage] = useState(0);

  const { data: changelog, isPending: changelogIsLoading } =
    useChangelog(changelogId);
  const { data: entriesData, isPending: entriesAreLoading } =
    useChangelogEntries(changelogId, page * ENTRIES_PER_PAGE, ENTRIES_PER_PAGE);

  const entries = entriesData?.entries ?? [];

  return (
    <>
      <Helmet>
        <title>
          {changelogIsLoading
            ? "Changelogs"
            : `Changelogs | ${changelog?.name}`}
        </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/changelogs" key="changelogs">
            Changelogs
          </Link>,
          changelogIsLoading ? (
            <Skeleton variant="text" width={150} key="skeleton" />
          ) : (
            <span key="name">{changelog?.name}</span>
          ),
        ]}
        primaryActions={[
          <Restrict min={Role.ADMIN} key="create">
            <Button component={Link} to="create" startDecorator={<IoAdd />}>
              Create entry
            </Button>
          </Restrict>,
        ]}
      >
        <Stack spacing={1.5}>
          {entriesAreLoading && (
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ borderRadius: "lg" }}
            />
          )}

          {!entriesAreLoading && entries.length === 0 && (
            <Sheet
              variant="outlined"
              sx={{ borderRadius: "lg", p: 4, borderStyle: "dashed" }}
            >
              <Typography
                level="body-sm"
                textColor="text.secondary"
                textAlign="center"
              >
                No entries yet.
              </Typography>
            </Sheet>
          )}

          {entries.map((entry) => (
            <ChangelogEntryListItem key={entry.id} entry={entry} />
          ))}

          {entriesData && entriesData.totalCount > ENTRIES_PER_PAGE && (
            <Pagination
              count={entriesData.totalCount}
              page={page}
              rowsPerPage={ENTRIES_PER_PAGE}
              onPageChange={setPage}
            />
          )}
        </Stack>
      </Container>
    </>
  );
};

export default ChangelogEntriesPage;
