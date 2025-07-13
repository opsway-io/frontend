import client from "../../client";

/*
  Shared
*/

export interface Incident {
  id: string;
  teamId: number;
  monitorId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/*
  Get Team Incidents
*/

export interface GetIncidentsResponse {
  incidents: Incident[];
}

export async function getIncidents(
  teamId: number,
  offset?: number,
  limit?: number,
): Promise<GetIncidentsResponse> {
  const response = await client.get(`/v1/teams/${teamId}/incidents`,
    {
        params: {
          offset,
          limit,
        },
      },
  );

  return response?.data;
}


export interface MonitorIncident {
  id: number;
  teamId: number;
  monitorId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  property: string;
  target: string;
  operator: string;
}

/*
  Get Team Incidents
*/

export interface GetMonitorIncidentsResponse {
  incidents: MonitorIncident[];
}


export async function getMonitorIncidents(
  teamId: number,
  monitorId: number,
  offset?: number,
  limit?: number,
): Promise<GetMonitorIncidentsResponse> {
  const response = await client.get(`/v1/teams/${teamId}/incidents/monitor/${monitorId}`,
    {
        params: {
          offset,
          limit,
        },
      },
  );

  return response?.data;
}

export interface PatchSolveMonitorIncidentRequest {
  resolved: boolean;
}

export async function patchSolveMonitorIncident(
  teamId: number,
  incidentId: number,
  data: PatchSolveMonitorIncidentRequest,
): Promise<void> {
  const response = await client.patch(`/v1/teams/${teamId}/incidents/${incidentId}/resolved`,
    data,
  );

  return response?.data;
}