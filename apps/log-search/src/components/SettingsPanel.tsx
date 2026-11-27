"use client";

import React, { useCallback, useEffect, useState } from "react";
import { OPSWAY_API_URL, resolveOpswaySession } from "../lib/opswayApi";
import { BillingPanel } from "./BillingPanel";

export type SettingsTabId =
  | "general"
  | "integrations"
  | "api-keys"
  | "ai-agent"
  | "billing";

interface SettingsPanelProps {
  activeTab: SettingsTabId;
  onSelectTab: (tab: SettingsTabId) => void;
}

interface TeamDetails {
  id: number;
  name: string;
  displayName?: string;
  slackWebhookUrl?: string | null;
  discordWebhookUrl?: string | null;
  webhookUrl?: string | null;
}

interface ApiKeyItem {
  id: number;
  name: string;
  prefix?: string;
  createdAt?: string;
}

interface AgentConfigData {
  enabled: boolean;
  executionMode: string;
  remediationLevel: string;
  autoTriggerOnLogSpike: boolean;
}

const SETTINGS_TABS: { id: SettingsTabId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "integrations", label: "Integrations" },
  { id: "api-keys", label: "API Keys" },
  { id: "ai-agent", label: "AI Agent" },
  { id: "billing", label: "Usage & Billing" },
];

