import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface EmailsDialogProps {
    open: boolean;
    onClose?: () => void;
    onSubmit?: () => void;
}

const EmailsDialog: FunctionComponent<EmailsDialogProps> = (props) => {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Stack direction="row" alignItems="center">
                    <span>Invite people</span>
                    <IconButton
                        aria-label="close"
                        onClick={props.onClose}
                        sx={{
                            marginLeft: "auto",
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 2 }}>
                <Typography variant="body2">
                    Invite people to join your team.
                </Typography>
                
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button color="success" variant="contained" onClick={props.onSubmit}>Send invites</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailsDialog;
