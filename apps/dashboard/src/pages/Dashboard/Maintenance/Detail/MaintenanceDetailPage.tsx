import { Button, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IMaintenanceWindow } from "../../../../api/endpoints/maintenance";
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";
import Container from "../../../../components/Container/Container";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { Restrict, Role } from "../../../../components/Restrict";
import {
  useDeleteMaintenanceWindow,
  useMaintenanceWindow,
  useUpdateMaintenanceWindow,
} from "../../../../hooks/maintenance.query";
import { getErrorMessage } from "../../../../utilities/errors";
import { toMaintenanceFormValues } from "../maintenanceForm";
import { getMaintenanceStatus } from "../maintenanceStatus";
import MaintenanceEditForm from "./components/MaintenanceEditForm";
import MaintenanceStatusAlert from "./components/MaintenanceStatusAlert";

/** End time for "complete early": now, but always after the start time. */
const earlyEndAt = (maintenanceWindow: IMaintenanceWindow) => {
  const start = new Date(maintenanceWindow.settings.startAt);
  const now = new Date();
  return (now > start ? now : new Date(start.getTime() + 1000)).toISOString();
};

const MaintenanceDetailPage: FunctionComponent = () => {
  const params = useParams();
  const id = Number(params.id);
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const { data: maintenanceWindow, isPending } = useMaintenanceWindow(id);
  const { mutateAsync: updateMaintenance, isPending: isUpdating } =
    useUpdateMaintenanceWindow(id);
  const { mutateAsync: deleteMaintenance, isPending: isDeleting } =
    useDeleteMaintenanceWindow();

  const handleDelete = async () => {
    try {
      await deleteMaintenance(id);
      enqueueSnackbar("Maintenance window deleted", { variant: "success" });
      navigate("..");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to delete"), {
        variant: "error",
      });
    }
  };

  const handleCompleteEarly = async () => {
    if (!maintenanceWindow) return;

    try {
      await updateMaintenance({
        ...toMaintenanceFormValues(maintenanceWindow),
        endAt: earlyEndAt(maintenanceWindow),
      });
      enqueueSnackbar(
        "Maintenance window completed. Monitors will resume within 1 minute.",
        { variant: "success", autoHideDuration: 6000 },
      );
      navigate("/maintenance");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to complete early"), {
        variant: "error",
      });
    } finally {
      setCompleteOpen(false);
    }
  };

  if (isPending) {
    return (
      <Container header="Loading...">
        <Placeholder />
      </Container>
    );
  }

  if (!maintenanceWindow) {
    return (
      <Container header="Not Found">
        <div>Maintenance window not found</div>
      </Container>
    );
  }

  const status = getMaintenanceStatus(maintenanceWindow);

  return (
    <>
      <Container
        header={maintenanceWindow.title}
        breadcrumbs={[
          <Link to="/maintenance" key="maintenance">
            Maintenance
          </Link>,
          <span key="detail">{maintenanceWindow.title}</span>,
        ]}
        primaryActions={[
          status === "ACTIVE" && (
            <Restrict min={Role.ADMIN} key="complete">
              <Button
                color="warning"
                variant="outlined"
                onClick={() => setCompleteOpen(true)}
              >
                Complete Early
              </Button>
            </Restrict>
          ),
          <Restrict min={Role.ADMIN} key="delete">
            <Button
              color="danger"
              variant="outlined"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </Restrict>,
        ].filter(Boolean)}
      >
        <Stack spacing={2}>
          <MaintenanceStatusAlert status={status} />
          <MaintenanceEditForm
            key={maintenanceWindow.updatedAt}
            maintenanceWindow={maintenanceWindow}
          />
        </Stack>
      </Container>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Maintenance Window?"
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      >
        Are you sure you want to delete this maintenance window? This action
        cannot be undone.
      </ConfirmDialog>

      <ConfirmDialog
        open={completeOpen}
        title="Complete Maintenance Early?"
        confirmLabel="Complete Early"
        confirmColor="warning"
        loading={isUpdating}
        onConfirm={handleCompleteEarly}
        onClose={() => setCompleteOpen(false)}
      >
        Are you sure you want to end this maintenance window right now? All
        associated monitors will resume checks.
      </ConfirmDialog>
    </>
  );
};

export default MaintenanceDetailPage;
