import client from "../client";

/*
  Shared
*/

export interface Report {
  id: number;
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
  const response = await client.get(`/v1/teams/${teamId}/reports`, {
    params: { offset, limit },
  });

  return response?.data;
}

interface MonitorUptime {
  MonitorID: number;
  Url: string;
  UptimePercentage: number;
  Date: string;
}

interface MonitorPerformance {
  MonitorID: number;
  AverageResponseTime: number;
  P99: number;
  P95: number;
}

interface MonitorIncident {
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
