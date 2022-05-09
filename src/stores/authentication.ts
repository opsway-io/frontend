import create from "zustand";
import { persist } from "zustand/middleware";
import { Token } from "../interfaces/token";

interface AuthenticationState extends Token {
    isAuthenticated(): boolean;
    logOut(): void;
    logIn(email: string, password: string): boolean;
}

const useAuthentication = create<AuthenticationState>()(
    persist(
        (set, get) => ({
            isAuthenticated: () => {
                return !!get().accessToken;
            },

            logOut: () => {
                set({ accessToken: undefined });
            },

            logIn: (email: string, password: string): boolean => {
                set({ accessToken: "accessToken" });
                return true;
            },
        }),
        {
            name: "authenticationState",
        }
    )
);
export default useAuthentication;
