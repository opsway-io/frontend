import { Alert, Button, Stack } from "@mui/joy";
import { isAxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { IoAlertCircleOutline } from "react-icons/io5";
import {
  EscalationPolicy,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import { useUpdateEscalationPolicy } from "../../../../hooks/escalation.query";
import {
  EscalationFormValues,
  toEscalationFormValues,
} from "../escalationForm";
import EscalationPolicyCard from "./EscalationPolicyCard";
import OnCallRotationsCard from "./OnCallRotationsCard";

interface EscalationFormProps {
  policy: EscalationPolicy | null | undefined;
  users: IGetTeamUserResponse[];
}

const EscalationForm: FunctionComponent<EscalationFormProps> = ({
  policy,
  users,
}) => {
  const { mutateAsync: updatePolicy, isPending } = useUpdateEscalationPolicy();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, control } = useForm<EscalationFormValues>({
    defaultValues: toEscalationFormValues(policy),
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);
    try {
      await updatePolicy(values);
      enqueueSnackbar("Escalation policy saved", { variant: "success" });
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setErrorMessage(message || "Failed to save policy.");
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        {errorMessage && (
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoAlertCircleOutline size={18} />}
          >
            {errorMessage}
          </Alert>
        )}

        <EscalationPolicyCard control={control} register={register} />
        <OnCallRotationsCard control={control} users={users} />

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" loading={isPending}>
            Save changes
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default EscalationForm;
