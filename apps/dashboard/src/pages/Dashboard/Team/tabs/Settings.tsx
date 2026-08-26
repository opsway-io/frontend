import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import {
  CategoryList,
  CategoryListItem,
} from "../../../../components/CategoryList";
import EditableInput from "../../../../components/EditableInput";
import { Restrict, Role } from "../../../../components/Restrict";
import {
  useCurrentTeam,
  useMutateCurrentTeam,
} from "../../../../hooks/team.query";
import DeleteTeamDialog from "../components/DeleteTeamDialog";

const TeamSettingsTabView: FunctionComponent = () => {
  const { data: team, isLoading } = useCurrentTeam();
  const { mutate } = useMutateCurrentTeam();

  const [displayName, setDisplayName] = useState<string>("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string>("");
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState<string>("");
  const [telegramChatId, setTelegramChatId] = useState<string>("");
  const [datadogWebhookUrl, setDatadogWebhookUrl] = useState<string>("");
  const [newRelicWebhookUrl, setNewRelicWebhookUrl] = useState<string>("");
  const [microsoftTeamsWebhookUrl, setMicrosoftTeamsWebhookUrl] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    setDisplayName(team?.displayName ?? "");
    setSlackWebhookUrl(team?.slackWebhookUrl ?? "");
    setDiscordWebhookUrl(team?.discordWebhookUrl ?? "");
    setTelegramChatId(team?.telegramChatId ?? "");
    setDatadogWebhookUrl(team?.datadogWebhookUrl ?? "");
    setNewRelicWebhookUrl(team?.newRelicWebhookUrl ?? "");
    setMicrosoftTeamsWebhookUrl(team?.microsoftTeamsWebhookUrl ?? "");
    setWebhookUrl(team?.webhookUrl ?? "");
  }, [team]);

  const handleSave = () => {
    if (displayName == null) {
      return;
    }

    mutate({
      displayName: displayName,
      slackWebhookUrl: slackWebhookUrl || undefined,
      discordWebhookUrl: discordWebhookUrl || undefined,
      telegramChatId: telegramChatId || undefined,
      datadogWebhookUrl: datadogWebhookUrl || undefined,
      newRelicWebhookUrl: newRelicWebhookUrl || undefined,
      microsoftTeamsWebhookUrl: microsoftTeamsWebhookUrl || undefined,
      webhookUrl: webhookUrl || undefined,
    });
  };

  return (
    <>
      <Card>
        <CardContent>
          <CategoryList>
            <CategoryListItem
              title="Team name"
              description="The team slug cannot be changed and is used in URL's. The team display name is the actual name of the team visible to users."
            >
              <TextField label="Team slug" value={team?.name} disabled />

              <EditableInput
                label="Display name"
                value={displayName}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </CategoryListItem>
            <CategoryListItem
              title="Slack Notifications"
              description="Configure an incoming Slack Webhook URL to receive instant alerts when a monitor or heartbeat goes down."
            >
              <EditableInput
                label="Slack Webhook URL"
                value={slackWebhookUrl}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setSlackWebhookUrl(e.target.value)}
              />
            </CategoryListItem>
            <CategoryListItem
              title="Discord Notifications"
              description="Configure an incoming Discord Webhook URL to receive instant alerts when a monitor or heartbeat goes down."
            >
              <EditableInput
                label="Discord Webhook URL"
                value={discordWebhookUrl}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setDiscordWebhookUrl(e.target.value)}
              />
            </CategoryListItem>
            <CategoryListItem
              title="Telegram Notifications"
              description="Configure a Telegram Chat ID to receive instant alerts when a monitor or heartbeat goes down."
            >
              <EditableInput
                label="Telegram Chat ID"
                value={telegramChatId}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setTelegramChatId(e.target.value)}
              />
            </CategoryListItem>
            <CategoryListItem
              title="Datadog Notifications"
              description="Configure an incoming Datadog Webhook URL to receive instant alerts when a monitor or heartbeat goes down."
            >
              <EditableInput
                label="Datadog Webhook URL"
                value={datadogWebhookUrl}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setDatadogWebhookUrl(e.target.value)}
              />
            </CategoryListItem>
            <CategoryListItem
              title="New Relic Notifications"
              description="Configure an incoming New Relic Webhook URL to receive instant alerts when a monitor or heartbeat goes down."
            >
              <EditableInput
                label="New Relic Webhook URL"
                value={newRelicWebhookUrl}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setNewRelicWebhookUrl(e.target.value)}
              />
            </CategoryListItem>
            <CategoryListItem
              title="Microsoft Teams Notifications"
              description="Configure an incoming Microsoft Teams Webhook URL to receive instant alerts when a monitor or heartbeat goes down."
            >
              <EditableInput
                label="Microsoft Teams Webhook URL"
                value={microsoftTeamsWebhookUrl}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setMicrosoftTeamsWebhookUrl(e.target.value)}
              />
            </CategoryListItem>
            <CategoryListItem
              title="Generic Webhook Notifications"
              description="Configure a generic Webhook URL to receive instant JSON payloads when a monitor or heartbeat goes down."
            >
              <EditableInput
                label="Webhook URL"
                value={webhookUrl}
                disabled={isLoading}
                onSave={handleSave}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </CategoryListItem>
          </CategoryList>
        </CardContent>
      </Card>

      <Restrict specific={Role.OWNER}>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }} color="text.secondary">
          Danger zone
        </Typography>

        <Card>
          <CardContent>
            <CategoryList>
              <CategoryListItem
                title="Delete team"
                description="This action cannot be undone. All data will be lost."
              >
                <Typography variant="body2" color="textSecondary">
                  Deleting a team will remove all data associated with it. This
                  action cannot be undone. All data associated with this team
                  will be lost.
                </Typography>

                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete team
                  </Button>
                </Box>
              </CategoryListItem>
            </CategoryList>
          </CardContent>
        </Card>
      </Restrict>

      {team && (
        <DeleteTeamDialog
          team={team}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
};

export default TeamSettingsTabView;
