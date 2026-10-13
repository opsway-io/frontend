import { Button, ColorPaletteProp, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { Dialog, DialogActions, DialogContent } from "../Dialog/Dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  /** Explanation shown in the dialog body. */
  children: ReactNode;
  confirmLabel: string;
  confirmColor?: ColorPaletteProp;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** Small "are you sure?" dialog with cancel + confirm buttons. */
const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({
  open,
  title,
  children,
  confirmLabel,
  confirmColor = "danger",
  loading,
  onConfirm,
  onClose,
}) => (
  <Dialog open={open} onClose={onClose} title={title} maxWidth="xs">
    <DialogContent>
      <Typography level="body-md" textColor="text.secondary">
        {children}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" color="neutral" onClick={onClose}>
        Cancel
      </Button>
      <Button color={confirmColor} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
