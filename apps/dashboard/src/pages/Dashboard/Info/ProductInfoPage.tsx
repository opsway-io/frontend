import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Tab,
  Table,
  TabList,
  Tabs,
  Typography,
} from "@mui/joy";
import { FunctionComponent, ReactNode, useState } from "react";
import { Helmet } from "react-helmet";
import { GoBrowser } from "react-icons/go";
import {
  IoAppsOutline,
  IoArrowForward,
  IoBookOutline,
  IoCheckmarkCircle,
  IoCodeSlashOutline,
  IoCopyOutline,
  IoFlashOutline,
  IoHardwareChipOutline,
  IoHelpBuoyOutline,
  IoLayersOutline,
  IoLockOpenOutline,
  IoLogInOutline,
  IoPlayOutline,
  IoPulseOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { PiFireSimpleBold, PiTerminalWindowBold } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Container from "../../../components/Container/Container";
import useAuthenticationStore from "../../../hooks/authentication.store";
import PreformattedBlock from "../Incidents/Detail/components/PreformattedBlock";

export type ProductSlug = "hub" | "monitoring" | "logs" | "agents";

interface ScenarioItem {
  situation: string;
  whenToUse: string;
  recommendedAction: string;
  actionLabel: string;
  actionUrl: string;
  external?: boolean;
}

interface HowToStep {
  step: string;
  title: string;
  description: string;
  proTip: string;
  ctaLabel?: string;
  ctaUrl?: string;
  external?: boolean;
}

interface ProductInfoDefinition {
  id: ProductSlug;
  name: string;
  tagline: string;
  subdomain: string;
  subdomainUrl: string;
  accentColor: string;
  softBg: string;
  icon: ReactNode;
  summary: string;
  standaloneValue: string;
  suiteSynergy: string;
  keyCapabilities: Array<{
    title: string;
    description: string;
  }>;
  whenToUseSummary: string[];
  loggedInScenarios: ScenarioItem[];
  loggedInHowToSteps: HowToStep[];
  codeExampleTitle: string;
  codeExampleDescription: string;
  codeExample: string;
}

const PRODUCT_DEFINITIONS: Record<ProductSlug, ProductInfoDefinition> = {
  monitoring: {
    id: "monitoring",
    name: "Opsway Monitoring & Status Pages",
    tagline: "Multi-region synthetic probes, ML anomaly detection, heartbeats, alerting & public status pages",
    subdomain: "monitoring.opsway.eu",
    subdomainUrl: "https://monitoring.opsway.eu",
    accentColor: "#79ab5d",
    softBg: "rgba(121, 171, 93, 0.15)",
    icon: <IoPulseOutline size={26} />,
    summary:
      "Opsway Monitoring continuously verifies the reachability, latency breakdown (DNS, TCP, TLS, TTFB, Transfer), SSL certificate validity, and payload assertions of your HTTP APIs, web apps, and background jobs across distributed probe locations.",
    standaloneValue:
      "Works out-of-the-box as a complete uptime, incident management, on-call escalation, and public status page platform with zero agents required on your servers.",
    suiteSynergy:
      "When combined with Opsway Log Search and Autonomous Agents, every probe failure or latency anomaly automatically correlates microservice error logs and triggers an AI root-cause investigation.",
    keyCapabilities: [
      {
        title: "Multi-Location Synthetic Probes",
        description:
          "Executes HTTP/HTTPS checks with sub-millisecond phase timings (DNS lookup, TCP handshake, TLS handshake, server processing, content transfer) stored in ClickHouse.",
      },
      {
        title: "Forecaster ML Anomaly Detection",
        description:
          "Trains IsolationForest models on historical latency series to flag statistical latency regressions and brownouts before hard downtime occurs.",
      },
      {
        title: "Cron & Background Job Heartbeats",
        description:
          "Passive dead-man's-switch endpoints that alert your team when scheduled backups, ETL pipelines, or Kubernetes CronJobs fail to check in on time.",
      },
      {
        title: "Alert Rules & On-Call Escalations",
        description:
          "Route incidents to Email, Slack, PagerDuty, or custom webhooks with multi-step escalation policies if an incident remains unacknowledged.",
      },
      {
        title: "Public & Custom-Domain Status Pages",
        description:
          "Communicate real-time service health, historical 90-day uptime bars, scheduled maintenance windows, and incident updates to customers.",
      },
      {
        title: "SLA & Uptime Reporting",
        description:
          "Generate monthly and quarterly SLA compliance reports across monitors with exportable latency percentiles and incident MTTR metrics.",
      },
    ],
    whenToUseSummary: [
      "Verify customer-facing endpoints, REST/GraphQL APIs, and TLS certificates from outside your cluster.",
      "Detect silent latency degradations using ML confidence bands before endpoints return 5xx errors.",
      "Monitor scheduled cron jobs, database backups, and queue workers via inbound Heartbeat pings.",
      "Publish transparent uptime and maintenance status pages for your external users and stakeholders.",
    ],
    loggedInScenarios: [
      {
        situation: "Customer-facing API or checkout endpoint must stay < 300ms and return HTTP 200",
        whenToUse:
          "Use an Active HTTP Monitor with status code + JSON body assertions and 30s–60s check intervals.",
        recommendedAction:
          "Create a monitor with multi-region locations and enable status code assertion = 200.",
        actionLabel: "Create Monitor",
        actionUrl: "/monitors/create",
      },
      {
        situation: "API returns HTTP 200 OK, but p95 latency creeps up from 80ms to 950ms during peak traffic",
        whenToUse:
          "Use the Monitor Detail Latency & Forecaster Anomaly chart to inspect Upper/Lower ML bounds and identify which phase (DNS, TLS, or Server Processing) spiked.",
        recommendedAction:
          "Open your monitor's detail view and toggle the Anomaly Forecast overlay on the latency chart.",
        actionLabel: "View Monitors",
        actionUrl: "/monitors",
      },
      {
        situation: "Nightly PostgreSQL backup or billing cron job silently stops running without throwing an HTTP error",
        whenToUse:
          "Use a Heartbeat monitor instead of an outbound HTTP probe. Your job pings Opsway upon completion; if no ping arrives within the grace window, an incident opens.",
        recommendedAction:
          "Create a Heartbeat with your cron schedule interval and append a curl ping to your script.",
        actionLabel: "Manage Heartbeats",
        actionUrl: "/heartbeats",
      },
      {
        situation: "Planned database migration or Kubernetes upgrade will cause 5 minutes of expected downtime",
        whenToUse:
          "Schedule a Maintenance Window beforehand so probes pause alert pages and your Status Page shows 'Scheduled Maintenance' instead of 'Outage'.",
        recommendedAction:
          "Create a maintenance window linked to the affected monitors before starting your rollout.",
        actionLabel: "Schedule Maintenance",
        actionUrl: "/maintenance/create",
      },
      {
        situation: "Customers ask whether your platform is experiencing an issue or if the problem is on their side",
        whenToUse:
          "Use Status Pages (a built-in feature of Monitoring) to expose live component status and incident timelines on your own domain.",
        recommendedAction:
          "Create or customize a Status Page and attach your core production monitors.",
        actionLabel: "Open Status Pages",
        actionUrl: "/status-pages",
      },
    ],
    loggedInHowToSteps: [
      {
        step: "Step 1",
        title: "Create Your Core Endpoint Monitors",
        description:
          "Navigate to Monitors → Create Monitor. Enter your URL, select check frequency (e.g., 60s), choose probe regions, and add response assertions (e.g., Status Code == 200 or Header/Body contains expected key).",
        proTip:
          "Separate liveness endpoints (/healthz) from deep dependency endpoints (/readyz) so you can distinguish process crashes from database stalls.",
        ctaLabel: "Create Monitor",
        ctaUrl: "/monitors/create",
      },
      {
        step: "Step 2",
        title: "Link Monitors to Your Service Catalog",
        description:
          "Register the microservice in the Service Catalog and link its Monitor IDs and Log-Search service.name. This lets Opsway automatically jump from a failing monitor to the exact container logs.",
        proTip:
          "Consistent naming between your monitor and Service Catalog unlocks 1-click AI root-cause analysis on every incident.",
        ctaLabel: "Open Service Catalog",
        ctaUrl: "/services",
      },
      {
        step: "Step 3",
        title: "Configure Alerting Rules & Escalation Chains",
        description:
          "Go to Alerting to define who gets notified (Email, Slack, Webhook) when an incident is opened, acknowledged, or resolved, and configure escalation delays if unacknowledged.",
        proTip:
          "Route high-severity production monitors to immediate on-call channels, and staging monitors to low-priority Slack channels.",
        ctaLabel: "Configure Alerting",
        ctaUrl: "/alerting",
      },
      {
        step: "Step 4",
        title: "Publish a Public Status Page",
        description:
          "Go to Status Pages → Create Status Page. Group your monitors into logical customer-facing components (e.g., 'Core API', 'Dashboard', 'Webhooks') and optionally bind a custom CNAME domain.",
        proTip:
          "Use Changelogs alongside Status Pages to announce new releases and correlate deployments with uptime metrics.",
        ctaLabel: "Configure Status Pages",
        ctaUrl: "/status-pages",
      },
    ],
    codeExampleTitle: "Cron / Background Worker Heartbeat Ping Example",
    codeExampleDescription:
      "Add this snippet to the end of any cron job, GitHub Action, or Kubernetes CronJob to report healthy completion to Opsway Monitoring:",
    codeExample: `#!/usr/bin/env bash
set -euo pipefail

# 1. Run your backup or batch job
pg_dump "$DATABASE_URL" | gzip > /backups/db-$(date +%F).sql.gz

# 2. Ping Opsway Heartbeat endpoint only if the job succeeded
curl -fsS -m 10 --retry 3 \\
  -X POST "https://api.opsway.eu/v1/heartbeats/<YOUR_HEARTBEAT_ID>/ping" \\
  -H "Authorization: Bearer <YOUR_OPSWAY_API_KEY>"`,
  },

  logs: {
    id: "logs",
    name: "Opsway Log Search",
    tagline: "Sub-second ClickHouse SQL & Milvus vector semantic log exploration with live SSE tailing",
    subdomain: "logs.opsway.eu",
    subdomainUrl: "https://logs.opsway.eu",
    accentColor: "#5185a5",
    softBg: "rgba(81, 133, 165, 0.15)",
    icon: <PiTerminalWindowBold size={26} />,
    summary:
      "Opsway Log Search is a high-throughput observability engine combining ClickHouse columnar storage for sub-second structured SQL filtering with Milvus vector embeddings for natural-language semantic log search and anomaly clustering.",
    standaloneValue:
      "Deploy as a standalone centralized log management platform: ingest logs via OpenTelemetry, Vector, FluentBit, or direct HTTP JSON, and search millions of lines in milliseconds.",
    suiteSynergy:
      "Exposes a native FastMCP server (/mcp) consumed by Opsway Autonomous Agents and Monitoring Incident detail pages, turning raw stack traces into immediate root-cause explanations.",
    keyCapabilities: [
      {
        title: "Structured SQL & Keyword Filtering",
        description:
          "Filter logs using intuitive expressions like `level = 'ERROR' AND service = 'api'` or full-text substring matches across JSON attributes and stack traces.",
      },
      {
        title: "Milvus Vector Semantic Search",
        description:
          "Find conceptually related failures (e.g. 'database connection pool exhausted' or 'TLS certificate expired') even when exact log wording differs across services.",
      },
      {
        title: "Real-Time Live Tail (Server-Sent Events)",
        description:
          "Stream incoming logs in real time with zero polling overhead while deploying new releases, running load tests, or verifying a remediation rollout.",
      },
      {
        title: "Severity Distribution Histograms",
        description:
          "Visualize bucketed INFO, WARN, and ERROR volume over 15m, 1h, 24h, or 7d windows to spot exact error onset timestamps and cascading spikes.",
      },
      {
        title: "Saved Queries & Deep-Link Sharing",
        description:
          "Bookmark frequent diagnostic queries for your team and share URL deep-links (`?query=...&timeRange=1h`) directly inside incident tickets.",
      },
      {
        title: "Built-In FastMCP Server (`/mcp`)",
        description:
          "Exposes `get_error_summary`, `semantic_search`, `get_log_context`, and `search_logs` tools to AI agents and IDEs.",
      },
    ],
    whenToUseSummary: [
      "Debug 5xx errors, panics, and stack traces immediately after an alert or deployment.",
      "Correlate spikes in WARN/ERROR volume across multiple microservices using the severity histogram.",
      "Watch live container output during a production rollout or incident mitigation with Live Tail.",
      "Allow AI agents or IDE assistants (Claude, Cursor) to query error clusters automatically via MCP.",
    ],
    loggedInScenarios: [
      {
        situation: "An incident just fired on `monitoring.opsway.eu` and you need to see what the backend threw",
        whenToUse:
          "Use Structured Filtering by `service` and `level = 'ERROR'` over the last 15m–1h window.",
        recommendedAction:
          "Open Log Search pre-filtered to ERROR logs or click the deep-link inside the Incident Investigation card.",
        actionLabel: "Search Error Logs",
        actionUrl: "https://logs.opsway.eu/?query=level%20%3D%20%27ERROR%27&timeRange=1h",
        external: true,
      },
      {
        situation: "You see an intermittent slowdown or failure, but you don't know which microservice started failing first",
        whenToUse:
          "Switch to the Histogram Analytics view in Log Search to compare WARN/ERROR spikes across time buckets, then narrow down by clicking the service chips in the left rail.",
        recommendedAction:
          "Open Log Search and select the 'Histogram' view in the left navigation rail.",
        actionLabel: "Open Log Search",
        actionUrl: "https://logs.opsway.eu",
        external: true,
      },
      {
        situation: "You just applied a hotfix or restarted a Kubernetes deployment and want to verify clean startup",
        whenToUse:
          "Use 'Live Tail' mode in Log Search to stream new log events over SSE as they arrive from Vector/OTLP.",
        recommendedAction:
          "Click 'Live Tail' in the Log Search sidebar while filtering by your service name.",
        actionLabel: "Launch Live Tail",
        actionUrl: "https://logs.opsway.eu",
        external: true,
      },
      {
        situation: "You want your microservice logs to automatically appear in Incident AI Investigations",
        whenToUse:
          "Ensure your service's `service` attribute in Log Search matches the `Log-Search service.name` registered in the Opsway Service Catalog.",
        recommendedAction:
          "Map your microservice slug to its Log-Search service name in the Service Catalog.",
        actionLabel: "Map in Service Catalog",
        actionUrl: "/services",
      },
    ],
    loggedInHowToSteps: [
      {
        step: "Step 1",
        title: "Ship Logs via Vector, OpenTelemetry, or HTTP JSON",
        description:
          "Send structured JSON logs to `https://logs.opsway.eu/v1/logs` (or internal cluster service `http://log-search.log-search.svc.cluster.local:8080/v1/logs`) with `service`, `level`, `message`, and `timestamp` fields.",
        proTip:
          "Include `trace_id` or `request_id` in your JSON payload so you can reconstruct an entire distributed request across services.",
        ctaLabel: "Open Log Search UI",
        ctaUrl: "https://logs.opsway.eu",
        external: true,
      },
      {
        step: "Step 2",
        title: "Filter by Service Chips or SQL Expressions",
        description:
          "Click any service chip in the left rail (`api`, `prober`, `postgres`, `redis`, `forecaster`, `milvus`) to toggle `service = '<name>'`, or combine conditions in the query bar such as `service = 'api' AND level = 'ERROR'`.",
        proTip:
          "Click any log row in the table to expand the full raw JSON event attributes and stack trace.",
        ctaLabel: "Explore Logs Now",
        ctaUrl: "https://logs.opsway.eu",
        external: true,
      },
      {
        step: "Step 3",
        title: "Save Frequent Triage Queries",
        description:
          "Type a name in the 'Save current query' input and click the Save icon. Your query appears in the 'Saved Queries' dropdown for 1-click access during future incidents.",
        proTip:
          "Save baseline queries for each critical tier (e.g., 'Checkout 5xx Errors', 'Auth Token Failures', 'DB Pool Warnings').",
      },
      {
        step: "Step 4",
        title: "Correlate with Histogram & AI Agents",
        description:
          "Switch between 'Log Records' and 'Histogram' to inspect burst patterns, or let Opsway Autonomous Agents query `logs.get_error_summary` and `logs.semantic_search` automatically via `/v1/mcp`.",
        proTip:
          "You can also jump back to this guide anytime from `logs.opsway.eu` by clicking 'Product Info & Guide' in the left sidebar.",
        ctaLabel: "Open Log Search",
        ctaUrl: "https://logs.opsway.eu",
        external: true,
      },
    ],
    codeExampleTitle: "Direct HTTP Log Ingestion & Query Cheatsheet",
    codeExampleDescription:
      "Ingest structured application logs from any service or CI pipeline and query them with SQL-like filters:",
    codeExample: `# 1. Ingest structured logs via HTTP POST
curl -X POST "https://logs.opsway.eu/v1/logs" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_OPSWAY_API_KEY>" \\
  -d '[
    {
      "timestamp": 1730000000000,
      "level": "ERROR",
      "service": "checkout-service",
      "message": "pq: sorry, too many clients already (SQLSTATE 53300)",
      "trace_id": "tr_98a7bc12"
    }
  ]'

# 2. Example Log Search Query Expressions:
# • Exact service & severity:   service = 'checkout-service' AND level = 'ERROR'
# • Multiple severities:        level IN ('ERROR', 'WARN') AND service = 'api'
# • Substring / keyword match:  service = 'api' AND message LIKE '%timeout%'`,
  },

  agents: {
    id: "agents",
    name: "Autonomous SRE Agents & FastMCP Gateway",
    tagline: "Multi-step ReAct incident investigations, federated MCP tool execution & 1-click verified remediation",
    subdomain: "my.opsway.eu/agents",
    subdomainUrl: "https://my.opsway.eu/agents",
    accentColor: "#A871B7",
    softBg: "rgba(168, 113, 183, 0.15)",
    icon: <IoSparklesOutline size={26} />,
    summary:
      "Opsway Autonomous Agents act as an always-on AI SRE on-call engineer. When an incident triggers or an engineer requests a diagnosis, the agent executes a multi-step ReAct loop across Monitoring timings, Log Search error clusters, and Pantomath code graphs to pinpoint root causes and stage verified remediation actions.",
    standaloneValue:
      "Connect your own external AI agents (Claude Desktop, Cursor, Windsurf, LangGraph, CrewAI) to the Unified FastMCP Gateway (`/v1/mcp`), or run Opsway's turnkey Managed Agent with your own LLM keys.",
    suiteSynergy:
      "Unifies the entire Opsway ecosystem: correlates probe failures from Monitoring, stack traces from Log Search, and topology from the Service Catalog into a single executive root-cause report and 1-click fix.",
    keyCapabilities: [
      {
        title: "Automated Multi-Step ReAct Investigations",
        description:
          "Executes structured tool calls (`monitoring.get_monitor_check_timings`, `logs.get_error_summary`, `logs.semantic_search`, `pantomath.ask_codebase`) with full step-by-step latency and output audit trails.",
      },
      {
        title: "Three Flexible Execution Modes",
        description:
          "Choose between Opsway Managed Agent (turnkey), Bring Your Own Agent (outbound HMAC-signed webhook with ephemeral 1h MCP token), or Bring Your Own LLM API Key (OpenAI, Anthropic, Ollama).",
      },
      {
        title: "Configurable Remediation Autonomy",
        description:
          "Operate in Level 1 (Advisory Only), Level 2 (Human-in-the-Loop 1-Click Approval), or Level 3 (Autonomous Self-Healing with post-action probe verification).",
      },
      {
        title: "Unified FastMCP Gateway (`/v1/mcp`)",
        description:
          "Single JSON-RPC 2.0 / SSE Model Context Protocol endpoint federating tools across Monitoring, Log Search, and Code GraphRAG with team-scoped authentication.",
      },
      {
        title: "Gatekeeper Trigger Policies & Cooldowns",
        description:
          "Control exactly which events trigger an investigation (probe consensus failures, Forecaster anomalies, log error spikes) and enforce per-incident cooldown windows.",
      },
      {
        title: "Closed-Loop Remediation Verification",
        description:
          "After executing a remediation playbook (e.g. Kubernetes rollout restart), the agent dispatches an immediate verification probe to confirm HTTP 200 recovery.",
      },
    ],
    whenToUseSummary: [
      "Eliminate manual war-room triage by automatically gathering probe timings and error logs the second an alert fires.",
      "Stage safe, 1-click human-approved remediations (e.g., rolling restarts, connection pool drains) for on-call responders.",
      "Connect Claude Desktop, Cursor, or Windsurf to `/v1/mcp` to query live production logs and incidents while coding.",
      "Dispatch signed incident webhooks with ephemeral MCP tokens to your custom internal LangGraph or CrewAI bots.",
    ],
    loggedInScenarios: [
      {
        situation: "An incident is active right now and you want an immediate root-cause hypothesis and log correlation",
        whenToUse:
          "Use the Live Activity & Investigations view to select the incident and click 'Trigger Investigation' (optionally passing a custom focus prompt).",
        recommendedAction:
          "Open Autonomous Agents, select the target incident, and run an interactive ReAct investigation.",
        actionLabel: "Run Investigation",
        actionUrl: "/agents?tab=investigations",
      },
      {
        situation: "You want the agent to draft fixes (like K8s rollout restarts) but require an engineer to click 'Approve & Execute'",
        whenToUse:
          "Configure Agent Policies to 'Level 2: Supervised (Human Approval Required)' — recommended for production environments.",
        recommendedAction:
          "Open Agent Policies & Autonomy and select 'Supervised (Human Approval Required)'.",
        actionLabel: "Configure Autonomy Policy",
        actionUrl: "/agents?tab=policies",
      },
      {
        situation: "You already have an internal OpenAI/Anthropic enterprise key or a custom LangGraph SRE bot",
        whenToUse:
          "Switch Execution Provider Mode to 'Bring Your Own LLM (BYO_LLM)' or 'Bring Your Own Agent (BYOA_WEBHOOK)' so you don't consume managed investigation quota.",
        recommendedAction:
          "Configure your webhook URL/secret or LLM provider key in Agent Policies.",
        actionLabel: "Set Execution Mode",
        actionUrl: "/agents?tab=policies",
      },
      {
        situation: "You are debugging a bug in Cursor or Claude Desktop and want your IDE assistant to inspect live Opsway logs and incidents",
        whenToUse:
          "Use the Unified FastMCP Gateway (`/v1/mcp`) with a team API key from Platform Settings.",
        recommendedAction:
          "Copy the `claude_desktop_config.json` snippet from the MCP Gateway tab and generate an API key.",
        actionLabel: "Open MCP Gateway",
        actionUrl: "/agents?tab=gateway",
      },
    ],
    loggedInHowToSteps: [
      {
        step: "Step 1",
        title: "Choose Your Execution Mode & Autonomy Level",
        description:
          "Go to Autonomous Agents → Agent Policies & Autonomy. Select Managed Agent, BYOA Webhook, or BYO LLM, and choose whether the agent operates in Advisory, 1-Click Approval, or Full Autonomous mode.",
        proTip:
          "Start with 'Supervised (Human Approval Required)' so your team can review the agent's root-cause confidence and proposed command before execution.",
        ctaLabel: "Configure Policies",
        ctaUrl: "/agents?tab=policies",
      },
      {
        step: "Step 2",
        title: "Enable Automated Trigger Conditions",
        description:
          "Toggle which signals automatically launch an investigation: Probe Consensus Failure (3+ locations), Forecaster Latency Anomaly, or Log Error Rate Spike, and set a per-incident cooldown (e.g., 30 minutes).",
        proTip:
          "A 30-minute cooldown prevents duplicate agent runs during prolonged upstream outages.",
        ctaLabel: "Set Trigger Rules",
        ctaUrl: "/agents?tab=policies",
      },
      {
        step: "Step 3",
        title: "Inspect the ReAct Trace & Approve Remediation",
        description:
          "When an investigation completes, review the Executive Summary, Root Cause Analysis, Correlated Log Snippets, and each MCP tool step. If a remediation action is staged, click 'Approve & Execute'.",
        proTip:
          "You can also view and trigger investigations directly inside any incident's detail page under Monitoring → Incidents.",
        ctaLabel: "View Investigations",
        ctaUrl: "/agents?tab=investigations",
      },
      {
        step: "Step 4",
        title: "Connect External IDE Agents via `/v1/mcp`",
        description:
          "Create a Team API Key in Settings → API Keys, then add `https://api.opsway.eu/v1/mcp` to Claude Desktop, Cursor, or Windsurf using the configuration in the Unified MCP Gateway tab.",
        proTip:
          "The `/v1/mcp` gateway automatically scopes all tool calls to your authenticated team and respects your product entitlements.",
        ctaLabel: "Manage API Keys",
        ctaUrl: "/settings/api-keys",
      },
    ],
    codeExampleTitle: "Connect Claude Desktop / Cursor / Custom Agents to Opsway FastMCP",
    codeExampleDescription:
      "Add this configuration to `~/.cursor/mcp.json` or `claude_desktop_config.json`, or call `/v1/mcp` directly via JSON-RPC 2.0:",
    codeExample: `{
  "mcpServers": {
    "opsway": {
      "url": "https://api.opsway.eu/v1/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_OPSWAY_API_KEY>"
      }
    }
  }
}

# Or test tool discovery directly from your terminal:
curl -s -X POST "https://api.opsway.eu/v1/mcp" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_OPSWAY_API_KEY>" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'`,
  },

  hub: {
    id: "hub",
    name: "Opsway Platform Hub & Service Catalog",
    tagline: "Unified control center, microservice topology registry, team RBAC & modular suite governance",
    subdomain: "my.opsway.eu",
    subdomainUrl: "https://my.opsway.eu",
    accentColor: "#6ba0c2",
    softBg: "rgba(107, 160, 194, 0.15)",
    icon: <IoAppsOutline size={26} />,
    summary:
      "Opsway Platform Hub (`my.opsway.eu`) is the non-product-specific control plane for your organization. It provides a unified cross-product launcher, the Service Catalog mapping microservices across Monitoring, Log Search, and Git repositories, plus centralized Team RBAC, API keys, and modular billing.",
    standaloneValue:
      "Gives engineering leaders and administrators a single pane of glass to manage users, roles, API credentials, and subscriptions across all Opsway products.",
    suiteSynergy:
      "The Service Catalog in Opsway Hub is the connective tissue of the suite—linking a service's monitors, `service.name` log streams, and Git repository so AI agents can correlate across products automatically.",
    keyCapabilities: [
      {
        title: "Cross-Product Suite Launcher & Health Summary",
        description:
          "View high-level metrics (active monitors, open incidents, cataloged services, agent execution mode) and jump between Monitoring, Log Search, and Autonomous Agents.",
      },
      {
        title: "Unified Service Catalog",
        description:
          "Register microservices once with their slug, display name, Log-Search `service.name`, linked Monitor IDs, and GitHub/GitLab repository URL.",
      },
      {
        title: "Team Access & Role-Based Governance (RBAC)",
        description:
          "Invite team members, manage Owner/Admin/Member permissions, and switch seamlessly between multiple organization workspaces.",
      },
      {
        title: "Centralized API Keys & Integrations",
        description:
          "Provision scoped API keys for CI/CD pipelines, Heartbeat pings, OTLP log ingestion, and external MCP clients.",
      },
      {
        title: "Modular Suite Billing & Entitlements",
        description:
          "Track real-time quotas and usage across Monitoring, Log Search, Pantomath Code Graph, and Managed AI Agent runs.",
      },
      {
        title: "Account Security & Personal Notification Rules",
        description:
          "Configure personal 2FA/password security, avatar profile, and individual notification routing preferences.",
      },
    ],
    whenToUseSummary: [
      "Onboard a new microservice so its uptime monitors, logs, and code repository are linked together.",
      "Invite engineers to your workspace, assign Admin/Member roles, or rotate team API keys.",
      "Review organization-wide health and jump to specialized product subdomains via the 9-dot App Switcher.",
      "Manage your team subscription plan and inspect monthly AI agent investigation usage.",
    ],
    loggedInScenarios: [
      {
        situation: "You are deploying a new microservice and want full observability + AI root-cause correlation",
        whenToUse:
          "Register the microservice in the Service Catalog first, mapping its slug, Log-Search `service.name`, and GitHub repo URL.",
        recommendedAction:
          "Open Service Catalog and click 'Add Service' to link its telemetry identifiers.",
        actionLabel: "Add to Service Catalog",
        actionUrl: "/services",
      },
      {
        situation: "A new SRE or developer joined your team and needs access to Monitoring and Log Search",
        whenToUse:
          "Use Team & Access in Opsway Hub to send an invitation and assign their role (Member or Admin).",
        recommendedAction:
          "Open Team & Access to invite members or manage pending invitations.",
        actionLabel: "Manage Team",
        actionUrl: "/team",
      },
      {
        situation: "You need a bearer token for `/v1/mcp`, CI/CD deployments, or log ingestion",
        whenToUse:
          "Generate a dedicated key under Platform Settings → API Keys so you can rotate or revoke it independently.",
        recommendedAction:
          "Open API Keys settings to create and copy a new token.",
        actionLabel: "Manage API Keys",
        actionUrl: "/settings/api-keys",
      },
      {
        situation: "You want to check how many Managed Agent runs your team has used this month or upgrade your tier",
        whenToUse:
          "Use Suite Billing to view live product entitlements, monthly quotas, and Stripe subscription settings.",
        recommendedAction:
          "Open Suite Billing to inspect product entitlements and plan quotas.",
        actionLabel: "Open Suite Billing",
        actionUrl: "/settings/billing",
      },
    ],
    loggedInHowToSteps: [
      {
        step: "Step 1",
        title: "Register Your Architecture in the Service Catalog",
        description:
          "Navigate to Service Catalog → Add Service. Enter the display name (e.g., 'Checkout Service'), slug ('checkout-service'), Log-Search service name, and repository URL.",
        proTip:
          "When an incident occurs on a linked monitor, the AI agent uses this catalog entry to query the exact Log-Search service and codebase.",
        ctaLabel: "Open Service Catalog",
        ctaUrl: "/services",
      },
      {
        step: "Step 2",
        title: "Configure Team Members & Notification Preferences",
        description:
          "Invite your engineering team under Team & Access, then customize your personal alert channels under Account & Security → Notification Rules.",
        proTip:
          "Use the 9-dot App Switcher in the top-left sidebar header at any time to hop between Hub, Monitoring, Log Search, and Autonomous Agents in a single click.",
        ctaLabel: "Team & Access",
        ctaUrl: "/team",
      },
      {
        step: "Step 3",
        title: "Provision API Keys & Webhook Integrations",
        description:
          "Under Platform Settings, create API keys for automated tooling and connect Slack, PagerDuty, or custom webhook endpoints.",
        proTip:
          "Keep separate API keys for IDE MCP clients and production Kubernetes log shippers.",
        ctaLabel: "Platform Settings",
        ctaUrl: "/settings/general",
      },
      {
        step: "Step 4",
        title: "Monitor Entitlements & Suite Quotas",
        description:
          "Visit Suite Billing to review active tiers (`FREE`, `PRO`, `ENTERPRISE`) across Monitoring, Log Search, Pantomath, and Managed Agents.",
        proTip:
          "Every Opsway product can be used standalone on its Free tier or scaled together as a unified suite.",
        ctaLabel: "Suite Billing",
        ctaUrl: "/settings/billing",
      },
    ],
    codeExampleTitle: "Register a Microservice in the Service Catalog via REST API",
    codeExampleDescription:
      "You can also automate Service Catalog registration directly from your CI/CD deployment pipeline or Terraform setup:",
    codeExample: `curl -X POST "https://api.opsway.eu/v1/teams/1/service-catalog" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_OPSWAY_API_KEY>" \\
  -d '{
    "slug": "checkout-service",
    "name": "Checkout Service",
    "description": "Handles Stripe payment intents and order creation",
    "logSearchServices": ["checkout-service", "payments-worker"],
    "repositoryUrl": "https://github.com/opsway-io/backend"
  }'`,
  },
};

const getDefaultProductFromHost = (paramProduct?: string): ProductSlug => {
  if (
    paramProduct === "hub" ||
    paramProduct === "monitoring" ||
    paramProduct === "logs" ||
    paramProduct === "agents"
  ) {
    return paramProduct;
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname.startsWith("monitoring")) {
      return "monitoring";
    }
  }
  return "hub";
};

