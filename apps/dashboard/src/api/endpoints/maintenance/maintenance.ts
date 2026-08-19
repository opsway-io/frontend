import client from "../../client";

export interface IMaintenanceWindow {
  id: number;
  title: string;
  description: string | null;
  settings: {
    startAt: string;
    endAt: string;
  };
  monitors: {
    id: number;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export async function getMaintenanceWindows(
  teamId: number,
): Promise<IMaintenanceWindow[]> {
  const response = await client.get(`/v1/teams/${teamId}/maintenance`);
  return response?.data;
}

export async function getMaintenanceWindow(
  teamId: number,
  maintenanceId: number,
): Promise<IMaintenanceWindow> {
  const response = await client.get(
    `/v1/teams/${teamId}/maintenance/${maintenanceId}`,
  );
  return response?.data;
}

export interface IPostMaintenanceWindowRequest {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  monitorIds?: number[];
}

export async function createMaintenanceWindow(
  teamId: number,
  data: IPostMaintenanceWindowRequest,
): Promise<IMaintenanceWindow> {
  const response = await client.post(`/v1/teams/${teamId}/maintenance`, data);
  return response?.data;
}

export interface IPutMaintenanceWindowRequest {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  monitorIds?: number[];
}

export async function updateMaintenanceWindow(
  teamId: number,
  maintenanceId: number,
  data: IPutMaintenanceWindowRequest,
): Promise<IMaintenanceWindow> {
  const response = await client.put(
    `/v1/teams/${teamId}/maintenance/${maintenanceId}`,
    data,
  );
  return response?.data;
}

export async function deleteMaintenanceWindow(
  teamId: number,
  maintenanceId: number,
): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/maintenance/${maintenanceId}`);
}
