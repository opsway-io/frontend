import client from "./client";
import { installLogoutInterceptor } from "./interceptors/logout";
import { installTokenRefreshInterceptor } from "./interceptors/token";

/**
 * Wires authentication handling into the API client. Kept separate from
 * `client.ts` so endpoint modules don't import the authentication store.
 */
export function installInterceptors() {
  // Order matters: try a token refresh before logging out on a 401.
  installTokenRefreshInterceptor(client);
  installLogoutInterceptor(client);
}
