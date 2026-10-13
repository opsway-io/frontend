import { Button, Card, Stack, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { IHeartbeat } from "../../../../../api/endpoints/heartbeats";
import { useUpdateHeartbeat } from "../../../../../hooks/heartbeats.query";
import { getErrorMessage } from "../../../../../utilities/errors";
import HeartbeatFields from "../../components/HeartbeatFields";
import {
  HeartbeatFormValues,
  toHeartbeatFormValues,
} from "../../heartbeatForm";

interface HeartbeatEditFormProps {
  heartbeat: IHeartbeat;
}

const HeartbeatEditForm: FunctionComponent<HeartbeatEditFormProps> = ({
  heartbeat,
}) => {
  const { mutateAsync: updateHeartbeat, isPending: isUpdating } =
    useUpdateHeartbeat(heartbeat.id);

  const { control, handleSubmit } = useForm<HeartbeatFormValues>({
    defaultValues: toHeartbeatFormValues(heartbeat),
  });

  const onSubmit = async (values: HeartbeatFormValues) => {
    try {
      await updateHeartbeat(values);
      enqueueSnackbar("Heartbeat updated", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to update"), {
        variant: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Typography level="title-md">Settings</Typography>
        <HeartbeatFields control={control} />
      </Card>
      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button type="submit" loading={isUpdating}>
          Save Changes
        </Button>
      </Stack>
    </form>
  );
};

export default HeartbeatEditForm;
