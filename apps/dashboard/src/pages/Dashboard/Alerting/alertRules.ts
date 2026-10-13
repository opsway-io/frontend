import {
  IAlertRule,
  IPostAlertRuleRequest,
} from "../../../api/endpoints/alerting";

export const CHANNEL_OPTIONS = [
  "email",
  "slack",
  "microsoft_teams",
  "webhook",
  "discord",
  "telegram",
  "sms",
  "voice",
  "datadog",
  "new_relic",
];

export const CONDITION_OPTIONS = [
  { label: "Any Incident (*)", value: "*" },
  { label: "Status Code Failure", value: "STATUS_CODE" },
  { label: "Response Time Degradation", value: "RESPONSE_TIME" },
  { label: "Raw Body Mismatch", value: "RAW_BODY" },
  { label: "JSON Body Mismatch", value: "JSON_BODY" },
  { label: "Header Mismatch", value: "HEADERS" },
  { label: "TLS Error", value: "TLS" },
  { label: "SSL Certificate Expiry", value: "SSL/TLS Cert Expiry" },
  { label: "Anomaly Detected", value: "Anomaly Detected" },
  { label: "Target Down", value: "Target Down" },
];

export interface AlertRuleFormValues {
  name: string;
  condition: string;
  channels: string[];
  enabled: boolean;
}

/**
 * Channels are stored as a JSON array string; older rules may use a
 * comma separated list.
 */
export const parseChannels = (channels: string): string[] => {
  try {
    const parsed = JSON.parse(channels);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON, fall back to the comma separated format.
  }

  return channels
    .split(",")
    .map((channel) => channel.trim())
    .filter(Boolean);
};

export const toAlertRuleFormValues = (
  rule: IAlertRule,
): AlertRuleFormValues => ({
  name: rule.name,
  condition: rule.condition,
  channels: parseChannels(rule.channels),
  enabled: rule.enabled,
});

export const toAlertRuleRequest = (
  values: AlertRuleFormValues,
): IPostAlertRuleRequest => ({
  ...values,
  channels: JSON.stringify(values.channels),
});
