import { styled } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

const Container = styled("div")<{
  flexItem?: boolean;
}>(({ theme, flexItem }) => ({
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
  color: theme.palette.text.primary,
  opacity: 0.25,
  flex: flexItem ? 1 : undefined,
}));

interface PlaceholderProps {
  children?: ReactNode | ReactNode[];
  flexItem?: boolean;
}

const Placeholder: FunctionComponent<PlaceholderProps> = (props) => {
  return (
    <Container flexItem={props.flexItem}>{props.children || ""}</Container>
  );
};

export default Placeholder;
