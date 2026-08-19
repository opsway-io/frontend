import { AxiosInstance } from "axios";
import useAuthenticationStore, {
  AuthenticationState,
  AuthenticationActions,
} from "../../hooks/authentication.store";

export function TokenInterceptor(inst: AxiosInstance) {
  inst.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthenticationStore.getState();

      // If the error is 401 and it's not already a retry, and not an auth endpoint
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/")
      ) {
        originalRequest._retry = true;

        try {
          await refreshTokens(inst, authStore);
          return inst(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
}

let isRefreshing = false;
let refreshSubscribers: ((failure?: boolean) => void)[] = [];

async function refreshTokens(
  axiosInst: AxiosInstance,
  authStore: AuthenticationState & AuthenticationActions,
): Promise<void> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((failure?: boolean) =>
        failure ? reject() : resolve(),
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
    throw error;
  } finally {
    isRefreshing = false;
  }
}

function subscribeTokenRefresh(cb: (failure?: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(failure?: boolean) {
  refreshSubscribers.map((cb) => cb(failure));
  refreshSubscribers = [];
}
