import client from "../client";

export interface LocationDetail {
  id: string;
  name: string;
  countryCode: string;
  status?: string;
}

export interface GetLocationsResponse {
  locations: string[];
  details?: LocationDetail[];
}

export async function getLocations(): Promise<GetLocationsResponse> {
  const response = await client.get("/v1/prober/locations");
  return response?.data;
}
