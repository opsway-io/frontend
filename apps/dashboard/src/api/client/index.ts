import axios from "axios";
import env from "../../env";
import { LogOutInterceptor } from "../interceptors/logout";
import { TokenInterceptor } from "../interceptors/token";

const instance = axios.create({
  baseURL: env.API_BASE_URL,
});

LogOutInterceptor(instance);
TokenInterceptor(instance);

export default instance;