export function SettingsPanel({ activeTab, onSelectTab }: SettingsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [genericWebhook, setGenericWebhook] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);
  const [agentConfig, setAgentConfig] = useState<AgentConfigData | null>(null);

  const fetchSettings = useCallback(async () => {
    const session = await resolveOpswaySession();
    if (!session.authenticated || !session.teamId) {
      return {
        error: session.error,
        teamId: null as number | null,
        team: null as TeamDetails | null,
        apiKeys: [] as ApiKeyItem[],
        agentConfig: null as AgentConfigData | null,
      };
    }

    const [teamRes, keysRes, agentRes] = await Promise.all([
      fetch(`${OPSWAY_API_URL}/v1/teams/${session.teamId}`, {
        credentials: "include",
      }),
      fetch(`${OPSWAY_API_URL}/v1/teams/${session.teamId}/api-keys`, {
        credentials: "include",
      }),
      fetch(`${OPSWAY_API_URL}/v1/teams/${session.teamId}/agent-config`, {
        credentials: "include",
      }),
    ]);

    const teamJson = teamRes.ok ? ((await teamRes.json()) as TeamDetails) : null;
    const keysJson = keysRes.ok ? await keysRes.json() : {};
    const agentJson = agentRes.ok
      ? ((await agentRes.json()) as AgentConfigData)
      : null;

    return {
      error: null as string | null,
      teamId: session.teamId,
      team: teamJson,
      apiKeys: (keysJson?.apiKeys ?? keysJson ?? []) as ApiKeyItem[],
      agentConfig: agentJson,
    };
  }, []);

  const applyResult = useCallback(
    (res: Awaited<ReturnType<typeof fetchSettings>>) => {
      setError(res.error);
      setTeamId(res.teamId);
      setTeam(res.team);
      setDisplayName(res.team?.displayName || res.team?.name || "");
      setSlackWebhook(res.team?.slackWebhookUrl || "");
      setDiscordWebhook(res.team?.discordWebhookUrl || "");
      setGenericWebhook(res.team?.webhookUrl || "");
      setApiKeys(Array.isArray(res.apiKeys) ? res.apiKeys : []);
      setAgentConfig(res.agentConfig);
    },
    [],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      applyResult(await fetchSettings());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load team settings.",
      );
    } finally {
      setLoading(false);
    }
  }, [applyResult, fetchSettings]);

  useEffect(() => {
    if (activeTab === "billing") return;
    let cancelled = false;
    fetchSettings()
      .then((res) => {
        if (!cancelled) applyResult(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load team settings.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, applyResult, fetchSettings]);

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const res = await fetch(`${OPSWAY_API_URL}/v1/teams/${teamId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          slackWebhookUrl: slackWebhook.trim() || null,
          discordWebhookUrl: discordWebhook.trim() || null,
          webhookUrl: genericWebhook.trim() || null,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update settings (${res.status})`);
      }
      setNotice("Team settings saved.");
      await reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !newKeyName.trim()) return;
    setSaving(true);
    setNotice(null);
    setError(null);
    setCreatedKeySecret(null);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/api-keys`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newKeyName.trim() }),
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to create API key (${res.status})`);
      }
      const data = await res.json();
      setCreatedKeySecret(data?.key || data?.token || null);
      setNewKeyName("");
      setNotice("API key created.");
      await reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create API key.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApiKey = async (keyId: number) => {
    if (!teamId) return;
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/api-keys/${keyId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to delete API key (${res.status})`);
      }
      setNotice("API key revoked.");
      await reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete API key.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAgent = async () => {
    if (!teamId || !agentConfig) return;
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/agent-config`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agentConfig),
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to save AI Agent settings (${res.status})`);
      }
      setNotice("AI Agent settings saved.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save AI Agent settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Canonical Settings Header & Top Selection Bar (identical across all product sub-sites) */}
      <div>
        <h1 className="m-0 text-2xl font-semibold text-[#e7e9ee]">Settings</h1>
        <p className="mt-1 mb-0 text-sm text-[#a3aab7]">
          Manage your team&apos;s profile, integrations, API keys and billing.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-white/[0.08] overflow-x-auto">
        {SETTINGS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                isActive
                  ? "border-[#5185a5] text-[#e7e9ee]"
                  : "border-transparent text-[#a3aab7] hover:text-[#e7e9ee]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "billing" ? (
        <BillingPanel hideSettingsChrome />
      ) : loading ? (
        <div className="p-6 text-sm text-[#a3aab7]">Loading settings…</div>
      ) : error && !teamId ? (
        <div className="p-6 rounded-xl bg-[#1d2128] border border-white/[0.08] flex flex-col gap-3">
          <div className="text-sm text-[#fca5a5]">{error}</div>
          <a
            href="https://my.opsway.eu/login"
            className="self-start px-3 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold no-underline"
          >
            Sign in on Opsway Hub
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notice && (
            <div className="px-4 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              {notice}
            </div>
          )}
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {activeTab === "general" && (
            <form
              onSubmit={handleSaveTeam}
              className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-5 flex flex-col gap-4 max-w-2xl"
            >
              <div>
                <div className="text-sm font-semibold text-[#e7e9ee]">
                  Team Profile
                </div>
                <div className="text-xs text-[#7c8494] mt-0.5">
                  Workspace slug: <code>{team?.name}</code>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="settings-display-name"
                  className="text-xs text-[#a3aab7]"
                >
                  Display name
                </label>
                <input
                  id="settings-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-[#161920] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e7e9ee] outline-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "integrations" && (
            <form
              onSubmit={handleSaveTeam}
              className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-5 flex flex-col gap-4 max-w-2xl"
            >
              <div>
                <div className="text-sm font-semibold text-[#e7e9ee]">
                  Webhook &amp; Notification Integrations
                </div>
                <div className="text-xs text-[#7c8494] mt-0.5">
                  Configure outbound webhooks shared across Log Search alerts
                  and Opsway incidents.
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="settings-slack-webhook"
                  className="text-xs text-[#a3aab7]"
                >
                  Slack Webhook URL
                </label>
                <input
                  id="settings-slack-webhook"
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="bg-[#161920] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e7e9ee] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="settings-discord-webhook"
                  className="text-xs text-[#a3aab7]"
                >
                  Discord Webhook URL
                </label>
                <input
                  id="settings-discord-webhook"
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  className="bg-[#161920] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e7e9ee] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="settings-generic-webhook"
                  className="text-xs text-[#a3aab7]"
                >
                  Generic Webhook URL
                </label>
                <input
                  id="settings-generic-webhook"
                  type="url"
                  placeholder="https://example.com/webhook"
                  value={genericWebhook}
                  onChange={(e) => setGenericWebhook(e.target.value)}
                  className="bg-[#161920] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e7e9ee] outline-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Integrations"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "api-keys" && (
            <div className="flex flex-col gap-4 max-w-3xl">
              <form
                onSubmit={handleCreateApiKey}
                className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-4 flex flex-wrap items-end gap-3"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
                  <label
                    htmlFor="settings-new-apikey"
                    className="text-xs text-[#a3aab7]"
                  >
                    Create API key (used for Log Search ingestion &amp; MCP)
                  </label>
                  <input
                    id="settings-new-apikey"
                    type="text"
                    required
                    placeholder="e.g. prod-log-shipper"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-[#161920] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e7e9ee] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Creating…" : "Create Key"}
                </button>
              </form>

              {createdKeySecret && (
                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/35 text-xs text-amber-200">
                  <div className="font-semibold">
                    Copy your new API key now — it will not be shown again:
                  </div>
                  <code className="block mt-2 p-2 rounded bg-[#14171c] text-[#e7e9ee] break-all">
                    {createdKeySecret}
                  </code>
                </div>
              )}

              <div className="rounded-xl bg-[#1d2128] border border-white/[0.09] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[#7c8494]">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Prefix</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 px-4 text-center text-[#7c8494]"
                        >
                          No API keys created yet.
                        </td>
                      </tr>
                    ) : (
                      apiKeys.map((k) => (
                        <tr
                          key={k.id}
                          className="border-b border-white/[0.05] text-[#e7e9ee]"
                        >
                          <td className="py-3 px-4 font-medium">{k.name}</td>
                          <td className="py-3 px-4 text-[#a3aab7]">
                            <code>{k.prefix || "opsway_…"}</code>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => handleDeleteApiKey(k.id)}
                              className="px-2.5 py-1 rounded-md border border-red-500/30 text-red-300 text-[11px] bg-transparent cursor-pointer hover:bg-red-500/10"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "ai-agent" && (
            <div className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-5 flex flex-col gap-4 max-w-2xl">
              <div>
                <div className="text-sm font-semibold text-[#e7e9ee]">
                  Autonomous AI Agent &amp; Log-Spike Triggers
                </div>
                <div className="text-xs text-[#7c8494] mt-0.5">
                  Control whether Log Search error spikes automatically trigger
                  AI root-cause investigations.
                </div>
              </div>
              {agentConfig ? (
                <>
                  <label className="inline-flex items-center gap-2.5 text-xs text-[#e7e9ee] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agentConfig.enabled}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          enabled: e.target.checked,
                        })
                      }
                      className="accent-[#5185a5]"
                    />
                    <span>Enable Autonomous AI Agent for this team</span>
                  </label>
                  <label className="inline-flex items-center gap-2.5 text-xs text-[#e7e9ee] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agentConfig.autoTriggerOnLogSpike}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          autoTriggerOnLogSpike: e.target.checked,
                        })
                      }
                      className="accent-[#5185a5]"
                    />
                    <span>Auto-trigger investigation on Log Search spikes</span>
                  </label>
                  <div>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSaveAgent}
                      className="px-4 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save AI Agent Settings"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-xs text-[#7c8494]">
                  AI Agent configuration is unavailable for this team.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
