import { Box } from "@mui/joy";
import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";

/** Centered, logo-topped shell for the sign-in / sign-up screens. */
const AuthenticationLayout: FunctionComponent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        px: 2,
        py: 6,
        backgroundImage: "url(/img/particles.svg)",
      }}
    >
      <Box component="a" href="https://opsway.eu" sx={{ display: "flex" }}>
        <Box
          component="img"
          src="/img/logo.svg"
          alt="logo"
          sx={{ width: 150 }}
        />
      </Box>

      <Outlet />
    </Box>
  );
};

export default AuthenticationLayout;
