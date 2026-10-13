import { IPutTeamRequest } from "../../../api/endpoints/teams";

export type IntegrationKey = Exclude<keyof IPutTeamRequest, "displayName">;

interface IntegrationField {
  key: IntegrationKey;
  label: string;
  description: string;
  placeholder: string;
}

const alertDescription = (service: string) =>
  `Incoming ${service} Webhook URL to receive instant alerts when a monitor or heartbeat goes down.`;

export const INTEGRATION_FIELDS: IntegrationField[] = [
  {
    key: "slackWebhookUrl",
    label: "Slack Webhook URL",
    description: alertDescription("Slack"),
    placeholder: "https://hooks.slack.com/services/…",
  },
  {
    key: "discordWebhookUrl",
    label: "Discord Webhook URL",
    description: alertDescription("Discord"),
    placeholder: "https://discord.com/api/webhooks/…",
  },
  {
    key: "telegramChatId",
    label: "Telegram Chat ID",
    description:
      "Telegram Chat ID to receive instant alerts when a monitor or heartbeat goes down.",
    placeholder: "-1001234567890",
  },
  {
    key: "datadogWebhookUrl",
    label: "Datadog Webhook URL",
    description: alertDescription("Datadog"),
    placeholder: "https://…",
  },
  {
    key: "newRelicWebhookUrl",
    label: "New Relic Webhook URL",
    description: alertDescription("New Relic"),
    placeholder: "https://…",
  },
  {
    key: "microsoftTeamsWebhookUrl",
    label: "Microsoft Teams Webhook URL",
    description: alertDescription("Microsoft Teams"),
    placeholder: "https://…webhook.office.com/…",
  },
  {
    key: "webhookUrl",
    label: "Generic Webhook URL",
    description:
      "Receive instant JSON payloads when a monitor or heartbeat goes down.",
    placeholder: "https://example.com/webhook",
  },
];
