import { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as AuthenticationAPI from "../api/endpoints/authentication";
import { IGetUserResponse } from "../api/endpoints/users";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

const initialState: AuthenticationState = {
  currentUserId: undefined,
  currentTeamId: undefined,
};

interface AuthenticationState {
  currentUserId?: number;
  currentTeamId?: number;
}

interface AuthenticationResult {
  success: boolean;
  user?: IGetUserResponse;
  error?: AxiosError<any>;
}

/**
 * Turns a login/register response into store state. Users with exactly one
 * team get it selected right away so they skip the team selection screen.
 */
async function toSession(
  request: Promise<AuthenticationAPI.ILoginResponse>,
): Promise<{ result: AuthenticationResult; state?: AuthenticationState }> {
  try {
    const { user } = await request;
    if (!user) {
      throw new Error("User missing in authentication response");
    }

    const currentTeamId =
      user.teams.length === 1 ? user.teams[0].id : undefined;

    return {
      result: { success: true, user },
      state: { currentUserId: user.id, currentTeamId },
    };
  } catch (error) {
    return { result: { success: false, error: error as AxiosError<any> } };
  }
}

interface AuthenticationActions {
  isAuthenticated(): boolean;

  logOut(): void;
  logIn(email: string, password: string): Promise<AuthenticationResult>;
  register(
    data: AuthenticationAPI.IRegisterRequest,
  ): Promise<AuthenticationResult>;
  setCurrentUserID(userId?: number): void;
  setCurrentTeamID(teamId?: number): void;

  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;

  refreshTokens(): Promise<void>;
}

const useAuthenticationStore = create<
  AuthenticationState & AuthenticationActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      isAuthenticated: () => {
        return !!get().currentUserId;
      },

      logOut: () => {
        AuthenticationAPI.logout().catch(() => {});
        try {
          queryClient.clear();
          localStorage.clear();
        } catch (e) {
          console.error("Error clearing local state during logout", e);
        }

        set(initialState);

        if (!window.location.pathname.startsWith("/login")) {
          const returnTo = encodeURIComponent(
            window.location.pathname + window.location.search,
          );
          window.location.href = `/login?returnTo=${returnTo}`;
        }
      },

      logIn: async (email, password) => {
        const { result, state } = await toSession(
          AuthenticationAPI.login(email, password),
        );
        if (state) set(state);
        return result;
      },

      register: async (data) => {
        const { result, state } = await toSession(
          AuthenticationAPI.register(data),
        );
        if (state) set(state);
        return result;
      },

      setCurrentUserID: (userId?: number) => {
        set({ currentUserId: userId });
      },

      setCurrentTeamID: (teamId?: number) => {
        set({ currentTeamId: teamId });
      },

      forgotPassword: async (email: string) => {
        await AuthenticationAPI.forgotPassword(email);
      },

      resetPassword: async (token: string, password: string) => {
        await AuthenticationAPI.resetPassword(token, password);
      },

      refreshTokens: async () => {
        // Backend reads refresh token from HttpOnly cookie
        await AuthenticationAPI.refresh("");
      },
    }),
    {
      name: "authenticationState",
    },
  ),
);

export type { AuthenticationState, AuthenticationActions };
export default useAuthenticationStore;
