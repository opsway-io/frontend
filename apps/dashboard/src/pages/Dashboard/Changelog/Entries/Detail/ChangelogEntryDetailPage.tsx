import { Skeleton } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../../components/Container/Container";
import {
  useChangelog,
  useChangelogEntry,
} from "../../../../../hooks/changelogs.query";
import ChangelogEntryEditForm from "./components/ChangelogEntryEditForm";

const ChangelogEntryDetailPage: FunctionComponent = () => {
  const params = useParams();
  const changelogId = Number(params.id) || 0;
  const entryId = Number(params.entryId) || 0;

  const { data: changelog } = useChangelog(changelogId);
  const { data: entry, isPending } = useChangelogEntry(changelogId, entryId);

  return (
    <>
      <Helmet>
        <title>Changelog | {changelog?.name || "..."} | Edit Entry</title>
      </Helmet>

      <Container
        header="Changelog Entry"
        breadcrumbs={[
          <Link to="/changelogs" key="changelogs">
            Changelogs
          </Link>,
          <Link to={`/changelogs/${changelogId}`} key="changelog">
            {changelog?.name ?? "..."}
          </Link>,
          <span key="entry">{entry?.title ?? "..."}</span>,
        ]}
      >
        {isPending || !entry ? (
          <Skeleton
            variant="rectangular"
            height={100}
            sx={{ borderRadius: "lg" }}
          />
        ) : (
          <ChangelogEntryEditForm
            key={entry.updatedAt}
            changelogId={changelogId}
            entry={entry}
          />
        )}
      </Container>
    </>
  );
};

export default ChangelogEntryDetailPage;
