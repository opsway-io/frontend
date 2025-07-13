
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ReporstAPI from "../api/endpoints/reports";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();


export const useReports = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "reporst"], () => {
    if (!teamId) {
      return Promise.resolve(null);
    }

    return ReporstAPI.getReports(teamId);
  });
}