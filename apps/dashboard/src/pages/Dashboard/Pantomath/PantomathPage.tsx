import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Option,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TabList,
  Tabs,
  Textarea,
  Typography,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, KeyboardEvent, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoBookOutline,
  IoCheckmarkCircleOutline,
  IoCodeSlashOutline,
  IoCopyOutline,
  IoGitBranchOutline,
  IoGitNetworkOutline,
  IoKeyOutline,
  IoLayersOutline,
  IoPlayOutline,
  IoRefreshOutline,
  IoSearchOutline,
  IoServerOutline,
  IoSparklesOutline,
  IoTerminalOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PantomathQueryResponse } from "../../../api/endpoints/suite";
import Container from "../../../components/Container/Container";
import {
  usePantomathProductRepos,
  useQueryPantomath,
  useSetActivePantomathProduct,
  useTeamUsage,
} from "../../../hooks/suite.query";

type PantomathTab = "playground" | "products" | "mcp";

interface QueryHistoryEntry {
  id: string;
  query: string;
  product: string;
  response: PantomathQueryResponse;
  timestamp: string;
}

const EXAMPLE_QUERIES = [
  "Which repositories are indexed?",
  "How does authentication and team authorization work across the API?",
  "Trace the monitoring probe to incident and AI investigation pipeline",
  "Where are Kubernetes ingress and Flux kustomizations configured?",
];

const MCP_TOOLS_REFERENCE = [
  {
    name: "pantomath.ask_codebase",
    description:
      "Hybrid dense + BM25 vector search with GraphRAG traversal across source code ASTs, Kubernetes manifests, and docs.",
    params: "query (required), product?, synthesize?, agentic_loop?, top_k?, max_hops?",
  },
  {
    name: "pantomath.list_products",
    description:
      "List all configured and indexed Agent Context products with their repository counts.",
    params: "(none)",
  },
  {
    name: "pantomath.list_repos",
    description:
      "List distinct Git repositories indexed inside a specific product collection.",
    params: "product (required)",
  },
];

const formatNumber = (n?: number) => (n ?? 0).toLocaleString();

const isAgentContextSubdomain = () =>
  typeof window !== "undefined" &&
  (window.location.hostname.startsWith("agent-context") ||
    window.location.hostname.startsWith("pantomath"));

