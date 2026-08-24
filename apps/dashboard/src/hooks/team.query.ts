import { useMutation, useQuery } from "@tanstack/react-query";
import * as TeamsAPI from "../api/endpoints/teams";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

export const removeTeamUser = async (
  teamId: string | number,
  userId: string | number,
): Promise<void> => {
  await TeamsAPI.removeUser(teamId, userId);
  queryClient.invalidateQueries(["teams", teamId, "users"]);
};

export const useTeamUsers = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  return useQuery(
    ["teams", teamId, "users", "all"],
    () => {
      if (!teamId) return Promise.resolve(null);
      return TeamsAPI.getUsers(teamId, 0, 1000);
    },
    {
      enabled: !!teamId,
    },
  );
};

export const useCurrentTeam = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", currentTeamId], () => {
    if (!currentTeamId) {
      return Promise.resolve(null);
    }

    return TeamsAPI.getTeam(currentTeamId);
  });
};

export const useMutateCurrentTeam = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: TeamsAPI.IPutTeamRequest) => {
      if (!currentTeamId) {
        return Promise.resolve(null);
      }

      return TeamsAPI.putTeam(currentTeamId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", currentTeamId]);
      },
    },
  );
};

export const useDeleteTeam = (teamId: number) => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useMutation(
    () => {
      return TeamsAPI.deleteTeam(teamId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId]);
        queryClient.invalidateQueries(["users", userId]);
      },
    },
  );
};

export const useMutateTeamUser = (teamId: number, userId: number) => {
  return useMutation(
    (data: TeamsAPI.IPutTeamUserRequest) => {
      return TeamsAPI.putTeamUser(teamId, userId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId]);
        queryClient.invalidateQueries(["users", userId]);
      },
    },
  );
};

export const useAcceptTeamInvite = () => {
  return useMutation(
    (token: string) => {
      return TeamsAPI.acceptInvite(token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams"]);
        queryClient.invalidateQueries(["users"]);
      },
    },
  );
};

export const usePostCreateCheckoutSession = (teamId: number, plan: string) => {
  return useMutation(
    () => {
      return TeamsAPI.postCreateCheckoutSession(teamId, plan);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "plan", plan]);
      },
    },
  );
};

export const usePostCustomerPortal = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);
  return useQuery([], () => {
    if (!currentTeamId) {
      return Promise.resolve(null);
    }
    return TeamsAPI.postCustomerPortal(currentTeamId);
  });
};

export const useGetProducts = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);
  return useQuery(["products"], () => {
    if (!currentTeamId) {
      return Promise.resolve(null);
    }
    return TeamsAPI.getProducts(currentTeamId);
  });
};

export const useGetCustomerSession = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);
  return useQuery([], () => {
    if (!currentTeamId) {
      return Promise.resolve(null);
    }
    return TeamsAPI.getCustomerSession(currentTeamId);
  });
};

export const useInviteTeamMember = (teamId: number) => {
  return useMutation(
    (data: TeamsAPI.IPostTeamUserInviteRequest) => {
      return TeamsAPI.postTeamUserInvite(teamId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "users"]);
        queryClient.invalidateQueries(["teams", teamId, "invites"]);
      },
    },
  );
};

export const useTeamInvitations = (teamId: number) => {
  return useQuery(["teams", teamId, "invites"], () => {
    return TeamsAPI.getInvitations(teamId);
  });
};

export const useRevokeTeamInvitation = (teamId: number) => {
  return useMutation(
    (email: string) => {
      return TeamsAPI.deleteInvitation(teamId, email);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "invites"]);
      },
    },
  );
};
