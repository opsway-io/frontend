import { Typography } from "@mui/material";
import { FunctionComponent } from "react";

interface ContainerHeaderProps {
    children: string | React.ReactNode | React.ReactNode[];
}

const ContainerHeader: FunctionComponent<ContainerHeaderProps> = (props) => {
    return (
        <Typography
            variant="h5"
            style={{
                margin: "0",
            }}
        >
            {props.children}
        </Typography>
    );
};

export default ContainerHeader;
