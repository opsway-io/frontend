import client from "../../client";

/*
  Shared
*/

export interface Report {
  id: string;
  teamId: number;
  report: string;
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
  const response = await client.get(`/v1/teams/${teamId}/reports`,
  );

  return response?.data;
}