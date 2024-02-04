import client from "../../client";

export interface IGetUserResponse {
  id: number;
  email: string;
  displayName?: string;
  name: string;
  avatarUrl?: string;
  teams: IGetUserTeamResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetUserTeamResponse {
  id: number;
  name: string;
  displayName: string;
  avatarUrl?: string;
}

export async function getUser(
  userId: number | string,
): Promise<IGetUserResponse> {
  const response = await client.get(`/v1/users/${userId}`);
  return response?.data;
}

export async function deleteUser(userId: number | string): Promise<void> {
  await client.delete(`/v1/users/${userId}`);
}

export interface IPutUserRequest {
  email: string;
  displayName: string;
  name: string;
}

export async function updateUser(
  userId: number | string,
  data: IPutUserRequest,
): Promise<void> {
  const response = await client.put(`/v1/users/${userId}`, data);
  return response?.data;
}

export async function updatePassword(
  userId: number | string,
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  await client.put(`/v1/users/${userId}/password`, {
    oldPassword,
    newPassword,
  });
}

export async function updateAvatar(
  userId: number | string,
  data: string | Blob,
): Promise<void> {
  const form = new FormData();
  form.append("file", data);

  await client.put(`/v1/users/${userId}/avatar`, form);
}

export interface IGetTeams {
  teams: {
    id: number;
    name: string;
    displayName: string;
    PaymentPlan: string;
    avatarUrl?: string;
    role: string;
  }[];
}

export async function getTeams(userId: number | string): Promise<IGetTeams> {
  const response = await client.get(`/v1/users/${userId}/teams`);
  return response?.data;
}
