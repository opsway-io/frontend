import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStatusPage,
  deleteStatusPage,
  getStatusPage,
  getStatusPages,
  GetStatusPagesResponse,
  PostStatusPageRequest,
  PutStatusPageRequest,
  StatusPage,
  updateStatusPage,
} from "../api/endpoints/statuspages";
import { useCurrentTeam } from "./team.query";

export const statusPagesKeys = {
  all: ["status-pages"] as const,
  lists: () => [...statusPagesKeys.all, "list"] as const,
  list: (teamId: number) => [...statusPagesKeys.lists(), teamId] as const,
  details: () => [...statusPagesKeys.all, "detail"] as const,
  detail: (teamId: number, statusPageId: number) =>
    [...statusPagesKeys.details(), teamId, statusPageId] as const,
};

export const useStatusPages = () => {
  const team = useCurrentTeam();

  return useQuery<GetStatusPagesResponse, Error>({
    queryKey: statusPagesKeys.list(team.data?.id ?? -1),
    queryFn: () => getStatusPages(team.data!.id),
    enabled: team.isSuccess && team.data !== undefined,
  });
};

export const useStatusPage = (statusPageId: number) => {
  const team = useCurrentTeam();

  return useQuery<StatusPage, Error>({
    queryKey: statusPagesKeys.detail(team.data?.id ?? -1, statusPageId),
    queryFn: () => getStatusPage(team.data!.id, statusPageId),
    enabled: team.isSuccess && team.data !== undefined,
  });
};

export const useCreateStatusPage = () => {
  const queryClient = useQueryClient();
  const team = useCurrentTeam();

  return useMutation({
    mutationFn: (payload: PostStatusPageRequest) =>
      createStatusPage(team.data!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statusPagesKeys.lists() });
    },
  });
};

export const useUpdateStatusPage = (statusPageId: number) => {
  const queryClient = useQueryClient();
  const team = useCurrentTeam();

  return useMutation({
    mutationFn: (payload: PutStatusPageRequest) =>
      updateStatusPage(team.data!.id, statusPageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statusPagesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: statusPagesKeys.detail(team.data!.id, statusPageId),
      });
    },
  });
};

export const useDeleteStatusPage = () => {
  const queryClient = useQueryClient();
  const team = useCurrentTeam();

  return useMutation({
    mutationFn: (statusPageId: number) =>
      deleteStatusPage(team.data!.id, statusPageId),
    onSuccess: (_, statusPageId) => {
      queryClient.invalidateQueries({ queryKey: statusPagesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: statusPagesKeys.detail(team.data!.id, statusPageId),
      });
    },
  });
};
