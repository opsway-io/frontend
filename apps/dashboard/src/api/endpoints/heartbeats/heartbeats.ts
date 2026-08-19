import client from "../../client";

export interface IHeartbeat {
  id: number;
  name: string;
  status: "UP" | "DOWN" | "PAUSED";
  interval: number;
  grace: number;
  lastPing: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getHeartbeats(teamId: number): Promise<IHeartbeat[]> {
  const response = await client.get(`/v1/teams/${teamId}/heartbeats`);
  return response?.data;
}

export async function getHeartbeat(
  teamId: number,
  heartbeatId: number,
): Promise<IHeartbeat> {
  const response = await client.get(
    `/v1/teams/${teamId}/heartbeats/${heartbeatId}`,
  );
  return response?.data;
}

export interface IPostHeartbeatRequest {
  name: string;
  interval: number;
  grace: number;
}

export async function createHeartbeat(
  teamId: number,
  data: IPostHeartbeatRequest,
): Promise<IHeartbeat> {
  const response = await client.post(`/v1/teams/${teamId}/heartbeats`, data);
  return response?.data;
}

export interface IPutHeartbeatRequest {
  name: string;
  interval: number;
  grace: number;
}

export async function updateHeartbeat(
  teamId: number,
  heartbeatId: number,
  data: IPutHeartbeatRequest,
): Promise<IHeartbeat> {
  const response = await client.put(
    `/v1/teams/${teamId}/heartbeats/${heartbeatId}`,
    data,
  );
  return response?.data;
}

export async function deleteHeartbeat(
  teamId: number,
  heartbeatId: number,
): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/heartbeats/${heartbeatId}`);
}
