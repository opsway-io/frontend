import {
  Alert,
  AlertTitle,
  Box,
  Fade,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { FunctionComponent, memo } from "react";
import Conditional from "../Conditional";
import DelayedVisibility from "../DelayedVisibility";
import ContainerBreadCrumbs from "./breadcrumbs";
import ContainerHeader from "./header";
import ContainerSkeleton from "./skeleton";

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[];

  header?: React.ReactNode;
  description?: string;

  breadcrumbs?: React.ReactNode[] | React.ReactNode[][];
  primaryActions?: React.ReactNode[];
  secondaryActions?: React.ReactNode[];

  hideHeader?: boolean;

  skeleton?: React.ReactNode | React.ReactNode[];

  loading?: boolean;
  error?: unknown;
}

const ContainerStyle = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),

  padding: theme.spacing(2),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),

  maxWidth: "1600px",

  marginLeft: "auto",
  marginRight: "auto",

  height: "fit-content",

  "& > *": {
    flexShrink: 0,
  },
}));

const Container: FunctionComponent<ContainerProps> = (props) => {
  return (
    <ContainerStyle>
      <Box
        sx={{
          display: props.hideHeader ? "none" : "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Stack spacing={1} flex="1">
          <Conditional value={props.header && !props.error}>
            {typeof props.header === "string" && (
              <ContainerHeader>{props.header}</ContainerHeader>
            )}
            {typeof props.header !== "string" && props.header}
          </Conditional>

          <Conditional
            value={!props.header && props.breadcrumbs && !props.error}
          >
            <ContainerBreadCrumbs>
              {props.breadcrumbs?.map((breadcrumb, index) => {
                return <span key={index}>{breadcrumb}</span>;
              })}
            </ContainerBreadCrumbs>
          </Conditional>

          <Conditional value={props.description}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                marginTop: "0 !important",
              }}
            >
              {props.description}
            </Typography>
          </Conditional>

          <Conditional
            value={props.primaryActions && !props.loading && !props.error}
          >
            <Stack direction="row" alignItems="left" spacing={2}>
              {props.primaryActions?.map((action, index) => {
                return <span key={index}>{action}</span>;
              })}
            </Stack>
          </Conditional>

          <Conditional value={props.loading}>
            <Fade in={true} style={{ transitionDelay: "500ms" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: (t) => t.spacing(1),
                }}
              >
                {props.skeleton ? props.skeleton : <ContainerSkeleton />}
              </Box>
            </Fade>
          </Conditional>

          <Conditional value={!props.loading && props.error}>
            <Alert severity="error">
              <>
                <AlertTitle>An error occurred</AlertTitle>
                <span>{props.error + ""}</span>
              </>
            </Alert>
          </Conditional>
        </Stack>

        <Conditional
          value={props.secondaryActions && !props.loading && !props.error}
        >
          <Stack direction="row" alignItems="left" spacing={2}>
            {props.secondaryActions?.map((action, index) => {
              return <span key={index}>{action}</span>;
            })}
          </Stack>
        </Conditional>
      </Box>

      <Conditional value={!props.loading && !props.error}>
        {props.children}
      </Conditional>
    </ContainerStyle>
  );
};

export default memo(Container);
