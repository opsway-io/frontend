import { Box, Card, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { IHeartbeat } from "../../../../api/endpoints/heartbeats";
import HeartbeatStatusChip from "./HeartbeatStatusChip";

interface HeartbeatListItemProps {
  heartbeat: IHeartbeat;
}

const HeartbeatListItem: FunctionComponent<HeartbeatListItemProps> = ({
  heartbeat,
}) => (
  <Card
    component={Link}
    to={`${heartbeat.id}`}
    sx={{
      textDecoration: "none",
      transition: "background-color 120ms, border-color 120ms",
      "&:hover": {
        bgcolor: "background.level1",
        borderColor: "neutral.outlinedBorder",
      },
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography level="title-md" textColor="text.primary">
          {heartbeat.name}
        </Typography>
        <Typography level="body-sm" textColor="text.secondary">
          Interval: {heartbeat.interval}m · Grace: {heartbeat.grace}m
        </Typography>
      </Box>
      <Stack alignItems="flex-end" spacing={0.75}>
        <HeartbeatStatusChip status={heartbeat.status} />
        <Typography level="body-xs" textColor="text.tertiary">
          Last ping:{" "}
          {heartbeat.lastPing ? moment(heartbeat.lastPing).fromNow() : "Never"}
        </Typography>
      </Stack>
    </Stack>
  </Card>
);

export default HeartbeatListItem;
