import { AxiosInstance } from "axios";
import useAuthenticationStore, {
  AuthenticationState,
} from "../../hooks/authentication.store";

// Middleware for refreshing access token when it expires
// The middleware will check if the access token has expired before making a request
// If the access token has expired, it will refresh the access token and retry the request
// If the refresh token has expired, it will log the user out.
//
// Any concurrent requests will be queued until the access token has been refreshed

export function TokenInterceptor(inst: AxiosInstance) {
  inst.interceptors.request.use(
    async (request) => {
      let authStore = useAuthenticationStore.getState();

      // Skip authorization middleware if the request is to the auth endpoint
      const orgAuth = request.headers?.Authorization;
      if (orgAuth !== undefined && orgAuth === "") {
        return request;
      }

      // Check if the refresh token has expired
      if (authStore.isRefreshTokenExpired()) {
        authStore.logOut();

        return request;
      }

      // If the access token has expired, refresh the access token
      if (authStore.isAccessTokenExpired()) {
        try {
          await refreshTokens(inst, authStore);
          authStore = useAuthenticationStore.getState();
        } catch (error) {
          Promise.reject(error);
        }
      }

      request.headers!.Authorization = `Bearer ${authStore.accessToken}`;

      return request;
    },
    (error) => {
      Promise.reject(error);
    }
  );
}

let isRefreshing = false;
let refreshSubscribers: ((failure?: boolean) => void)[] = [];

async function refreshTokens(
  axiosInst: AxiosInstance,
  authStore: AuthenticationState
): Promise<void> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((failure?: boolean) =>
        failure ? reject() : resolve()
      );
    });
  }

  try {
    isRefreshing = true;
    await authStore.refreshTokens();
    onTokenRefreshed(false);
  } catch (error) {
    authStore.logOut();
    onTokenRefreshed(true);
  } finally {
    isRefreshing = false;
  }
}

function subscribeTokenRefresh(cb: () => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(failure?: boolean) {
  refreshSubscribers.map((cb) => cb(failure));
  refreshSubscribers = [];
}
