import { Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { Report } from "../../../../api/endpoints/reports";
import ReportOverviewListItem from "./ReportOverviewListItem";

interface ReportOverviewListProps {
  reports?: Report[];
}

const ReportOverviewList: FunctionComponent<ReportOverviewListProps> = ({
  reports,
}) => (
  <Stack spacing={1}>
    {reports?.map((report) => (
      <ReportOverviewListItem key={report.id} report={report} />
    ))}
  </Stack>
);

export default ReportOverviewList;
