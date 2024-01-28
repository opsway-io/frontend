import { FunctionComponent } from "react";
import {
  alpha,
  Box,
  Dialog as MuiDialog,
  DialogActionsProps,
  DialogContent as MuiDialogContent,
  DialogContentProps,
  DialogProps as MuiDialogProps,
  DialogTitle,
  DialogActions as MuiDialogActions,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DialogProps extends MuiDialogProps {
  title?: string;
  showTitle?: boolean;
}

const Dialog: FunctionComponent<DialogProps> = (props) => {
  return (
    <MuiDialog
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        sx: {
          minHeight: 200,
          minWidth: 500,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
          padding: 2,
        }}
      >
        <Stack direction="row" alignItems="center">
          <span>{props.title}</span>
          <IconButton
            aria-label="close"
            onClick={(e) => props.onClose?.(e, "escapeKeyDown")}
            sx={{
              marginLeft: "auto",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {props.children}
    </MuiDialog>
  );
};

Dialog.defaultProps = {
  showTitle: true,
};

const DialogContent: FunctionComponent<DialogContentProps> = (props) => {
  return (
    <MuiDialogContent
      {...props}
      sx={{
        padding: 0,
        marginTop: 2,
        marginBottom: 2,
        ...props.sx,
      }}
    >
      <Box
        sx={{
          padding: 2,
        }}
      >
        {props.children}
      </Box>
    </MuiDialogContent>
  );
};

const DialogActions: FunctionComponent<DialogActionsProps> = (props) => {
  return (
    <MuiDialogActions
      {...props}
      sx={{
        padding: 2,
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
        ...props.sx,
      }}
    >
      {props.children}
    </MuiDialogActions>
  );
};

export { Dialog, DialogContent, DialogActions };
export type { DialogProps };
