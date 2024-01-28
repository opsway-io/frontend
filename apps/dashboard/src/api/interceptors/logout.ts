import { AxiosInstance } from "axios";
import useAuthenticationStore from "../../hooks/authentication.store";

// Log out if the response is 401: Unauthorized
export function LogOutInterceptor(inst: AxiosInstance) {
  inst.interceptors.request.use(
    async (request) => {
      const authStore = useAuthenticationStore.getState();

      // Skip authorization middleware if the request is to the auth endpoint
      const orgAuth = request.headers?.Authorization;
      if (orgAuth !== undefined && orgAuth === "") {
        return request;
      }

      // Check if the access token has expired, if so log out
      if (!authStore.isAuthenticated()) {
        useAuthenticationStore.getState().logOut();
      }

      return request;
    },
    async (error) => {
      return Promise.reject(error);
    },
  );

  inst.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 401) {
        useAuthenticationStore.getState().logOut();
      }

      return Promise.reject(error);
    },
  );
}