const PantomathPage: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDedicatedHost = isAgentContextSubdomain();
  const playgroundPath = isDedicatedHost ? "/" : "/agent-context";
  const guidePath = isDedicatedHost ? "/info" : "/info/agent-context";

  const activeTab: PantomathTab = useMemo(() => {
    if (
      location.pathname === "/products" ||
      location.pathname.startsWith("/agent-context/products") ||
      location.pathname.startsWith("/pantomath/products")
    )
      return "products";
    if (
      location.pathname === "/mcp" ||
      location.pathname.startsWith("/agent-context/mcp") ||
      location.pathname.startsWith("/pantomath/mcp")
    )
      return "mcp";
    return "playground";
  }, [location.pathname]);

  const { data: usage, isLoading: usageLoading, refetch: refetchUsage } = useTeamUsage();
  const queryMutation = useQueryPantomath();
  const setActiveProductMutation = useSetActivePantomathProduct();

  const pantomathUsage = usage?.products?.pantomath;
  const pantomathProducts = useMemo(
    () => usage?.topConsumers?.pantomathProducts ?? [],
    [usage],
  );

  // Playground state
  const [queryText, setQueryText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("__all__");
  const [synthesize, setSynthesize] = useState<boolean>(true);
  const [agenticLoop, setAgenticLoop] = useState<boolean>(true);
  const [topK, setTopK] = useState<number>(5);
  const [maxHops, setMaxHops] = useState<number>(2);
  const [history, setHistory] = useState<QueryHistoryEntry[]>([]);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  // Products tab state
  const [inspectedProduct, setInspectedProduct] = useState<string | null>(null);
  const {
    data: productRepos,
    isLoading: reposLoading,
    refetch: refetchRepos,
  } = usePantomathProductRepos(inspectedProduct);

  // MCP tab state
  const [mcpSnippetTab, setMcpSnippetTab] = useState<string>("gateway");

  const activeEntry = useMemo(
    () => history.find((item) => item.id === activeResultId) ?? history[0] ?? null,
    [history, activeResultId],
  );

  const handleTabChange = (_: unknown, value: string | number | null) => {
    if (value === "products") navigate("/products");
    else if (value === "mcp") navigate("/mcp");
    else navigate(playgroundPath);
  };

  const runQuery = (overrideQuery?: string) => {
    const q = (overrideQuery ?? queryText).trim();
    if (!q) {
      enqueueSnackbar("Enter a question to query the knowledge graph.", {
        variant: "warning",
      });
      return;
    }
    if (overrideQuery) {
      setQueryText(overrideQuery);
    }
    const productParam = selectedProduct === "__all__" ? undefined : selectedProduct;
    queryMutation.mutate(
      {
        query: q,
        product: productParam,
        synthesize,
        agenticLoop,
        topK,
        maxHops,
      },
      {
        onSuccess: (res) => {
          const entry: QueryHistoryEntry = {
            id: `${Date.now()}`,
            query: q,
            product: productParam || "All products",
            response: res,
            timestamp: new Date().toLocaleTimeString(),
          };
          setHistory((prev) => [entry, ...prev].slice(0, 12));
          setActiveResultId(entry.id);
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Failed to execute Agent Context query";
          enqueueSnackbar(message, { variant: "error" });
        },
      },
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`${label} copied to clipboard`, { variant: "success" });
  };

  const handleSetActiveProduct = (product: string) => {
    setActiveProductMutation.mutate(product, {
      onSuccess: () =>
        enqueueSnackbar(`"${product}" is now your active Agent Context product`, {
          variant: "success",
        }),
      onError: () =>
        enqueueSnackbar("Failed to update active Agent Context product", {
          variant: "error",
        }),
    });
  };

  const gatewayConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        opsway: {
          type: "http",
          url: "https://api.opsway.eu/v1/mcp",
          headers: {
            Authorization: "Bearer <YOUR_OPSWAY_API_KEY>",
          },
        },
      },
    },
    null,
    2,
  );

  const localHttpSnippet = JSON.stringify(
    {
      mcpServers: {
        pantomath: {
          type: "http",
          url: "http://localhost:8000/mcp",
        },
      },
    },
    null,
    2,
  );

  const stdioSnippet = JSON.stringify(
    {
      mcpServers: {
        pantomath: {
          command: "uv",
          args: ["run", "python", "-m", "src.mcp.server"],
        },
      },
    },
    null,
    2,
  );

  const activeSnippet =
    mcpSnippetTab === "gateway"
      ? gatewayConfigSnippet
      : mcpSnippetTab === "local-http"
        ? localHttpSnippet
        : stdioSnippet;

  return (
    <>
      <Helmet>
        <title>Agent Context | Product, Code &amp; Infra GraphRAG — Opsway</title>
      </Helmet>
      <Container>
        <Stack spacing={3} sx={{ py: 3 }}>
          {/* Hero Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
              p: 3,
              borderRadius: "lg",
              background:
                "linear-gradient(135deg, rgba(45, 212, 191, 0.14) 0%, rgba(81, 133, 165, 0.12) 100%)",
              border: "1px solid rgba(45, 212, 191, 0.22)",
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                <IoGitNetworkOutline size={26} color="#2dd4bf" />
                <Typography
                  level="h2"
                  sx={{ fontSize: { xs: "xl", md: "2xl" }, fontWeight: 700 }}
                >
                  Agent Context
                </Typography>
                <Chip
                  size="sm"
                  variant="soft"
                  sx={{
                    bgcolor: "rgba(45, 212, 191, 0.16)",
                    color: "#2dd4bf",
                    fontWeight: 600,
                  }}
                >
                  {pantomathUsage?.tier || "FREE"} Tier
                </Chip>
              </Stack>
              <Typography level="body-sm" sx={{ color: "text.secondary", maxWidth: 700 }}>
                Indexed product, code &amp; infrastructure context for AI agents. Query
                Tree-sitter ASTs, Kubernetes Kustomize topologies, and product docs with
                Milvus Hybrid Search — or connect agents over MCP.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.25} flexWrap="wrap">
              <Button
                variant="outlined"
                color="neutral"
                size="sm"
                startDecorator={<IoRefreshOutline />}
                loading={usageLoading}
                onClick={() => refetchUsage()}
              >
                Refresh Stats
              </Button>
              <Button
                component={Link}
                to={guidePath}
                variant="outlined"
                color="primary"
                size="sm"
                startDecorator={<IoBookOutline />}
              >
                Guide &amp; Docs
              </Button>
            </Stack>
          </Box>

          {/* KPI Bar */}
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      INDEXED PRODUCTS
                    </Typography>
                    <Typography level="h3" sx={{ mt: 0.5 }}>
                      {formatNumber(pantomathProducts.length)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor: "rgba(45, 212, 191, 0.12)",
                      color: "#2dd4bf",
                    }}
                  >
                    <IoLayersOutline size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  {formatNumber(pantomathUsage?.linkedRepositories)} linked repositories
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      VECTOR CHUNKS
                    </Typography>
                    <Typography level="h3" sx={{ mt: 0.5 }}>
                      {formatNumber(pantomathUsage?.vectorChunks)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor: "rgba(107, 160, 194, 0.12)",
                      color: "#6ba0c2",
                    }}
                  >
                    <IoServerOutline size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  Dense + BM25 hybrid embeddings
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      GRAPH EDGES
                    </Typography>
                    <Typography level="h3" sx={{ mt: 0.5 }}>
                      {formatNumber(pantomathUsage?.graphEdges)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor: "rgba(168, 113, 183, 0.12)",
                      color: "#a871b7",
                    }}
                  >
                    <IoGitNetworkOutline size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  AST symbols &amp; Kustomize topology links
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      QUERIES &amp; MCP CALLS
                    </Typography>
                    <Typography level="h3" sx={{ mt: 0.5 }}>
                      {formatNumber(
                        (pantomathUsage?.queriesExecuted ?? 0) +
                          (pantomathUsage?.mcpCalls ?? 0),
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor: "rgba(244, 172, 69, 0.12)",
                      color: "#f4ac45",
                    }}
                  >
                    <IoSparklesOutline size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  {formatNumber(pantomathUsage?.pantomathTriggeredInvestigations)} agent
                  investigations assisted
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Navigation Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ bgcolor: "transparent" }}
          >
            <TabList variant="outlined" sx={{ borderRadius: "md", p: 0.5 }}>
              <Tab value="playground" sx={{ gap: 1 }}>
                <IoSearchOutline />
                Context Playground
              </Tab>
              <Tab value="products" sx={{ gap: 1 }}>
                <IoGitBranchOutline />
                Indexed Products ({pantomathProducts.length})
              </Tab>
              <Tab value="mcp" sx={{ gap: 1 }}>
                <IoTerminalOutline />
                MCP &amp; IDE Setup
              </Tab>
            </TabList>
          </Tabs>

          {/* TAB 1: KNOWLEDGE PLAYGROUND */}
          {activeTab === "playground" && (
            <Grid container spacing={2.5}>
              <Grid xs={12} lg={8}>
                <Stack spacing={2.5}>
                  <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography level="title-md" sx={{ mb: 0.5 }}>
                          Ask Agent Context
                        </Typography>
                        <Typography level="body-xs" textColor="text.tertiary">
                          Ask about code architecture, service dependencies, Kubernetes
                          manifests, or recent implementations. Press Cmd/Ctrl + Enter to run.
                        </Typography>
                      </Box>

                      <Textarea
                        minRows={3}
                        maxRows={8}
                        placeholder="e.g. How does the monitoring prober publish check results and trigger incidents?"
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />

                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {EXAMPLE_QUERIES.map((example) => (
                          <Chip
                            key={example}
                            size="sm"
                            variant="soft"
                            color="neutral"
                            onClick={() => runQuery(example)}
                            sx={{ cursor: "pointer" }}
                          >
                            {example}
                          </Chip>
                        ))}
                      </Stack>

                      <Divider />

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", sm: "flex-end" }}
                        justifyContent="space-between"
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                          <FormControl size="sm" sx={{ minWidth: 160 }}>
                            <FormLabel>Product Scope</FormLabel>
                            <Select
                              value={selectedProduct}
                              onChange={(_, v) => setSelectedProduct(v || "__all__")}
                            >
                              <Option value="__all__">All indexed products</Option>
                              {pantomathProducts.map((p) => (
                                <Option key={p.product} value={p.product}>
                                  {p.product} ({p.repoCount} repos)
                                </Option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl size="sm" sx={{ minWidth: 95 }}>
                            <FormLabel>Top K</FormLabel>
                            <Select
                              value={topK}
                              onChange={(_, v) => setTopK(Number(v) || 5)}
                            >
                              {[3, 5, 10, 15].map((k) => (
                                <Option key={k} value={k}>
                                  {k} hits
                                </Option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl size="sm" sx={{ minWidth: 105 }}>
                            <FormLabel>Graph Hops</FormLabel>
                            <Select
                              value={maxHops}
                              onChange={(_, v) => setMaxHops(Number(v ?? 2))}
                            >
                              {[0, 1, 2, 3].map((h) => (
                                <Option key={h} value={h}>
                                  {h} {h === 1 ? "hop" : "hops"}
                                </Option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl size="sm">
                            <FormLabel>Synthesize</FormLabel>
                            <Switch
                              checked={synthesize}
                              onChange={(e) => setSynthesize(e.target.checked)}
                              sx={{ mt: 0.5 }}
                            />
                          </FormControl>

                          <FormControl size="sm">
                            <FormLabel>Agentic Loop</FormLabel>
                            <Switch
                              checked={agenticLoop}
                              onChange={(e) => setAgenticLoop(e.target.checked)}
                              sx={{ mt: 0.5 }}
                            />
                          </FormControl>
                        </Stack>

                        <Button
                          size="md"
                          loading={queryMutation.isPending}
                          startDecorator={<IoPlayOutline />}
                          onClick={() => runQuery()}
                          sx={{
                            bgcolor: "#0f766e",
                            "&:hover": { bgcolor: "#115e59" },
                          }}
                        >
                          Run Query
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>

                  {/* Query Output */}
                  {queryMutation.isPending && (
                    <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                      <Stack spacing={1.5} alignItems="center">
                        <CircularProgress size="md" />
                        <Typography level="title-sm">
                          Traversing Milvus Hybrid Search &amp; Knowledge Graph...
                        </Typography>
                        <Typography level="body-xs" textColor="text.tertiary">
                          Reranking AST snippets and expanding multi-hop topology nodes.
                        </Typography>
                      </Stack>
                    </Card>
                  )}

                  {activeEntry && !queryMutation.isPending && (
                    <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography level="title-md">Retrieved Knowledge</Typography>
                            <Chip size="sm" variant="soft" color="primary">
                              {activeEntry.product}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="soft"
                              color="neutral"
                              startDecorator={<IoTimeOutline />}
                            >
                              {activeEntry.response.durationMs} ms
                            </Chip>
                          </Stack>
                          <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            startDecorator={<IoCopyOutline />}
                            onClick={() =>
                              copyToClipboard(
                                activeEntry.response.markdown || "",
                                "Markdown response",
                              )
                            }
                          >
                            Copy Markdown
                          </Button>
                        </Stack>

                        {activeEntry.response.isError && (
                          <Alert color="warning" variant="soft">
                            Agent Context reported an error or partial result for this query.
                          </Alert>
                        )}

                        <Box
                          component="pre"
                          sx={{
                            m: 0,
                            p: 2,
                            borderRadius: "md",
                            bgcolor: "background.level1",
                            border: "1px solid",
                            borderColor: "divider",
                            fontFamily: "monospace",
                            fontSize: "0.82rem",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            maxHeight: 560,
                            overflowY: "auto",
                          }}
                        >
                          {activeEntry.response.markdown || "(empty response)"}
                        </Box>
                      </Stack>
                    </Card>
                  )}
                </Stack>
              </Grid>

              {/* Right rail: Recent Queries & Capabilities */}
              <Grid xs={12} lg={4}>
                <Stack spacing={2}>
                  <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                    <Typography level="title-sm" sx={{ mb: 1.5 }}>
                      Session Query History
                    </Typography>
                    {history.length === 0 ? (
                      <Typography level="body-xs" textColor="text.tertiary">
                        Queries you run in this session will appear here for quick comparison.
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {history.map((item) => (
                          <Box
                            key={item.id}
                            onClick={() => setActiveResultId(item.id)}
                            sx={{
                              p: 1.25,
                              borderRadius: "sm",
                              cursor: "pointer",
                              border: "1px solid",
                              borderColor:
                                activeEntry?.id === item.id ? "#2dd4bf" : "divider",
                              bgcolor:
                                activeEntry?.id === item.id
                                  ? "rgba(45, 212, 191, 0.08)"
                                  : "transparent",
                              "&:hover": { bgcolor: "background.level1" },
                            }}
                          >
                            <Typography
                              level="body-xs"
                              fontWeight={600}
                              noWrap
                              title={item.query}
                            >
                              {item.query}
                            </Typography>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ mt: 0.5 }}
                            >
                              <Typography level="body-xs" textColor="text.tertiary">
                                {item.product}
                              </Typography>
                              <Typography level="body-xs" textColor="text.tertiary">
                                {item.response.durationMs}ms · {item.timestamp}
                              </Typography>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Card>

                  <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                    <Typography level="title-sm" sx={{ mb: 1 }}>
                      How Agent Context Retrieval Works
                    </Typography>
                    <Stack spacing={1.25}>
                      <Typography level="body-xs" textColor="text.secondary">
                        <strong>1. Dual-Vector Hybrid Search:</strong> Combines BGE-M3 dense
                        semantic vectors with sparse BM25 keyword matching in Milvus.
                      </Typography>
                      <Typography level="body-xs" textColor="text.secondary">
                        <strong>2. GraphRAG Expansion:</strong> Traverses AST symbol imports
                        and Kustomize deployment topology edges up to{" "}
                        <code>max_hops</code>.
                      </Typography>
                      <Typography level="body-xs" textColor="text.secondary">
                        <strong>3. Cross-Encoder Reranking:</strong> Re-scores candidates via
                        Reciprocal Rank Fusion (RRF) before returning cited Markdown.
                      </Typography>
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          )}

          {/* TAB 2: INDEXED PRODUCTS & REPOS */}
          {activeTab === "products" && (
            <Stack spacing={2.5}>
              <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1.5}
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography level="title-md">Indexed Knowledge Products</Typography>
                    <Typography level="body-xs" textColor="text.tertiary">
                      Each product maps to an isolated Milvus vector &amp; graph collection.
                      Inspect repositories or switch your active product below.
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    to="/services"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    startDecorator={<IoLayersOutline />}
                  >
                    Map to Service Catalog
                  </Button>
                </Stack>

                {pantomathProducts.length === 0 ? (
                  <Alert color="neutral" variant="soft">
                    No Agent Context products are indexed for this team yet. Configure a product
                    under <code>config/products/&lt;product&gt;/sources.yaml</code> or run the
                    Agent Context sync job to populate Milvus.
                  </Alert>
                ) : (
                  <Table hoverRow sx={{ "--TableCell-paddingY": "12px" }}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Source</th>
                        <th style={{ textAlign: "right" }}>Repositories</th>
                        <th style={{ textAlign: "right" }}>Vector Chunks</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pantomathProducts.map((item) => {
                        const isScheduledDelete = item.status === "scheduled_delete";
                        const isSelected = inspectedProduct === item.product;
                        return (
                          <tr key={item.product}>
                            <td>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <IoGitNetworkOutline color="#2dd4bf" />
                                <Typography level="title-sm">{item.product}</Typography>
                              </Stack>
                            </td>
                            <td>
                              {isScheduledDelete ? (
                                <Chip size="sm" color="warning" variant="soft">
                                  Locked · Deletes {item.deleteAt || "soon"}
                                </Chip>
                              ) : (
                                <Chip
                                  size="sm"
                                  color="success"
                                  variant="soft"
                                  startDecorator={<IoCheckmarkCircleOutline />}
                                >
                                  Active
                                </Chip>
                              )}
                            </td>
                            <td>
                              <Chip size="sm" variant="outlined" color="neutral">
                                {item.source || "indexed"}
                              </Chip>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {formatNumber(item.repoCount)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {formatNumber(item.vectorChunks)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="flex-end"
                              >
                                <Button
                                  size="sm"
                                  variant={isSelected ? "solid" : "outlined"}
                                  color="neutral"
                                  startDecorator={<IoGitBranchOutline />}
                                  onClick={() =>
                                    setInspectedProduct(isSelected ? null : item.product)
                                  }
                                >
                                  {isSelected ? "Hide Repos" : "Inspect Repos"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="soft"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedProduct(item.product);
                                    navigate(playgroundPath);
                                  }}
                                >
                                  Query
                                </Button>
                                {isScheduledDelete && (
                                  <Button
                                    size="sm"
                                    variant="soft"
                                    color="warning"
                                    loading={setActiveProductMutation.isPending}
                                    onClick={() => handleSetActiveProduct(item.product)}
                                  >
                                    Set Active
                                  </Button>
                                )}
                              </Stack>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card>

              {/* Expanded Repo Inspector */}
              {inspectedProduct && (
                <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IoCodeSlashOutline size={20} color="#2dd4bf" />
                      <Typography level="title-md">
                        Repositories in <code>{inspectedProduct}</code>
                      </Typography>
                      {productRepos && (
                        <Chip size="sm" variant="soft" color="neutral">
                          {productRepos.count} repos ({productRepos.source})
                        </Chip>
                      )}
                    </Stack>
                    <IconButton
                      size="sm"
                      variant="outlined"
                      onClick={() => refetchRepos()}
                      aria-label="Refresh repositories"
                    >
                      <IoRefreshOutline />
                    </IconButton>
                  </Stack>

                  {reposLoading ? (
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 2 }}>
                      <CircularProgress size="sm" />
                      <Typography level="body-sm" textColor="text.secondary">
                        Loading indexed repositories...
                      </Typography>
                    </Stack>
                  ) : productRepos && productRepos.repos.length > 0 ? (
                    <Grid container spacing={1}>
                      {productRepos.repos.map((repo) => (
                        <Grid xs={12} sm={6} md={4} key={repo}>
                          <Box
                            sx={{
                              p: 1.25,
                              borderRadius: "sm",
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: "background.level1",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IoGitBranchOutline color="#2dd4bf" />
                            <Typography
                              level="body-xs"
                              sx={{ fontFamily: "monospace" }}
                              noWrap
                              title={repo}
                            >
                              {repo}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography level="body-sm" textColor="text.tertiary">
                      No indexed repositories returned for this product.
                    </Typography>
                  )}
                </Card>
              )}
            </Stack>
          )}

          {/* TAB 3: MCP & IDE SETUP */}
          {activeTab === "mcp" && (
            <Grid container spacing={2.5}>
              <Grid xs={12} lg={7}>
                <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Box>
                        <Typography level="title-md">Connect AI Agents via MCP</Typography>
                        <Typography level="body-xs" textColor="text.tertiary">
                          Drop this configuration into Antigravity, Cursor, or Claude Desktop
                          to give your coding agent live access to Agent Context.
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to="/settings/api-keys"
                        size="sm"
                        variant="outlined"
                        color="primary"
                        startDecorator={<IoKeyOutline />}
                      >
                        Manage API Keys
                      </Button>
                    </Stack>

                    <Tabs
                      value={mcpSnippetTab}
                      onChange={(_, v) => setMcpSnippetTab(String(v || "gateway"))}
                    >
                      <TabList size="sm">
                        <Tab value="gateway">Opsway Cloud Gateway (Recommended)</Tab>
                        <Tab value="local-http">Local Streamable HTTP</Tab>
                        <Tab value="stdio">Local stdio (uv)</Tab>
                      </TabList>
                    </Tabs>

                    <Box sx={{ position: "relative" }}>
                      <Button
                        size="sm"
                        variant="soft"
                        color="neutral"
                        startDecorator={<IoCopyOutline />}
                        onClick={() => copyToClipboard(activeSnippet, "MCP config")}
                        sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                      >
                        Copy
                      </Button>
                      <Box
                        component="pre"
                        sx={{
                          m: 0,
                          p: 2,
                          pr: 12,
                          borderRadius: "md",
                          bgcolor: "background.level1",
                          border: "1px solid",
                          borderColor: "divider",
                          fontFamily: "monospace",
                          fontSize: "0.82rem",
                          lineHeight: 1.6,
                          overflowX: "auto",
                        }}
                      >
                        {activeSnippet}
                      </Box>
                    </Box>

                    <Alert color="primary" variant="soft">
                      Using the Opsway Cloud Gateway automatically scopes Agent Context queries to
                      your team&apos;s tenant, enforces product quotas, and shares the same MCP
                      connection with Monitoring &amp; Log Search tools.
                    </Alert>
                  </Stack>
                </Card>
              </Grid>

              <Grid xs={12} lg={5}>
                <Card variant="outlined" sx={{ p: 2.5, bgcolor: "background.surface" }}>
                  <Stack spacing={2}>
                    <Typography level="title-md">Exposed MCP Tools</Typography>
                    {MCP_TOOLS_REFERENCE.map((tool) => (
                      <Box
                        key={tool.name}
                        sx={{
                          p: 1.5,
                          borderRadius: "md",
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.level1",
                        }}
                      >
                        <Typography
                          level="title-sm"
                          sx={{ fontFamily: "monospace", color: "#2dd4bf" }}
                        >
                          {tool.name}
                        </Typography>
                        <Typography
                          level="body-xs"
                          textColor="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {tool.description}
                        </Typography>
                        <Typography
                          level="body-xs"
                          textColor="text.tertiary"
                          sx={{ mt: 0.75, fontFamily: "monospace" }}
                        >
                          Args: {tool.params}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default PantomathPage;
