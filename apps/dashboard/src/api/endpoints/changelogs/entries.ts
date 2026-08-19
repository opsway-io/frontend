import client from "../../client";

export interface IChangelogEntry {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetChangelogEntriesResponse {
  entries: IChangelogEntry[];
  totalCount: number;
}

export async function getChangelogEntries(
  teamId: number,
  changelogId: number,
  offset = 0,
  limit = 10,
  query?: string,
): Promise<IGetChangelogEntriesResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/changelogs/${changelogId}/entries`,
    {
      params: {
        offset,
        limit,
        query,
      },
    },
  );

  return response?.data;
}

export async function getChangelogEntry(
  teamId: number,
  changelogId: number,
  entryId: number,
): Promise<IChangelogEntry> {
  const response = await client.get(
    `/v1/teams/${teamId}/changelogs/${changelogId}/entries/${entryId}`,
  );

  return response?.data;
}

export interface IPostChangelogEntryRequest {
  title: string;
  content?: string;
  authorIds?: number[];
}

export async function createChangelogEntry(
  teamId: number,
  changelogId: number,
  data: IPostChangelogEntryRequest,
): Promise<IChangelogEntry> {
  const response = await client.post(
    `/v1/teams/${teamId}/changelogs/${changelogId}/entries`,
    data,
  );

  return response?.data;
}

export interface IPutChangelogEntryRequest {
  title: string;
}

export async function updateChangelogEntry(
  teamId: number,
  changelogId: number,
  entryId: number,
  data: IPutChangelogEntryRequest,
): Promise<IChangelogEntry> {
  const response = await client.put(
    `/v1/teams/${teamId}/changelogs/${changelogId}/entries/${entryId}`,
    data,
  );

  return response?.data;
}

export async function deleteChangelogEntry(
  teamId: number,
  changelogId: number,
  entryId: number,
): Promise<void> {
  await client.delete(
    `/v1/teams/${teamId}/changelogs/${changelogId}/entries/${entryId}`,
  );
}
