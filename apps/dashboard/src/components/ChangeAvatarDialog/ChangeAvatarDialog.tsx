import { FunctionComponent } from "react";
import { Dialog } from "../Dialog/Dialog";
import AvatarCropForm from "./AvatarCropForm";

interface ChangeAvatarDialogProps {
  title?: string;
  open: boolean;
  /** Uploads the cropped image. */
  onUpload: (image: Blob) => Promise<unknown>;
  onClose?: (ok: boolean) => void;
}

/**
 * Lets the user pick an image (drop or browse), crop it to a square and
 * upload it through `onUpload`. The form state resets whenever the dialog
 * closes because its content unmounts.
 */
const ChangeAvatarDialog: FunctionComponent<ChangeAvatarDialogProps> = ({
  title = "Change avatar",
  open,
  onUpload,
  onClose,
}) => (
  <Dialog title={title} open={open} onClose={() => onClose?.(false)}>
    <AvatarCropForm onUpload={onUpload} onUploaded={() => onClose?.(true)} />
  </Dialog>
);

export default ChangeAvatarDialog;
