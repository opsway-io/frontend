import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as AuthenticationAPI from "../api/endpoints/authentication";
import { getQueryClient } from "./client.query";
import jwt_decode from "jwt-decode";
import { IGetUserResponse } from "../api/endpoints/users";

const queryClient = getQueryClient();

const initialState: AuthenticationState = {
  currentUserId: undefined,
  currentTeamId: undefined,
  accessToken: undefined,
  refreshToken: undefined,
};

interface AuthenticationState {
  currentUserId?: number;
  currentTeamId?: number;

  accessToken?: string;
  refreshToken?: string;
}

interface AuthenticationActions {
  isAuthenticated(): boolean;

  logOut(): void;
  logIn(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: IGetUserResponse }>;

  setCurrentUserID(userId?: number): void;
  setCurrentTeamID(teamId?: number): void;

  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;

  refreshTokens(): Promise<void>;

  isAccessTokenExpired(): boolean;
  isRefreshTokenExpired(): boolean;
}

const useAuthenticationStore = create<
  AuthenticationState & AuthenticationActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      isAuthenticated: () => {
        return !get().isRefreshTokenExpired() && !!get().currentUserId;
      },

      logOut: () => {
        queryClient.clear();
        localStorage.clear();

        set(initialState);
      },

      logIn: async (
        email: string,
        password: string,
      ): Promise<{ success: boolean; user?: IGetUserResponse }> => {
        try {
          const response = await AuthenticationAPI.login(email, password);

          if (!response.user) {
            throw new Error("User missing in login response");
          }

          let teamId = undefined;

          // If the user only has one team, set it as the current team
          // This is to prevent the user from having to select a team on login
          if (response.user.teams.length === 1) {
            teamId = response.user.teams[0].id;
          }

          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            currentUserId: response.user?.id,
            currentTeamId: teamId,
          });

          return { success: true, user: response.user };
        } catch (error) {
          console.error(error);

          return { success: false };
        }
      },

      setCurrentUserID: (userId?: number) => {
        set({ currentUserId: userId });
      },

      setCurrentTeamID: (teamId?: number) => {
        set({ currentTeamId: teamId });
      },

      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },

      setRefreshToken: (token: string) => {
        set({ refreshToken: token });
      },

      refreshTokens: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        const resp = await AuthenticationAPI.refresh(refreshToken);

        set({
          accessToken: resp.accessToken,
          refreshToken: resp.refreshToken,
        });
      },

      isAccessTokenExpired: () => {
        const token = get().accessToken;
        if (!token) {
          return true;
        }

        return hasTokenExpired(token);
      },

      isRefreshTokenExpired: () => {
        const token = get().refreshToken;
        if (!token) {
          return true;
        }

        return hasTokenExpired(token);
      },
    }),
    {
      name: "authenticationState",
    },
  ),
);

function hasTokenExpired(token: string) {
  const jwt: any = jwt_decode(token);
  return jwt.exp < Date.now() / 1000;
}

export type { AuthenticationState };
export default useAuthenticationStore;
