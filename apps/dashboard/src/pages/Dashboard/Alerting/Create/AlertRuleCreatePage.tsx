import { Button, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import { useCreateAlertRule } from "../../../../hooks/alerting.query";
import { AlertRuleFormValues, toAlertRuleRequest } from "../alertRules";
import AlertRuleFormFields from "../components/AlertRuleFormFields";

const AlertRuleCreatePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createAlertRule, isPending } = useCreateAlertRule();

  const { control, handleSubmit } = useForm<AlertRuleFormValues>({
    defaultValues: {
      name: "",
      condition: "*",
      channels: ["email"],
      enabled: true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createAlertRule(toAlertRuleRequest(values));
      enqueueSnackbar("Alert rule created successfully", {
        variant: "success",
      });
      navigate("/alerting");
    } catch (error) {
      enqueueSnackbar(
        (error as Error).message || "Failed to create alert rule",
        { variant: "error" },
      );
    }
  });

  return (
    <>
      <Helmet>
        <title>Create alert rule</title>
      </Helmet>

      <Container
        header="Create Alert Rule"
        breadcrumbs={[
          <Link to="/alerting" key="alerting">
            Alerting
          </Link>,
          <span key="create">Create</span>,
        ]}
      >
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <AlertRuleFormFields control={control} />

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                variant="outlined"
                color="neutral"
                component={Link}
                to="/alerting"
              >
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                Create Rule
              </Button>
            </Stack>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default AlertRuleCreatePage;
