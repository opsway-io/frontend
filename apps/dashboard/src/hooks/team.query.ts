import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import * as TeamsAPI from "../api/endpoints/teams";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

export const removeTeamUser = async (
  teamId: string | number,
  userId: string | number,
): Promise<void> => {
  await TeamsAPI.removeUser(teamId, userId);
  queryClient.invalidateQueries({ queryKey: ["teams", teamId, "users"] });
};

export const useTeamUsers = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  return useQuery({
    queryKey: ["teams", teamId, "users", "all"],
    queryFn: () => {
      if (!teamId) return Promise.resolve(null);
      return TeamsAPI.getUsers(teamId, 0, 1000);
    },
    enabled: !!teamId,
  });
};

interface TeamUsersPageParams {
  offset: number;
  limit: number;
  query?: string;
  role?: string;
}

/** One page of the current team's members, optionally filtered. */
export const useTeamUsersPage = ({
  offset,
  limit,
  query,
  role,
}: TeamUsersPageParams) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "users", { offset, limit, query, role }],
    queryFn: () => {
      if (!teamId) return Promise.resolve(null);
      return TeamsAPI.getUsers(teamId, offset, limit, query, role);
    },
    placeholderData: keepPreviousData,
  });
};

export const useCurrentTeam = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", currentTeamId],
    queryFn: () => {
      if (!currentTeamId) {
        return Promise.resolve(null);
      }

      return TeamsAPI.getTeam(currentTeamId);
    },
  });
};

export const useMutateCurrentTeam = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: TeamsAPI.IPutTeamRequest) => {
      if (!currentTeamId) {
        return Promise.resolve(null);
      }

      return TeamsAPI.putTeam(currentTeamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", currentTeamId] });
    },
  });
};

export const useDeleteTeam = (teamId: number) => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useMutation({
    mutationFn: () => {
      return TeamsAPI.deleteTeam(teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
  });
};

export const useMutateTeamUser = (teamId: number, userId: number) => {
  return useMutation({
    mutationFn: (data: TeamsAPI.IPutTeamUserRequest) => {
      return TeamsAPI.putTeamUser(teamId, userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
  });
};

export const useAcceptTeamInvite = () => {
  return useMutation({
    mutationFn: (token: string) => {
      return TeamsAPI.acceptInvite(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useChangePlan = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (plan: string) => {
      if (!currentTeamId) {
        return Promise.reject(new Error("No team selected"));
      }

      return TeamsAPI.postCreateCheckoutSession(currentTeamId, plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/** Creates a Stripe customer portal session; resolves to its URL. */
export const useOpenCustomerPortal = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: async () => {
      if (!currentTeamId) {
        throw new Error("No team selected");
      }

      const { url } = await TeamsAPI.postCustomerPortal(currentTeamId);
      return url;
    },
  });
};

export const useGetProducts = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);
  return useQuery({
    queryKey: ["teams", currentTeamId, "products"],
    queryFn: () => {
      if (!currentTeamId) {
        return Promise.resolve(null);
      }
      return TeamsAPI.getProducts(currentTeamId);
    },
  });
};

/** Total number of members in the current team. */
export const useTeamMemberCount = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "users", "count"],
    queryFn: async () => {
      if (!teamId) return null;
      const response = await TeamsAPI.getUsers(teamId, 0, 1);
      return response.totalCount;
    },
  });
};

export const useInviteTeamMember = (teamId: number) => {
  return useMutation({
    mutationFn: (data: TeamsAPI.IPostTeamUserInviteRequest) => {
      return TeamsAPI.postTeamUserInvite(teamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "users"] });
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "invites"] });
    },
  });
};

export const useTeamInvitations = (teamId: number) => {
  return useQuery({
    queryKey: ["teams", teamId, "invites"],
    queryFn: () => {
      return TeamsAPI.getInvitations(teamId);
    },
  });
};

export const useRevokeTeamInvitation = (teamId: number) => {
  return useMutation({
    mutationFn: (email: string) => {
      return TeamsAPI.deleteInvitation(teamId, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "invites"] });
    },
  });
};
