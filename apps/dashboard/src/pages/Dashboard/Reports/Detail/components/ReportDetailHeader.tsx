import { Button, Chip, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { ReportDetail } from "../../../../../api/endpoints/reports";
import { reportStatusColor } from "../../reportStatus";
import { downloadReportJson } from "../reportSummary";
import ReportBackButton from "./ReportBackButton";

interface ReportDetailHeaderProps {
  /** Without a report only the back button and `title` are shown. */
  report?: ReportDetail;
  title: ReactNode;
}

const ReportDetailHeader: FunctionComponent<ReportDetailHeaderProps> = ({
  report,
  title,
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    flexWrap="wrap"
    gap={2}
    width="100%"
  >
    <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
      <ReportBackButton />
      <Typography level="h4">{title}</Typography>
      {report && (
        <>
          <Chip variant="soft" color="info">
            {report.type}
          </Chip>
          <Chip variant="soft" color={reportStatusColor(report.status)}>
            {report.status}
          </Chip>
        </>
      )}
    </Stack>
    {report && (
      <Button
        startDecorator={<IoDownloadOutline />}
        onClick={() => report.data && downloadReportJson(report)}
        disabled={report.status !== "COMPLETED"}
      >
        Download JSON
      </Button>
    )}
  </Stack>
);

export default ReportDetailHeader;
