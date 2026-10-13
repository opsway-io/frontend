import { Button, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";
import Container from "../../../../components/Container/Container";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { Restrict, Role } from "../../../../components/Restrict";
import {
  useDeleteHeartbeat,
  useHeartbeat,
} from "../../../../hooks/heartbeats.query";
import { getErrorMessage } from "../../../../utilities/errors";
import HeartbeatEditForm from "./components/HeartbeatEditForm";
import HeartbeatUsageCard from "./components/HeartbeatUsageCard";

const HeartbeatDetailPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { heartbeatId } = useParams();
  const id = parseInt(heartbeatId || "0", 10);

  const { data: heartbeat, isPending } = useHeartbeat(id);
  const { mutateAsync: deleteHeartbeat, isPending: isDeleting } =
    useDeleteHeartbeat();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteHeartbeat(id);
      enqueueSnackbar("Heartbeat deleted", { variant: "success" });
      navigate("..");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to delete"), {
        variant: "error",
      });
    }
  };

  if (isPending) {
    return (
      <Container header="Loading...">
        <Placeholder />
      </Container>
    );
  }

  if (!heartbeat) {
    return (
      <Container header="Not Found">
        <div>Heartbeat not found</div>
      </Container>
    );
  }

  return (
    <>
      <Container
        header={heartbeat.name}
        breadcrumbs={[
          <Link to="/heartbeats" key="heartbeats">
            Heartbeats
          </Link>,
          <span key="detail">{heartbeat.name}</span>,
        ]}
        primaryActions={[
          <Restrict min={Role.ADMIN} key="delete">
            <Button
              color="danger"
              variant="outlined"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </Restrict>,
        ]}
      >
        <Stack spacing={2}>
          <HeartbeatUsageCard heartbeat={heartbeat} />
          <HeartbeatEditForm key={heartbeat.updatedAt} heartbeat={heartbeat} />
        </Stack>
      </Container>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Heartbeat?"
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      >
        Are you sure you want to delete this heartbeat? This action cannot be
        undone.
      </ConfirmDialog>
    </>
  );
};

export default HeartbeatDetailPage;
