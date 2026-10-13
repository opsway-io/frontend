import { Box, Divider, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container/Container";
import Placeholder from "../../../components/Placeholder/Placeholder";
import { useReports } from "../../../hooks/reports.query";
import GenerateReportDialog from "./components/GenerateReportDialog";
import ReportOverviewList from "./components/ReportOverviewList";
import ReportTypeCard from "./components/ReportTypeCard";
import { ReportType, reportTypes } from "./reportTypes";

const ReportsPage: FunctionComponent = () => {
  const { data: teamReports, isPending: reportsAreLoading } = useReports();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogReportType, setDialogReportType] =
    useState<ReportType>("UPTIME");

  const openDialog = (type: ReportType) => {
    setDialogReportType(type);
    setDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Reports</title>
      </Helmet>

      <Container header="Reports">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 2,
          }}
        >
          {reportTypes.map((option) => (
            <ReportTypeCard
              key={option.type}
              option={option}
              onSelect={() => openDialog(option.type)}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={0.5}>
          <Typography level="title-lg">Previous reports</Typography>
          <Typography level="body-sm" textColor="text.secondary">
            Reports that have been generated within the last year.
          </Typography>
        </Stack>

        {reportsAreLoading ? (
          <Placeholder />
        ) : (
          <ReportOverviewList reports={teamReports?.reports} />
        )}
      </Container>

      <GenerateReportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        defaultReportType={dialogReportType}
      />
    </>
  );
};

export default ReportsPage;
