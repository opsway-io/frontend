import {
  DialogActions as JoyDialogActions,
  DialogContent as JoyDialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  ModalDialogProps,
} from "@mui/joy";
import { DialogActionsProps } from "@mui/joy/DialogActions";
import { DialogContentProps } from "@mui/joy/DialogContent";
import { FunctionComponent, ReactNode } from "react";

type CloseReason = "backdropClick" | "escapeKeyDown" | "closeClick";

interface DialogProps {
  open: boolean;
  onClose?: (event: object, reason: CloseReason) => void;
  title?: ReactNode;
  showTitle?: boolean;
  children?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg";
  size?: ModalDialogProps["size"];
  sx?: ModalDialogProps["sx"];
}

const widths = {
  xs: 400,
  sm: 520,
  md: 720,
  lg: 960,
};

const Dialog: FunctionComponent<DialogProps> = ({
  open,
  onClose,
  title,
  showTitle = true,
  children,
  maxWidth = "sm",
  size,
  sx,
}) => {
  return (
    <Modal open={open} onClose={(e, reason) => onClose?.(e, reason)}>
      <ModalDialog
        size={size}
        sx={{
          width: widths[maxWidth],
          maxWidth: "calc(100vw - 32px)",
          ...sx,
        }}
      >
        <ModalClose />
        {showTitle && title && <DialogTitle>{title}</DialogTitle>}
        {children}
      </ModalDialog>
    </Modal>
  );
};

const DialogContent: FunctionComponent<DialogContentProps> = (props) => {
  return <JoyDialogContent {...props} sx={{ py: 1, ...props.sx }} />;
};

const DialogActions: FunctionComponent<DialogActionsProps> = (props) => {
  // Joy renders actions in reverse order by default; keep source order so
  // the primary action placed last ends up on the right.
  return (
    <JoyDialogActions
      {...props}
      sx={{
        flexDirection: "row",
        justifyContent: "flex-end",
        pt: 1,
        ...props.sx,
      }}
    />
  );
};

export { Dialog, DialogContent, DialogActions };
