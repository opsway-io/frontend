import { ReportData, ReportDetail } from "../../../../api/endpoints/reports";

export interface ReportSummary {
  avgUptime?: number;
  avgResponseTime?: number;
  totalIncidents?: number;
}

const average = (values: number[]) =>
  values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length;

type ReportSection = "UPTIME" | "PERFORMANCE" | "INCIDENT";

/** Whether a report of `type` covers `section` (ALL and CUSTOM cover all). */
const coversSection = (type: string, section: ReportSection) =>
  type === section || type === "ALL" || type === "CUSTOM";

/** Headline numbers for the sections the report contains. */
export const summarizeReport = ({
  type,
  data,
}: ReportDetail): ReportSummary => {
  const summary: ReportSummary = {};
  const { uptime, performance, incident }: ReportData = data ?? {};

  if (uptime && coversSection(type, "UPTIME")) {
    summary.avgUptime = average(uptime.map((row) => row.UptimePercentage));
  }
  if (performance && coversSection(type, "PERFORMANCE")) {
    summary.avgResponseTime = average(
      performance.map((row) => row.AverageResponseTime),
    );
  }
  if (incident && coversSection(type, "INCIDENT")) {
    summary.totalIncidents = incident.reduce((sum, row) => sum + row.count, 0);
  }

  return summary;
};

/** Saves the raw report data as a JSON file. */
export const downloadReportJson = (report: ReportDetail) => {
  const blob = new Blob([JSON.stringify(report.data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `report-${report.id}-${report.type}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
