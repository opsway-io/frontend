import {
  BreadcrumbsProps as MuiBreadcrumbsProps,
  Breadcrumbs as MuiBreadCrumbs,
} from "@mui/material";
import { FunctionComponent, memo } from "react";

interface BreadCrumbsProps extends MuiBreadcrumbsProps {}

const ContainerBreadCrumbs: FunctionComponent<BreadCrumbsProps> = (props) => {
  return (
    <MuiBreadCrumbs
      {...props}
      sx={{
        "*": {
          fontSize: (t) => t.typography.h5.fontSize,
          color: (t) => t.palette.grey[500],
          textDecoration: "none",

          "a:hover": {
            color: (t) => t.palette.grey[700],
          },

          "li:last-child": {
            "*": {
              color: (t) => t.palette.text.primary,
            },
          },
        },
      }}
    />
  );
};

export default memo(ContainerBreadCrumbs);
