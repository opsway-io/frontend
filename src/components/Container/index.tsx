import { Stack, styled } from "@mui/material";
import { FunctionComponent } from "react";
import Sidebar from "../Sidebar";

const StyledContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
    paddingTop: theme.spacing(6),
    boxSizing: "border-box",
}));

interface ContainerProps {
    children: React.ReactNode | React.ReactNode[];
}

const Container: FunctionComponent<ContainerProps> = (props) => {
    return (
        <>
            <Sidebar />
            <StyledContainer children={props.children} spacing={2}/>
        </>
    );
};

export default Container;
