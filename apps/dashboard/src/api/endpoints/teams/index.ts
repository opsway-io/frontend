import client from "../../client";

export interface IGetTeamResponse {
  id: number;
  name: string;
  displayName: string;
  paymentPlan: string;
  avatarUrl: string;
  slackWebhookUrl?: string;
  discordWebhookUrl?: string;
  telegramChatId?: string;
  datadogWebhookUrl?: string;
  newRelicWebhookUrl?: string;
  microsoftTeamsWebhookUrl?: string;
  webhookUrl?: string;
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
  slackWebhookUrl?: string;
  discordWebhookUrl?: string;
  telegramChatId?: string;
  datadogWebhookUrl?: string;
  newRelicWebhookUrl?: string;
  microsoftTeamsWebhookUrl?: string;
  webhookUrl?: string;
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
  role?: string,
): Promise<IGetTeamUsersResponse> {
  const response = await client.get(`/v1/teams/${teamId}/users`, {
    params: {
      offset,
      limit,
      query,
      role,
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

export interface IGetTeamUsersInviteResponse {
  email: string;
  role: string;
  createdAt: string;
}

export interface IGetTeamUsersInvitesResponse {
  invites: IGetTeamUsersInviteResponse[];
}

export async function getInvitations(
  teamId: string | number,
): Promise<IGetTeamUsersInvitesResponse> {
  const response = await client.get<IGetTeamUsersInvitesResponse>(
    `/v1/teams/${teamId}/users/invites`,
  );
  return response.data;
}

export async function deleteInvitation(
  teamId: string | number,
  email: string,
): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/users/invites/${email}`);
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
  plan: string,
): Promise<void> {
  const res = client.post(`/v1/teams/${teamId}/create-checkout-session`, {
    plan,
  });
  const body = (await res).data;
  if (body != "") {
    window.location.href = body;
  }
}

export interface IPostCustomerPortalResponse {
  url: string;
}

export async function postCustomerPortal(
  teamId: string | number,
): Promise<IPostCustomerPortalResponse> {
  const response = await client.post<IPostCustomerPortalResponse>(
    `/v1/teams/${teamId}/customer-portal`,
  );

  return response.data;
}

export interface IGetProductsResponse {
  products: {
    id: string;
    name: string;
    price: number;
    currency: string;
    marketing_features: string[];
  }[];
}

export async function getProducts(
  teamId: string | number,
): Promise<IGetProductsResponse> {
  const response = await client.get<IGetProductsResponse>(
    `/v1/teams/${teamId}/products`,
  );

  return response.data;
}

export interface IGetCustomerSessionResponse {
  sessionId: string;
}

export async function getCustomerSession(
  teamId: string | number,
): Promise<IGetCustomerSessionResponse> {
  const response = await client.get<IGetCustomerSessionResponse>(
    `/v1/teams/${teamId}/customer-session`,
  );

  return response.data;
}

export interface IGetApiKeysResponseApiKey {
  id: number;
  name: string;
  createdAt: string;
}

export interface IGetApiKeysResponse {
  apiKeys: IGetApiKeysResponseApiKey[];
}

export async function getApiKeys(
  teamId: string | number,
): Promise<IGetApiKeysResponse> {
  const response = await client.get<IGetApiKeysResponse>(
    `/v1/teams/${teamId}/apikeys`,
  );
  return response.data;
}

export interface IPostApiKeyRequest {
  name: string;
}

export interface IPostApiKeyResponse {
  plaintextKey: string;
}

export async function createApiKey(
  teamId: string | number,
  data: IPostApiKeyRequest,
): Promise<IPostApiKeyResponse> {
  const response = await client.post<IPostApiKeyResponse>(
    `/v1/teams/${teamId}/apikeys`,
    data,
  );
  return response.data;
}

export async function deleteApiKey(
  teamId: string | number,
  keyId: string | number,
): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/apikeys/${keyId}`);
}

export interface OnCallRotation {
  userId: number;
  tier: number;
}

export interface EscalationPolicy {
  name: string;
  escalationTimeoutMinutes: number;
  rotations: OnCallRotation[];
}

export async function getEscalationPolicy(
  teamId: number,
): Promise<EscalationPolicy> {
  const response = await client.get(`/v1/teams/${teamId}/escalation`);
  return response?.data;
}

export async function putEscalationPolicy(
  teamId: number,
  policy: EscalationPolicy,
): Promise<void> {
  await client.put(`/v1/teams/${teamId}/escalation`, policy);
}
