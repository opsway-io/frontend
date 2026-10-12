import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { subscribeToStatusPage } from "../api";

interface Props {
  open: boolean;
  onClose: () => void;
  domain: string;
}

const SubscribeModal: FunctionComponent<Props> = ({
  open,
  onClose,
  domain,
}) => {
  const [channel, setChannel] = useState<"EMAIL" | "WEBHOOK" | "SLACK">("EMAIL");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await subscribeToStatusPage(domain, email, channel, destination);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setEmail("");
      setDestination("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Subscribe to Updates</DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs value={channel} onChange={(_, val) => setChannel(val)}>
          <Tab label="Email" value="EMAIL" />
          <Tab label="Webhook" value="WEBHOOK" />
          <Tab label="Slack" value="SLACK" />
        </Tabs>
      </Box>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText mb={2}>
            {channel === "EMAIL" && "Get notified via email whenever an incident or maintenance is created or resolved."}
            {channel === "WEBHOOK" && "Receive JSON HTTP POST payloads directly to your monitoring system or incident bot."}
            {channel === "SLACK" && "Post live incident notifications directly to your team's Slack incoming webhook."}
          </DialogContentText>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success ? (
            <Alert severity="success">
              {channel === "EMAIL"
                ? "Subscription request sent! Please check your email to verify your subscription."
                : "Subscription created successfully! You will receive live incident alerts."}
            </Alert>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                autoFocus
                label={channel === "EMAIL" ? "Email Address" : "Notification Contact Email"}
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              {channel === "WEBHOOK" && (
                <TextField
                  label="Webhook Endpoint URL"
                  type="url"
                  placeholder="https://example.com/alerts"
                  fullWidth
                  variant="outlined"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  disabled={loading}
                />
              )}
              {channel === "SLACK" && (
                <TextField
                  label="Slack Webhook URL"
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  fullWidth
                  variant="outlined"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  disabled={loading}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {success ? "Close" : "Cancel"}
          </Button>
          {!success && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !email || (channel !== "EMAIL" && !destination)}
            >
              Subscribe
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubscribeModal;
