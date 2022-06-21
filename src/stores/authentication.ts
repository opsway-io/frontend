import axios from "axios";
import create from "zustand";
import Authentication from "../api/authentication";
import { deleteRefreshToken, deleteToken, getRefreshToken, getToken, setRefreshToken, setToken } from "../helpers/token";
import { Token } from "../interfaces/token";
import { User } from "../interfaces/user";

const api = new Authentication(
    axios.create({
        baseURL: "http://localhost:8080",
    })
);

interface AuthenticationState extends Token {
    isAuthenticated(): boolean;
    logOut(): void;
    logIn(email: string, password: string): Promise<{success: boolean, user?: User}>;
}

const useAuthentication = create<AuthenticationState>()((set, get) => ({
    isAuthenticated: () => {
        return !!getToken() && !!getRefreshToken();
    },

    logOut: () => {
        deleteToken();
        deleteRefreshToken();
    },

    logIn: async (email: string, password: string): Promise<{success: boolean, user?: User}>=> {
        try {
            const response = await api.login(email, password);

            setToken(response.token);
            setRefreshToken(response.refreshToken);

            return { success: true, user: response.user };
        } catch (error) {
            return { success: false };
        }
    },
}));

export default useAuthentication;
