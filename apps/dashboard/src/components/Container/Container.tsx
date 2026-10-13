import { Alert, Box, Stack, Typography, styled } from "@mui/joy";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FunctionComponent, memo } from "react";
import Conditional from "../Conditional/Conditional";
import ContainerBreadcrumbs from "./ContainerBreadcrumbs";
import ContainerHeader from "./ContainerHeader";
import ContainerSkeleton from "./ContainerSkeleton";

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
  gap: theme.spacing(2),
  width: "100%",
  minWidth: 0,

  padding: theme.spacing(3),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },

  maxWidth: "1600px",

  marginLeft: "auto",
  marginRight: "auto",

  height: "fit-content",

  "& > *": {
    flexShrink: 0,
    minWidth: 0,
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
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack spacing={1} flex="1" minWidth={240}>
          <Conditional value={props.header && !props.error}>
            {typeof props.header === "string" && (
              <ContainerHeader>{props.header}</ContainerHeader>
            )}
            {typeof props.header !== "string" && props.header}
          </Conditional>

          <Conditional
            value={!props.header && props.breadcrumbs && !props.error}
          >
            <ContainerBreadcrumbs>
              {props.breadcrumbs?.map((breadcrumb, index) => {
                return <span key={index}>{breadcrumb}</span>;
              })}
            </ContainerBreadcrumbs>
          </Conditional>

          <Conditional value={props.description}>
            <Typography
              level="body-md"
              textColor="text.secondary"
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
            <Stack direction="row" alignItems="center" spacing={1} pt={1}>
              {props.primaryActions?.map((action, index) => {
                return <span key={index}>{action}</span>;
              })}
            </Stack>
          </Conditional>

          <Conditional value={props.loading}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                "@keyframes containerFadeIn": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
                animation: "containerFadeIn 200ms ease-out 500ms both",
              }}
            >
              {props.skeleton ? props.skeleton : <ContainerSkeleton />}
            </Box>
          </Conditional>

          <Conditional value={!props.loading && props.error}>
            <Alert
              color="danger"
              variant="soft"
              startDecorator={<IoAlertCircleOutline size={20} />}
              sx={{ alignItems: "flex-start" }}
            >
              <div>
                <Typography level="title-sm" color="danger">
                  An error occurred
                </Typography>
                <Typography level="body-sm" color="danger">
                  {props.error + ""}
                </Typography>
              </div>
            </Alert>
          </Conditional>
        </Stack>

        <Conditional
          value={props.secondaryActions && !props.loading && !props.error}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
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
