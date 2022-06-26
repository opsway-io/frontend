import { styled } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: theme.spacing(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.shape.borderRadius,
    borderStyle: "dashed",
    boxSizing: "border-box",
    borderWidth: 2,
    borderSpacing: 4,
    borderColor: theme.palette.grey[500],
    color: theme.palette.grey[800],
}));

interface PlaceholderProps {
    children?: ReactNode | ReactNode[]
}
 
const Placeholder: FunctionComponent<PlaceholderProps> = (props) => {
    return <Container>{props.children || ""}</Container>;
}
 
export default Placeholder;