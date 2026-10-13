import { Box } from "@mui/joy";
import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";

/** Centered, logo-topped shell for error pages. */
const ErrorLayout: FunctionComponent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        px: 2,
        py: 6,
      }}
    >
      <Box component="a" href="/" sx={{ display: "flex" }}>
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

export default ErrorLayout;
