import { Typography } from "@mui/material";
import { FunctionComponent } from "react";

interface ContainerHeaderProps {
    children: React.ReactNode | React.ReactNode[];
}

const ContainerHeader: FunctionComponent<ContainerHeaderProps> = (props) => {
    return (
        <Typography
            variant="h4"
            style={{
                margin: "0",
            }}
        >
            {props.children}
        </Typography>
    );
};

export default ContainerHeader;
