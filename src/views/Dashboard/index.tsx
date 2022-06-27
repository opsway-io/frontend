import { styled } from "@mui/material";
import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Main = styled("main")(({ theme }) => ({
    overflow: "auto",
    width: "100%",
    height: "100%",
    display: "flex",
    backgroundColor: theme.palette.background.default,
}));

const Navigation = styled("nav")(({ theme }) => ({
    display: "flex",
    height: "100%",
}));

const DashboardView: FunctionComponent = () => {
    return (
        <>
            <Navigation>
                <Sidebar />
            </Navigation>
            <Main>
                <Outlet />
            </Main>
        </>
    );
};

export default DashboardView;
