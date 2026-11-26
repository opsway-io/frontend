"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Button,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  Chip,
  Collapse,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { OpswayTopBar } from "@opsway/shell";
import { opswayTheme } from "../components/theme";
import { Sidebar } from "../components/Sidebar";
import { LogSearchGuide } from "../components/LogSearchGuide";
import { BillingPanel } from "../components/BillingPanel";

interface LogEvent {
  id?: string;
  timestamp: string | number;
  level: string;
  message: string;
  service?: string;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
}

interface SavedQuery {
  id: string;
  name: string;
  query_string: string;
}

interface HistogramPoint {
  time: string;
  INFO: number;
  WARN: number;
  ERROR: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// Joy UI soft semantic badges (matches JoyTheme softBg / softColor tokens)
function getLevelChip(level: string) {
  const norm = (level || "INFO").toUpperCase();
  if (norm === "ERROR" || norm === "CRITICAL" || norm === "FATAL") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[rgba(203,79,79,0.16)] text-[#efb3b3]">
        {norm}
      </span>
    );
  }
  if (norm === "WARN" || norm === "WARNING") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[rgba(244,172,69,0.16)] text-[#fbd69f]">
        {norm}
      </span>
    );
  }
  if (norm === "INFO") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[rgba(81,133,165,0.16)] text-[#adc9dc]">
        {norm}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium bg-white/[0.06] text-[#d5d9e0]">
      {norm}
    </span>
  );
}

