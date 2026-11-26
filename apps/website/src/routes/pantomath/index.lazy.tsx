import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import {
  IoArrowForward,
  IoCheckmarkCircle,
  IoCodeSlashOutline,
  IoGitNetworkOutline,
  IoLayersOutline,
  IoSearchOutline,
  IoServerOutline,
  IoSparklesOutline,
  IoTerminalOutline,
} from "react-icons/io5";

export const Route = createLazyFileRoute("/pantomath/")({
  component: PantomathProductPage,
});

const CAPABILITIES = [
  {
    icon: <IoCodeSlashOutline size={22} />,
    title: "Tree-sitter AST Intelligence",
    description:
      "Parses Python, Go, and TypeScript/JavaScript repositories into structural AST chunks and symbol call graphs rather than naive text splits.",
  },
  {
    icon: <IoLayersOutline size={22} />,
    title: "Kustomize & Infra Topology",
    description:
      "Inspects GitOps Kubernetes manifests and Kustomize overlays to map deployments, ingresses, Kafka/RabbitMQ queues, HTTP services, and databases.",
  },
  {
    icon: <IoSearchOutline size={22} />,
    title: "Milvus Hybrid Search + RRF",
    description:
      "Combines dense BGE-M3 semantic vectors with sparse BM25 keyword matching and Cross-Encoder Reciprocal Rank Fusion reranking.",
  },
  {
    icon: <IoTerminalOutline size={22} />,
    title: "Native Model Context Protocol",
    description:
      "Connect Antigravity, Cursor, Claude Desktop, or Opsway Autonomous SRE Agents directly to your private knowledge graph over Streamable HTTP MCP.",
  },
];

const CONNECTORS = [
  "Git Repositories (AST + Commits)",
  "Kubernetes & Kustomize Overlays",
  "Jira Issues & Epics",
  "Confluence Spaces",
  "GitHub Projects",
  "Recursive Web Documentation Crawler",
];

const MCP_CONFIG_SNIPPET = `{
  "mcpServers": {
    "opsway": {
      "type": "http",
      "url": "https://api.opsway.eu/v1/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_OPSWAY_API_KEY>"
      }
    }
  }
}`;

function PantomathProductPage() {
  return (
    <>
      <Helmet>
        <title>Pantomath — Code &amp; Infrastructure GraphRAG | Opsway</title>
        <meta
          name="description"
          content="Pantomath maps source code ASTs, Kubernetes Kustomize topologies, and engineering docs into a Milvus Hybrid Search GraphRAG server exposed over MCP."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          borderBottom: "1px solid",
          borderColor: "divider",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(45, 212, 191, 0.14) 0%, transparent 65%)",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Chip
              size="md"
              variant="soft"
              startDecorator={<IoGitNetworkOutline />}
              sx={{
                bgcolor: "rgba(45, 212, 191, 0.14)",
                color: "#2dd4bf",
                fontWeight: 600,
              }}
            >
              Opsway Pantomath · Code &amp; Infra GraphRAG
            </Chip>

            <Typography
              level="h1"
              sx={{
                fontSize: { xs: "2.25rem", md: "3.5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                maxWidth: 860,
              }}
            >
              Give your engineers and AI agents a live map of your entire stack.
            </Typography>

            <Typography
              level="body-lg"
              textColor="text.secondary"
              sx={{ maxWidth: 680, fontSize: { xs: "md", md: "lg" } }}
            >
              Pantomath indexes source code ASTs, Kubernetes Kustomize topologies,
              and internal documentation into a multi-tenant Milvus Hybrid GraphRAG
              engine—queryable from the web playground or over MCP.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 1 }}
            >
              <Button
                component="a"
                href="https://pantomath.opsway.eu"
                size="lg"
                endDecorator={<IoArrowForward />}
                sx={{
                  bgcolor: "#0f766e",
                  "&:hover": { bgcolor: "#115e59" },
                }}
              >
                Launch Pantomath
              </Button>
              <Button
                component={Link}
                to="/pricing"
                size="lg"
                variant="outlined"
                color="neutral"
              >
                View Pricing
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Capabilities Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Stack spacing={1.5} sx={{ mb: 5 }}>
          <Typography level="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}>
            Built for real multi-repo architectures
          </Typography>
          <Typography level="body-md" textColor="text.secondary" sx={{ maxWidth: 640 }}>
            Generic RAG breaks down on microservices and GitOps clusters. Pantomath
            understands code structure, cross-repo dependencies, and deployment
            overlays natively.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {CAPABILITIES.map((cap) => (
            <Grid xs={12} md={6} key={cap.title}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "background.surface",
                  borderColor: "divider",
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "md",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(45, 212, 191, 0.14)",
                      color: "#2dd4bf",
                    }}
                  >
                    {cap.icon}
                  </Box>
                  <Typography level="title-lg" fontWeight={700}>
                    {cap.title}
                  </Typography>
                  <Typography level="body-md" textColor="text.secondary">
                    {cap.description}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* MCP & Suite Integration Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.level1",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid xs={12} md={6}>
              <Stack spacing={2.5}>
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  startDecorator={<IoSparklesOutline />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Model Context Protocol (MCP)
                </Chip>
                <Typography level="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.1rem" } }}>
                  Plug directly into Antigravity, Cursor, Claude &amp; Opsway Agents
                </Typography>
                <Typography level="body-md" textColor="text.secondary">
                  One MCP endpoint exposes your entire indexed codebase and
                  infrastructure topology alongside Opsway Monitoring and Log Search.
                  When an incident fires, Autonomous Agents automatically query
                  Pantomath to pinpoint the exact file and manifest involved.
                </Typography>

                <Divider />

                <Typography level="title-sm">Supported Ecosystem Connectors</Typography>
                <Grid container spacing={1}>
                  {CONNECTORS.map((connector) => (
                    <Grid xs={12} sm={6} key={connector}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IoCheckmarkCircle color="#2dd4bf" />
                        <Typography level="body-sm" textColor="text.secondary">
                          {connector}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>

            <Grid xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: "background.surface",
                  borderColor: "neutral.700",
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IoServerOutline color="#2dd4bf" />
                    <Typography level="title-sm" sx={{ fontFamily: "monospace" }}>
                      mcp.json · Opsway Unified MCP Gateway
                    </Typography>
                  </Stack>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      p: 2,
                      borderRadius: "md",
                      bgcolor: "background.body",
                      border: "1px solid",
                      borderColor: "divider",
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      overflowX: "auto",
                    }}
                  >
                    {MCP_CONFIG_SNIPPET}
                  </Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Deploy Pantomath in Opsway Cloud or self-host in your private
                    Kubernetes cluster with Milvus 2.6+ and BGE-M3.
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 10 }, textAlign: "center" }}>
        <Stack spacing={2.5} alignItems="center">
          <Typography level="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}>
            Ready to index your architecture?
          </Typography>
          <Typography level="body-md" textColor="text.secondary" sx={{ maxWidth: 560 }}>
            Start querying your repositories and Kubernetes manifests in minutes with
            Pantomath inside the Opsway Suite.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component="a"
              href="https://pantomath.opsway.eu"
              size="lg"
              endDecorator={<IoArrowForward />}
              sx={{
                bgcolor: "#0f766e",
                "&:hover": { bgcolor: "#115e59" },
              }}
            >
              Open Pantomath Workspace
            </Button>
            <Button
              component="a"
              href="https://pantomath.opsway.eu/info/pantomath"
              size="lg"
              variant="outlined"
              color="neutral"
            >
              Read Operational Guide
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
