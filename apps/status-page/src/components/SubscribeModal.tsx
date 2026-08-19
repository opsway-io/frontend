import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { subscribeToStatusPage } from "../api";

interface Props {
  open: boolean;
  onClose: () => void;
  domain: string;
}

const SubscribeModal: FunctionComponent<Props> = ({ open, onClose, domain }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await subscribeToStatusPage(domain, email);
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
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Subscribe to Updates</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText mb={2}>
            Get notified via email whenever opsway creates, updates, or resolves an incident.
          </DialogContentText>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success ? (
            <Alert severity="success">
              Subscription request sent! Please check your email to verify your subscription.
            </Alert>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {success ? "Close" : "Cancel"}
          </Button>
          {!success && (
            <Button type="submit" variant="contained" color="primary" disabled={loading || !email}>
              Subscribe
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubscribeModal;
