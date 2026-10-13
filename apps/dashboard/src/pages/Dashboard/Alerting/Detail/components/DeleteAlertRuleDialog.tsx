import { Button, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../../components/Dialog/Dialog";
import { useDeleteAlertRule } from "../../../../../hooks/alerting.query";

interface DeleteAlertRuleDialogProps {
  ruleId: number;
  open: boolean;
  onClose: () => void;
}

const DeleteAlertRuleDialog: FunctionComponent<DeleteAlertRuleDialogProps> = ({
  ruleId,
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const { mutateAsync: deleteAlertRule, isPending } = useDeleteAlertRule();

  const handleDelete = async () => {
    try {
      await deleteAlertRule(ruleId);
      enqueueSnackbar("Alert rule deleted", { variant: "success" });
      navigate("/alerting");
    } catch (error) {
      enqueueSnackbar((error as Error).message || "Failed to delete", {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Delete Alert Rule?"
      maxWidth="xs"
    >
      <DialogContent>
        <Typography level="body-md" textColor="text.secondary">
          Are you sure you want to delete this alert rule? You will no longer
          receive notifications for it.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete} loading={isPending}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAlertRuleDialog;
