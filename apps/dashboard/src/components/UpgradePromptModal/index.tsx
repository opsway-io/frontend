import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";

interface UpgradePromptModalProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  open,
  onClose,
  featureName,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/team/subscription");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <HiOutlineSparkles style={{ color: "#f59e0b" }} />
        Upgrade Required
      </DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <DialogContentText>
          You have reached the limit for {featureName || "this feature"} on your
          current plan. Please upgrade your team's subscription to unlock higher
          limits and continue growing!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleUpgrade} variant="contained" color="primary">
          View Plans
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradePromptModal;
