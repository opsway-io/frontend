import { useSnackbar } from "notistack";
import { FunctionComponent, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { UpdateMonitorRequest } from "../../../api/endpoints/monitors";
import Container from "../../../components/Container/Container";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useMonitor, useUpdateMonitor } from "../../../hooks/monitors.query";
import MonitorForm from "./components/MonitorForm/MonitorForm";
import { getErrorMessage } from "../../../utilities/errors";
import {
  createDefaultMonitorFormValues,
  MonitorFormData,
  monitorToFormData,
} from "./models/monitorFormData";

const MonitorSettingsPage: FunctionComponent = () => {
  const params = useParams();
  const monitorId = Number(params.id) || 0;
  const { data, isPending: isLoading } = useMonitor(monitorId);

  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const { mutate, isPending: isUpdating } = useUpdateMonitor(monitorId);
  const { enqueueSnackbar } = useSnackbar();

  const formValues = useMemo(
    () => (data && teamId ? monitorToFormData(data, teamId) : undefined),
    [data, teamId],
  );

  // `values` resets the form whenever the monitor is (re)fetched.
  // `defaultValues` keeps every field controlled until the monitor is loaded.
  const form = useForm<MonitorFormData>({
    defaultValues: createDefaultMonitorFormValues(teamId ?? 0),
    values: formValues,
    mode: "onChange",
  });

  const updateMonitor = () => {
    if (!teamId || !data) {
      return;
    }

    const formData = form.getValues();

    const request: UpdateMonitorRequest = {
      name: formData.name,
      // The API type only allows ACTIVE/INACTIVE; the current state is sent as is.
      state: data.state as UpdateMonitorRequest["state"],
      settings: formData.settings,
      steps: formData.steps,
    };

    mutate(request, {
      onSuccess: () => {
        enqueueSnackbar(`Monitor '${formData.name}' settings updated.`, {
          variant: "success",
        });
      },
      onError: (error) => {
        enqueueSnackbar(
          getErrorMessage(error, "Failed to update monitor settings"),
          { variant: "error" },
        );
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Monitors | Settings</title>
      </Helmet>

      <Container
        loading={isLoading}
        breadcrumbs={[
          <Link key="monitors" to="/monitors">
            Monitors
          </Link>,
          <Link key="monitor" to={`/monitors/${monitorId}`}>
            {data?.name}
          </Link>,
          <span key="settings">Settings</span>,
        ]}
      >
        <MonitorForm
          form={form}
          submitLabel="Save settings"
          submitting={isUpdating}
          submitDisabled={!form.formState.isValid || !form.formState.isDirty}
          onSubmit={updateMonitor}
        />
      </Container>
    </>
  );
};

export default MonitorSettingsPage;
