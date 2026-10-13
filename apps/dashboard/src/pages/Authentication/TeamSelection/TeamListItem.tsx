import {
  Box,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { IoChevronForward } from "react-icons/io5";
import Avatar from "../../../components/Avatar/Avatar";

interface TeamListItemProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  icon?: ReactNode;
  muted?: boolean;
  onClick?: () => void;
}

const TeamListItem: FunctionComponent<TeamListItemProps> = (props) => {
  return (
    <ListItem>
      <ListItemButton
        variant="outlined"
        color="neutral"
        onClick={props.onClick}
        sx={{
          gap: 1.5,
          py: 1.25,
          px: 1.5,
          borderRadius: "md",
          borderColor: "divider",
          borderStyle: props.muted ? "dashed" : "solid",
          "& .chevron": { opacity: 0, transition: "opacity 120ms" },
          "&:hover .chevron": { opacity: 1 },
        }}
      >
        <ListItemDecorator sx={{ minInlineSize: 0 }}>
          {props.icon ? (
            <Avatar size="md" variant="soft">
              {props.icon}
            </Avatar>
          ) : (
            <Avatar size="md" name={props.name} src={props.avatarUrl} />
          )}
        </ListItemDecorator>
        <ListItemContent>
          <Typography
            level="title-sm"
            textColor={props.muted ? "text.secondary" : "text.primary"}
            noWrap
          >
            {props.name}
          </Typography>
          {props.role && (
            <Typography
              level="body-xs"
              textColor="text.tertiary"
              sx={{ textTransform: "capitalize" }}
            >
              {props.role.toLowerCase()}
            </Typography>
          )}
        </ListItemContent>
        <Box
          component={IoChevronForward}
          className="chevron"
          sx={{ color: "text.tertiary", flexShrink: 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default TeamListItem;
