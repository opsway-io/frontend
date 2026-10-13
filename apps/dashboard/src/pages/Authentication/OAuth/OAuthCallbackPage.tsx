import { CircularProgress, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

/**
 * Landing page after a social login redirect: moves the session from the
 * short-lived cookies set by the backend into the authentication store.
 */
const OAuthCallbackPage: FunctionComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const { setCurrentUserID, setCurrentTeamID, logOut } =
      useAuthenticationStore.getState();

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

      Cookies.remove("team_id");
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    } catch (e) {
      console.error(e);
      logOut();
    } finally {
      navigate("/login", { replace: true });
    }
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- navigate is required by react-hooks/exhaustive-deps; the two rules disagree
  }, [navigate]);

  return (
    <Stack spacing={2} alignItems="center">
      <CircularProgress size="md" />
      <Typography level="body-sm" textColor="text.secondary">
        Signing you in…
      </Typography>
    </Stack>
  );
};

export default OAuthCallbackPage;
