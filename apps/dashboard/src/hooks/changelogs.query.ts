import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import * as ChangelogsAPI from "../api/endpoints/changelogs";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

export const useCreateChangelog = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (name: string) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.createChangelog(teamId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "changelogs"],
      });
    },
  });
};

export const useDeleteChangelog = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (changelogId: number) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.deleteChangelog(teamId, changelogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "changelogs"],
      });
    },
  });
};

export const useChangelog = (changelogId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "changelogs", changelogId],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.getChangelog(teamId, changelogId);
    },
  });
};

export const useChangelogs = (offset = 0, limit = 10, query?: string) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "changelogs",
      {
        offset,
        limit,
        query,
      },
    ],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.getChangelogs(teamId, offset, limit, query);
    },
    placeholderData: keepPreviousData,
  });
};

export const useChangelogEntries = (
  changelogId: number,
  offset = 0,
  limit = 10,
  query?: string,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "changelogs",
      changelogId,
      "entries",
      {
        offset,
        limit,
        query,
      },
    ],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.getChangelogEntries(
        teamId,
        changelogId,
        offset,
        limit,
        query,
      );
    },
    placeholderData: keepPreviousData,
  });
};

export const useChangelogEntry = (changelogId: number, entryId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "changelogs", changelogId, "entries", entryId],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.getChangelogEntry(teamId, changelogId, entryId);
    },
  });
};

export const useCreateChangelogEntry = (changelogId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: ChangelogsAPI.IPostChangelogEntryRequest) => {
      if (!teamId) {
        return Promise.reject(new Error("No team selected"));
      }

      return ChangelogsAPI.createChangelogEntry(teamId, changelogId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "changelogs", changelogId, "entries"],
      });
    },
  });
};

export const useUpdateChangelogEntry = (
  changelogId: number,
  entryId: number,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: ChangelogsAPI.IPutChangelogEntryRequest) => {
      if (!teamId) {
        return Promise.reject(new Error("No team selected"));
      }

      return ChangelogsAPI.updateChangelogEntry(
        teamId,
        changelogId,
        entryId,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "changelogs", changelogId, "entries"],
      });
    },
  });
};

export const useDeleteChangelogEntry = (changelogId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (entryId: number) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ChangelogsAPI.deleteChangelogEntry(teamId, changelogId, entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "changelogs", changelogId, "entries"],
      });
    },
  });
};
