import client from "../../client";

/*
  Shared
*/

export interface Check {
  id: string;
  statusCode: number;
  timing: Timing;
  tls: TLS;
  createdAt: string;
}
export interface Timing {
  dnsLookup: number;
  tcpConnection: number;
  tlsHandshake: number;
  serverProcessing: number;
  contentTransfer: number;
  total: number;
}

export interface TLS {
  version: string;
  cipher: string;
  issuer: string;
  subject: string;
  notBefore: Date;
  notAfter: Date;
}

/*
  Get Monitor Checks
*/

export interface GetMonitorChecksResponse {
  checks: Check[];
}

export async function getMonitorChecks(
  teamId: number,
  monitorId: number,
  offset?: number,
  limit?: number,
): Promise<GetMonitorChecksResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/checks`,
    {
      params: {
        offset,
        limit,
      },
    },
  );

  return response?.data;
}

/*
  Get Failed Monitor Checks
*/

export interface GetFailedMonitorChecksResponse {
  checks: Check[];
}

export async function getFailedMonitorChecks(
  teamId: number,
  monitorId: number,
  assertionId: number,
  offset?: number,
  limit?: number,
): Promise<GetFailedMonitorChecksResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/checks/failed/${assertionId}`,
    {
      params: {
        offset,
        limit,
      },
    },
  );

  return response?.data;
}


export interface GetMonitorsIncidentsResponse {
  monitors: MonitorsWithIncidents[];
}

export interface MonitorsWithIncidents {
  id: number;
  teamId: number;
  state: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  incidents: Incident[];
}
export interface Incident {
  id: number;
  createdAt: string;
  updatedAt: string;
  MonitorAssertionID: number;
}


export async function getMonitorsIncidents(
  teamId: number,
): Promise<GetMonitorsIncidentsResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/incidents`,
  );

  return response?.data;
}

/*
  Get Monitor Check
*/

export async function getMonitorCheck(
  teamId: number,
  monitorId: number,
  checkId: number,
): Promise<Check> {
  const response = await client.get(
    `/v1/teams/${teamId}/monitors/${monitorId}/checks/${checkId}`,
  );

  return response?.data;
}
