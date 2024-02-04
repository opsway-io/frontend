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
