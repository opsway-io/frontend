import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container";
import { useMonitor, useMutateMonitor } from "../../../../hooks/monitors.query";
import { FormData } from "../models/formData";
import Placeholder from "../../../../components/Placeholder";
import { Helmet } from "react-helmet";

const MonitorSettingsView: FunctionComponent = () => {
  let params = useParams();

  const monitorId = (params.id as number | undefined) || 0;
  const { data, error, isLoading } = useMonitor(monitorId);
  const { mutate, isLoading: isMutating } = useMutateMonitor(monitorId);

  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      method: "GET",
      url: "",
      frequencySeconds: 60,
      bodyType: "NONE",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!data || isLoading) {
      return;
    }

    reset({
      name: data.name,
      method: data.settings.method,
      url: data.settings.url,
      frequencySeconds: data.settings.frequencySeconds,
      bodyType: data.settings.bodyType,
    });
  }, [data, isLoading]);

  const save = (values: FormData) => {
    if (!data || isLoading || isMutating) {
      return;
    }

    mutate(
      {
        ...data,
        name: values.name,
        settings: {
          ...data.settings,
          method: values.method,
          url: values.url,
          frequencySeconds: values.frequencySeconds,
          bodyType: values.bodyType,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Monitor settings saved", {
            variant: "success",
          });
        },
        onError: () => {
          enqueueSnackbar("Failed to save monitor settings", {
            variant: "error",
          });
        },
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {isLoading ? "Monitors" : `Monitors | ${data?.name} | Settings`}
        </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/monitors">Monitors</Link>,
          isLoading ? (
            <Skeleton width={150} />
          ) : (
            <Link to={`/monitors/${monitorId}`}>{data?.name}</Link>
          ),
          <span>Settings</span>,
        ]}
        loading={isLoading}
        error={error && "Failed to load monitor settings"}
      >
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Placeholder />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default MonitorSettingsView;
