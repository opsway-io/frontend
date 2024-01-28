import { useMutation, useQuery } from "@tanstack/react-query";
import * as ChangelogsAPI from "../api/endpoints/changelogs";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

export const useCreateChangelog = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (name: string) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.postChangelog(teamId, name);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "changelogs"]);
      },
    }
  );
};

export const useDeleteChangelog = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (changelogId: number) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.deleteChangelog(teamId, changelogId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "changelogs"]);
      },
    }
  );
};

export const useChangelog = (changelogId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "changelogs", changelogId], () => {
    if (!teamId) {
      return Promise.resolve(null);
    }

    return ChangelogsAPI.getChangelog(teamId, changelogId);
  });
};

export const useChangelogs = (offset = 0, limit = 10, query?: string) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    [
      "teams",
      teamId,
      "changelogs",
      {
        offset,
        limit,
        query,
      },
    ],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.getChangelogs(teamId, offset, limit, query);
    },
    {
      keepPreviousData: true,
    }
  );
};
