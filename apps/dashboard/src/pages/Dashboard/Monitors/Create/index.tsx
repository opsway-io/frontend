import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "../../../../components/Container";
import RequestSettings from "../components/RequestSettings";
import ResponseAssertionSettings from "../components/ResponseAssertionSettings";
import { FormData } from "../models/formData";
import { useCreateMonitor } from "../../../../hooks/monitors.query";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import { useSnackbar } from "notistack";
import { IoAdd } from "react-icons/io5";
import FrequencyAndLocationSettings from "../components/FrequencyAndLocationSettings";
import TLSVerificationSettings from "../components/TLSVerificationSettings";
import { v4 as uuidv4 } from "uuid";
import HowAssertionsWork from "../components/HowAssertionsWork";
import { Helmet } from "react-helmet";

const MonitorCreateView: FunctionComponent = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const { mutate } = useCreateMonitor();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [params, setParams] = useSearchParams({
    tab: "request",
  });
  const selectedTab = useMemo(() => params.get("tab"), [params]);

  const formMethods = useForm<FormData>({
    defaultValues: {
      name: "",
      method: "GET",
      url: "",
      bodyType: "NONE",
      body: "",
      headers: [],
      assertions: [
        {
          key: uuidv4(),
          source: "STATUS_CODE",
          property: "",
          operator: "EQUAL",
          target: "200",
        },
      ],
      frequencySeconds: 300, // 5 minutes
      locations: ["eu-central-1"],
      tls: {
        validate: {
          enabled: true,
        },
        expiration: {
          enabled: true,
          thresholdDays: 7,
        },
      },
    },
    mode: "onChange",
  });

  const createMonitor = () => {
    if (!teamId) {
      return;
    }

    const data = formMethods.getValues();

    mutate(
      {
        teamId: teamId,
        name: data.name,
        settings: {
          method: data.method,
          url: data.url,
          headers: data.headers,
          bodyType: data.bodyType,
          body: data.body,
          frequencySeconds: data.frequencySeconds,
          locations: data.locations,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(`Monitor \`${data.name}\` created.`, {
            variant: "success",
          });

          navigate("/monitors");
        },
        onError: () => {
          enqueueSnackbar("Failed to create monitor", { variant: "error" });
        },
      },
    );
  };

  return (
    <>
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
            <Tab value="tlsVerification" label="SSL/TLS verification" />
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
