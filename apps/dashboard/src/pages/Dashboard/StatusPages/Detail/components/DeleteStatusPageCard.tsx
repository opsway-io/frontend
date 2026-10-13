import { Button } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusPage } from "../../../../../api/endpoints/statuspages";
import ConfirmDialog from "../../../../../components/ConfirmDialog/ConfirmDialog";
import { Restrict, Role } from "../../../../../components/Restrict";
import SettingsCard from "../../../../../components/SettingsCard/SettingsCard";
import { useDeleteStatusPage } from "../../../../../hooks/statuspages.query";
import { getErrorMessage } from "../../../../../utilities/errors";

interface DeleteStatusPageCardProps {
  statusPage: StatusPage;
}

const DeleteStatusPageCard: FunctionComponent<DeleteStatusPageCardProps> = ({
  statusPage,
}) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteStatusPage, isPending } = useDeleteStatusPage();

  const handleDelete = async () => {
    try {
      await deleteStatusPage(statusPage.id);
      enqueueSnackbar("Status page deleted", { variant: "success" });
      navigate("/status-pages");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to delete status page"), {
        variant: "error",
      });
    }
  };

  return (
    <Restrict min={Role.ADMIN}>
      <SettingsCard
        danger
        title="Delete status page"
        description="Permanently delete this status page. Visitors of the domain will no longer see it."
        actions={
          <Button color="danger" onClick={() => setConfirmOpen(true)}>
            Delete status page
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Status Page?"
        confirmLabel="Delete"
        loading={isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      >
        Are you sure you want to delete {statusPage.name}? This action cannot be
        undone.
      </ConfirmDialog>
    </Restrict>
  );
};

export default DeleteStatusPageCard;
