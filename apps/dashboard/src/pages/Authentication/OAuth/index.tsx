import { CircularProgress } from "@mui/material";
import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthenticationStore from "../../../hooks/authentication.store";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const OAuthLoginView: FunctionComponent = () => {
  const navigate = useNavigate();
  const [
    setAccessToken,
    setRefreshToken,
    setCurrentUserID,
    setCurrentTeamID,
    logOut,
  ] = useAuthenticationStore((state) => [
    state.setAccessToken,
    state.setRefreshToken,
    state.setCurrentUserID,
    state.setCurrentTeamID,
    state.logOut,
  ]);

  useEffect(() => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("no access cookie token");
      }

      const refreshToken = Cookies.get("refresh_token");
      if (!refreshToken) {
        throw new Error("no refresh cookie token");
      }

      const teamIdStr = Cookies.get("team_id");
      if (!accessToken) {
        throw new Error("no access cookie token");
      }

      const accessJWT = jwtDecode<{ sub: string }>(accessToken);
      if (!accessJWT) {
        throw new Error("Invalid access jwt token");
      }

      const teamId = parseInt(teamIdStr || "", 10);
      if (teamId) {
        setCurrentTeamID(teamId);
      }

      const userId = parseInt(accessJWT.sub);

      setCurrentUserID(userId);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      Cookies.remove("team_id");
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    } catch (e) {
      console.error(e);
      logOut();
    } finally {
      navigate("/login", { replace: true });
    }
  }, []);

  return <CircularProgress />;
};

export default OAuthLoginView;
