import { AxiosInstance } from "axios";
import useAuthenticationStore from "../../hooks/authentication.store";

/** Logs the user out when unauthenticated or when a request returns 401. */
export function installLogoutInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use((request) => {
    // Auth endpoints opt out by sending an empty Authorization header.
    if (request.headers?.Authorization === "") {
      return request;
    }

    const authStore = useAuthenticationStore.getState();
    if (!authStore.isAuthenticated()) {
      authStore.logOut();
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        !error.config?.url?.includes("/auth/")
      ) {
        useAuthenticationStore.getState().logOut();
      }

      return Promise.reject(error);
    },
  );
}
