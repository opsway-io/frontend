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
