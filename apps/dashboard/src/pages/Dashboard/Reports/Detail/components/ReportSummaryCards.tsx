import { Box } from "@mui/joy";
import { FunctionComponent } from "react";
import { ReportSummary } from "../reportSummary";
import StatCard from "./StatCard";

interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

const ReportSummaryCards: FunctionComponent<ReportSummaryCardsProps> = ({
  summary,
}) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
      gap: 2,
    }}
  >
    {summary.avgUptime !== undefined && (
      <StatCard
        label="Average Uptime"
        value={`${summary.avgUptime.toFixed(2)}%`}
        color="success"
      />
    )}
    {summary.avgResponseTime !== undefined && (
      <StatCard
        label="Average Response Time"
        value={`${summary.avgResponseTime.toFixed(0)} ms`}
        color="info"
      />
    )}
    {summary.totalIncidents !== undefined && (
      <StatCard
        label="Total Incidents"
        value={summary.totalIncidents}
        color="danger"
      />
    )}
  </Box>
);

export default ReportSummaryCards;
