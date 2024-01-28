import client from "../client";

export interface IChangelog {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: string;
}

export interface IChangelogsResponse {
  changelogs: IChangelog[];
  totalCount: number;
}

export async function getChangelogs(
  teamId: number,
  offset?: number,
  limit?: number,
  query?: string
): Promise<IChangelogsResponse> {
  const response = await client.get(`/v1/teams/${teamId}/changelogs`, {
    params: {
      offset,
      limit,
      query,
    },
  });

  return response?.data;
}

export interface IChangelogResponse extends IChangelog {}

export async function getChangelog(
  teamId: number,
  changelogId: number
): Promise<IChangelogResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/changelogs/${changelogId}`
  );

  return response?.data;
}

export async function postChangelog(
  teamId: number,
  name: string
): Promise<IChangelogResponse> {
  const response = await client.post(`/v1/teams/${teamId}/changelogs`, {
    name,
  });

  return response?.data;
}

export async function deleteChangelog(
  teamId: number,
  changelogId: number
): Promise<void> {
  const response = await client.delete(
    `/v1/teams/${teamId}/changelogs/${changelogId}`
  );

  return response?.data;
}
