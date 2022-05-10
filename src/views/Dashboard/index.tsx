import { Stack, styled } from "@mui/material";
import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Container = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
    paddingTop: theme.spacing(6),
    boxSizing: "border-box",
}));

const DashboardView: FunctionComponent = () => {
    return (
        <>
            <Sidebar />
            <Container spacing={2}>
                <Outlet />
            </Container>
        </>
    );
};

export default DashboardView;
