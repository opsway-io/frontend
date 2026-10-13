import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FormEvent, FunctionComponent, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import CodeSnippet from "../../../../components/CodeSnippet/CodeSnippet";
import { useCreateApiKey } from "../../../../hooks/apikeys.query";

interface CreateApiKeyDialogProps {
  teamId: number;
  onClose: () => void;
}

/**
 * Asks for a key name, then shows the generated key once. Mount only while
 * open so every opening starts with an empty form.
 */
const CreateApiKeyDialog: FunctionComponent<CreateApiKeyDialogProps> = ({
  teamId,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const { mutate, isPending } = useCreateApiKey();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isPending) return;

    mutate(name.trim(), {
      onSuccess: (response) => setGeneratedKey(response.plaintextKey),
      onError: () => {
        enqueueSnackbar("Failed to create API key", { variant: "error" });
      },
    });
  };

  return (
    // The generated key is shown only once, so require an explicit "Done".
    <Modal open onClose={generatedKey ? undefined : onClose}>
      <ModalDialog sx={{ width: 520, maxWidth: "calc(100vw - 32px)" }}>
        {!generatedKey && <ModalClose />}
        <DialogTitle>
          {generatedKey ? "Save your new API key" : "Create a new API key"}
        </DialogTitle>

        {generatedKey ? (
          <>
            <DialogContent sx={{ py: 1 }}>
              <Stack spacing={2}>
                <Alert
                  color="warning"
                  variant="soft"
                  startDecorator={<IoWarningOutline size={18} />}
                >
                  Please copy your API key and save it securely. You won't be
                  able to see it again!
                </Alert>
                <CodeSnippet code={generatedKey} />
                <Typography level="body-sm" textColor="text.secondary">
                  To use this for Prometheus metrics scraping, use the URL{" "}
                  <Box
                    component="code"
                    sx={{
                      fontFamily: "code",
                      fontSize: "0.85em",
                      px: 0.5,
                      py: 0.25,
                      borderRadius: "xs",
                      bgcolor: "background.level2",
                      color: "text.primary",
                    }}
                  >
                    /v1/teams/{teamId}/metrics/prometheus
                  </Box>{" "}
                  and set this API key as the Bearer token in your Prometheus
                  scraper config.
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{ flexDirection: "row", justifyContent: "flex-end", pt: 1 }}
            >
              <Button onClick={onClose}>Done</Button>
            </DialogActions>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            <DialogContent sx={{ py: 1 }}>
              <Stack spacing={2}>
                <Typography level="body-sm" textColor="text.secondary">
                  API keys allow you to authenticate with the Opsway API.
                </Typography>
                <FormControl>
                  <FormLabel>Key name</FormLabel>
                  <Input
                    // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of a dialog the user just opened
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prometheus Scraper"
                  />
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{ flexDirection: "row", justifyContent: "flex-end", pt: 1 }}
            >
              <Button variant="plain" color="neutral" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim()} loading={isPending}>
                Generate
              </Button>
            </DialogActions>
          </form>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default CreateApiKeyDialog;