export const ProductInfoContent: FunctionComponent<{
  initialProduct?: ProductSlug;
  embedded?: boolean;
}> = ({ initialProduct, embedded = false }) => {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const authentication = useAuthenticationStore();
  const isLoggedIn = authentication.isAuthenticated();

  const resolvedProduct = initialProduct || getDefaultProductFromHost(productId);
  const [selectedTab, setSelectedTab] = useState<ProductSlug>(resolvedProduct);

  const activeSlug: ProductSlug = initialProduct
    ? selectedTab
    : productId === "hub" ||
      productId === "monitoring" ||
      productId === "logs" ||
      productId === "agents"
    ? productId
    : selectedTab;

  const product = PRODUCT_DEFINITIONS[activeSlug];

  const handleTabChange = (nextSlug: ProductSlug) => {
    setSelectedTab(nextSlug);
    if (!embedded) {
      navigate(`/info/${nextSlug}`);
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(product.codeExample);
    enqueueSnackbar("Snippet copied to clipboard", { variant: "success" });
  };

  return (
    <Stack spacing={3.5} sx={{ py: embedded ? 1 : 2 }}>
      {/* Product Switcher Tabs */}
      {!embedded && (
        <Tabs
          value={activeSlug}
          onChange={(_, val) => val && handleTabChange(val as ProductSlug)}
          sx={{ bgcolor: "transparent" }}
        >
          <TabList
            sx={{
              p: 0.5,
              gap: 1,
              borderRadius: "md",
              bgcolor: "background.level1",
              overflowX: "auto",
            }}
          >
            <Tab value="hub" sx={{ borderRadius: "sm", py: 1, px: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IoAppsOutline color="#6ba0c2" />
                <span>Opsway Hub & Catalog</span>
              </Stack>
            </Tab>
            <Tab value="monitoring" sx={{ borderRadius: "sm", py: 1, px: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IoPulseOutline color="#79ab5d" />
                <span>Monitoring & Status Pages</span>
              </Stack>
            </Tab>
            <Tab value="logs" sx={{ borderRadius: "sm", py: 1, px: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PiTerminalWindowBold color="#5185a5" />
                <span>Log Search</span>
              </Stack>
            </Tab>
            <Tab value="agents" sx={{ borderRadius: "sm", py: 1, px: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IoSparklesOutline color="#A871B7" />
                <span>Autonomous Agents & MCP</span>
              </Stack>
            </Tab>
          </TabList>
        </Tabs>
      )}

      {/* Hero Product Banner */}
      <Card
        variant="outlined"
        sx={{
          p: { xs: 2.5, md: 3.5 },
          background: `linear-gradient(135deg, ${product.softBg} 0%, rgba(25, 28, 34, 0.95) 100%)`,
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2.5}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: "md",
                  bgcolor: product.softBg,
                  color: product.accentColor,
                  display: "flex",
                }}
              >
                {product.icon}
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography level="h2" sx={{ fontSize: { xs: "xl", md: "2xl" }, fontWeight: 700 }}>
                    {product.name}
                  </Typography>
                  <Chip size="sm" variant="outlined" sx={{ fontFamily: "monospace" }}>
                    {product.subdomain}
                  </Chip>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={isLoggedIn ? "success" : "primary"}
                  >
                    {isLoggedIn
                      ? "Logged-In Operational Guide & Playbooks"
                      : "Public Product Overview"}
                  </Chip>
                </Stack>
                <Typography level="body-sm" sx={{ color: "text.secondary", mt: 0.25 }}>
                  {product.tagline}
                </Typography>
              </Box>
            </Stack>

            <Typography level="body-md" sx={{ color: "text.primary", mt: 1.5, lineHeight: 1.65 }}>
              {product.summary}
            </Typography>
          </Box>

          <Stack direction={{ xs: "row", md: "column" }} spacing={1} sx={{ minWidth: 200 }}>
            {isLoggedIn ? (
              <Button
                component="a"
                href={product.subdomainUrl}
                variant="solid"
                endDecorator={<IoArrowForward />}
                sx={{
                  bgcolor: product.accentColor,
                  color: "#fff",
                  "&:hover": { opacity: 0.9, bgcolor: product.accentColor },
                }}
              >
                Open {product.id === "hub" ? "Hub" : product.name.split(" ")[1]}
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to={`/login?returnTo=${encodeURIComponent(`/info/${product.id}`)}`}
                  variant="solid"
                  color="primary"
                  startDecorator={<IoLogInOutline />}
                >
                  Sign In for Full Playbooks
                </Button>
                <Button
                  component={Link}
                  to="/login/register"
                  variant="outlined"
                  color="neutral"
                >
                  Create Free Account
                </Button>
              </>
            )}
          </Stack>
        </Stack>

        {/* Standalone vs Suite Value */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: "md",
                bgcolor: "rgba(20, 23, 28, 0.65)",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <IoShieldCheckmarkOutline color={product.accentColor} />
                <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                  Standalone Capability
                </Typography>
              </Stack>
              <Typography level="body-xs" textColor="text.secondary">
                {product.standaloneValue}
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: "md",
                bgcolor: "rgba(20, 23, 28, 0.65)",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <IoHardwareChipOutline color="#A871B7" />
                <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                  Unified Suite Synergy
                </Typography>
              </Stack>
              <Typography level="body-xs" textColor="text.secondary">
                {product.suiteSynergy}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Core Capabilities Grid (Visible to BOTH Non-Logged-In & Logged-In Users) */}
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <IoLayersOutline size={20} color={product.accentColor} />
          <Typography level="title-lg" sx={{ fontWeight: 700 }}>
            What It Does &amp; Core Capabilities
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {product.keyCapabilities.map((cap) => (
            <Grid key={cap.title} xs={12} sm={6} md={4}>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: "background.surface",
                  height: "100%",
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Typography level="title-sm" sx={{ fontWeight: 700, mb: 0.75 }}>
                    {cap.title}
                  </Typography>
                  <Typography level="body-xs" textColor="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {cap.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* High-level When to Use Summary (Visible to all users) */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 2.5 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <IoTimeOutline size={20} color={product.accentColor} />
          <Typography level="title-md" sx={{ fontWeight: 700 }}>
            When to Use {product.name}
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
          {product.whenToUseSummary.map((item) => (
            <Grid key={item} xs={12} md={6}>
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
                <Box sx={{ color: product.accentColor, mt: 0.25 }}>
                  <IoCheckmarkCircle size={18} />
                </Box>
                <Typography level="body-sm" textColor="text.secondary">
                  {item}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* =====================================================================
          LOGGED-IN DETAILED OPERATIONAL SECTIONS ("HOW & WHEN TO USE")
         ===================================================================== */}
      {isLoggedIn ? (
        <>
          {/* Detailed When-to-Use Decision Matrix */}
          <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IoFlashOutline size={20} color="#f4ac45" />
                  <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                    When to Use What: Operational Decision Matrix
                  </Typography>
                  <Chip size="sm" variant="soft" color="warning">
                    Logged-In Playbook
                  </Chip>
                </Stack>
                <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 0.5 }}>
                  Match real-world engineering symptoms and operational goals to the exact workflow in {product.name}.
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ overflowX: "auto" }}>
              <Table
                hoverRow
                sx={{
                  "& th": { bgcolor: "background.level1", fontWeight: 700 },
                  minWidth: 680,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "28%" }}>Scenario / Symptom</th>
                    <th style={{ width: "34%" }}>When &amp; Why to Use</th>
                    <th style={{ width: "23%" }}>Recommended Configuration</th>
                    <th style={{ width: "15%", textAlign: "right" }}>Quick Action</th>
                  </tr>
                </thead>
                <tbody>
                  {product.loggedInScenarios.map((sc) => (
                    <tr key={sc.situation}>
                      <td aria-label="Scenario">
                        <Typography level="body-xs" sx={{ fontWeight: 600, color: "text.primary" }}>
                          {sc.situation}
                        </Typography>
                      </td>
                      <td aria-label="When to use">
                        <Typography level="body-xs" textColor="text.secondary">
                          {sc.whenToUse}
                        </Typography>
                      </td>
                      <td aria-label="Recommended action">
                        <Typography level="body-xs" textColor="text.secondary">
                          {sc.recommendedAction}
                        </Typography>
                      </td>
                      <td style={{ textAlign: "right" }} aria-label="Action">
                        {sc.external ? (
                          <Button
                            component="a"
                            href={sc.actionUrl}
                            size="sm"
                            variant="soft"
                            color="primary"
                            endDecorator={<IoArrowForward />}
                          >
                            {sc.actionLabel}
                          </Button>
                        ) : (
                          <Button
                            component={Link}
                            to={sc.actionUrl}
                            size="sm"
                            variant="soft"
                            color="primary"
                            endDecorator={<IoArrowForward />}
                          >
                            {sc.actionLabel}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Card>

          {/* Step-by-Step How to Use Guide */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <IoBookOutline size={20} color={product.accentColor} />
              <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                How to Use {product.name}: Step-by-Step Workflow
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {product.loggedInHowToSteps.map((st) => (
                <Grid key={st.step} xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      bgcolor: "background.surface",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: 2.5,
                    }}
                  >
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                          size="sm"
                          variant="soft"
                          sx={{ bgcolor: product.softBg, color: product.accentColor, fontWeight: 700 }}
                        >
                          {st.step}
                        </Chip>
                      </Stack>
                      <Typography level="title-md" sx={{ fontWeight: 700, mb: 1 }}>
                        {st.title}
                      </Typography>
                      <Typography level="body-sm" textColor="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {st.description}
                      </Typography>
                    </Box>

                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "sm",
                          bgcolor: "background.level1",
                          borderLeft: `3px solid ${product.accentColor}`,
                        }}
                      >
                        <Typography level="body-xs" textColor="text.secondary">
                          <strong>Best Practice:</strong> {st.proTip}
                        </Typography>
                      </Box>

                      {st.ctaLabel && st.ctaUrl && (
                        <Box>
                          {st.external ? (
                            <Button
                              component="a"
                              href={st.ctaUrl}
                              size="sm"
                              variant="outlined"
                              color="neutral"
                              endDecorator={<IoArrowForward />}
                            >
                              {st.ctaLabel}
                            </Button>
                          ) : (
                            <Button
                              component={Link}
                              to={st.ctaUrl}
                              size="sm"
                              variant="outlined"
                              color="neutral"
                              endDecorator={<IoArrowForward />}
                            >
                              {st.ctaLabel}
                            </Button>
                          )}
                        </Box>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Copyable Integration & CLI / Query Reference */}
          <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IoCodeSlashOutline size={20} color={product.accentColor} />
                  <Typography level="title-md" sx={{ fontWeight: 700 }}>
                    {product.codeExampleTitle}
                  </Typography>
                </Stack>
                <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 0.5 }}>
                  {product.codeExampleDescription}
                </Typography>
              </Box>
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                startDecorator={<IoCopyOutline />}
                onClick={handleCopySnippet}
              >
                Copy Snippet
              </Button>
            </Stack>
            <PreformattedBlock monospace>{product.codeExample}</PreformattedBlock>
          </Card>

          {/* End-to-End Cross-Product Incident Lifecycle */}
          <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <PiFireSimpleBold size={20} color="#cb4f4f" />
              <Typography level="title-md" sx={{ fontWeight: 700 }}>
                How All Opsway Products Work Together During an Outage
              </Typography>
            </Stack>
            <Typography level="body-xs" textColor="text.secondary" sx={{ mb: 2 }}>
              While each product operates independently, combining them creates a closed-loop self-healing workflow:
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.level1", height: "100%" }}>
                  <Chip size="sm" variant="soft" color="success" sx={{ mb: 1 }}>
                    1. Detect (Monitoring)
                  </Chip>
                  <Typography level="body-xs" textColor="text.secondary">
                    Multi-region probes or Forecaster IsolationForest models detect downtime or latency spikes and open an Incident.
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.level1", height: "100%" }}>
                  <Chip size="sm" variant="soft" color="primary" sx={{ mb: 1 }}>
                    2. Map (Service Catalog)
                  </Chip>
                  <Typography level="body-xs" textColor="text.secondary">
                    Opsway Hub resolves the failing monitor to its microservice slug, Log-Search `service.name`, and Git repository.
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.level1", height: "100%" }}>
                  <Chip size="sm" variant="soft" color="warning" sx={{ mb: 1 }}>
                    3. Correlate (Log Search)
                  </Chip>
                  <Typography level="body-xs" textColor="text.secondary">
                    The FastMCP Gateway queries ClickHouse &amp; Milvus logs around the incident timestamp to extract stack traces.
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: "md", bgcolor: "background.level1", height: "100%" }}>
                  <Chip size="sm" variant="soft" color="danger" sx={{ mb: 1 }}>
                    4. Remediate (AI Agents)
                  </Chip>
                  <Typography level="body-xs" textColor="text.secondary">
                    The Autonomous Agent synthesizes root cause, executes the approved remediation runbook, and verifies recovery.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </>
      ) : (
        /* Callout for Non-Logged-In Users */
        <Card
          variant="outlined"
          sx={{
            p: 3,
            bgcolor: "background.surface",
            borderColor: "primary.500",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1.5,
                borderRadius: "md",
                bgcolor: "rgba(81, 133, 165, 0.15)",
                color: "#6ba0c2",
                display: "flex",
              }}
            >
              <IoLockOpenOutline size={26} />
            </Box>
            <Box>
              <Typography level="title-md" sx={{ fontWeight: 700 }}>
                Sign in to unlock interactive &quot;How &amp; When to Use&quot; operational playbooks
              </Typography>
              <Typography level="body-sm" textColor="text.secondary">
                Logged-in users get scenario-based decision matrices, step-by-step configuration workflows, copyable CLI/MCP snippets, and 1-click actions directly into their workspace.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
            <Button
              component={Link}
              to={`/login?returnTo=${encodeURIComponent(`/info/${product.id}`)}`}
              variant="solid"
              color="primary"
              startDecorator={<IoPlayOutline />}
            >
              Sign In to View Full Guide
            </Button>
            <Button
              component={Link}
              to="/login/register"
              variant="outlined"
              color="neutral"
            >
              Start Free
            </Button>
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

const ProductInfoPage: FunctionComponent = () => {
  const authentication = useAuthenticationStore();
  const isLoggedIn = authentication.isAuthenticated();

  if (isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>Product Info &amp; Operational Guides | Opsway</title>
        </Helmet>
        <Container
          header="Product Info & Operational Guides"
          description="Explore what each Opsway product does, when to use specific capabilities, and step-by-step operational playbooks."
        >
          <ProductInfoContent />
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Opsway Product Suite | Overview &amp; Documentation</title>
      </Helmet>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.body",
          color: "text.primary",
          pb: 8,
        }}
      >
        {/* Public Top Navigation Bar for Unauthenticated Visitors */}
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            bgcolor: "background.surface",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: { xs: 2, md: 4 },
            py: 1.75,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ maxWidth: 1280, mx: "auto" }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                component="a"
                href="https://opsway.eu"
                sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
              >
                <img src="/img/logo.svg" alt="Opsway" style={{ height: 22 }} />
              </Box>
              <Chip size="sm" variant="soft" color="neutral" startDecorator={<IoHelpBuoyOutline />}>
                Product Documentation &amp; Overview
              </Chip>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component="a"
                href="https://opsway.eu"
                variant="plain"
                color="neutral"
                size="sm"
              >
                opsway.eu
              </Button>
              <Button
                component="a"
                href="https://logs.opsway.eu"
                variant="plain"
                color="neutral"
                size="sm"
                startDecorator={<GoBrowser />}
              >
                Log Search UI
              </Button>
              <Divider orientation="vertical" sx={{ height: 20 }} />
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="neutral"
                size="sm"
              >
                Log in
              </Button>
              <Button
                component={Link}
                to="/login/register"
                variant="solid"
                color="primary"
                size="sm"
              >
                Sign up free
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 4 }, pt: 3 }}>
          <ProductInfoContent />
        </Box>
      </Box>
    </>
  );
};

export default ProductInfoPage;
