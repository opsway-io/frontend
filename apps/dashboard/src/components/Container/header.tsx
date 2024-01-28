import { Typography } from "@mui/material";
import { FunctionComponent } from "react";

interface ContainerHeaderProps {
  children: string | React.ReactNode | React.ReactNode[];
}

const ContainerHeader: FunctionComponent<ContainerHeaderProps> = (props) => {
  return (
    <Typography
      sx={{
        fontSize: (t) => t.typography.h5.fontSize,
        color: (t) => t.palette.text.primary,
      }}
    >
      {props.children}
    </Typography>
  );
};

export default ContainerHeader;
