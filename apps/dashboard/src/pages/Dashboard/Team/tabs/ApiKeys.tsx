import { FunctionComponent, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import { IoTrashOutline, IoCopyOutline } from "react-icons/io5";
import { getApiKeys, createApiKey, deleteApiKey } from "../../../../api/endpoints/teams";
import { useCurrentTeam } from "../../../../hooks/team.query";
import { enqueueSnackbar } from "notistack";

const ApiKeysTabView: FunctionComponent = () => {
  const { data: team } = useCurrentTeam();
  const queryClient = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const { data, isLoading } = useQuery(
    ["team-apikeys", team?.id],
    () => getApiKeys(team!.id),
    { enabled: !!team }
  );

  const createMutation = useMutation(
    (name: string) => createApiKey(team!.id, { name }),
    {
      onSuccess: (res) => {
        setGeneratedKey(res.plaintextKey);
        queryClient.invalidateQueries(["team-apikeys", team?.id]);
      },
      onError: () => {
        enqueueSnackbar("Failed to create API key", { variant: "error" });
      }
    }
  );

  const deleteMutation = useMutation(
    (keyId: number) => deleteApiKey(team!.id, keyId),
    {
      onSuccess: () => {
        enqueueSnackbar("API key revoked", { variant: "success" });
        queryClient.invalidateQueries(["team-apikeys", team?.id]);
      },
      onError: () => {
        enqueueSnackbar("Failed to revoke API key", { variant: "error" });
      }
    }
  );

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    createMutation.mutate(newKeyName);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setNewKeyName("");
    setGeneratedKey(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar("Copied to clipboard", { variant: "success" });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6">API Keys</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage API keys to access Opsway programmatically or to scrape metrics using Prometheus.
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => setOpenCreate(true)}>
              Create new key
            </Button>
          </Stack>

          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Loading...</TableCell>
                  </TableRow>
                )}
                {!isLoading && data?.apiKeys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No API keys generated yet.</TableCell>
                  </TableRow>
                )}
                {data?.apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => deleteMutation.mutate(key.id)}>
                        <IoTrashOutline />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openCreate} onClose={generatedKey ? undefined : handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>
          {generatedKey ? "Save your new API key" : "Create a new API key"}
        </DialogTitle>
        <DialogContent>
          {generatedKey ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2" color="error">
                Please copy your API key and save it securely. You won't be able to see it again!
              </Typography>
              <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body1" sx={{ fontFamily: "monospace", wordBreak: "break-all", pr: 2 }}>
                  {generatedKey}
                </Typography>
                <IconButton onClick={() => handleCopy(generatedKey)}>
                  <IoCopyOutline />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                To use this for Prometheus metrics scraping, use the URL <code>/v1/teams/{team?.id}/metrics/prometheus</code> and set this API key as the Bearer token in your Prometheus scraper config.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                API keys allow you to authenticate with the Opsway API.
              </Typography>
              <TextField
                autoFocus
                label="Key name"
                fullWidth
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Prometheus Scraper"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {generatedKey ? (
            <Button onClick={handleCloseCreate} variant="contained">
              Done
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseCreate}>Cancel</Button>
              <Button onClick={handleCreate} variant="contained" disabled={!newKeyName.trim() || createMutation.isLoading}>
                Generate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApiKeysTabView;
