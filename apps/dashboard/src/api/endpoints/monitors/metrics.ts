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
  start?: string,
  end?: string,
): Promise<getMonitorMetricsResponse> {
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/metrics${query}`,
  );
  return response?.data;
}
