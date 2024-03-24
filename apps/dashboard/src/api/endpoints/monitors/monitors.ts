import client from "../../client";

/*
  Shared
*/

export interface Monitor {
  id: number;
  state: "ACTIVE" | "INACTIVE";
  name: string;
  settings: MonitorSettings;
  assertions: MonitorAssertion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MonitorWithStats extends Monitor {
  stats: MonitorStats;
}

export interface MonitorSettings {
  method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS" | "PATCH";
  url: string;
  frequencySeconds: number;
  headers?: {
    key: string;
    value: string;
  }[];
  body: {
    type: "NONE" | "RAW" | "JSON" | "GRAPHQL" | "XML";
    content: string | null;
  };
  tls: {
    enabled: boolean;
    verifyHostname: boolean;
    checkExpiration: boolean;
    expirationThresholdDays: number;
  };
  locations: string[];
}

export interface MonitorAssertion {
  source: string;
  property?: string;
  operator: string;
  target?: string;
}

export interface MonitorStats {
  totalCount: number;
  uptimePercentage: number;
  averageResponseTimes: number[];
  p99: number;
  p95: number;
}

/*
  Get monitors
*/

export interface GetMonitorsResponse {
  monitors: MonitorWithStats[];
  totalCount: number;
}

export async function getMonitors(
  teamId: number,
  offset?: number,
  limit?: number,
  query?: string,
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

/*
  Get monitor
*/

export interface GetMonitorResponse extends MonitorWithStats {}

export async function getMonitor(
  teamId: number,
  monitorId: number,
): Promise<GetMonitorResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}`,
  );
  return response?.data;
}

/*
  Create monitor
*/

export interface CreateMonitorRequest {
  teamId: number;
  name: string;
  settings: MonitorSettings;
  assertions: MonitorAssertion[];
}

export async function createMonitor(
  teamId: number,
  data: CreateMonitorRequest,
): Promise<void> {
  const response = await client.post(`/v1/teams/${teamId}/monitors`, data);
  return response?.data;
}

/*
  Update monitor
*/

export interface UpdateMonitorRequest {
  name: string;
  state: "ACTIVE" | "INACTIVE";
  settings: MonitorSettings;
  assertions: MonitorAssertion[];
}

export async function updateMonitor(
  teamId: number,
  monitorId: number,
  data: UpdateMonitorRequest,
): Promise<void> {
  const response = await client.put(
    `/v1/teams/${teamId}/monitors/${monitorId}`,
    data,
  );
  return response?.data;
}

/*
  Delete monitor
*/

export async function deleteMonitor(
  teamId: number,
  monitorId: number,
): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/monitors/${monitorId}`);
}

/*
  Set monitor state
*/

export async function updateMonitorState(
  teamId: number,
  monitorId: number,
  state: "ACTIVE" | "INACTIVE",
): Promise<void> {
  await client.put(`/v1/teams/${teamId}/monitors/${monitorId}/state`, {
    state,
  });
}
