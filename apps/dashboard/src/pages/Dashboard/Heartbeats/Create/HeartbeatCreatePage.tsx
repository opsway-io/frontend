import { Button, Card, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import { useCreateHeartbeat } from "../../../../hooks/heartbeats.query";
import { getErrorMessage } from "../../../../utilities/errors";
import HeartbeatFields from "../components/HeartbeatFields";
import {
  emptyHeartbeatFormValues,
  HeartbeatFormValues,
} from "../heartbeatForm";

const HeartbeatCreatePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createHeartbeat, isPending: isCreating } =
    useCreateHeartbeat();

  const { control, handleSubmit } = useForm<HeartbeatFormValues>({
    defaultValues: emptyHeartbeatFormValues,
  });

  const onSubmit = async (values: HeartbeatFormValues) => {
    try {
      await createHeartbeat(values);
      enqueueSnackbar("Heartbeat created successfully", { variant: "success" });
      navigate("..");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to create heartbeat"), {
        variant: "error",
      });
    }
  };

  return (
    <Container
      header="Create Heartbeat"
      breadcrumbs={[
        <Link to="/heartbeats" key="heartbeats">
          Heartbeats
        </Link>,
        <span key="create">Create</span>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <HeartbeatFields control={control} />
        </Card>
        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
          <Button
            variant="outlined"
            color="neutral"
            component={Link}
            to="/heartbeats"
          >
            Cancel
          </Button>
          <Button type="submit" loading={isCreating}>
            Create
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default HeartbeatCreatePage;
