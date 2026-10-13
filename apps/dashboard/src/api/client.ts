import { create } from "axios";
import env from "../env";

/**
 * Shared axios instance for the opsway API. Interceptors (token refresh,
 * logout on 401) are installed at startup by `installInterceptors`.
 */
const client = create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});

export default client;
