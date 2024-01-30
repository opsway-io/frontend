import client from "../client";

export interface IGetTeamResponse {
  id: number;
  name: string;
  displayName: string;
  paymentPlan: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export async function getTeam(
  teamId: string | number,
): Promise<IGetTeamResponse> {
  const response = await client.get<IGetTeamResponse>(`/v1/teams/${teamId}`);
  return response.data;
}

export interface IPutTeamRequest {
  displayName: string;
}

export async function putTeam(
  teamId: string | number,
  data: IPutTeamRequest,
): Promise<void> {
  await client.put(`/v1/teams/${teamId}`, data);
}

export interface IGetTeamUsersResponse {
  totalCount: number;
  users: IGetTeamUserResponse[];
}

export interface IGetTeamUserResponse {
  id: number;
  name: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: string;
}

export async function getUsers(
  teamId: string | number,
  offset?: number,
  limit?: number,
  query?: string,
): Promise<IGetTeamUsersResponse> {
  const response = await client.get(`/v1/teams/${teamId}/users`, {
    params: {
      offset,
      limit,
      query,
    },
  });

  return response.data;
}

export async function removeUser(
  teamId: string | number,
  userId: string | number,
): Promise<void> {
  return await client.delete(`/v1/teams/${teamId}/users/${userId}`);
}

export interface IPostTeamNameAvailableRequest {
  name: string;
}

export interface IPostTeamNameAvailableResponse {
  available: boolean;
}

export async function postNameAvailable(
  name: string,
): Promise<IPostTeamNameAvailableResponse> {
  const response = await client.post<IPostTeamNameAvailableResponse>(
    `/v1/teams/available`,
    {
      name,
    },
  );
  return response.data;
}

export interface IPostTeamRequest {
  name: string;
  displayName: string;
}

export interface IPostTeamResponse {
  id: number;
  name: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export async function postTeam(
  name: string,
  displayName: string,
): Promise<IPostTeamResponse> {
  const response = await client.post<IPostTeamResponse>(`/v1/teams`, {
    name,
    displayName,
  });

  return response.data;
}

export async function deleteTeam(teamId: string | number): Promise<void> {
  await client.delete(`/v1/teams/${teamId}`);
}

export interface IPutTeamUserRequest {
  role: string;
}

export async function putTeamUser(
  teamId: string | number,
  userId: string | number,
  data: IPutTeamUserRequest,
): Promise<void> {
  await client.put(`/v1/teams/${teamId}/users/${userId}`, data);
}

export interface IPostTeamUserInviteRequest {
  email: string;
  role: string;
}

export async function postTeamUserInvite(
  teamId: string | number,
  data: IPostTeamUserInviteRequest,
): Promise<void> {
  await client.post(`/v1/teams/${teamId}/users/invites`, data);
}

export async function updateAvatar(
  teamId: number | string,
  data: string | Blob,
): Promise<void> {
  const form = new FormData();
  form.append("file", data);

  await client.put(`/v1/teams/${teamId}/avatar`, form);
}

export async function acceptInvite(token: string): Promise<void> {
  await client.post(`/v1/teams/invites/accept`, { token });
}

export async function postCreateCheckoutSession(
  teamId: string | number,
  priceLookupKey: string,
): Promise<void> {
  const res =  client.post(`/v1/teams/${teamId}/create-checkout-session`, {
    priceLookupKey,
  });
  const body = (await res).data;
  window.location.href = body;
}
