import {
  alpha,
  Button,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../Avatar";
import useSidebarStore from "../../hooks/sidebar.store";

interface SidebarHeaderProps {
  name?: string;
  picture?: string;
  loading?: boolean;
  teamDisplayName?: string;
}

const SidebarHeader: FunctionComponent<SidebarHeaderProps> = (props) => {
  const { collapsed } = useSidebarStore();

  return (
    <Tooltip title={collapsed ? "Account" : ""} placement="right">
      <Button
        startIcon={
          collapsed ? null : <Avatar src={props.picture} name={props.name} />
        }
        sx={{
          justifyContent: collapsed ? "center" : "left",
          fontSize: (theme) => theme.typography.body1.fontSize,
          width: "100%",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          marginBottom: (t) => t.spacing(2),
          color: (t) => t.palette.text.primary,

          "&.active": {
            backgroundColor: (t) => t.palette.action.selected,
            fontWeight: 600,
          },
        }}
        component={NavLink}
        to="/account"
      >
        {collapsed && <Avatar src={props.picture} name={props.name} />}

        {!collapsed && (
          <Stack spacing={0} alignContent="center">
            {props.loading && (
              <>
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={12}
                  sx={{
                    marginBottom: (t) => t.spacing(0.5),
                  }}
                />
                <Skeleton variant="rectangular" width={80} height={12} />
              </>
            )}

            {!props.loading && (
              <>
                <Typography
                  variant="body1"
                  component="span"
                  lineHeight={1.2}
                  fontWeight={500}
                >
                  {props.name}
                </Typography>
                <Typography
                  variant="body1"
                  component="span"
                  color={(t) => alpha(t.palette.text.primary, 0.7)}
                  lineHeight={1.2}
                >
                  {props.teamDisplayName}
                </Typography>
              </>
            )}
          </Stack>
        )}
      </Button>
    </Tooltip>
  );
};

export default memo(SidebarHeader);
