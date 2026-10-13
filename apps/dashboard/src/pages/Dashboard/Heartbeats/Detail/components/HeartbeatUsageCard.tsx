import { Box, Card, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IHeartbeat } from "../../../../../api/endpoints/heartbeats";
import CodeSnippet from "../../../../../components/CodeSnippet/CodeSnippet";
import env from "../../../../../env";
import useAuthenticationStore from "../../../../../hooks/authentication.store";

interface HeartbeatUsageCardProps {
  heartbeat: IHeartbeat;
}

/** Explains how to ping the heartbeat (the ping endpoint needs no auth). */
const HeartbeatUsageCard: FunctionComponent<HeartbeatUsageCardProps> = ({
  heartbeat,
}) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const apiBaseUrl = env.API_BASE_URL || window.location.origin;
  const curlCommand = `curl -X POST ${apiBaseUrl}/v1/teams/${teamId}/heartbeats/${heartbeat.id}/ping`;

  return (
    <Card>
      <Box>
        <Typography level="title-md">How to use</Typography>
        <Typography level="body-sm" textColor="text.secondary">
          Send a POST (or GET) request to this endpoint every{" "}
          {heartbeat.interval} minutes to keep the heartbeat UP.
        </Typography>
      </Box>
      <CodeSnippet code={curlCommand} copyMessage="Copied curl command" />
    </Card>
  );
};

export default HeartbeatUsageCard;
