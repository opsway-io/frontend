import {
  IGetTeamResponse,
  IPutTeamRequest,
} from "../../../api/endpoints/teams";

/**
 * PUT /teams/:id replaces every setting, so each save starts from the team's
 * current values and only overrides the fields of the section being saved.
 */
export const toTeamUpdateRequest = (
  team: IGetTeamResponse,
  changes: Partial<IPutTeamRequest>,
): IPutTeamRequest => ({
  displayName: team.displayName ?? "",
  slackWebhookUrl: team.slackWebhookUrl,
  discordWebhookUrl: team.discordWebhookUrl,
  telegramChatId: team.telegramChatId,
  datadogWebhookUrl: team.datadogWebhookUrl,
  newRelicWebhookUrl: team.newRelicWebhookUrl,
  microsoftTeamsWebhookUrl: team.microsoftTeamsWebhookUrl,
  webhookUrl: team.webhookUrl,
  ...changes,
});
