import axios, { AxiosInstance } from "axios";
import { JWTInjectorInterceptor, JWTRefresherInterceptor } from "./interceptors/jwt";

export interface IClientOptions {
    interceptors?: boolean;
}

export function NewClient(baseURL: string, options: IClientOptions = { 
    interceptors: true 
}): AxiosInstance {
    let client = axios.create({
        baseURL: baseURL,
    });

    if (options?.interceptors) {
        client = JWTInjectorInterceptor(client);
        client = JWTRefresherInterceptor(client);
    }

    return client;
}