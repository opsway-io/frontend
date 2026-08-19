import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";
import {
  Button,
  Skeleton,
  Card,
  CardContent,
  Typography,
  Stack,
  Pagination,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useChangelog } from "../../../../hooks/changelogs.query";
import { useChangelogEntries } from "../../../../hooks/changelogs.query";
import moment from "moment";
import { useState } from "react";

const ChangelogEntriesView: FunctionComponent = () => {
  const params = useParams();
  const changelogId = Number(params.id) || 0;

  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const { data: changelog, isLoading: changelogIsLoading } =
    useChangelog(changelogId);
  const { data: entriesData, isLoading: entriesAreLoading } =
    useChangelogEntries(changelogId, offset, limit);

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
      >
        <Stack spacing={2} sx={{ mt: 2 }}>
          {entriesAreLoading ? (
            <Skeleton variant="rectangular" height={100} />
          ) : (
            entriesData?.entries.map((entry) => (
              <Card
                key={entry.id}
                component={Link}
                to={`${entry.id}`}
                sx={{ textDecoration: "none" }}
              >
                <CardContent>
                  <Typography variant="h6" color="text.primary">
                    {entry.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created {moment(entry.createdAt).fromNow()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}

          {entriesData && entriesData.totalCount > limit && (
            <Pagination
              count={Math.ceil(entriesData.totalCount / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          )}
        </Stack>

        <Button component={Link} to="create">
          Create
        </Button>
      </Container>
    </>
  );
};

export default ChangelogEntriesView;
