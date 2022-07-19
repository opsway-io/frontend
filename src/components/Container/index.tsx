import { styled, useTheme } from "@mui/material";
import { FunctionComponent, useEffect } from "react";

interface ContainerProps {
    flex?: boolean;
    children: React.ReactNode | React.ReactNode[];
}

const ContainerStyle = styled("div")(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    gap: theme.spacing(1),

    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto",

    "& > *": {
        flexShrink: 0,
    },
}));


const Container: FunctionComponent<ContainerProps> = (props) => {
    return (
        <ContainerStyle
            style={{
                height: props.flex ? undefined : "fit-content",
            }}
        >
            {props.children}
        </ContainerStyle>
    );
};

export default Container;
