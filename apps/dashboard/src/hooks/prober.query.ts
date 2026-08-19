import { useQuery } from "@tanstack/react-query";
import { getLocations, GetLocationsResponse } from "../api/endpoints/prober";

export function useLocations() {
  return useQuery<GetLocationsResponse>({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
  });
}
