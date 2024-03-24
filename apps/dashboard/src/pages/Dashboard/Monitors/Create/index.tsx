import { DevTool } from "@hookform/devtools";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FunctionComponent, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Container from "../../../../components/Container";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import { useCreateMonitor } from "../../../../hooks/monitors.query";
import FrequencyAndLocationSettings from "../components/FrequencyAndLocationSettings";
import HowAssertionsWork from "../components/HowAssertionsWork";
import RequestSettings from "../components/RequestSettings";
import ResponseAssertionSettings from "../components/ResponseAssertionSettings";
import TLSVerificationSettings from "../components/TLSVerificationSettings";
import { SettingsFormData } from "../models/settingsFormData";

const MonitorCreateView: FunctionComponent = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const { mutate } = useCreateMonitor();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [params, setParams] = useSearchParams({
    tab: "request",
  });
  const selectedTab = useMemo(() => params.get("tab"), [params]);

  const formMethods = useForm<SettingsFormData>({
    defaultValues: {
      teamId: teamId,
      name: "",
      settings: {
        method: "GET",
        url: "",
        headers: [],
        body: {
          type: "NONE",
          content: null,
        },
        tls: {
          enabled: true,
          verifyHostname: true,
          checkExpiration: true,
          expirationThresholdDays: 7,
        },
        frequencySeconds: 300,
        locations: ["eu-central-1"],
      },
      assertions: [
        {
          key: uuidv4(),
          source: "STATUS_CODE",
          operator: "EQUAL",
          target: "200",
        },
      ],
    },
    mode: "onChange",
  });

  const createMonitor = () => {
    if (!teamId) {
      return;
    }

    const data = formMethods.getValues();

    mutate(data, {
      onSuccess: () => {
        enqueueSnackbar(`Monitor '${data.name}' created.`, {
          variant: "success",
        });

        navigate("/monitors");
      },
      onError: () => {
        enqueueSnackbar("Failed to create monitor", { variant: "error" });
      },
    });
  };

  return (
    <>
      <DevTool control={formMethods.control} />

      <Helmet>
        <title>Monitors | Create </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/monitors">Monitors</Link>,
          <span>Create</span>,
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

            <Button
              color="success"
              variant="contained"
              size="large"
              type="submit"
              disabled={!formMethods.formState.isValid}
              onClick={createMonitor}
              sx={{
                height: "38px",
              }}
              endIcon={<IoAdd />}
            >
              Create monitor
            </Button>
          </Stack>

          <Tabs value={selectedTab} onChange={(e, v) => setParams({ tab: v })}>
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

export default MonitorCreateView;
