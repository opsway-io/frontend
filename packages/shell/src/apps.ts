export type OpswayAppId =
  | "hub"
  | "agents"
  | "monitoring"
  | "logs"
  | "pantomath"
  | "website"
  | "billing";

export interface SuiteAppMeta {
  id: OpswayAppId;
  name: string;
  shortName: string;
  desc: string;
  accentColor: string;
  url: string;
  guideUrl: string;
}

export const SUITE_APPS: SuiteAppMeta[] = [
  {
    id: "hub",
    name: "Opsway Hub",
    shortName: "Hub",
    desc: "Platform Overview & Administration",
    accentColor: "#6ba0c2",
    url: "https://my.opsway.eu",
    guideUrl: "https://my.opsway.eu/info/hub",
  },
  {
    id: "agents",
    name: "Autonomous Agents",
    shortName: "Agents",
    desc: "AI SRE, Incident RCA & MCP Gateway",
    accentColor: "#a871b7",
    url: "https://my.opsway.eu/agents",
    guideUrl: "https://my.opsway.eu/info/agents",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    shortName: "Monitoring",
    desc: "Uptime, Probes, Incidents & Status Pages",
    accentColor: "#79ab5d",
    url: "https://monitoring.opsway.eu",
    guideUrl: "https://monitoring.opsway.eu/info",
  },
  {
    id: "logs",
    name: "Log Search",
    shortName: "Log Search",
    desc: "Semantic & SQL Log Explorer",
    accentColor: "#5185a5",
    url: "https://logs.opsway.eu",
    guideUrl: "https://logs.opsway.eu/info",
  },
  {
    id: "pantomath",
    name: "Agent Context",
    shortName: "Agent Context",
    desc: "Product, Code & Infra Context for AI Agents",
    accentColor: "#2dd4bf",
    url: "https://agent-context.opsway.eu",
    guideUrl: "https://agent-context.opsway.eu/info",
  },
  {
    id: "website",
    name: "Opsway Suite Home",
    shortName: "Website",
    desc: "Umbrella Platform Portal",
    accentColor: "#f4ac45",
    url: "https://opsway.eu",
    guideUrl: "https://my.opsway.eu/info",
  },
  {
    id: "billing",
    name: "Suite Billing",
    shortName: "Billing",
    desc: "Manage Modular Products",
    accentColor: "#d5d9e0",
    url: "https://my.opsway.eu/settings/billing",
    guideUrl: "https://my.opsway.eu/info/hub",
  },
];

export function getAppMeta(id: OpswayAppId): SuiteAppMeta {
  return SUITE_APPS.find((app) => app.id === id) ?? SUITE_APPS[0];
}
