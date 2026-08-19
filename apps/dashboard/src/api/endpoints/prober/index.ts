import client from "../../client";

export interface GetLocationsResponse {
  locations: string[];
}

export async function getLocations(): Promise<GetLocationsResponse> {
  const response = await client.get("/v1/prober/locations");
  return response?.data;
}
