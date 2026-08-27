import client from "../../client";

/*
  Shared
*/

export interface Report {
  id: string;
  teamId: number;
  type: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

/*
  Get Team Reports
*/

export interface GetReportsResponse {
  reports: Report[];
}

export async function getReports(
  teamId: number,
  offset?: number,
  limit?: number,
): Promise<GetReportsResponse> {
  const response = await client.get(`/v1/teams/${teamId}/reports`);

  return response?.data;
}

export interface MonitorUptime {
  MonitorID: number;
  Url: string;
  UptimePercentage: number;
  Date: string;
}

export interface MonitorPerformance {
  MonitorID: number;
  AverageResponseTime: number;
  P99: number;
  P95: number;
}

export interface MonitorIncident {
  monitorId: number;
  count: number;
}

export interface ReportData {
  uptime?: MonitorUptime[];
  performance?: MonitorPerformance[];
  incident?: MonitorIncident[];
  all?: string;
  custom?: string;
}

export interface ReportDetail extends Report {
  data: ReportData;
}

export async function getReport(
  teamId: number,
  reportId: number,
): Promise<ReportDetail> {
  const response = await client.get(`/v1/teams/${teamId}/reports/${reportId}`);
  return response?.data;
}

/*
  Create Team Report
*/

export interface IPostReportRequest {
  reportType: "UPTIME" | "PERFORMANCE" | "INCIDENT" | "ALL" | "CUSTOM";
  start: string;
  end: string;
}

export async function createReport(
  teamId: number,
  payload: IPostReportRequest,
): Promise<void> {
  await client.post(`/v1/teams/${teamId}/reports`, payload);
}
