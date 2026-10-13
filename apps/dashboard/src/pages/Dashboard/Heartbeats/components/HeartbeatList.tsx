import { Card, Sheet, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { useHeartbeats } from "../../../../hooks/heartbeats.query";
import HeartbeatListItem from "./HeartbeatListItem";

const HeartbeatList: FunctionComponent = () => {
  const { data: heartbeats, isPending } = useHeartbeats();

  if (isPending) {
    return (
      <Card>
        <Placeholder />
      </Card>
    );
  }

  if (!heartbeats || heartbeats.length === 0) {
    return (
      <Sheet
        variant="outlined"
        sx={{ borderRadius: "lg", p: 4, borderStyle: "dashed" }}
      >
        <Typography
          level="body-sm"
          textColor="text.secondary"
          textAlign="center"
        >
          No heartbeats found. Create one to start monitoring background tasks.
        </Typography>
      </Sheet>
    );
  }

  return (
    <Stack spacing={1.5}>
      {heartbeats.map((heartbeat) => (
        <HeartbeatListItem key={heartbeat.id} heartbeat={heartbeat} />
      ))}
    </Stack>
  );
};

export default HeartbeatList;
