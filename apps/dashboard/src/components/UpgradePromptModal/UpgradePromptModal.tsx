import { Box, Button, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { FunctionComponent } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { Dialog, DialogActions, DialogContent } from "../Dialog/Dialog";

interface UpgradePromptModalProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

const UpgradePromptModal: FunctionComponent<UpgradePromptModalProps> = ({
  open,
  onClose,
  featureName,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/settings/billing");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component={HiOutlineSparkles}
            sx={{ color: "warning.500", flexShrink: 0 }}
          />
          Upgrade required
        </Box>
      }
    >
      <DialogContent>
        <Typography level="body-md" textColor="text.secondary">
          You have reached the limit for {featureName || "this feature"} on your
          current plan. Please upgrade your team's subscription to unlock higher
          limits and continue growing!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleUpgrade}>View plans</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradePromptModal;
