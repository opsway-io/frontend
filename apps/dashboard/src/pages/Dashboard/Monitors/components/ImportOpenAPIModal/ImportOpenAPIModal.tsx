import { FunctionComponent } from "react";
import { Dialog } from "../../../../../components/Dialog/Dialog";
import ImportOpenAPIWizard from "./ImportOpenAPIWizard";

interface ImportOpenAPIModalProps {
  open: boolean;
  onClose: () => void;
}

const ImportOpenAPIModal: FunctionComponent<ImportOpenAPIModalProps> = (
  props,
) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="sm"
      title="Import from OpenAPI"
    >
      <ImportOpenAPIWizard onClose={props.onClose} />
    </Dialog>
  );
};

export default ImportOpenAPIModal;
