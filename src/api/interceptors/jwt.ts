import axios, { AxiosError, AxiosInstance } from "axios";
import { getRefreshToken, getToken, setRefreshToken, setToken } from "../../helpers/token";
import Authentication from "../authentication";

const api = new Authentication(axios.create({
    baseURL: "http://localhost:8080",
}))

function JWTInjectorInterceptor(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.request.use((config) => {
        const token = getToken();
        if (!token) {
            return config;
        }

        if (!config.headers) {
            config.headers = {};
        }

        config.headers.Authorization = `Bearer ${token}`;

        return config;
    });

    return instance;
}

function JWTRefresherInterceptor(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.request.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;

            if (err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        const refreshToken = getRefreshToken();
                        if (!refreshToken) {
                            return Promise.reject(err);
                        }

                        try {
                            const response = await api.refresh(refreshToken);

                            setToken(response.token);
                            setRefreshToken(response.refreshToken);
                        } catch (error) {
                            return Promise.reject(err);
                        }

                        return instance(originalConfig);
                    } catch (error) {
                        const _error = error as AxiosError;
                        if (_error.response && _error.response.data) {
                            return Promise.reject(_error.response.data);
                        }

                        return Promise.reject(_error);
                    }
                }

                if (err.response.status === 403 && err.response.data) {
                    return Promise.reject(err.response.data);
                }
            }

            return Promise.reject(err);
        }
    );

    return instance;
}

export { JWTInjectorInterceptor, JWTRefresherInterceptor };