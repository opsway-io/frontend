import { Button, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { IAlertRule } from "../../../../../api/endpoints/alerting";
import { useUpdateAlertRule } from "../../../../../hooks/alerting.query";
import {
  AlertRuleFormValues,
  toAlertRuleFormValues,
  toAlertRuleRequest,
} from "../../alertRules";
import AlertRuleFormFields from "../../components/AlertRuleFormFields";

interface EditAlertRuleFormProps {
  rule: IAlertRule;
}

const EditAlertRuleForm: FunctionComponent<EditAlertRuleFormProps> = ({
  rule,
}) => {
  const { mutateAsync: updateAlertRule, isPending } = useUpdateAlertRule(
    rule.id,
  );

  const { control, handleSubmit } = useForm<AlertRuleFormValues>({
    defaultValues: toAlertRuleFormValues(rule),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateAlertRule(toAlertRuleRequest(values));
      enqueueSnackbar("Alert rule updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar((error as Error).message || "Failed to update", {
        variant: "error",
      });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        <AlertRuleFormFields control={control} />

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" loading={isPending}>
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default EditAlertRuleForm;
