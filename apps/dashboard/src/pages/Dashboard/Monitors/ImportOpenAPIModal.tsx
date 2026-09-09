import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocations } from "../../../hooks/prober.query";
import useAuthenticationStore from "../../../hooks/authentication.store";
import {
  previewOpenAPI,
  createMonitorsBulk,
  PreviewOpenAPIEndpoint,
  CreateMonitorsBulkRequest,
} from "../../../api/endpoints/monitors";
import toast from "react-hot-toast";

interface ImportOpenAPIModalProps {
  open: boolean;
  onClose: () => void;
}

const ImportOpenAPIModal: FunctionComponent<ImportOpenAPIModalProps> = ({
  open,
  onClose,
}) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const queryClient = useQueryClient();

  const [url, setUrl] = useState("");
  const [endpoints, setEndpoints] = useState<PreviewOpenAPIEndpoint[]>([]);
  const [selectedEndpoints, setSelectedEndpoints] = useState<number[]>([]);
  const [step, setStep] = useState<"INPUT" | "SELECT">("INPUT");
  const [baseUrl, setBaseUrl] = useState("");

  const [authMethod, setAuthMethod] = useState<"NONE" | "BASIC" | "OAUTH2_CLIENT_CREDENTIALS">("NONE");
  const [authUrl, setAuthUrl] = useState("");
  const [authClientId, setAuthClientId] = useState("");
  const [authClientSecret, setAuthClientSecret] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["global"]);

  const { data: locationsData } = useLocations();
  const availableLocations = locationsData?.locations || [];

  const previewMutation = useMutation(
    async (importUrl: string) => {
      return previewOpenAPI(teamId!, importUrl);
    },
    {
      onSuccess: (data) => {
        setEndpoints(data.endpoints);
        setSelectedEndpoints(data.endpoints.map((_, i) => i)); // select all by default
        
        try {
          const parsedUrl = new URL(url);
          setBaseUrl(parsedUrl.origin);
        } catch (e) {
          // ignore invalid url if backend somehow accepted it
        }

        if (data.auth) {
          setAuthMethod(data.auth.method);
          if (data.auth.tokenUrl) setAuthUrl(data.auth.tokenUrl);
        } else {
          setAuthMethod("NONE");
        }
        setStep("SELECT");
      },
      onError: () => {
        toast.error("Failed to parse OpenAPI spec from the provided URL.");
      },
    },
  );

  const importMutation = useMutation(
    async () => {
      const selected = selectedEndpoints.map((i) => endpoints[i]);
      const req: CreateMonitorsBulkRequest = {
        monitors: selected.map((ep) => ({
          name: ep.summary || `${ep.method.toUpperCase()} ${ep.path}`,
          settings: {
            method: ep.method.toUpperCase() as any,
            url: baseUrl ? `${baseUrl.replace(/\/$/, "")}/${ep.path.replace(/^\//, "")}` : ep.path,
            frequencySeconds: 60,
            body: {
              type: ep.requestBody ? "JSON" : "NONE",
              content: ep.requestBody || null,
            },
            tls: {
              enabled: true,
              verifyHostname: true,
              checkExpiration: true,
              expirationThresholdDays: 7,
            },
            auth: {
              method: authMethod,
              tokenUrl: authUrl ? (baseUrl && !authUrl.startsWith("http") ? `${baseUrl.replace(/\/$/, "")}/${authUrl.replace(/^\//, "")}` : authUrl) : undefined,
              clientId: authClientId || undefined,
              clientSecret: authClientSecret || undefined,
              username: authUsername || undefined,
              password: authPassword || undefined,
            },
            locations: selectedLocations.length > 0 ? selectedLocations : ["global"],
          },
          assertions: [
            {
              source: "STATUS_CODE",
              operator: "EQUAL",
              target: ep.statusCode || "200",
            },
          ],
        })),
      };
      return createMonitorsBulk(teamId!, req);
    },
    {
      onSuccess: () => {
        toast.success(
          `Successfully imported ${selectedEndpoints.length} monitors!`,
        );
        queryClient.invalidateQueries(["teams", teamId, "monitors"]);
        handleClose();
      },
      onError: (err: any) => {
        if (err?.response?.status === 402) {
          toast.error("You have reached your plan limit for monitors.");
        } else {
          toast.error("Failed to import monitors.");
        }
      },
    },
  );

  const handleClose = () => {
    setUrl("");
    setBaseUrl("");
    setEndpoints([]);
    setSelectedEndpoints([]);
    setStep("INPUT");
    onClose();
  };

  const handleToggle = (index: number) => {
    const currentIndex = selectedEndpoints.indexOf(index);
    const newChecked = [...selectedEndpoints];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedEndpoints(newChecked);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import from OpenAPI</DialogTitle>
      <DialogContent dividers>
        {step === "INPUT" && (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Provide a public URL to your OpenAPI (Swagger) `openapi.json`
              file. We will parse the endpoints, expected status codes, and
              request bodies.
            </Typography>
            <TextField
              fullWidth
              label="OpenAPI URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/openapi.json"
              autoFocus
            />
          </Stack>
        )}

        {step === "SELECT" && (
          <Stack spacing={2}>
            <Alert severity="info">
              Discovered {endpoints.length} endpoints. Select the ones you want
              to monitor.
            </Alert>
            <TextField
              label="Base URL"
              variant="outlined"
              size="small"
              fullWidth
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              helperText="This URL will be prepended to all imported endpoint paths."
            />
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
                "& ul": { padding: 0 },
              }}
            >
              {endpoints.map((ep, i) => (
                <ListItem
                  key={i}
                  disablePadding
                  secondaryAction={
                    <Typography variant="caption" color="text.secondary">
                      Expect {ep.statusCode}
                    </Typography>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedEndpoints.indexOf(i) !== -1}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleToggle(i)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      ep.summary || `${ep.method.toUpperCase()} ${ep.path}`
                    }
                    secondary={`${ep.method.toUpperCase()} ${ep.path}`}
                  />
                </ListItem>
              ))}
            </List>

            {authMethod !== "NONE" && (
              <Stack spacing={2} sx={{ mt: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
                <Typography variant="subtitle2">Global Authentication Settings</Typography>
                <Typography variant="caption" color="text.secondary">
                  The backend detected that this API requires authentication. These credentials will be applied to all imported monitors.
                </Typography>

                {authMethod === "OAUTH2_CLIENT_CREDENTIALS" && (
                  <Stack spacing={2}>
                    <TextField
                      label="Token Endpoint URL"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={authUrl}
                      onChange={(e) => setAuthUrl(e.target.value)}
                    />
                    <Stack spacing={2} direction="row">
                      <TextField
                        label="Client ID"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={authClientId}
                        onChange={(e) => setAuthClientId(e.target.value)}
                      />
                      <TextField
                        label="Client Secret"
                        type="password"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={authClientSecret}
                        onChange={(e) => setAuthClientSecret(e.target.value)}
                      />
                    </Stack>
                  </Stack>
                )}

                {authMethod === "BASIC" && (
                  <Stack spacing={2} direction="row">
                    <TextField
                      label="Username"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </Stack>
                )}
              </Stack>
            )}

            {availableLocations.length > 0 && (
              <Stack spacing={2} sx={{ mt: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
                <Typography variant="subtitle2">Locations</Typography>
                <Typography variant="caption" color="text.secondary">
                  Select the locations to run these monitors from.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {availableLocations.map((loc) => (
                    <Button
                      key={loc}
                      variant={selectedLocations.includes(loc) ? "contained" : "outlined"}
                      size="small"
                      onClick={() => {
                        setSelectedLocations(prev =>
                          prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
                        );
                      }}
                    >
                      {loc}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        {step === "INPUT" && (
          <Button
            onClick={() => previewMutation.mutate(url)}
            variant="contained"
            color="primary"
            disabled={!url || previewMutation.isLoading}
            startIcon={
              previewMutation.isLoading ? <CircularProgress size={16} /> : null
            }
          >
            Fetch Endpoints
          </Button>
        )}
        {step === "SELECT" && (
          <Button
            onClick={() => importMutation.mutate()}
            variant="contained"
            color="primary"
            disabled={
              selectedEndpoints.length === 0 || importMutation.isLoading
            }
            startIcon={
              importMutation.isLoading ? <CircularProgress size={16} /> : null
            }
          >
            Import {selectedEndpoints.length} Monitors
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportOpenAPIModal;
