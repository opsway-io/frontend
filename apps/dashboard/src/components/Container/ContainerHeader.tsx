import { Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface ContainerHeaderProps {
  children: ReactNode;
}

const ContainerHeader: FunctionComponent<ContainerHeaderProps> = (props) => {
  return (
    <Typography level="h3" fontWeight={600} letterSpacing="-0.01em">
      {props.children}
    </Typography>
  );
};

export default ContainerHeader;
