import client from "../../client";

/*
  Shared
*/

export interface Metric {
  name: string;
  timing: MetricTiming[];
}

export interface MetricTiming {
  timing: number;
  start: string;
}

/*
  Get monitor metrics
*/

export interface getMonitorMetricsResponse {
  metrics: Metric[];
}

export async function getMonitorMetrics(
  teamId: number,
  monitorId: number,
): Promise<getMonitorMetricsResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/metrics`,
  );
  return response?.data;
}
