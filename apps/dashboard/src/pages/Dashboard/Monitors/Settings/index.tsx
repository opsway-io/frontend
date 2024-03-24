import { DevTool } from "@hookform/devtools";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FunctionComponent, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Container from "../../../../components/Container";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import { useMonitor, useUpdateMonitor } from "../../../../hooks/monitors.query";
import FrequencyAndLocationSettings from "../components/FrequencyAndLocationSettings";
import HowAssertionsWork from "../components/HowAssertionsWork";
import RequestSettings from "../components/RequestSettings";
import ResponseAssertionSettings from "../components/ResponseAssertionSettings";
import TLSVerificationSettings from "../components/TLSVerificationSettings";
import { SettingsFormData } from "../models/settingsFormData";

const MonitorSettingsView: FunctionComponent = () => {
  let params = useParams();
  const monitorId = (params.id as number | undefined) || 0;
  const { data, isLoading } = useMonitor(monitorId);

  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  const { mutate } = useUpdateMonitor(monitorId);
  const { enqueueSnackbar } = useSnackbar();

  const [searchParams, setSearchParams] = useSearchParams({
    tab: "request",
  });
  const selectedTab = useMemo(() => searchParams.get("tab"), [params]);

  const formMethods = useForm<SettingsFormData>({
    defaultValues: data || {},
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      formMethods.reset(data);
    }
  }, [data]);

  const updateMonitor = () => {
    if (!teamId) {
      return;
    }

    const data = formMethods.getValues();

    mutate(data, {
      onSuccess: () => {
        enqueueSnackbar(`Monitor '${data.name}' settings updated.`, {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar("Failed to update monitor settings", {
          variant: "error",
        });
      },
    });
  };

  return (
    <>
      <DevTool control={formMethods.control} />

      <Helmet>
        <title>Monitors | Settings</title>
      </Helmet>

      <Container
        loading={isLoading}
        breadcrumbs={[
          <Link to="/monitors">Monitors</Link>,
          <Link to={`/monitors/${monitorId}`}>{data?.name}</Link>,
          <span>Settings</span>,
        ]}
      >
        <FormProvider {...formMethods}>
          <Stack spacing={1} direction="row">
            <Stack flex="1">
              <Controller
                name={`name` as const}
                control={formMethods.control}
                rules={{
                  required: true,
                  maxLength: 100,
                }}
                render={({ field }) => (
                  <TextField
                    autoFocus={true}
                    fullWidth
                    placeholder="Monitor name"
                    size="small"
                    {...field}
                  />
                )}
              />
            </Stack>

            <LoadingButton
              color="success"
              variant="contained"
              size="large"
              type="submit"
              loading={formMethods.formState.isSubmitting}
              disabled={
                !formMethods.formState.isValid || !formMethods.formState.isDirty
              }
              onClick={updateMonitor}
              sx={{
                height: "38px",
              }}
            >
              Save settings
            </LoadingButton>
          </Stack>

          <Tabs
            value={selectedTab}
            onChange={(e, v) => setSearchParams({ tab: v })}
          >
            <Tab value="request" label="Request" />
            <Tab value="assertions" label="Response assertions" />
            <Tab value="frequencyAndLocation" label="Frequency & Location" />
            <Tab value="tlsVerification" label="SSL/TLS" />
          </Tabs>

          <Box sx={{ display: selectedTab === "request" ? "block" : "none" }}>
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <RequestSettings />
                </CardContent>
              </Card>
            </Stack>
          </Box>

          <Box
            sx={{
              display: selectedTab === "assertions" ? "block" : "none",
            }}
          >
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <ResponseAssertionSettings />
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <HowAssertionsWork />
                </CardContent>
              </Card>
            </Stack>
          </Box>

          <Box
            sx={{
              display:
                selectedTab === "frequencyAndLocation" ? "block" : "none",
            }}
          >
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <FrequencyAndLocationSettings />
                </CardContent>
              </Card>
            </Stack>
          </Box>

          <Box
            sx={{
              display: selectedTab === "tlsVerification" ? "block" : "none",
            }}
          >
            <Card>
              <CardContent>
                <TLSVerificationSettings />
              </CardContent>
            </Card>
          </Box>
        </FormProvider>
      </Container>
    </>
  );
};

export default MonitorSettingsView;
