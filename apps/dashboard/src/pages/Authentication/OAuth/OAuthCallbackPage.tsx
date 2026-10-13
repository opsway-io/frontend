import { CircularProgress, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as AuthenticationAPI from "../../../api/endpoints/authentication";
import useAuthenticationStore from "../../../hooks/authentication.store";

/**
 * Landing page after a social login redirect: initializes the session from the
 * HttpOnly cookies set by the backend into the authentication store.
 */
const OAuthCallbackPage: FunctionComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { setCurrentUserID, setCurrentTeamID, logOut } =
      useAuthenticationStore.getState();

    AuthenticationAPI.getMe()
      .then((data) => {
        const user = data?.user;
        if (!user) {
          throw new Error("No user returned from /v1/auth/me");
        }

        setCurrentUserID(user.id);

        const currentTeamId =
          user.teams?.length === 1 ? user.teams[0].id : undefined;

        if (currentTeamId) {
          setCurrentTeamID(currentTeamId);
          navigate("/monitors", { replace: true });
        } else {
          navigate("/login/team/select", { replace: true });
        }
      })
      .catch((err) => {
        console.error("Failed to complete OAuth callback", err);
        logOut();
        navigate("/login", { replace: true });
      });
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
