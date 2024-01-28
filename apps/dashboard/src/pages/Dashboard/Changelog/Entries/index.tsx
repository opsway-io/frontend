import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";
import { Button, Skeleton } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useChangelog } from "../../../../hooks/changelogs.query";

const ChangelogEntriesView: FunctionComponent = () => {
  let params = useParams();
  const changelogId = (params.id as number | undefined) || 0;

  const { data, isLoading } = useChangelog(changelogId);

  return (
    <>
      <Helmet>
        <title>{isLoading ? "Changelogs" : `Changelogs | ${data?.name}`}</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/changelogs">Changelogs</Link>,
          isLoading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <span>{data?.name}</span>
          ),
        ]}
      >
        <Placeholder />

        <Button component={Link} to="create">
          Create
        </Button>
      </Container>
    </>
  );
};

export default ChangelogEntriesView;
