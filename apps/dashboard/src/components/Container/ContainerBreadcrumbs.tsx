import { Breadcrumbs, BreadcrumbsProps } from "@mui/joy";
import { FunctionComponent, memo } from "react";

const ContainerBreadcrumbs: FunctionComponent<BreadcrumbsProps> = (props) => {
  return (
    <Breadcrumbs
      size="lg"
      {...props}
      sx={{
        p: 0,
        "--Breadcrumbs-gap": "10px",
        fontSize: "var(--joy-fontSize-xl2)",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: "text.tertiary",

        "& a": {
          color: "text.tertiary",
          textDecoration: "none",
          transition: "color 120ms",
        },
        "& a:hover": {
          color: "text.primary",
        },
        "& li:last-of-type, & li:last-of-type *": {
          color: "text.primary",
        },
        ...props.sx,
      }}
    />
  );
};

export default memo(ContainerBreadcrumbs);