export default function Home() {
  const auth0 = useAuth0();
  const [query, setQuery] = useState("");
  const [timeRange, setTimeRange] = useState("1h");
  const [limit, setLimit] = useState(100);

  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [histogramData, setHistogramData] = useState<HistogramPoint[]>([]);
  const [totalMatches, setTotalMatches] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"logs" | "dashboard" | "guide" | "billing">("logs");
  const [expandedLogId, setExpandedLogId] = useState<string | number | null>(null);

  // Live Tailing
  const [isLive, setIsLive] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Saved Queries Menu
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [savedQueriesAnchor, setSavedQueriesAnchor] = useState<null | HTMLElement>(null);

  // Quick service filter
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [availableServices, setAvailableServices] = useState<string[]>([
    "api",
    "prober",
    "scheduler",
    "alerter",
    "postgres",
    "redis",
    "forecaster",
    "milvus",
    "dashboard",
    "status-page",
    "website",
  ]);

  // Sidebar rail collapsed & mobile drawer
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check auth or fallback token
  const getEffectiveToken = async (): Promise<string> => {
    // 1. Check URL query param ?token=
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        localStorage.setItem("opsway_access_token", urlToken);
        return urlToken;
      }
    }
    // 2. Check localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("opsway_access_token");
      if (stored) return stored;
    }
    // 3. Check Auth0
    if (auth0.isAuthenticated) {
      try {
        const token = await auth0.getAccessTokenSilently();
        if (token) return token;
      } catch (e) {
        console.warn("Auth0 silent token acquisition failed", e);
      }
    }
    // 4. Default fallback for internal / dev mode
    return "opsway_dev_session_token";
  };

  const fetchSavedQueries = async () => {
    try {
      const token = await getEffectiveToken();
      const res = await fetch(`${API_BASE}/v1/saved-queries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedQueries(data);
      }
    } catch (e) {
      console.warn("Saved queries fetch error", e);
    }
  };

  const fetchServices = async () => {
    try {
      const token = await getEffectiveToken();
      const res = await fetch(`${API_BASE}/v1/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.services) && data.services.length > 0) {
          const core = [
            "api",
            "prober",
            "scheduler",
            "alerter",
            "postgres",
            "redis",
            "forecaster",
            "milvus",
            "dashboard",
            "status-page",
            "website",
          ];
          const hidden = new Set([
            "csi-attacher",
            "csi-provisioner",
            "csi-resizer",
            "frr",
            "frr-metrics",
            "frr-status",
            "speaker",
            "node-exporter",
            "log-search-evaluator",
            "alert-manager",
            "proxmox-csi-proxmox-csi-plugin-controller",
            "proxmox-csi-proxmox-csi-plugin-node",
            "reloader",
            "controller",
            "manager",
            "proxy",
            "ingress-controller",
            "datanode",
            "clickhouse-backup",
          ]);
          const merged = Array.from(
            new Set([
              ...core,
              ...data.services.filter((s: string) => s && !hidden.has(s)),
            ])
          );
          setAvailableServices(merged);
        }
      }
    } catch (e) {
      console.warn("Services fetch error", e);
    }
  };

  const handleSaveQuery = async () => {
    if (!query) return;
    const name = prompt("Enter a name for this saved query:");
    if (!name) return;

    try {
      const token = await getEffectiveToken();
      const res = await fetch(`${API_BASE}/v1/saved-queries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, query_string: query, description: "" }),
      });
      if (res.ok) {
        fetchSavedQueries();
      }
    } catch (e) {
      console.error("Failed to save query", e);
    }
  };

  const handleSearch = async (
    overrideQuery?: string,
    targetLimit?: number,
    overrideTimeRange?: string
  ) => {
    stopLiveTailing();
    setIsSearching(true);
    const effLimit = targetLimit ?? limit;
    const activeQuery = overrideQuery !== undefined ? overrideQuery : query;
    const effRange = overrideTimeRange ?? timeRange;

    try {
      const token = await getEffectiveToken();
      const endTs = Date.now();
      let startTs: number | undefined = endTs - 3600000;
      let finalEndTs: number | undefined = endTs;
      if (effRange === "15m") startTs = endTs - 15 * 60 * 1000;
      else if (effRange === "1h") startTs = endTs - 60 * 60 * 1000;
      else if (effRange === "24h") startTs = endTs - 24 * 60 * 60 * 1000;
      else if (effRange === "7d") startTs = endTs - 7 * 24 * 60 * 60 * 1000;
      else if (effRange === "all") {
        startTs = undefined;
        finalEndTs = undefined;
      }

      // Fetch logs and histogram concurrently
      const [res, histRes] = await Promise.all([
        fetch(`${API_BASE}/v1/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: activeQuery || "*",
            start_ts: startTs,
            end_ts: finalEndTs,
            limit: effLimit,
          }),
        }),
        fetch(`${API_BASE}/v1/query/histogram`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: activeQuery || "*",
            start_ts: startTs || endTs - 24 * 60 * 60 * 1000,
            end_ts: finalEndTs || endTs,
            buckets: 20,
          }),
        }),
      ]);

      let fetchedCount = 0;
      let headerCount: string | null = null;
      if (res.ok) {
        headerCount = res.headers.get("x-total-count");
        if (headerCount) {
          setTotalMatches(parseInt(headerCount, 10));
        }
        const data = await res.json();
        const mappedLogs: LogEvent[] = (Array.isArray(data) ? data : []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d: any, idx: number) => {
            let parsedLabels = d.labels;
            if (typeof d.labels === "string") {
              try {
                parsedLabels = JSON.parse(d.labels);
              } catch {
                parsedLabels = d.labels;
              }
            }
            return {
              ...d,
              labels: parsedLabels,
              id: d.id || d.log_id || `${d.timestamp}-${idx}`,
              level: (d.log_level || d.level || "INFO").toUpperCase(),
              timestamp: new Date(d.timestamp).toISOString(),
              service: d.service || d.service_name || "default",
              message: d.message || d.content || JSON.stringify(d),
            };
          }
        );
        mappedLogs.sort((a, b) =>
          String(b.timestamp).localeCompare(String(a.timestamp))
        );
        setLogs(mappedLogs);
        fetchedCount = mappedLogs.length;
        if (!headerCount) {
          setTotalMatches(fetchedCount);
        }
      }

      if (histRes.ok) {
        const histData = await histRes.json();
        const histTotal = (Array.isArray(histData) ? histData : []).reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc: number, b: any) => acc + (b.total_count || 0),
          0
        );
        if (histTotal > 0 && !headerCount) {
          setTotalMatches(histTotal);
        }
        setHistogramData(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (Array.isArray(histData) ? histData : []).map((d: any) => ({
            time: new Date(d.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            INFO: d.info_count || 0,
            WARN: d.warn_count || 0,
            ERROR: d.error_count || 0,
          }))
        );
      }
    } catch (e) {
      console.error("Search execution failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  const startLiveTailing = async (overrideService?: string | null) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setLogs([]);
    setTotalMatches(null);
    setIsLive(true);
    setViewMode("logs");

    try {
      const token = await getEffectiveToken();
      const backendHost =
        API_BASE ||
        (typeof window !== "undefined" && window.location.port === "3000"
          ? "http://localhost:8080"
          : typeof window !== "undefined"
          ? window.location.origin
          : "");
      const tokenUrl = new URL(`${backendHost}/v1/logs/tail`);
      tokenUrl.searchParams.append("token", token);
      const effService =
        overrideService !== undefined ? overrideService : selectedService;
      if (effService) {
        tokenUrl.searchParams.append("service", effService);
      }

      const es = new EventSource(tokenUrl.toString());
      es.addEventListener("message", (e) => {
        try {
          const raw = JSON.parse(e.data);
          let parsedLabels = raw.labels;
          if (typeof raw.labels === "string") {
            try {
              parsedLabels = JSON.parse(raw.labels);
            } catch {
              parsedLabels = raw.labels;
            }
          }
          const log: LogEvent = {
            ...raw,
            labels: parsedLabels,
            id: raw.id || `${Date.now()}-${Math.random()}`,
            level: (raw.log_level || raw.level || "INFO").toUpperCase(),
            timestamp: new Date(raw.timestamp || Date.now()).toISOString(),
            service: raw.service || raw.service_name || "default",
            message: raw.message || raw.content || JSON.stringify(raw),
          };
          setLogs((prev) => [log, ...prev].slice(0, 150));
        } catch (err) {
          console.error("Failed to parse live log event", err);
        }
      });
      eventSourceRef.current = es;
    } catch (e) {
      console.error("Live tailing error", e);
      setIsLive(false);
    }
  };

  const stopLiveTailing = () => {
    setIsLive(false);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const toggleLiveTailing = () => {
    if (isLive) {
      stopLiveTailing();
    } else {
      startLiveTailing();
    }
  };

  const applyPreset = (presetQuery: string) => {
    setQuery(presetQuery);
    handleSearch(presetQuery);
  };

  const toggleServiceFilter = (serviceName: string) => {
    if (selectedService === serviceName) {
      setSelectedService(null);
      setQuery("");
      if (isLive) {
        startLiveTailing(null);
      } else {
        handleSearch("");
      }
    } else {
      setSelectedService(serviceName);
      const newQuery = `service = '${serviceName}'`;
      setQuery(newQuery);
      if (isLive) {
        startLiveTailing(serviceName);
      } else {
        handleSearch(newQuery);
      }
    }
  };

  // On mount: check deep links from Opsway Incident investigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlQuery = params.get("query");
      const urlRange = params.get("timeRange");
      const urlView = params.get("view");
      if (urlView === "guide" || urlView === "info") {
        setViewMode("guide");
      }
      if (urlRange) setTimeRange(urlRange);
      if (urlQuery) {
        setQuery(urlQuery);
        handleSearch(urlQuery, undefined, urlRange || undefined);
      } else {
        handleSearch("", undefined, urlRange || undefined);
      }
    }
    fetchSavedQueries();
    fetchServices();
    return () => {
      stopLiveTailing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    auth0.loginWithRedirect();
  };

  const handleLogout = () => {
    auth0.logout({
      logoutParams: {
        returnTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  };

  const navProps = {
    viewMode,
    isLive,
    onSelectLogs: () => {
      stopLiveTailing();
      setViewMode("logs");
    },
    onSelectHistogram: () => {
      stopLiveTailing();
      setViewMode("dashboard");
    },
    onSelectGuide: () => {
      stopLiveTailing();
      setViewMode("guide");
    },
    onSelectBilling: () => {
      stopLiveTailing();
      setViewMode("billing");
    },
    onToggleLive: toggleLiveTailing,
  };

  return (
    <ThemeProvider theme={opswayTheme}>
      <CssBaseline />
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#14171c] text-[#e7e9ee] antialiased">
        {/* Global Opsway Suite TopBar */}
        <OpswayTopBar
          currentApp="logs"
          brandHref="/"
          guideHref="/info"
          onNavigate={(path) => {
            stopLiveTailing();
            if (path === "/info") {
              setViewMode("guide");
            } else {
              setViewMode("logs");
            }
          }}
          userName={auth0.user?.name}
          userSubtitle={auth0.user?.email}
          avatarUrl={auth0.user?.picture}
          isAuthenticated={auth0.isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Mobile sidebar drawer (< md) */}
        <Drawer
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          slotProps={{
            paper: {
              sx: {
                bgcolor: "#191c22",
                width: 280,
                border: "none",
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              },
            },
          }}
        >
          <Sidebar
            variant="drawer"
            collapsed={false}
            onToggleCollapsed={() => {}}
            onNavigate={() => setMobileMenuOpen(false)}
            {...navProps}
          />
        </Drawer>

        <div className="flex flex-1 min-h-0 min-w-0">
          {/* Desktop sidebar rail (md+) */}
          <Sidebar
            variant="rail"
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed(!collapsed)}
            {...navProps}
          />

          {/* Main scrollable workspace (mirrors DashboardLayout + Container) */}
          <main className="flex-1 min-w-0 h-full overflow-auto">
          <div className="w-full max-w-[1600px] mx-auto px-4 py-4 md:px-6 md:pt-8 md:pb-12 flex flex-col gap-4">
            {viewMode === "billing" ? (
              <BillingPanel />
            ) : viewMode === "guide" ? (
              <LogSearchGuide
                onOpenErrorLogs={() => {
                  stopLiveTailing();
                  setViewMode("logs");
                  setQuery("level = 'ERROR'");
                  handleSearch("level = 'ERROR'");
                }}
                onOpenHistogram={() => {
                  stopLiveTailing();
                  setViewMode("dashboard");
                }}
                onOpenLiveTail={() => {
                  setViewMode("logs");
                  if (!isLive) toggleLiveTailing();
                }}
              />
            ) : (
            <>
            {/* Page Header (mirrors ContainerHeader + description + secondaryActions) */}
            <div className="flex flex-row justify-between items-end flex-wrap gap-4">
              <div className="flex-1 min-w-[240px] flex flex-col gap-1">
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ color: "#e7e9ee" }}
                >
                  Log Search
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#a3aab7",
                  }}
                >
                  Query structured application logs, inspect severity distributions, and tail live streams across your services.
                </Typography>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  onClick={(e) => setSavedQueriesAnchor(e.currentTarget)}
                  startIcon={<BookmarkIcon sx={{ fontSize: 16 }} />}
                >
                  Saved Queries ({savedQueries.length})
                </Button>
                <Menu
                  anchorEl={savedQueriesAnchor}
                  open={Boolean(savedQueriesAnchor)}
                  onClose={() => setSavedQueriesAnchor(null)}
                  slotProps={{
                    paper: { sx: { minWidth: 260 } },
                  }}
                >
                  {savedQueries.length === 0 ? (
                    <MenuItem disabled sx={{ color: "#7c8494", fontSize: "0.85rem" }}>
                      No saved queries yet
                    </MenuItem>
                  ) : (
                    savedQueries.map((sq) => (
                      <MenuItem
                        key={sq.id}
                        onClick={() => {
                          setQuery(sq.query_string);
                          setSavedQueriesAnchor(null);
                          handleSearch(sq.query_string);
                        }}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm text-[#e7e9ee]">
                            {sq.name}
                          </span>
                          <span className="text-xs text-[#7c8494] font-mono truncate max-w-[220px]">
                            {sq.query_string}
                          </span>
                        </div>
                      </MenuItem>
                    ))
                  )}
                </Menu>

                <Button
                  variant={isLive ? "contained" : "outlined"}
                  color={isLive ? "success" : "primary"}
                  onClick={toggleLiveTailing}
                  startIcon={
                    isLive ? (
                      <StopIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <PlayArrowIcon sx={{ fontSize: 16 }} />
                    )
                  }
                >
                  {isLive ? "Stop Stream" : "Live Tail"}
                </Button>
              </div>
            </div>

            {/* Search Bar & Filter Controls Card */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: "#191c22",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="space-y-3">
                {/* Search Input Row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter query: service = 'api' AND level = 'ERROR' or SELECT * FROM logs..."
                    value={query}
                    disabled={isLive}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#a3aab7", fontSize: 18 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Save query">
                              <IconButton
                                size="small"
                                onClick={handleSaveQuery}
                                sx={{
                                  color: "#a3aab7",
                                  "&:hover": { color: "#e7e9ee" },
                                }}
                              >
                                <BookmarkBorderIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        sx: {
                          fontSize: "0.875rem",
                          fontFamily:
                            'var(--font-mono, "JetBrains Mono", monospace)',
                        },
                      },
                    }}
                  />

                  {/* Time Range Selector */}
                  <Select
                    size="small"
                    value={timeRange}
                    disabled={isLive}
                    onChange={(e) => {
                      const nextRange = e.target.value;
                      setTimeRange(nextRange);
                      handleSearch(undefined, undefined, nextRange);
                    }}
                    sx={{
                      minWidth: 145,
                      fontSize: "0.875rem",
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccessTimeIcon
                          sx={{ color: "#a3aab7", fontSize: 16, mr: 0.5 }}
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="15m">Last 15 mins</MenuItem>
                    <MenuItem value="1h">Last 1 hour</MenuItem>
                    <MenuItem value="24h">Last 24 hours</MenuItem>
                    <MenuItem value="7d">Last 7 days</MenuItem>
                    <MenuItem value="all">All time</MenuItem>
                  </Select>

                  {/* Limit Selector */}
                  <Select
                    size="small"
                    value={limit}
                    disabled={isLive}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setLimit(newLimit);
                      handleSearch(undefined, newLimit);
                    }}
                    sx={{
                      minWidth: 112,
                      fontSize: "0.875rem",
                    }}
                  >
                    <MenuItem value={50}>50 logs</MenuItem>
                    <MenuItem value={100}>100 logs</MenuItem>
                    <MenuItem value={250}>250 logs</MenuItem>
                    <MenuItem value={500}>500 logs</MenuItem>
                    <MenuItem value={1000}>1000 logs</MenuItem>
                  </Select>

                  {/* Primary Action Button (near-white JoyTheme primary) */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSearch()}
                    disabled={isLive || isSearching}
                    sx={{ minWidth: 100 }}
                    startIcon={
                      isSearching ? (
                        <CircularProgress size={15} color="inherit" />
                      ) : (
                        <RefreshIcon sx={{ fontSize: 17 }} />
                      )
                    }
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Quick Filters Row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-[#7c8494] font-medium mr-1 flex items-center gap-1">
                    <FilterListIcon sx={{ fontSize: 14 }} /> Quick Filters:
                  </span>
                  <button
                    type="button"
                    onClick={() => applyPreset("level = 'ERROR'")}
                    className="px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[rgba(203,79,79,0.16)] text-[#efb3b3] hover:bg-[rgba(203,79,79,0.24)] transition-colors cursor-pointer"
                  >
                    level = &apos;ERROR&apos;
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("level = 'WARN'")}
                    className="px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[rgba(244,172,69,0.16)] text-[#fbd69f] hover:bg-[rgba(244,172,69,0.24)] transition-colors cursor-pointer"
                  >
                    level = &apos;WARN&apos;
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("status >= 500")}
                    className="px-2 py-0.5 rounded-[6px] text-xs font-medium bg-white/[0.06] text-[#d5d9e0] hover:bg-white/[0.1] transition-colors font-mono cursor-pointer"
                  >
                    status &gt;= 500
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("duration_ms > 1000")}
                    className="px-2 py-0.5 rounded-[6px] text-xs font-medium bg-white/[0.06] text-[#d5d9e0] hover:bg-white/[0.1] transition-colors font-mono cursor-pointer"
                  >
                    duration_ms &gt; 1000
                  </button>
                  {(query || selectedService) && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedService(null);
                        handleSearch("");
                      }}
                      className="ml-auto text-xs text-[#a3aab7] hover:text-[#e7e9ee] underline cursor-pointer"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {/* Service Filter Chips Row (moved out of sidebar to match Monitoring & Hub) */}
                {availableServices.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
                    <span className="text-xs text-[#7c8494] font-medium mr-1">
                      Services:
                    </span>
                    {availableServices.map((svc) => {
                      const active = selectedService === svc;
                      return (
                        <Chip
                          key={svc}
                          size="small"
                          label={svc}
                          onClick={() => toggleServiceFilter(svc)}
                          sx={{
                            fontSize: "0.75rem",
                            height: "24px",
                            bgcolor: active
                              ? "rgba(81, 133, 165, 0.24)"
                              : "rgba(255, 255, 255, 0.06)",
                            color: active ? "#d6e4ee" : "#a3aab7",
                            "&:hover": {
                              bgcolor: active
                                ? "rgba(81, 133, 165, 0.32)"
                                : "rgba(255, 255, 255, 0.1)",
                              color: "#e7e9ee",
                            },
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </Paper>

            {/* Segmented View Tabs (JoyTabList / JoyTab pill style) + Result Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Log view mode"
                className="inline-flex items-center self-start gap-1 p-1 rounded-[14px] bg-[#1f232a] border border-white/[0.08]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "logs"}
                  onClick={() => setViewMode("logs")}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                    viewMode === "logs"
                      ? "bg-[#2d323b] text-[#e7e9ee]"
                      : "text-[#a3aab7] hover:text-[#e7e9ee]"
                  }`}
                >
                  <ListIcon sx={{ fontSize: 16 }} />
                  Logs
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "dashboard"}
                  onClick={() => setViewMode("dashboard")}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                    viewMode === "dashboard"
                      ? "bg-[#2d323b] text-[#e7e9ee]"
                      : "text-[#a3aab7] hover:text-[#e7e9ee]"
                  }`}
                >
                  <BarChartIcon sx={{ fontSize: 16 }} />
                  Histogram
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                {isLive && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#a2cc87] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#79ab5d] animate-ping" />
                    Live stream active
                  </span>
                )}
                <span className="text-xs font-medium px-2.5 py-1 rounded-[6px] bg-white/[0.06] text-[#d5d9e0]">
                  {isLive
                    ? `${logs.length} events received`
                    : totalMatches !== null && totalMatches > logs.length
                    ? `Showing ${logs.length} of ${totalMatches.toLocaleString()} events`
                    : `${logs.length} events`}
                </span>
              </div>
            </div>

            {/* Results Display Area */}
            {viewMode === "logs" ? (
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: "#191c22",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  maxHeight: "calc(100vh - 320px)",
                  overflow: "auto",
                }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 40 }} />
                      <TableCell sx={{ width: 195 }}>Timestamp (UTC)</TableCell>
                      <TableCell sx={{ width: 105 }}>Level</TableCell>
                      <TableCell sx={{ width: 140 }}>Service</TableCell>
                      <TableCell>Message</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{ textAlign: "center", py: 8, border: "none" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#7c8494", mb: 1.5 }}
                          >
                            {isLive
                              ? "Awaiting live incoming stream events..."
                              : "No logs found matching your query or time window."}
                          </Typography>
                          {!isLive && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setQuery("");
                                setSelectedService(null);
                                handleSearch("");
                              }}
                            >
                              Reset to all logs
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log, idx) => {
                        const rowKey = log.id || idx;
                        const isExpanded = expandedLogId === rowKey;
                        return (
                          <React.Fragment key={rowKey}>
                            <TableRow
                              hover
                              onClick={() =>
                                setExpandedLogId(isExpanded ? null : rowKey)
                              }
                              sx={{
                                cursor: "pointer",
                                bgcolor: isExpanded
                                  ? "rgba(255, 255, 255, 0.04)"
                                  : "transparent",
                                "&:hover": {
                                  bgcolor: "rgba(255, 255, 255, 0.03) !important",
                                },
                              }}
                            >
                              <TableCell sx={{ py: 0.8, px: 1 }}>
                                <IconButton
                                  size="small"
                                  sx={{ color: "#7c8494", p: 0.25 }}
                                >
                                  {isExpanded ? (
                                    <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      sx={{ fontSize: 16 }}
                                    />
                                  )}
                                </IconButton>
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily:
                                    'var(--font-mono, "JetBrains Mono", monospace)',
                                  fontSize: "0.78rem",
                                  color: "#a3aab7",
                                  whiteSpace: "nowrap",
                                  py: 0.8,
                                }}
                              >
                                {log.timestamp}
                              </TableCell>
                              <TableCell sx={{ py: 0.8 }}>
                                {getLevelChip(log.level)}
                              </TableCell>
                              <TableCell sx={{ py: 0.8 }}>
                                <span className="text-xs font-mono px-2 py-0.5 rounded-[6px] bg-white/[0.06] text-[#d5d9e0]">
                                  {log.service || "app"}
                                </span>
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily:
                                    'var(--font-mono, "JetBrains Mono", monospace)',
                                  fontSize: "0.82rem",
                                  color: "#e7e9ee",
                                  py: 0.8,
                                }}
                              >
                                <span className="line-clamp-1 break-all">
                                  {log.message}
                                </span>
                              </TableCell>
                            </TableRow>

                            {/* Collapsible detail metadata row */}
                            <TableRow sx={{ bgcolor: "#14171c" }}>
                              <TableCell
                                colSpan={5}
                                sx={{
                                  p: 0,
                                  borderBottom: isExpanded ? undefined : "none",
                                }}
                              >
                                <Collapse
                                  in={isExpanded}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box
                                    sx={{
                                      p: 2,
                                      bgcolor: "#14171c",
                                      borderLeft: "2px solid rgba(255, 255, 255, 0.16)",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        fontWeight: 600,
                                        color: "#7c8494",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        mb: 1,
                                      }}
                                    >
                                      Raw Event Attributes & Metadata
                                    </Typography>
                                    <pre className="p-3 rounded-[10px] bg-[#191c22] border border-white/[0.08] text-xs font-mono text-[#d5d9e0] overflow-x-auto max-h-60">
                                      {JSON.stringify(log, null, 2)}
                                    </pre>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              /* Histogram View */
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: "#191c22",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  height: 440,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#e7e9ee",
                      }}
                    >
                      Log Event Distribution
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.8rem", color: "#7c8494" }}
                    >
                      Bucketed log frequency by severity level over time
                    </Typography>
                  </div>
                </div>

                {histogramData.length > 0 ? (
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={histogramData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorInfo"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#5185a5"
                              stopOpacity={0.7}
                            />
                            <stop
                              offset="95%"
                              stopColor="#5185a5"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorWarn"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#f4ac45"
                              stopOpacity={0.7}
                            />
                            <stop
                              offset="95%"
                              stopColor="#f4ac45"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorError"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#cb4f4f"
                              stopOpacity={0.7}
                            />
                            <stop
                              offset="95%"
                              stopColor="#cb4f4f"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          stroke="#7c8494"
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis stroke="#7c8494" tick={{ fontSize: 11 }} />
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.06)"
                          vertical={false}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#1d2128",
                            borderColor: "rgba(255,255,255,0.08)",
                            borderRadius: "10px",
                            fontSize: "12px",
                          }}
                          itemStyle={{ color: "#e7e9ee" }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                          type="monotone"
                          dataKey="INFO"
                          stroke="#5185a5"
                          fillOpacity={1}
                          fill="url(#colorInfo)"
                        />
                        <Area
                          type="monotone"
                          dataKey="WARN"
                          stroke="#f4ac45"
                          fillOpacity={1}
                          fill="url(#colorWarn)"
                        />
                        <Area
                          type="monotone"
                          dataKey="ERROR"
                          stroke="#cb4f4f"
                          fillOpacity={1}
                          fill="url(#colorError)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center text-[#7c8494]">
                    <div>
                      <BarChartIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                      <Typography variant="body2">
                        No distribution data available for this range.
                      </Typography>
                    </div>
                  </div>
                )}
              </Paper>
            )}
            </>
            )}
          </div>
        </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
