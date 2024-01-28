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

const ErrorsBaseView: FunctionComponent<ContainerProps> = (props) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <a href="/">
        <Logo src={"/img/logo.svg"} alt="logo" />
      </a>

      {props.children}
      <Outlet />
    </Box>
  );
};

export default ErrorsBaseView;
