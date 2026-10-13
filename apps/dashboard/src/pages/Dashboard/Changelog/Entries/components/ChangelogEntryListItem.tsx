import { Card, Typography } from "@mui/joy";
import moment from "moment";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { IChangelogEntry } from "../../../../../api/endpoints/changelogs";

interface ChangelogEntryListItemProps {
  entry: IChangelogEntry;
}

const ChangelogEntryListItem: FunctionComponent<
  ChangelogEntryListItemProps
> = ({ entry }) => (
  <Card
    component={Link}
    to={`entries/${entry.id}`}
    sx={{
      textDecoration: "none",
      gap: 0.5,
      transition: "background-color 120ms, border-color 120ms",
      "&:hover": {
        bgcolor: "background.level1",
        borderColor: "neutral.outlinedBorder",
      },
    }}
  >
    <Typography level="title-md" textColor="text.primary">
      {entry.title}
    </Typography>
    <Typography level="body-sm" textColor="text.secondary">
      Created {moment(entry.createdAt).fromNow()}
    </Typography>
  </Card>
);

export default ChangelogEntryListItem;
