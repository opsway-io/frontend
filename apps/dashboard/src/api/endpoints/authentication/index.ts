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

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function register(
  data: IRegisterRequest,
): Promise<ILoginResponse> {
  const response = await client.post<ILoginResponse>(
    "/v1/auth/register",
    data,
    {
      headers: {
        Authorization: "", // Skip auth interceptor
      },
    },
  );

  return response.data;
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

export async function forgotPassword(email: string): Promise<void> {
  await client.post(
    "/v1/auth/forgot-password",
    { email },
    {
      headers: {
        Authorization: "",
      },
    },
  );
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  await client.post(
    "/v1/auth/reset-password",
    { token, password },
    {
      headers: {
        Authorization: "",
      },
    },
  );
}

export async function logout(): Promise<void> {
  await client.post(
    "/v1/auth/logout",
    {},
    {
      headers: {
        Authorization: "",
      },
    },
  );
}
