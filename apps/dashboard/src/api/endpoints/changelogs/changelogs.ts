import client from "../../client";

/*
  Shared
*/

export interface Changelog {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: string;
}

export interface GetChangelogsResponse {
  changelogs: Changelog[];
  totalCount: number;
}

/*
  Get Changelogs
*/

export async function getChangelogs(
  teamId: number,
  offset?: number,
  limit?: number,
  query?: string,
): Promise<GetChangelogsResponse> {
  const response = await client.get(`/v1/teams/${teamId}/changelogs`, {
    params: {
      offset,
      limit,
      query,
    },
  });

  return response?.data;
}

/*
  Get Changelog
*/

export interface GetChangelogResponse extends Changelog {}

export async function getChangelog(
  teamId: number,
  changelogId: number,
): Promise<GetChangelogResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/changelogs/${changelogId}`,
  );

  return response?.data;
}

/*
  Create Changelog
*/

export async function createChangelog(
  teamId: number,
  name: string,
): Promise<GetChangelogResponse> {
  const response = await client.post(`/v1/teams/${teamId}/changelogs`, {
    name,
  });

  return response?.data;
}

/*
  Delete Changelog
*/

export async function deleteChangelog(
  teamId: number,
  changelogId: number,
): Promise<void> {
  const response = await client.delete(
    `/v1/teams/${teamId}/changelogs/${changelogId}`,
  );

  return response?.data;
}
