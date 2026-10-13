import { Box } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface PlaceholderProps {
  children?: ReactNode | ReactNode[];
  flexItem?: boolean;
}

const Placeholder: FunctionComponent<PlaceholderProps> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: 96,
        p: 4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "lg",
        border: "1px dashed",
        borderColor: "neutral.700",
        boxSizing: "border-box",
        color: "text.tertiary",
        flex: props.flexItem ? 1 : undefined,
      }}
    >
      {props.children || ""}
    </Box>
  );
};

export default Placeholder;
