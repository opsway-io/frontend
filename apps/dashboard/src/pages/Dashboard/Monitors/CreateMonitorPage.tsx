import { useSnackbar } from "notistack";
import { FunctionComponent, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import Container from "../../../components/Container/Container";
import UpgradePromptModal from "../../../components/UpgradePromptModal/UpgradePromptModal";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useCreateMonitor } from "../../../hooks/monitors.query";
import MonitorForm from "./components/MonitorForm/MonitorForm";
import { getErrorMessage } from "../../../utilities/errors";
import {
  createDefaultMonitorFormValues,
  MonitorFormData,
} from "./models/monitorFormData";

const CreateMonitorPage: FunctionComponent = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const { mutate, isPending } = useCreateMonitor();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const form = useForm<MonitorFormData>({
    defaultValues: createDefaultMonitorFormValues(teamId ?? 0),
    mode: "onChange",
  });

  // Guards against double submits before `isPending` has updated.
  const isSubmitting = useRef(false);

  const createMonitor = () => {
    if (!teamId || isSubmitting.current) {
      return;
    }

    isSubmitting.current = true;
    const data = form.getValues();

    mutate(data, {
      onSuccess: () => {
        enqueueSnackbar(`Monitor '${data.name}' created.`, {
          variant: "success",
        });
        navigate("/monitors");
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 402) {
          setShowUpgradeModal(true);
          return;
        }

        enqueueSnackbar(getErrorMessage(error, "Failed to create monitor"), {
          variant: "error",
        });
      },
      onSettled: () => {
        isSubmitting.current = false;
      },
    });
  };

  return (
    <>
      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Monitors"
      />
      <Helmet>
        <title>Monitors | Create </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link key="monitors" to="/monitors">
            Monitors
          </Link>,
          <span key="create">Create</span>,
        ]}
      >
        <MonitorForm
          form={form}
          submitLabel="Create monitor"
          submitIcon={<IoAdd />}
          submitting={isPending}
          submitDisabled={!form.formState.isValid}
          onSubmit={createMonitor}
        />
      </Container>
    </>
  );
};

export default CreateMonitorPage;
