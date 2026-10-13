import { Typography } from "@mui/joy";
import moment from "moment";
import { FunctionComponent, useState } from "react";
import { TimelineItem } from "../../../../../components/Timeline";
import { useIncidentOccurrences } from "../../../../../hooks/incidents.query";
import HistoryCard from "./HistoryCard";

interface TriggerHistoryCardProps {
  incidentId: number;
}

const TriggerHistoryCard: FunctionComponent<TriggerHistoryCardProps> = ({
  incidentId,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, isPending } = useIncidentOccurrences(
    incidentId,
    page * rowsPerPage,
    rowsPerPage,
  );

  const occurrences = data?.occurrences ?? [];

  return (
    <HistoryCard
      title="Trigger History"
      subheader="Recent probe failures for this incident"
      isLoading={isPending}
      emptyText="No recent triggers found."
      totalCount={data?.totalCount || occurrences.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
    >
      {occurrences.map((occurrence) => (
        <TimelineItem
          key={occurrence.id}
          color="danger"
          title="Check Failed"
          timestamp={moment(occurrence.createdAt).format("MMM DD, HH:mm:ss")}
        >
          <Typography level="body-xs" textColor="text.secondary">
            Probe assertion triggered incident rules
          </Typography>
        </TimelineItem>
      ))}
    </HistoryCard>
  );
};

export default TriggerHistoryCard;
