import client from "../../client";
import { IGetUserResponse } from "../users";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IGetUserResponse;
}

export async function login(
  email: string,
  password: string,
): Promise<ILoginResponse> {
  const data: ILoginRequest = {
    email: email,
    password: password,
  };

  const response = await client.post<ILoginResponse>("/v1/auth/login", data, {
    headers: {
      Authorization: "", // Skip auth interceptor
    },
  });

  return response.data;
}

export interface IRefreshRequest {
  refreshToken: string;
}

export interface IRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export async function refresh(refreshToken: string): Promise<IRefreshResponse> {
  const data: IRefreshRequest = {
    refreshToken: refreshToken,
  };

  const response = await client.post<IRefreshResponse>(
    "/v1/auth/refresh",
    data,
    {
      headers: {
        Authorization: "", // Skip auth interceptor
      },
    },
  );

  return response.data;
}
