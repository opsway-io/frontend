"use client";

import React, { useState } from "react";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import TerminalIcon from "@mui/icons-material/Terminal";

interface LogSearchGuideProps {
  onOpenErrorLogs: () => void;
  onOpenHistogram: () => void;
  onOpenLiveTail: () => void;
}

const CAPABILITIES = [
  {
    title: "Structured SQL & Keyword Filtering",
    description:
      "Filter logs using intuitive expressions like level = 'ERROR' AND service = 'api' or full-text substring matches across JSON attributes and stack traces.",
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
      "Bookmark frequent diagnostic queries for your team and share URL deep-links (?query=...&timeRange=1h) directly inside incident tickets.",
  },
  {
    title: "Built-In FastMCP Server (/mcp)",
    description:
      "Exposes get_error_summary, semantic_search, get_log_context, and search_logs tools to AI agents and IDEs.",
  },
];

const HOW_TO_STEPS = [
  {
    step: "Step 1",
    title: "Ship Logs via Vector, OpenTelemetry, or HTTP JSON",
    description:
      "Send structured JSON logs to https://logs.opsway.eu/v1/logs with service, level, message, and timestamp fields.",
    proTip:
      "Include trace_id or request_id in your JSON payload so you can reconstruct an entire distributed request across services.",
  },
  {
    step: "Step 2",
    title: "Filter by Service Chips or SQL Expressions",
    description:
      "Click any service chip (api, prober, postgres, redis, forecaster, milvus) to toggle service = '<name>', or combine conditions in the query bar such as service = 'api' AND level = 'ERROR'.",
    proTip:
      "Click any log row in the table to expand the full raw JSON event attributes and stack trace.",
  },
  {
    step: "Step 3",
    title: "Save Frequent Triage Queries",
    description:
      "Click the bookmark icon in the search bar to save your current query. Saved queries are available from the Saved Queries menu for 1-click access during incidents.",
    proTip:
      "Save baseline queries for critical tiers (e.g., 'Checkout 5xx Errors', 'Auth Token Failures', 'DB Pool Warnings').",
  },
  {
    step: "Step 4",
    title: "Correlate with Histogram, Live Tail & MCP",
    description:
      "Switch between Log Records, Histogram, and Live Tail in the sidebar, or connect Claude/Cursor/Autonomous Agents to the /mcp endpoint.",
    proTip:
      "Use the 9-dot App Switcher in the top bar anytime to hop between Log Search, Monitoring, and Opsway Hub.",
  },
];

const CODE_EXAMPLE = `# 1. Ingest structured logs via HTTP POST
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
# • Substring / keyword match:  service = 'api' AND message LIKE '%timeout%'`;

export function LogSearchGuide({
  onOpenErrorLogs,
  onOpenHistogram,
  onOpenLiveTail,
}: LogSearchGuideProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CODE_EXAMPLE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard permission errors in restricted contexts.
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <Typography variant="h4" component="h1" sx={{ color: "#e7e9ee" }}>
          Log Search Guide
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: "#a3aab7" }}>
          Sub-second ClickHouse SQL &amp; Milvus vector semantic log exploration
          with live SSE tailing.
        </Typography>
      </div>

      {/* Hero Banner */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, md: 3.5 },
          background:
            "linear-gradient(135deg, rgba(81, 133, 165, 0.16) 0%, rgba(25, 28, 34, 0.96) 100%)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="max-w-[760px] flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <Box
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  bgcolor: "rgba(81, 133, 165, 0.18)",
                  color: "#5185a5",
                  display: "inline-flex",
                }}
              >
                <TerminalIcon sx={{ fontSize: 22 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: "#e7e9ee", fontWeight: 600 }}
              >
                Opsway Log Search
              </Typography>
              <Chip
                size="small"
                label="logs.opsway.eu"
                sx={{
                  bgcolor: "rgba(81, 133, 165, 0.16)",
                  color: "#adc9dc",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                }}
              />
            </div>
            <Typography sx={{ color: "#a3aab7", fontSize: "0.925rem", lineHeight: 1.6 }}>
              Opsway Log Search is a high-throughput observability engine
              combining ClickHouse columnar storage for sub-second structured
              SQL filtering with Milvus vector embeddings for natural-language
              semantic log search and anomaly clustering.
            </Typography>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon sx={{ fontSize: 16 }} />}
              onClick={onOpenErrorLogs}
            >
              Search Errors
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<BarChartIcon sx={{ fontSize: 16 }} />}
              onClick={onOpenHistogram}
            >
              Histogram
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
              onClick={onOpenLiveTail}
            >
              Live Tail
            </Button>
          </div>
        </div>
      </Paper>

      {/* Key Capabilities */}
      <div className="flex flex-col gap-2.5">
        <Typography
          sx={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
            color: "#7c8494",
          }}
        >
          Key Capabilities
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAPABILITIES.map((cap) => (
            <Paper
              key={cap.title}
              variant="outlined"
              sx={{
                p: 2.25,
                bgcolor: "#191c22",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#e7e9ee",
                  mb: 0.75,
                }}
              >
                {cap.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "#a3aab7",
                  lineHeight: 1.55,
                }}
              >
                {cap.description}
              </Typography>
            </Paper>
          ))}
        </div>
      </div>

      {/* Step-by-Step Operational Guide */}
      <div className="flex flex-col gap-2.5">
        <Typography
          sx={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
            color: "#7c8494",
          }}
        >
          Step-by-Step Operational Guide
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HOW_TO_STEPS.map((item) => (
            <Paper
              key={item.step}
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: "#191c22",
                borderColor: "rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <div className="flex items-center gap-2">
                <Chip
                  size="small"
                  label={item.step}
                  sx={{
                    bgcolor: "rgba(81, 133, 165, 0.16)",
                    color: "#adc9dc",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#e7e9ee",
                  }}
                >
                  {item.title}
                </Typography>
              </div>
              <Typography
                sx={{ fontSize: "0.85rem", color: "#a3aab7", lineHeight: 1.55 }}
              >
                {item.description}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "#7c8494",
                  borderLeft: "2px solid #5185a5",
                  pl: 1.5,
                  mt: 0.5,
                }}
              >
                Tip: {item.proTip}
              </Typography>
            </Paper>
          ))}
        </div>
      </div>

      {/* Direct HTTP Log Ingestion & Query Cheatsheet */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          bgcolor: "#191c22",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: 600, color: "#e7e9ee" }}
            >
              Direct HTTP Log Ingestion &amp; Query Cheatsheet
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#a3aab7" }}>
              Ingest structured application logs from any service or CI pipeline
              and query them with SQL-like filters.
            </Typography>
          </div>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCopy}
            startIcon={
              copied ? (
                <CheckIcon sx={{ fontSize: 15 }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: 15 }} />
              )
            }
          >
            {copied ? "Copied" : "Copy Snippet"}
          </Button>
        </div>
        <pre className="m-0 p-3.5 rounded-[8px] bg-[#14171c] border border-white/[0.08] text-[#d5d9e0] text-[12.5px] font-mono overflow-x-auto leading-relaxed">
          {CODE_EXAMPLE}
        </pre>
      </Paper>
    </div>
  );
}
