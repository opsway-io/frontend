import { AxiosInstance } from "axios";
import { User } from "../../interfaces/user";

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export interface IRefreshRequest {
    refreshToken: string;
}

export interface IRefreshResponse {
    token: string;
    refreshToken: string;
}

export default class Authentication {
    private client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }

    public async login(email: string, password: string): Promise<ILoginResponse> {
        const data: ILoginRequest = {
            email: email,
            password: password,
        };

        
        return {
            refreshToken: "refresh-token",
            token: "token",
            user: {
                email: "demo@opsway.io",
                displayName: "Demo user",
            }
        }
        
        const response = await this.client.post<ILoginResponse>("/v1/authentication/login", data);
        
        return response.data;
    }

    public async refresh(refreshToken: string): Promise<IRefreshResponse> {
        const data: IRefreshRequest = {
            refreshToken: refreshToken,
        };

        const response = await this.client.post("/v1/authentication/refresh", data);

        return response.data;
    }
}
