import { Stack, Typography } from "@mui/joy";
import { FunctionComponent, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { useMonitors } from "../../../../hooks/monitors.query";
import { useReport } from "../../../../hooks/reports.query";
import IncidentSection from "./components/IncidentSection";
import PerformanceSection from "./components/PerformanceSection";
import ReportDetailHeader from "./components/ReportDetailHeader";
import ReportSummaryCards from "./components/ReportSummaryCards";
import UptimeSection from "./components/UptimeSection";
import { summarizeReport } from "./reportSummary";

const ReportDetailPage: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, isPending: reportLoading } = useReport(Number(id));
  const { data: monitorsData, isPending: monitorsLoading } = useMonitors(
    0,
    1000,
  );

  const monitorNames = useMemo(
    () =>
      Object.fromEntries(
        (monitorsData?.monitors ?? []).map((monitor) => [
          monitor.id,
          monitor.name,
        ]),
      ) as Record<number, string>,
    [monitorsData],
  );

  if (reportLoading || monitorsLoading) {
    return (
      <Container header={<ReportDetailHeader title="Loading Report..." />}>
        <Placeholder />
      </Container>
    );
  }

  if (!report) {
    return (
      <Container header={<ReportDetailHeader title="Report Not Found" />}>
        <Typography textColor="text.secondary">
          The report you requested could not be found.
        </Typography>
      </Container>
    );
  }

  const monitorName = (monitorId: number) =>
    monitorNames[monitorId] || `Monitor #${monitorId}`;
  const data = report.status === "COMPLETED" ? report.data : undefined;

  return (
    <>
      <Helmet>
        <title>{`Report ${report.id}`}</title>
      </Helmet>

      <Container
        header={
          <ReportDetailHeader report={report} title={`Report #${report.id}`} />
        }
      >
        <Stack spacing={4}>
          <Typography level="body-sm" textColor="text.secondary">
            Created At: {new Date(report.createdAt).toLocaleString()}
          </Typography>

          {data && <ReportSummaryCards summary={summarizeReport(report)} />}

          {data?.uptime && (
            <UptimeSection rows={data.uptime} monitorName={monitorName} />
          )}

          {data?.performance && (
            <PerformanceSection
              data={data}
              rows={data.performance}
              monitorNames={monitorNames}
              monitorName={monitorName}
            />
          )}

          {data?.incident && (
            <IncidentSection
              data={data}
              rows={data.incident}
              monitorNames={monitorNames}
              monitorName={monitorName}
            />
          )}
        </Stack>
      </Container>
    </>
  );
};

export default ReportDetailPage;
