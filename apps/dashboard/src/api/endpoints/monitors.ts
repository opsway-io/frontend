import client from "../client";
import { Check } from "../models/checks";
import { Metric } from "../models/metrics";

interface GetMonitorsResponse {
  monitors: IMonitorResponse[];
  totalCount: number;
}

export interface IMonitorResponse {
  id: number;
  state: "ACTIVE" | "INACTIVE";
  name: string;
  settings: IMonitorSettings;
  stats: number[];
  uptimePercentage: number;
  p99: number;
  p95: number;
  avg: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMonitorSettings {
  method: string;
  url: string;
  headers?: { [header: string]: string }[];
  bodyType: string;
  body?: any;
  frequencySeconds: number;
  locations: string[];
  assertions: IMonitorAssertion[];
}

export interface IMonitorAssertion {
  source: string;
  property?: string;
  operator: string;
  target?: string;
}

export async function getMonitors(
  teamId: number,
  offset?: number,
  limit?: number,
  query?: string
): Promise<GetMonitorsResponse> {
  const response = await client.get(`/v1/teams/${teamId}/monitors`, {
    params: {
      offset,
      limit,
      query,
    },
  });

  return response?.data;
}

export async function getMonitor(
  teamId: number,
  monitorId: number
): Promise<IMonitorResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}`
  );
  return response?.data;
}

interface MonitorSettings {
  method: string;
  url: string;
  headers?: { [header: string]: string }[];
  bodyType: string;
  body?: string;
  frequencySeconds: number;
  locations: string[];
}

export interface IPostMonitorRequest {
  teamId: number;
  name: string;
  settings: MonitorSettings;
}

export async function postMonitor(
  teamId: number,
  data: IPostMonitorRequest
): Promise<void> {
  const response = await client.post(`/v1/teams/${teamId}/monitors`, data);
  return response?.data;
}

export interface IMonitorChecksResponse {
  checks: Check[];
}

export async function getMonitorChecks(
  teamId: number,
  monitorId: number,
  offset?: number,
  limit?: number
): Promise<IMonitorChecksResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/checks`,
    {
      params: {
        offset,
        limit,
      },
    }
  );

  return response?.data;
}

export async function getMonitorCheck(
  teamId: number,
  monitorId: number,
  checkId: number
): Promise<Check> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/checks/${checkId}`
  );

  return response?.data;
}
export interface IMonitorMetricsResponse {
  metrics: Metric[];
}

export async function getMonitorMetrics(
  teamId: number,
  monitorId: number
): Promise<IMonitorMetricsResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/metrics`
  );
  return response?.data;
}

export async function deleteMonitor(
  teamId: number,
  monitorId: number
): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/monitors/${monitorId}`);
}

export interface IPutMonitorRequest {
  state: "ACTIVE" | "INACTIVE";
  name: string;
  settings: MonitorSettings;
}

export async function putMonitor(
  teamId: number,
  monitorId: number,
  data: IPutMonitorRequest
): Promise<void> {
  await client.put(`/v1/teams/${teamId}/monitors/${monitorId}`, data);
}
