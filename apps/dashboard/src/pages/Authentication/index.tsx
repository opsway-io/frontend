import { Box, styled } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";
import { Outlet } from "react-router-dom";

const Logo = styled("img")(({ theme }) => ({
  position: "absolute",
  top: "42px",
  width: "150px",
  left: "calc(50% - 75px)",
}));

interface ContainerProps {
  children?: ReactNode | ReactNode[];
}

const AuthenticationBaseView: FunctionComponent<ContainerProps> = (props) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        backgroundImage: "url(/img/particles.svg)",
      }}
    >
      <a href="https://opsway.io">
        <Logo src={"/img/logo.svg"} alt="logo" />
      </a>

      {props.children}
      <Outlet />
    </Box>
  );
};

export default AuthenticationBaseView;
