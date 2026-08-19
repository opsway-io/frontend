import { AxiosError } from "axios";
import jwt_decode from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as AuthenticationAPI from "../api/endpoints/authentication";
import { IGetUserResponse } from "../api/endpoints/users";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

const initialState: AuthenticationState = {
  currentUserId: undefined,
  currentTeamId: undefined,
};

interface AuthenticationState {
  currentUserId?: number;
  currentTeamId?: number;
}

interface AuthenticationActions {
  isAuthenticated(): boolean;

  logOut(): void;
  logIn(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    user?: IGetUserResponse;
    error?: AxiosError<any>;
  }>;
  register(data: AuthenticationAPI.IRegisterRequest): Promise<{
    success: boolean;
    user?: IGetUserResponse;
    error?: AxiosError<any>;
  }>;
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
        queryClient.clear();
        localStorage.clear();

        set(initialState);
      },

      logIn: async (
        email: string,
        password: string,
      ): Promise<{
        success: boolean;
        user?: IGetUserResponse;
        error?: AxiosError<any>;
      }> => {
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
            currentUserId: response.user?.id,
            currentTeamId: teamId,
          });

          return { success: true, user: response.user };
        } catch (error: any) {
          return { success: false, error: error as AxiosError<any> };
        }
      },

      register: async (
        data: AuthenticationAPI.IRegisterRequest,
      ): Promise<{
        success: boolean;
        user?: IGetUserResponse;
        error?: AxiosError<any>;
      }> => {
        try {
          const response = await AuthenticationAPI.register(data);

          if (!response.user) {
            throw new Error("User missing in register response");
          }

          let teamId = undefined;

          // If the user only has one team, set it as the current team
          if (response.user.teams.length === 1) {
            teamId = response.user.teams[0].id;
          }

          set({
            currentUserId: response.user?.id,
            currentTeamId: teamId,
          });

          return { success: true, user: response.user };
        } catch (error: any) {
          return { success: false, error: error as AxiosError<any> };
        }
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
